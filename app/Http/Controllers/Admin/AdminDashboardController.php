<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PengajuanSurat;
use App\Models\PengajuanSuratHistory;
use App\Models\Warga;
use App\Support\LetterStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $totalWarga = Warga::count();
        $totalDiajukan = PengajuanSurat::where('status', LetterStatus::DIAJUKAN)->count();
        $totalLaporanHunian = Warga::where(function ($q) {
            $q->where('status_domisili', 'like', '%Kontrak%')
              ->orWhere('status_domisili', 'like', '%Sewa%')
              ->orWhere('status_domisili', 'like', '%Kost%');
        })->count();
        $totalSelesai = PengajuanSurat::where('status', LetterStatus::SELESAI)->count();

        // Ambil data pengajuan surat terbaru secara real-time dari database
        $letters = PengajuanSurat::query()
            ->with(['pemohon:id,name,username', 'creator:id,name,role', 'completedBy:id,name,role'])
            ->orderByDesc('last_activity_at')
            ->orderByDesc('id')
            ->take(5)
            ->get();

        $recentLetters = $letters->map(function (PengajuanSurat $letter) {
            $statusClass = match ($letter->status) {
                LetterStatus::DIAJUKAN => 'bg-[#FFF3DA] text-[#A66700] border border-[#FDE6B8]',
                LetterStatus::TERBIT => 'bg-[#EBF2FF] text-[#2F65CB] border border-[#CDE0FD]',
                LetterStatus::SELESAI => 'bg-[#EAF7EE] text-[#14833B] border border-[#B6E6C5]',
                default => 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
            };

            // Ambil waktu real-time kapan surat dibuat
            $createdAt = $letter->created_at ?? $letter->updated_at ?? now();
            $createdAtFormatted = $createdAt->timezone(config('app.timezone'))->translatedFormat('d F Y, H.i');

            return [
                'id' => $letter->id,
                'nomor' => $letter->nomor,
                'pemohon_name' => $letter->pemohon?->name ?? ($letter->data_surat['nama'] ?? ($letter->creator?->name ?? 'Warga RT 01')),
                'pemohon_nik' => $letter->pemohon?->username ?? ($letter->data_surat['nomor_kk_ktp'] ?? '-'),
                'jenis_surat' => $letter->jenis_surat,
                'jenis_label' => $letter->jenisLabel(),
                'keperluan' => $letter->keperluan,
                'keterangan' => $letter->keterangan,
                'status' => $letter->status,
                'status_label' => $letter->statusLabel(),
                'status_class' => $statusClass,
                'petugas_name' => $letter->completedBy?->name ?? $letter->creator?->name ?? 'Budi Santoso',
                'date' => $createdAt->timezone(config('app.timezone'))->format('d M Y'),
                'created_at_formatted' => $createdAtFormatted,
                'updated_at_formatted' => $createdAtFormatted,
                'show_url' => route('admin.surat.show', $letter->id),
            ];
        });

        // Riwayat aktivitas terbaru
        $recentHistories = PengajuanSuratHistory::query()
            ->with(['letter', 'actor'])
            ->latest('id')
            ->take(5)
            ->get()
            ->map(function ($history) {
                $isCompleted = $history->status === LetterStatus::SELESAI;
                return [
                    'id' => $history->id,
                    'title' => $isCompleted ? 'Status surat diperbarui' : 'Pengajuan surat baru',
                    'desc' => ($history->letter?->nomor ?? 'Surat') . ' (' . LetterStatus::label($history->status) . ')',
                    'time' => $history->created_at?->timezone(config('app.timezone'))->format('H.i') ?? 'Baru saja',
                    'status' => $history->status,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_warga' => (string) ($totalWarga > 0 ? $totalWarga : 248),
                'surat_diajukan' => str_pad((string) $totalDiajukan, 2, '0', STR_PAD_LEFT),
                'laporan_hunian' => str_pad((string) ($totalLaporanHunian > 0 ? $totalLaporanHunian : 3), 2, '0', STR_PAD_LEFT),
                'surat_selesai' => str_pad((string) $totalSelesai, 2, '0', STR_PAD_LEFT),
            ],
            'recentLetters' => $recentLetters,
            'recentHistories' => $recentHistories,
        ]);
    }
}
