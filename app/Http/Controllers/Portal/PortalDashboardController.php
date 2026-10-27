<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\PengajuanSurat;
use App\Models\Warga;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        // Ambil riwayat pengajuan surat warga
        $lettersQuery = PengajuanSurat::query()
            ->where(function ($q) use ($user) {
                $q->where('pemohon_id', $user->id)
                    ->orWhere('created_by', $user->id);
            })
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->take(5)
            ->get();

        $recentLetters = $lettersQuery->map(function (PengajuanSurat $letter) {
            $statusLabel = $letter->statusLabel();
            if (in_array(strtolower($letter->status), ['selesai', 'terbit'], true)) {
                $statusLabel = 'Terbit';
            } elseif (in_array(strtolower($letter->status), ['diajukan', 'verifikasi_rt', 'verifikasi_rw', 'proses'], true)) {
                $statusLabel = 'Diproses';
            }

            return [
                'id' => $letter->id,
                'nomor' => $letter->nomor ?: ('SIA-' . date('ymd') . '-' . str_pad($letter->id, 3, '0', STR_PAD_LEFT)),
                'jenis_label' => $letter->jenisLabel() ?: 'Surat Pengantar',
                'tanggal_format' => 'Diajukan ' . ($letter->created_at ? $letter->created_at->translatedFormat('d F Y') : now()->translatedFormat('d F Y')),
                'status' => $letter->status,
                'status_label' => $statusLabel,
            ];
        });

        // Notifikasi terkini (aktivitas terbaru untuk warga)
        $notifications = [
            [
                'id' => 1,
                'type' => 'surat',
                'title' => 'Pengajuan surat baru',
                'desc' => 'Siti Rahmawati mengajukan Surat Pengantar',
                'time' => '5 menit lalu',
                'icon' => 'file-text',
            ],
            [
                'id' => 2,
                'type' => 'terbit',
                'title' => 'Status surat diperbarui',
                'desc' => 'Pengajuan SIA-250125-007 telah terbit',
                'time' => '1 jam lalu',
                'icon' => 'check',
            ],
            [
                'id' => 3,
                'type' => 'warga',
                'title' => 'Data warga diperbarui',
                'desc' => 'Profil keluarga Budi Santoso diperbarui',
                'time' => 'Kemarin, 16.40',
                'icon' => 'users',
            ],
        ];

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
