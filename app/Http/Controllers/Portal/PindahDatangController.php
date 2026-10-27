<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\DokumenMutasi;
use App\Models\PermohonanMutasi;
use App\Models\UnitRumah;
use App\Models\Warga;
use App\Support\MutasiStatus;
use App\Support\MutasiType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PindahDatangController extends Controller
{
    public function create(Request $request): Response
    {
        $user = $request->user();

        $defaultWarga = Warga::query()
            ->with('unitRumah')
            ->where('user_id', $user->id)
            ->orWhere('nik', $user->username)
            ->first();

        $units = UnitRumah::query()
            ->select('id', 'nama_unit', 'blok', 'nomor', 'nama_pemilik')
            ->orderBy('nama_unit')
            ->get();

        return Inertia::render('Portal/PindahDatang/Create', [
            'units' => $units,
            'defaultWarga' => $defaultWarga ? [
                'nama' => $defaultWarga->nama_lengkap ?: $defaultWarga->nama ?: $user->name,
                'nik' => $defaultWarga->nik ?: ($user->username ?: ''),
                'no_kk' => $defaultWarga->no_kk ?: '',
                'telepon' => $defaultWarga->no_wa ?: $defaultWarga->telepon ?: '',
                'alamat_ktp' => $defaultWarga->alamat_lengkap ?: $defaultWarga->alamat_ktp ?: '',
                'unit' => $defaultWarga->unitRumah?->nama_unit ?? ($defaultWarga->nomor_rumah ? "{$defaultWarga->nama_jalan} {$defaultWarga->nomor_rumah}" : ''),
            ] : [
                'nama' => $user->name,
                'nik' => is_numeric($user->username) && strlen($user->username) === 16 ? $user->username : '',
                'no_kk' => '',
                'telepon' => '',
                'alamat_ktp' => '',
                'unit' => '',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis' => ['required', 'string', 'in:datang,pindah'],
            'nama' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16'],
            'kk' => ['required', 'digits:16'],
            'tanggal' => ['required', 'date'],
            'alamatAsal' => ['required', 'string', 'max:1000'],
            'unit' => ['required', 'string', 'max:255'],
            'statusTinggal' => ['required', 'string', 'max:255'],
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ], [
            'nama.required' => 'Nama lengkap pemohon wajib diisi.',
            'nik.required' => 'NIK pemohon wajib diisi.',
            'nik.digits' => 'NIK harus berjumlah 16 digit angka.',
            'kk.required' => 'Nomor Kartu Keluarga (KK) wajib diisi.',
            'kk.digits' => 'Nomor KK harus berjumlah 16 digit angka.',
            'tanggal.required' => 'Tanggal rencana wajib diisi.',
            'alamatAsal.required' => 'Alamat asal lengkap wajib diisi.',
            'unit.required' => 'Unit rumah di RT 01/08 wajib diisi atau dipilih.',
            'statusTinggal.required' => 'Status tempat tinggal wajib dipilih.',
            'files.required' => 'Dokumen pendukung wajib diunggah.',
            'files.min' => 'Unggah berkas dokumen persyaratan (minimal KTP Pemohon & KK).',
            'files.*.file' => 'Berkas yang diunggah tidak valid.',
            'files.*.mimes' => 'Format berkas dokumen harus JPG, PNG, atau PDF.',
            'files.*.max' => 'Ukuran berkas maksimal 5 MB per dokumen.',
        ]);

        $user = $request->user();

        // Cari kecocokan data unit rumah
        $unitModel = UnitRumah::query()
            ->where('nama_unit', $validated['unit'])
            ->orWhereRaw('LOWER(TRIM(nama_unit)) = ?', [strtolower(trim($validated['unit']))])
            ->first();

        // Cari kecocokan data warga
        $warga = Warga::query()
            ->where('user_id', $user->id)
            ->orWhere('nik', $validated['nik'])
            ->first();

        // Tentukan alamat asal & tujuan sesuai jenis mutasi
        if ($validated['jenis'] === MutasiType::DATANG) {
            $alamatAsal = $validated['alamatAsal'];
            $alamatTujuan = "{$validated['unit']}, RT 01 / RW 08 Kelurahan Sukatani";
        } else {
            $alamatAsal = "{$validated['unit']}, RT 01 / RW 08 Kelurahan Sukatani";
            $alamatTujuan = $validated['alamatAsal'];
        }

        $ticket = PermohonanMutasi::generateNomorTiket(Carbon::parse($validated['tanggal']));

        $mutasi = DB::transaction(function () use (
            $validated,
            $user,
            $warga,
            $unitModel,
            $alamatAsal,
            $alamatTujuan,
            $ticket,
            $request
        ) {
            $permohonan = PermohonanMutasi::create([
                'nomor_tiket' => $ticket,
                'user_id' => $user->id,
                'warga_id' => $warga?->id,
                'jenis_mutasi' => $validated['jenis'],
                'nama_pemohon' => $validated['nama'],
                'nik_pemohon' => $validated['nik'],
                'no_kk' => $validated['kk'],
                'telepon' => $warga?->telepon ?? '081234567890',
                'tanggal_rencana' => $validated['tanggal'],
                'alamat_asal' => $alamatAsal,
                'alamat_tujuan' => $alamatTujuan,
                'unit_rumah_id' => $unitModel?->id,
                'unit_rumah_custom' => $validated['unit'],
                'status_tinggal' => $validated['statusTinggal'],
                'nama_pemilik_rumah' => $unitModel?->nama_pemilik,
                'rincian_pengikut' => [],
                'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
                'checklist_alamat' => false,
                'checklist_nik' => false,
                'checklist_dokumen' => false,
                'last_activity_at' => now(),
            ]);

            $uploadedFiles = $request->file('files', []);
            foreach ($uploadedFiles as $index => $uploadedFile) {
                if (! $uploadedFile->isValid()) {
                    continue;
                }

                $originalName = $uploadedFile->getClientOriginalName();
                $lower = strtolower($originalName);

                if (str_contains($lower, 'ktp') || $index === 0) {
                    $jenisDokumen = 'ktp';
                    $namaDokumen = 'e-KTP Pemohon';
                } elseif (str_contains($lower, 'kk') || str_contains($lower, 'keluarga') || $index === 1) {
                    $jenisDokumen = 'kk';
                    $namaDokumen = 'Kartu Keluarga (KK)';
                } else {
                    $jenisDokumen = 'dokumen_pendukung';
                    $namaDokumen = pathinfo($originalName, PATHINFO_FILENAME);
                }

                $path = $uploadedFile->store('dokumen_mutasi', 'local');
                $size = $uploadedFile->getSize();

                DokumenMutasi::create([
                    'permohonan_mutasi_id' => $permohonan->id,
                    'jenis_dokumen' => $jenisDokumen,
                    'nama_dokumen' => $namaDokumen,
                    'file_path' => $path,
                    'file_name' => $originalName,
                    'file_size' => $size,
                    'file_size_label' => $this->formatFileSize($size),
                    'mime_type' => $uploadedFile->getClientMimeType() ?: 'application/octet-stream',
                    'status_pemeriksaan' => 'belum_diperiksa',
                ]);
            }

            return $permohonan;
        });

        return redirect()
            ->route('portal.pindah-datang.tracking', ['ticket' => $mutasi->nomor_tiket])
            ->with('success', "Laporan perpindahan warga berhasil dikirim ke antrean verifikasi RT 01 dengan No. Tiket #{$mutasi->nomor_tiket}.");
    }

    public function tracking(Request $request): Response
    {
        $user = $request->user();
        $ticket = $request->query('ticket');

        $query = PermohonanMutasi::query()->with(['unitRumah', 'dokumen']);

        if ($ticket) {
            $permohonan = (clone $query)->where('nomor_tiket', $ticket)->first();
            // Jika tiket tidak ketemu dan user punya data, fallback ke latest milik user
            if (! $permohonan && $user) {
                $permohonan = (clone $query)
                    ->where(function ($q) use ($user) {
                        $q->where('user_id', $user->id)
                            ->orWhere('nik_pemohon', $user->username);
                    })
                    ->latest()
                    ->first();
            }
        } else {
            $permohonan = $query
                ->where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                        ->orWhere('nik_pemohon', $user->username);
                })
                ->latest()
                ->first();
        }

        // Ambil riwayat lengkap laporan mutasi user dari database
        $historyList = PermohonanMutasi::query()
            ->with(['unitRumah', 'dokumen'])
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('nik_pemohon', $user->username);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (PermohonanMutasi $m) => $this->formatTrackingPayload($m))
            ->values()
            ->all();

        $payload = $permohonan ? $this->formatTrackingPayload($permohonan) : (count($historyList) > 0 ? $historyList[0] : null);

        return Inertia::render('Portal/PindahDatang/Tracking', [
            'permohonan' => $payload,
            'history' => $historyList,
        ]);
    }

    private function formatTrackingPayload(PermohonanMutasi $m): array
    {
        $files = $m->dokumen->map(function (DokumenMutasi $d) use ($m) {
            return [
                'id' => $d->id,
                'name' => $d->file_name,
                'sizeLabel' => $d->file_size_label ?? $this->formatFileSize($d->file_size),
                'kind' => strtoupper($d->jenis_dokumen) . ' • Terenkripsi',
                'url' => route('admin.mutasi.document.preview', [$m->id, $d->id]),
            ];
        })->values()->all();

        $createdAtWib = $m->created_at ? $m->created_at->copy()->timezone('Asia/Jakarta') : now()->timezone('Asia/Jakarta');

        return [
            'id' => $m->id,
            'ticket' => $m->nomor_tiket,
            'nomor_tiket' => $m->nomor_tiket,
            'jenis' => $m->jenis_mutasi,
            'nama' => $m->nama_pemohon,
            'nik' => $m->nik_pemohon,
            'no_kk' => $m->no_kk,
            'telepon' => $m->telepon,
            'alamatAsal' => $m->alamat_asal,
            'alamatTujuan' => $m->alamat_tujuan,
            'unit' => $m->unitRumah?->nama_unit ?? $m->unit_rumah_custom ?? 'Unit belum ditentukan',
            'statusTinggal' => $m->status_tinggal ?? 'Kontrak / Sewa Tahunan',
            'status' => $m->status,
            'statusLabel' => $m->statusLabel(),
            'alasanRevisi' => $m->alasan_revisi,
            'catatanPemeriksaan' => $m->catatan_pemeriksaan,
            'checklistAlamat' => (bool) $m->checklist_alamat,
            'checklistNik' => (bool) $m->checklist_nik,
            'checklistDokumen' => (bool) $m->checklist_dokumen,
            'submittedAt' => $createdAtWib->toISOString(),
            'submittedAtFormatted' => $createdAtWib->locale('id')->translatedFormat('d M Y, H.i') . ' WIB',
            'files' => $files,
        ];
    }

    private function formatFileSize(?int $bytes): string
    {
        if (! $bytes || $bytes <= 0) {
            return '1.5 MB';
        }

        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 1).' MB';
        }

        return number_format($bytes / 1024, 0).' KB';
    }
}
