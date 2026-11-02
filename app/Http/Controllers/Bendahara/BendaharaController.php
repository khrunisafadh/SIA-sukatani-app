<?php

namespace App\Http\Controllers\Bendahara;

use App\Http\Controllers\Controller;
use App\Models\TransaksiKas;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BendaharaController extends Controller
{
    /**
     * Tampilkan Dashboard Bendahara & Manajemen Aliran Kas RT.
     */
    public function index(Request $request): Response
    {
        $periods = TransaksiKas::query()
            ->distinct()
            ->orderBy('periode', 'desc')
            ->pluck('periode')
            ->toArray();

        if (empty($periods)) {
            $periods = ['Januari–Juni 2025', 'Juli–Desember 2024', 'Januari–Juni 2024'];
        }

        $selectedPeriod = $request->query('periode', $periods[0] ?? 'Januari–Juni 2025');

        $query = TransaksiKas::query()->where('periode', $selectedPeriod);

        $allInPeriod = (clone $query)->orderBy('tanggal', 'desc')->orderBy('id', 'desc')->get();

        $totalPemasukan = (int) (clone $query)->where('jenis', 'pemasukan')->sum('nominal');
        $totalPengeluaran = (int) (clone $query)->where('jenis', 'pengeluaran')->sum('nominal');
        $saldoAkhir = $totalPemasukan - $totalPengeluaran;

        $monthlyFlow = $this->calculateMonthlyFlow($allInPeriod, $selectedPeriod);

        $kategoriList = [
            'Iuran Warga',
            'Operasional & Kebersihan',
            'Perawatan Fasilitas',
            'Kegiatan Warga',
            'Sosial & Dana Darurat',
            'Lainnya',
        ];

        return Inertia::render('Bendahara/Dashboard', [
            'summary' => [
                'saldoAkhir' => $saldoAkhir,
                'totalPemasukan' => $totalPemasukan,
                'totalPengeluaran' => $totalPengeluaran,
                'pembaruanTerakhir' => Carbon::now()->translatedFormat('d F Y'),
            ],
            'monthlyFlow' => $monthlyFlow,
            'transactions' => $allInPeriod,
            'periods' => $periods,
            'selectedPeriod' => $selectedPeriod,
            'kategoriList' => $kategoriList,
        ]);
    }

    /**
     * Simpan transaksi kas baru (data simulasi / riil).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tanggal' => ['required', 'date'],
            'keterangan' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'string', 'max:100'],
            'jenis' => ['required', 'string', 'in:pemasukan,pengeluaran'],
            'nominal' => ['required', 'numeric', 'min:1000'],
            'periode' => ['required', 'string', 'max:100'],
            'catatan' => ['nullable', 'string', 'max:500'],
        ], [
            'tanggal.required' => 'Tanggal transaksi wajib diisi.',
            'keterangan.required' => 'Keterangan transaksi wajib diisi.',
            'kategori.required' => 'Pilih kategori transaksi.',
            'jenis.required' => 'Pilih jenis transaksi (pemasukan / pengeluaran).',
            'nominal.required' => 'Nominal transaksi wajib diisi.',
            'nominal.min' => 'Nominal minimal Rp1.000.',
        ]);

        TransaksiKas::create([
            'periode' => $validated['periode'],
            'tanggal' => $validated['tanggal'],
            'keterangan' => $validated['keterangan'],
            'kategori' => $validated['kategori'],
            'jenis' => $validated['jenis'],
            'nominal' => (int) $validated['nominal'],
            'catatan' => $validated['catatan'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        return redirect()->back()->with('success', 'Transaksi kas berhasil dicatat dan langsung terhubung ke landing page publik!');
    }

    /**
     * Hapus transaksi kas.
     */
    public function destroy(TransaksiKas $transaksiKas): RedirectResponse
    {
        $transaksiKas->delete();

        return redirect()->back()->with('success', 'Data transaksi kas berhasil dihapus.');
    }

    /**
     * Hitung perbandingan arus kas per bulan (Jan - Jun / Jul - Des).
     */
    public static function calculateMonthlyFlow($transactions, string $periode): array
    {
        $isFirstSemester = str_contains(strtolower($periode), 'januari');
        $months = $isFirstSemester
            ? [
                1 => 'Jan',
                2 => 'Feb',
                3 => 'Mar',
                4 => 'Apr',
                5 => 'Mei',
                6 => 'Jun',
            ]
            : [
                7 => 'Jul',
                8 => 'Agu',
                9 => 'Sep',
                10 => 'Okt',
                11 => 'Nov',
                12 => 'Des',
            ];

        $flow = [];
        foreach ($months as $num => $name) {
            $monthTx = $transactions->filter(function ($tx) use ($num) {
                return Carbon::parse($tx->tanggal)->month === $num;
            });

            $in = (int) $monthTx->where('jenis', 'pemasukan')->sum('nominal');
            $out = (int) $monthTx->where('jenis', 'pengeluaran')->sum('nominal');

            $flow[] = [
                'month' => $name,
                'monthNum' => $num,
                'pemasukan' => $in,
                'pengeluaran' => $out,
            ];
        }

        return $flow;
    }
}
