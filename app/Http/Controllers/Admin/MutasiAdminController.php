<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DokumenMutasi;
use App\Models\PermohonanMutasi;
use App\Models\UnitRumah;
use App\Models\Warga;
use App\Support\MutasiStatus;
use App\Support\MutasiType;
use App\Support\Roles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MutasiAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $this->assertCanManageMutasi($request);

        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'jenis' => (string) $request->query('jenis', ''),
            'tab' => (string) $request->query('tab', 'menunggu_pemeriksaan'),
            'periode' => (string) $request->query('periode', ''),
        ];

        $query = PermohonanMutasi::query()
            ->with(['unitRumah', 'dokumen'])
            ->orderByDesc('created_at');

        // Filter tab status
        if ($filters['tab'] !== '' && $filters['tab'] !== 'all') {
            if (in_array($filters['tab'], MutasiStatus::all(), true)) {
                $query->where('status', $filters['tab']);
            }
        }

        // Filter search (nama, NIK, nomor tiket)
        if ($filters['q'] !== '') {
            $search = $filters['q'];
            $query->where(function ($builder) use ($search) {
                $builder->where('nomor_tiket', 'like', "%{$search}%")
                    ->orWhere('nama_pemohon', 'like', "%{$search}%")
                    ->orWhere('nik_pemohon', 'like', "%{$search}%");
            });
        }

        // Filter jenis mutasi (datang / pindah)
        if (in_array($filters['jenis'], MutasiType::all(), true)) {
            $query->where('jenis_mutasi', $filters['jenis']);
        }

        // Filter periode (bulan & tahun)
        if ($filters['periode'] !== '') {
            try {
                $date = Carbon::parse($filters['periode']);
                $query->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month);
            } catch (\Throwable) {
                // Ignore invalid date format
            }
        }

        $items = $query->paginate(4)->withQueryString();

        // Ringkasan KPI dan Tab counts
        $base = PermohonanMutasi::query();
        $summary = [
            'total' => (clone $base)->count(),
            'menunggu' => (clone $base)->where('status', MutasiStatus::MENUNGGU_PEMERIKSAAN)->count(),
            'diperiksa' => (clone $base)->where('status', MutasiStatus::SEDANG_DIPERIKSA)->count(),
            'selesai' => (clone $base)->where('status', MutasiStatus::SELESAI)->count(),
            'revisi' => (clone $base)->where('status', MutasiStatus::PERLU_REVISI)->count(),
            'kk_baru_bulan_ini' => (clone $base)
                ->where('status', MutasiStatus::SELESAI)
                ->where('jenis_mutasi', MutasiType::DATANG)
                ->count(),
        ];

        // Statistik Hunian RT 01
        $totalUnits = UnitRumah::count();
        $occupiedUnits = UnitRumah::where('status_hunian', '!=', 'kosong')->count();
        $emptyUnits = max(0, $totalUnits - $occupiedUnits);
        $occupancyRate = $totalUnits > 0 ? (int) round(($occupiedUnits / $totalUnits) * 100) : 0;
        $wargaTetapKk = UnitRumah::where('status_hunian', 'milik_sendiri')->count();
        $wargaSewaKk = UnitRumah::where('status_hunian', 'kontrak')->count();

        $hunianStats = [
            'total_units' => $totalUnits,
            'occupied_units' => $occupiedUnits,
            'empty_units' => $emptyUnits,
            'occupancy_rate' => $occupancyRate,
            'warga_tetap_kk' => $wargaTetapKk,
            'warga_sewa_kk' => $wargaSewaKk,
        ];

        return Inertia::render('Admin/Mutasi/Index', [
            'mutations' => $items->through(fn (PermohonanMutasi $m) => $this->listPayload($m)),
            'filters' => $filters,
            'summary' => $summary,
            'hunianStats' => $hunianStats,
            'jenisOptions' => MutasiType::labels(),
            'statusOptions' => MutasiStatus::labels(),
        ]);
    }

    public function show(Request $request, PermohonanMutasi $permohonanMutasi): Response
    {
        $this->assertCanManageMutasi($request);

        $permohonanMutasi->loadMissing(['dokumen', 'unitRumah', 'warga', 'diverifikasiOleh']);

        return Inertia::render('Admin/Mutasi/Show', [
            'mutation' => $this->detailPayload($permohonanMutasi),
        ]);
    }

    public function saveDraft(Request $request, PermohonanMutasi $permohonanMutasi): RedirectResponse
    {
        $this->assertCanManageMutasi($request);

        $validated = $request->validate([
            'checklist_alamat' => ['nullable', 'boolean'],
            'checklist_nik' => ['nullable', 'boolean'],
            'checklist_dokumen' => ['nullable', 'boolean'],
            'catatan_pemeriksaan' => ['nullable', 'string', 'max:1500'],
            'dokumen_status' => ['nullable', 'array'],
            'dokumen_status.*' => ['nullable', 'string', 'in:belum_diperiksa,valid,buram'],
        ]);

        $nextStatus = $permohonanMutasi->status;
        if ($nextStatus === MutasiStatus::MENUNGGU_PEMERIKSAAN) {
            $nextStatus = MutasiStatus::SEDANG_DIPERIKSA;
        }

        $permohonanMutasi->forceFill([
            'checklist_alamat' => (bool) ($validated['checklist_alamat'] ?? false),
            'checklist_nik' => (bool) ($validated['checklist_nik'] ?? false),
            'checklist_dokumen' => (bool) ($validated['checklist_dokumen'] ?? false),
            'catatan_pemeriksaan' => $validated['catatan_pemeriksaan'] ?? $permohonanMutasi->catatan_pemeriksaan,
            'status' => $nextStatus,
            'last_activity_at' => now(),
        ])->save();

        if (! empty($validated['dokumen_status'])) {
            foreach ($validated['dokumen_status'] as $docId => $status) {
                DokumenMutasi::where('id', $docId)
                    ->where('permohonan_mutasi_id', $permohonanMutasi->id)
                    ->update(['status_pemeriksaan' => $status]);
            }
        }

        return redirect()
            ->route('admin.mutasi.show', $permohonanMutasi)
            ->with('success', 'Draf pemeriksaan dan checklist berhasil disimpan.');
    }

    public function requestRevision(Request $request, PermohonanMutasi $permohonanMutasi): RedirectResponse
    {
        $this->assertCanManageMutasi($request);

        if ($permohonanMutasi->status === MutasiStatus::SELESAI) {
            throw ValidationException::withMessages([
                'status' => 'Permohonan yang telah selesai disetujui tidak dapat diminta revisi.',
            ]);
        }

        $validated = $request->validate([
            'alasan_revisi' => ['required', 'string', 'min:5', 'max:1000'],
            'catatan_pemeriksaan' => ['nullable', 'string', 'max:1500'],
            'dokumen_buram_ids' => ['nullable', 'array'],
            'dokumen_buram_ids.*' => ['integer'],
        ], [
            'alasan_revisi.required' => 'Alasan revisi wajib diisi agar warga memahami hal yang perlu diperbaiki.',
            'alasan_revisi.min' => 'Alasan revisi minimal :min karakter.',
        ]);

        $permohonanMutasi->forceFill([
            'status' => MutasiStatus::PERLU_REVISI,
            'alasan_revisi' => $validated['alasan_revisi'],
            'catatan_pemeriksaan' => $validated['catatan_pemeriksaan'] ?? $permohonanMutasi->catatan_pemeriksaan,
            'last_activity_at' => now(),
        ])->save();

        if (! empty($validated['dokumen_buram_ids'])) {
            DokumenMutasi::whereIn('id', $validated['dokumen_buram_ids'])
                ->where('permohonan_mutasi_id', $permohonanMutasi->id)
                ->update(['status_pemeriksaan' => 'buram']);
        }

        return redirect()
            ->route('admin.mutasi.show', $permohonanMutasi)
            ->with('success', 'Status berhasil diubah ke Perlu Revisi. Instruksi perbaikan telah dicatat untuk warga.');
    }

    public function approve(Request $request, PermohonanMutasi $permohonanMutasi): RedirectResponse
    {
        $this->assertCanManageMutasi($request);

        if ($permohonanMutasi->status === MutasiStatus::SELESAI) {
            throw ValidationException::withMessages([
                'status' => 'Permohonan ini telah disetujui sebelumnya.',
            ]);
        }

        // Validasi Checklist dan Dokumen
        if (! $permohonanMutasi->allChecklistsPassed()) {
            throw ValidationException::withMessages([
                'checklist' => 'Seluruh 3 checklist verifikasi lapangan wajib dicentang sebelum persetujuan.',
            ]);
        }

        $buramCount = $permohonanMutasi->dokumen()->where('status_pemeriksaan', 'buram')->count();
        if ($buramCount > 0) {
            throw ValidationException::withMessages([
                'dokumen' => 'Terdapat berkas yang berstatus Buram/Perlu Perbaikan. Perbaiki dokumen terlebih dahulu.',
            ]);
        }

        $actor = $request->user();

        DB::transaction(function () use ($permohonanMutasi, $actor) {
            if ($permohonanMutasi->jenis_mutasi === MutasiType::DATANG) {
                // 1. Tambah / Update data Warga Pemohon
                $statusWarga = str_contains(strtolower((string) $permohonanMutasi->status_tinggal), 'milik sendiri')
                    ? 'tetap'
                    : 'kontrak';

                $warga = Warga::updateOrCreate(
                    ['nik' => $permohonanMutasi->nik_pemohon],
                    [
                        'no_kk' => $permohonanMutasi->no_kk,
                        'nama' => $permohonanMutasi->nama_pemohon,
                        'telepon' => $permohonanMutasi->telepon,
                        'status_warga' => $statusWarga,
                        'unit_rumah_id' => $permohonanMutasi->unit_rumah_id,
                        'alamat_ktp' => $permohonanMutasi->alamat_asal,
                        'is_kepala_keluarga' => true,
                        'hubungan_keluarga' => 'Kepala Keluarga',
                    ]
                );

                // 2. Tambah rincian pengikut pindah jika ada
                if (is_array($permohonanMutasi->rincian_pengikut)) {
                    foreach ($permohonanMutasi->rincian_pengikut as $pengikut) {
                        if (! empty($pengikut['nik']) && ! empty($pengikut['nama'])) {
                            Warga::updateOrCreate(
                                ['nik' => $pengikut['nik']],
                                [
                                    'no_kk' => $permohonanMutasi->no_kk,
                                    'nama' => $pengikut['nama'],
                                    'status_warga' => $statusWarga,
                                    'unit_rumah_id' => $permohonanMutasi->unit_rumah_id,
                                    'alamat_ktp' => $permohonanMutasi->alamat_asal,
                                    'is_kepala_keluarga' => false,
                                    'hubungan_keluarga' => $pengikut['hubungan'] ?? 'Anggota Keluarga',
                                ]
                            );
                        }
                    }
                }

                // 3. Update status hunian unit rumah
                if ($permohonanMutasi->unit_rumah_id) {
                    $unit = UnitRumah::find($permohonanMutasi->unit_rumah_id);
                    if ($unit && $unit->status_hunian === 'kosong') {
                        $unit->update([
                            'status_hunian' => $statusWarga === 'tetap' ? 'milik_sendiri' : 'kontrak',
                        ]);
                    }
                }

                $permohonanMutasi->warga_id = $warga->id;
            } elseif ($permohonanMutasi->jenis_mutasi === MutasiType::PINDAH) {
                // Untuk Warga Pindah: Pertahankan data kependudukan, ubah status menjadi pindah
                $warga = Warga::where('nik', $permohonanMutasi->nik_pemohon)
                    ->orWhere('id', $permohonanMutasi->warga_id)
                    ->first();

                if ($warga) {
                    $warga->update([
                        'status_warga' => 'pindah',
                    ]);

                    // Update pengikut juga
                    if (is_array($permohonanMutasi->rincian_pengikut)) {
                        foreach ($permohonanMutasi->rincian_pengikut as $pengikut) {
                            if (! empty($pengikut['nik'])) {
                                Warga::where('nik', $pengikut['nik'])->update([
                                    'status_warga' => 'pindah',
                                ]);
                            }
                        }
                    }
                }
            }

            // Update status permohonan mutasi
            $permohonanMutasi->forceFill([
                'status' => MutasiStatus::SELESAI,
                'diverifikasi_oleh' => $actor->id,
                'diverifikasi_pada' => now(),
                'last_activity_at' => now(),
            ])->save();
        });

        return redirect()
            ->route('admin.mutasi.show', $permohonanMutasi)
            ->with('success', 'Permohonan mutasi berhasil disetujui dan data kependudukan warga telah diperbarui.');
    }

    public function downloadDocument(PermohonanMutasi $permohonanMutasi, DokumenMutasi $dokumenMutasi): HttpResponse
    {
        $this->assertCanManageMutasi(request());

        abort_unless($dokumenMutasi->permohonan_mutasi_id === $permohonanMutasi->id, 404);

        $path = $dokumenMutasi->absolutePath();
        if (! $path || ! file_exists($path)) {
            abort(404, 'Berkas dokumen fisik tidak ditemukan.');
        }

        $mime = $dokumenMutasi->mime_type ?: mime_content_type($path) ?: 'application/octet-stream';
        $filename = $dokumenMutasi->file_name ?: basename($path);

        return response()->download($path, $filename, [
            'Content-Type' => $mime,
        ]);
    }

    public function previewDocument(PermohonanMutasi $permohonanMutasi, DokumenMutasi $dokumenMutasi): HttpResponse
    {
        $this->assertCanManageMutasi(request());

        abort_unless($dokumenMutasi->permohonan_mutasi_id === $permohonanMutasi->id, 404);

        $path = $dokumenMutasi->absolutePath();
        if (! $path || ! file_exists($path)) {
            abort(404, 'Berkas dokumen fisik tidak ditemukan.');
        }

        $mime = $dokumenMutasi->mime_type ?: mime_content_type($path) ?: 'application/octet-stream';

        return response()->file($path, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="'.$dokumenMutasi->file_name.'"',
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $this->assertCanManageMutasi($request);

        $items = PermohonanMutasi::query()
            ->with(['unitRumah'])
            ->orderByDesc('created_at')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="Rekap_Mutasi_RT01_RW08_'.now()->format('Ymd_His').'.csv"',
        ];

        return response()->stream(function () use ($items) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // BOM UTF-8 for Excel

            fputcsv($handle, [
                'Nomor Tiket',
                'Nama Pemohon',
                'NIK',
                'No KK',
                'Jenis Mutasi',
                'Unit Rumah',
                'Status Tinggal',
                'Tanggal Rencana',
                'Alamat Asal',
                'Status Permohonan',
                'Tanggal Pengajuan',
            ]);

            foreach ($items as $m) {
                fputcsv($handle, [
                    $m->nomor_tiket,
                    $m->nama_pemohon,
                    $m->nik_pemohon,
                    $m->no_kk,
                    $m->jenisLabel(),
                    $m->unitRumah?->nama_unit ?? $m->unit_rumah_custom ?? '-',
                    $m->status_tinggal ?? '-',
                    $m->tanggal_rencana?->format('d/m/Y') ?? '-',
                    $m->alamat_asal,
                    $m->statusLabel(),
                    $m->created_at?->timezone(config('app.timezone'))->format('d/m/Y H:i') ?? '-',
                ]);
            }

            fclose($handle);
        }, HttpResponse::HTTP_OK, $headers);
    }

    /**
     * @return array<string, mixed>
     */
    private function listPayload(PermohonanMutasi $m): array
    {
        $timeAgo = $m->created_at ? $m->created_at->diffForHumans() : '-';
        if ($m->status === MutasiStatus::PERLU_REVISI) {
            $timeAgo = 'Menunggu unggah ulang';
        } elseif ($m->status === MutasiStatus::SELESAI) {
            $timeAgo = 'Selesai diverifikasi';
        }

        // Tentukan ringkasan dokumen
        $docCount = $m->dokumen->count();
        $hasBuram = $m->dokumen->contains(fn ($d) => $d->status_pemeriksaan === 'buram');
        $allValid = $docCount > 0 && $m->dokumen->every(fn ($d) => $d->status_pemeriksaan === 'valid');

        $docBadge = [
            'count' => $docCount,
            'label' => "{$docCount} Berkas (KTP, KK)",
            'type' => 'normal',
        ];

        if ($hasBuram) {
            $docBadge = [
                'count' => $docCount,
                'label' => '1 Berkas Buram',
                'type' => 'buram',
            ];
        } elseif ($allValid && $m->status === MutasiStatus::SELESAI) {
            $docBadge = [
                'count' => $docCount,
                'label' => 'Lengkap & Valid',
                'type' => 'valid',
            ];
        } elseif ($allValid) {
            $docBadge = [
                'count' => $docCount,
                'label' => "{$docCount} Berkas Lengkap",
                'type' => 'complete',
            ];
        }

        return [
            'id' => $m->id,
            'nomor_tiket' => $m->nomor_tiket,
            'pemohon' => [
                'nama' => $m->nama_pemohon,
                'nik_masked' => $m->maskedNik(),
                'initials' => $this->initials($m->nama_pemohon),
            ],
            'jenis' => $m->jenis_mutasi,
            'jenis_label' => $m->jenisLabel(),
            'unit_rumah' => [
                'nama' => $m->unitRumah?->nama_unit ?? $m->unit_rumah_custom ?? 'Blok -',
                'status_tinggal' => $m->status_tinggal ?? 'Milik Sendiri',
            ],
            'dokumen' => $docBadge,
            'tanggal' => [
                'formatted' => $m->created_at?->timezone(config('app.timezone'))->format('d M Y • H:i') ?? '-',
                'relative' => $timeAgo,
            ],
            'status' => $m->status,
            'status_label' => $m->statusLabel(),
            'alasan_revisi' => $m->alasan_revisi,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detailPayload(PermohonanMutasi $m): array
    {
        $telp = preg_replace('/[^0-9]/', '', (string) $m->telepon);
        if (str_starts_with($telp, '0')) {
            $telp = '62'.substr($telp, 1);
        }

        $waText = urlencode("Halo Bpk/Ibu {$m->nama_pemohon}, kami dari Pengurus RT 01/08 Sukatani ingin mengonfirmasi permohonan mutasi {$m->nomor_tiket}.");
        $waUrl = "https://wa.me/{$telp}?text={$waText}";

        $pengikut = is_array($m->rincian_pengikut) ? $m->rincian_pengikut : [];
        $pengikutPayload = array_map(function ($p) {
            $nik = (string) ($p['nik'] ?? '');
            $masked = strlen($nik) === 16 ? substr($nik, 0, 8).'****'.substr($nik, -4) : $nik;

            return [
                'nama' => $p['nama'] ?? '-',
                'hubungan' => $p['hubungan'] ?? '-',
                'umur' => $p['umur'] ?? 0,
                'nik_masked' => $masked,
            ];
        }, $pengikut);

        $waktuMasuk = $m->created_at
            ? $m->created_at->timezone(config('app.timezone'))->isoFormat('D MMMM Y, HH:mm') . ' WIB • ' . $m->created_at->diffForHumans()
            : '-';

        return [
            'id' => $m->id,
            'nomor_tiket' => $m->nomor_tiket,
            'status' => $m->status,
            'status_label' => $m->statusLabel(),
            'waktu_masuk' => $waktuMasuk,
            'pemohon' => [
                'nama' => $m->nama_pemohon,
                'nik' => $m->nik_pemohon,
                'no_kk' => $m->no_kk,
                'telepon' => $m->telepon,
                'whatsapp_url' => $waUrl,
                'tanggal_rencana' => $m->tanggal_rencana ? Carbon::parse($m->tanggal_rencana)->isoFormat('dddd, D MMMM Y') : '-',
            ],
            'jenis_mutasi' => $m->jenis_mutasi,
            'jenis_label' => $m->jenisLabel(),
            'unit_hunian' => [
                'nama' => $m->unitRumah?->nama_unit ?? $m->unit_rumah_custom ?? 'Blok -',
                'status_tinggal' => $m->status_tinggal ?? 'Kontrak / Sewa Tahunan',
                'nama_pemilik' => $m->unitRumah?->nama_pemilik ?? $m->nama_pemilik_rumah ?? 'Bpk. Hendro Sujarwo',
            ],
            'alamat_asal' => $m->alamat_asal,
            'alamat_tujuan' => $m->alamat_tujuan,
            'rincian_pengikut' => $pengikutPayload,
            'checklist' => [
                'alamat' => (bool) $m->checklist_alamat,
                'nik' => (bool) $m->checklist_nik,
                'dokumen' => (bool) $m->checklist_dokumen,
                'passed_count' => $m->checklistPassedCount(),
                'total_count' => 3,
                'all_passed' => $m->allChecklistsPassed(),
            ],
            'catatan_pemeriksaan' => $m->catatan_pemeriksaan ?? '',
            'alasan_revisi' => $m->alasan_revisi ?? '',
            'dokumen' => $m->dokumen->map(fn (DokumenMutasi $d) => [
                'id' => $d->id,
                'jenis_dokumen' => $d->jenis_dokumen,
                'nama_dokumen' => $d->nama_dokumen,
                'file_name' => $d->file_name,
                'file_size_label' => $d->file_size_label,
                'status_pemeriksaan' => $d->status_pemeriksaan,
                'keterangan_tambahan' => $d->keterangan_tambahan,
                'preview_url' => route('admin.mutasi.document.preview', [$m->id, $d->id]),
                'download_url' => route('admin.mutasi.document.download', [$m->id, $d->id]),
            ]),
        ];
    }

    private function initials(string $name): string
    {
        $words = explode(' ', trim($name));
        $initials = '';
        foreach (array_slice($words, 0, 2) as $w) {
            $initials .= strtoupper($w[0] ?? '');
        }

        return $initials ?: 'W';
    }

    private function assertCanManageMutasi(Request $request): void
    {
        $user = $request->user();
        abort_unless($user && in_array($user->role, [Roles::KETUA_RT, Roles::SEKRETARIS], true), 403);
    }
}
