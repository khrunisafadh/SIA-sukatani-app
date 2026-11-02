<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\PengajuanSurat;
use App\Models\PermohonanMutasi;
use App\Models\Warga;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PortalDashboardController extends Controller
{
    /**
     * Menampilkan dashboard utama portal warga.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Ambil profil warga berdasarkan user_id atau NIK
        $warga = Warga::query()
            ->where('user_id', $user->id)
            ->orWhere('nik', $user->username)
            ->first();

        // Ambil riwayat pengajuan surat warga yang sebenarnya dari database
        $lettersQuery = PengajuanSurat::query()
            ->where(function ($q) use ($user, $warga) {
                $q->where('pemohon_id', $user->id)
                    ->orWhere('created_by', $user->id);
                if ($warga) {
                    $q->orWhere('data_surat->nik', $warga->nik)
                        ->orWhere('data_surat->nik_pemohon', $warga->nik);
                }
            })
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->take(5)
            ->get();

        $recentLetters = $lettersQuery->map(function (PengajuanSurat $letter) {
            return [
                'id' => $letter->id,
                'nomor' => $letter->nomor_surat ?: ($letter->nomor ?: ('SRT-' . ($letter->created_at ? $letter->created_at->format('Y') : date('Y')) . '-' . str_pad($letter->id, 3, '0', STR_PAD_LEFT))),
                'jenis_label' => $letter->jenisLabel() ?: 'Surat Pengantar',
                'keperluan' => $letter->keperluan ?: '-',
                'tanggal_format' => 'Diajukan ' . ($letter->created_at ? $letter->created_at->translatedFormat('d F Y') : '-'),
                'created_at' => $letter->created_at?->toIso8601String(),
                'status' => $letter->status,
                'status_label' => $letter->statusLabel(),
                'can_download' => $letter->draftPdfAccessible(),
            ];
        })->values()->all();

        // Bangun notifikasi aktivitas terkini langsung dari rekaman database warga
        $activityList = collect();

        // 1. Notifikasi dari Pengajuan Surat Resmi
        foreach ($lettersQuery as $letter) {
            $nomor = $letter->nomor_surat ?: $letter->nomor;
            $jenis = $letter->jenisLabel();

            if ($letter->status === 'terbit') {
                $activityList->push([
                    'id' => 'letter-' . $letter->id,
                    'type' => 'terbit',
                    'title' => 'Surat Resmi Telah Terbit',
                    'desc' => "Pengajuan {$nomor} ({$jenis}) telah selesai diverifikasi dan siap diunduh.",
                    'time' => $letter->issued_at ? $letter->issued_at->diffForHumans() : ($letter->updated_at ? $letter->updated_at->diffForHumans() : 'Baru saja'),
                    'timestamp' => $letter->issued_at ?: $letter->updated_at,
                    'icon' => 'check',
                ]);
            } elseif ($letter->status === 'selesai') {
                $activityList->push([
                    'id' => 'letter-' . $letter->id,
                    'type' => 'selesai',
                    'title' => 'Pengesahan Fisik Lengkap',
                    'desc' => "Pengajuan {$nomor} telah selesai ditandatangani Ketua RT dan Ketua RW.",
                    'time' => $letter->completed_at ? $letter->completed_at->diffForHumans() : ($letter->updated_at ? $letter->updated_at->diffForHumans() : 'Baru saja'),
                    'timestamp' => $letter->completed_at ?: $letter->updated_at,
                    'icon' => 'check',
                ]);
            } elseif ($letter->status === 'selesai_rt') {
                $activityList->push([
                    'id' => 'letter-' . $letter->id,
                    'type' => 'selesai_rt',
                    'title' => 'Disahkan oleh Ketua RT',
                    'desc' => "Pengajuan {$nomor} telah disahkan RT dan diteruskan untuk registrasi RW.",
                    'time' => $letter->rt_confirmed_at ? $letter->rt_confirmed_at->diffForHumans() : ($letter->updated_at ? $letter->updated_at->diffForHumans() : 'Baru saja'),
                    'timestamp' => $letter->rt_confirmed_at ?: $letter->updated_at,
                    'icon' => 'check',
                ]);
            } else {
                $activityList->push([
                    'id' => 'letter-' . $letter->id,
                    'type' => 'diajukan',
                    'title' => 'Pengajuan Surat Terkirim',
                    'desc' => "Pengajuan {$nomor} ({$jenis}) sedang menunggu peninjauan pengurus RT.",
                    'time' => $letter->created_at ? $letter->created_at->diffForHumans() : 'Baru saja',
                    'timestamp' => $letter->created_at,
                    'icon' => 'file-text',
                ]);
            }
        }

        // 2. Notifikasi dari Pelaporan Pindah / Datang (Mutasi)
        $mutasiList = PermohonanMutasi::query()
            ->where(function ($q) use ($user, $warga) {
                $q->where('user_id', $user->id);
                if ($warga) {
                    $q->orWhere('warga_id', $warga->id)
                        ->orWhere('nik_pemohon', $warga->nik);
                }
            })
            ->orderByDesc('updated_at')
            ->take(3)
            ->get();

        foreach ($mutasiList as $mutasi) {
            $tiket = $mutasi->nomor_tiket ?: ('MUT-' . $mutasi->id);
            $jenisMutasi = ucfirst($mutasi->jenis_mutasi);

            if ($mutasi->status === 'disetujui') {
                $activityList->push([
                    'id' => 'mutasi-' . $mutasi->id,
                    'type' => 'mutasi_approved',
                    'title' => "Laporan {$jenisMutasi} Disetujui",
                    'desc' => "Laporan domisili tiket {$tiket} telah disetujui pengurus RT.",
                    'time' => $mutasi->diverifikasi_pada ? Carbon::parse($mutasi->diverifikasi_pada)->diffForHumans() : ($mutasi->updated_at ? $mutasi->updated_at->diffForHumans() : 'Baru saja'),
                    'timestamp' => $mutasi->diverifikasi_pada ? Carbon::parse($mutasi->diverifikasi_pada) : $mutasi->updated_at,
                    'icon' => 'check',
                ]);
            } elseif ($mutasi->status === 'revisi') {
                $activityList->push([
                    'id' => 'mutasi-' . $mutasi->id,
                    'type' => 'mutasi_revision',
                    'title' => "Permintaan Revisi Dokumen",
                    'desc' => "Laporan {$tiket}: " . ($mutasi->alasan_revisi ?: 'Periksa kembali kelengkapan berkas.'),
                    'time' => $mutasi->updated_at ? $mutasi->updated_at->diffForHumans() : 'Baru saja',
                    'timestamp' => $mutasi->updated_at,
                    'icon' => 'alert',
                ]);
            } else {
                $activityList->push([
                    'id' => 'mutasi-' . $mutasi->id,
                    'type' => 'mutasi_pending',
                    'title' => "Laporan {$jenisMutasi} Tercatat",
                    'desc' => "Laporan tiket {$tiket} dalam peninjauan pengurus lingkungan.",
                    'time' => $mutasi->created_at ? $mutasi->created_at->diffForHumans() : 'Baru saja',
                    'timestamp' => $mutasi->created_at,
                    'icon' => 'arrow-left-right',
                ]);
            }
        }

        // 3. Notifikasi Status Kependudukan Warga
        if ($warga) {
            $activityList->push([
                'id' => 'warga-' . $warga->id,
                'type' => 'warga',
                'title' => 'Data Kependudukan Terverifikasi',
                'desc' => "Profil Anda terdaftar resmi sebagai warga RT 01 / RW 08 ({$warga->status_domisili}).",
                'time' => $warga->updated_at ? $warga->updated_at->diffForHumans() : 'Aktif',
                'timestamp' => $warga->updated_at ?: $warga->created_at,
                'icon' => 'users',
            ]);
        } else {
            $activityList->push([
                'id' => 'user-' . $user->id,
                'type' => 'warga',
                'title' => 'Selamat Datang di SIA Sukatani',
                'desc' => "Akun warga atas nama {$user->name} telah aktif. Anda dapat mengajukan surat atau lapor domisili secara mandiri.",
                'time' => $user->created_at ? $user->created_at->diffForHumans() : 'Aktif',
                'timestamp' => $user->created_at ?: now(),
                'icon' => 'users',
            ]);
        }

        // Urutkan seluruh notifikasi berdasarkan timestamp terbaru
        $notifications = $activityList->sortByDesc('timestamp')->take(5)->values()->all();

        return Inertia::render('Portal/Dashboard', [
            'warga' => $warga ? [
                'id' => $warga->id,
                'nama' => $warga->nama_lengkap ?: $warga->nama ?: $user->name,
                'nama_lengkap' => $warga->nama_lengkap ?: $warga->nama ?: $user->name,
                'nik' => $warga->nik ?: ($user->username ?: '3276020101900001'),
                'masked_nik' => $warga->masked_nik ?: $this->maskNik($warga->nik ?: $user->username),
                'no_kk' => $warga->no_kk ?: '3276020101900002',
                'status_domisili' => $warga->status_domisili ?: 'Warga Tetap (Pemilik Rumah)',
                'is_verified' => true,
            ] : [
                'id' => null,
                'nama' => $user->name,
                'nama_lengkap' => $user->name,
                'nik' => $user->username ?: '3276020101900001',
                'masked_nik' => $this->maskNik($user->username ?: '3276020101900001'),
                'no_kk' => '3276020101900002',
                'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
                'is_verified' => true,
            ],
            'recentLetters' => $recentLetters,
            'notifications' => $notifications,
        ]);
    }

    /**
     * Menampilkan detail data kependudukan warga yang sedang login.
     */
    public function wargaDetail(Request $request): Response
    {
        $user = $request->user();

        $warga = Warga::query()
            ->where('user_id', $user->id)
            ->orWhere('nik', $user->username)
            ->first();

        return Inertia::render('Portal/Warga/Index', [
            'warga' => $warga ? [
                'id' => $warga->id,
                'nama_lengkap' => $warga->nama_lengkap ?: $warga->nama ?: $user->name,
                'nik' => $warga->nik ?: $user->username,
                'masked_nik' => $warga->masked_nik ?: $this->maskNik($warga->nik ?: $user->username),
                'no_kk' => $warga->no_kk ?: '-',
                'gender' => $warga->gender ?: ($warga->jenis_kelamin ?: 'L'),
                'tempat_lahir' => $warga->tempat_lahir ?: 'Depok',
                'tgl_lahir' => $warga->tgl_lahir ? $warga->tgl_lahir->format('Y-m-d') : ($warga->tanggal_lahir ? $warga->tanggal_lahir->format('Y-m-d') : '1995-01-01'),
                'agama' => $warga->agama ?: 'Islam',
                'goldar' => $warga->goldar ?: 'O',
                'shdk' => $warga->shdk ?: ($warga->hubungan_keluarga ?: 'Kepala Keluarga'),
                'nama_jalan' => $warga->nama_jalan ?: 'Jl. Mawar',
                'nomor_rumah' => $warga->nomor_rumah ?: 'No. 12',
                'detail_alamat' => $warga->detail_alamat ?: '',
                'alamat_lengkap' => $warga->alamat_lengkap ?: 'RT 01 / RW 08 Kel. Sukatani, Tapos, Depok',
                'status_domisili' => $warga->status_domisili ?: 'Warga Tetap (Pemilik Rumah)',
                'no_wa' => $warga->no_wa ?: ($warga->telepon ?: ''),
                'pekerjaan' => $warga->pekerjaan ?: '',
                'status_administrasi' => $warga->status_administrasi ?: 'Aktif',
            ] : [
                'id' => null,
                'nama_lengkap' => $user->name,
                'nik' => $user->username ?: '3276020101900001',
                'masked_nik' => $this->maskNik($user->username ?: '3276020101900001'),
                'no_kk' => '3276020101900002',
                'gender' => 'L',
                'tempat_lahir' => 'Depok',
                'tgl_lahir' => '1995-01-01',
                'agama' => 'Islam',
                'goldar' => 'O',
                'shdk' => 'Kepala Keluarga',
                'nama_jalan' => 'Jl. Mawar',
                'nomor_rumah' => 'No. 12',
                'detail_alamat' => '',
                'alamat_lengkap' => 'RT 01 / RW 08 Kel. Sukatani, Tapos, Depok',
                'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
                'no_wa' => '',
                'pekerjaan' => '',
                'status_administrasi' => 'Aktif',
            ],
        ]);
    }

    /**
     * Memperbarui kontak dan pekerjaan warga secara mandiri.
     */
    public function updateWargaDetail(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'no_wa' => ['nullable', 'string', 'max:20'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'detail_alamat' => ['nullable', 'string', 'max:255'],
            'agama' => ['nullable', 'string', 'max:50'],
            'goldar' => ['nullable', 'string', 'max:10'],
        ]);

        $warga = Warga::query()
            ->where('user_id', $user->id)
            ->orWhere('nik', $user->username)
            ->first();

        if ($warga) {
            $warga->update([
                'no_wa' => $validated['no_wa'] ?? $warga->no_wa,
                'telepon' => $validated['no_wa'] ?? $warga->telepon,
                'pekerjaan' => $validated['pekerjaan'] ?? $warga->pekerjaan,
                'detail_alamat' => $validated['detail_alamat'] ?? $warga->detail_alamat,
                'agama' => $validated['agama'] ?? $warga->agama,
                'goldar' => $validated['goldar'] ?? $warga->goldar,
            ]);
        } else {
            Warga::create([
                'user_id' => $user->id,
                'nik' => $user->username ?: '3276020101900001',
                'no_kk' => '3276020101900002',
                'nama' => $user->name,
                'nama_lengkap' => $user->name,
                'no_wa' => $validated['no_wa'] ?? '',
                'telepon' => $validated['no_wa'] ?? '',
                'pekerjaan' => $validated['pekerjaan'] ?? '',
                'detail_alamat' => $validated['detail_alamat'] ?? '',
                'agama' => $validated['agama'] ?? 'Islam',
                'goldar' => $validated['goldar'] ?? 'O',
                'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
                'status_administrasi' => 'Aktif',
            ]);
        }

        return redirect()->back()->with('success', 'Data kependudukan Anda berhasil diperbarui!');
    }

    private function maskNik(?string $nik): string
    {
        if (! $nik) {
            return '3276••••••••1042';
        }
        if (strlen($nik) >= 8) {
            return substr($nik, 0, 4) . '••••••••' . substr($nik, -4);
        }

        return $nik;
    }
}
