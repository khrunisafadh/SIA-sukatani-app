<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warga;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class WargaController extends Controller
{
    /**
     * Menampilkan daftar warga
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $statusHunian = $request->query('status_hunian');

        $query = Warga::query()->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('no_kk', 'like', "%{$search}%")
                  ->orWhere('nama_jalan', 'like', "%{$search}%")
                  ->orWhere('detail_alamat', 'like', "%{$search}%")
                  ->orWhere('alamat_lengkap', 'like', "%{$search}%")
                  ->orWhere('nomor_rumah', 'like', "%{$search}%");
            });
        }

        if ($statusHunian && $statusHunian !== 'Semua') {
            $query->where('status_domisili', 'like', "%{$statusHunian}%");
        }

        $wargas = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Warga/Index', [
            'wargas' => $wargas,
            'filters' => [
                'search' => $search,
                'status_hunian' => $statusHunian,
            ],
            'totalWarga' => Warga::count(),
            'totalTetap' => Warga::where('status_domisili', 'like', '%Tetap%')->count(),
            'totalKontrak' => Warga::where('status_domisili', 'like', '%Kontrak%')->orWhere('status_domisili', 'like', '%Sewa%')->count(),
        ]);
    }

    /**
     * Menampilkan formulir tambah data warga baru
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Warga/Create');
    }

    /**
     * Cek apakah NIK sudah terdaftar (AJAX/API endpoint untuk tombol "Cek NIK")
     */
    public function checkNik(Request $request)
    {
        $nik = $request->query('nik');
        if (! $nik || strlen($nik) !== 16) {
            return response()->json([
                'valid' => false,
                'message' => 'NIK harus berjumlah 16 digit angka.',
            ]);
        }

        $exists = Warga::where('nik', $nik)->exists();

        if ($exists) {
            return response()->json([
                'valid' => false,
                'message' => 'NIK sudah terdaftar di sistem RT 01 Sukatani.',
            ]);
        }

        return response()->json([
            'valid' => true,
            'message' => 'NIK valid & belum terdaftar di RT 01 Sukatani.',
        ]);
    }

    /**
     * Menyimpan data warga baru ke database
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => ['required', 'string', 'size:16', 'unique:wargas,nik'],
            'no_kk' => ['required', 'string', 'size:16'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:L,P'],
            'tempat_lahir' => ['required', 'string', 'max:100'],
            'tgl_lahir' => ['required', 'date'],
            'agama' => ['required', 'string'],
            'goldar' => ['nullable', 'string'],
            'shdk' => ['required', 'string'],
            'nama_jalan' => ['required', 'string', 'max:255'],
            'nomor_rumah' => ['required', 'string', 'max:50'],
            'detail_alamat' => ['nullable', 'string', 'max:500'],
            'status_domisili' => ['required', 'string'],
            'no_wa' => ['nullable', 'string', 'max:20'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'foto_ktp' => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'], // Max 5MB
            'foto_kk' => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
        ], [
            'nik.required' => 'Nomor Induk Kependudukan (NIK) wajib diisi.',
            'nik.size' => 'NIK harus berjumlah tepat 16 digit.',
            'nik.unique' => 'NIK ini sudah terdaftar di sistem warga.',
            'no_kk.required' => 'Nomor Kartu Keluarga wajib diisi.',
            'no_kk.size' => 'Nomor KK harus berjumlah tepat 16 digit.',
            'nama_lengkap.required' => 'Nama lengkap wajib diisi sesuai KTP.',
            'nama_jalan.required' => 'Nama jalan / gang wajib diisi.',
            'nomor_rumah.required' => 'Nomor rumah wajib diisi.',
        ]);

        // Upload Dokumen Pendukung jika ada
        if ($request->hasFile('foto_ktp')) {
            $validated['foto_ktp'] = $request->file('foto_ktp')->store('dokumen_warga/ktp', 'public');
        }

        if ($request->hasFile('foto_kk')) {
            $validated['foto_kk'] = $request->file('foto_kk')->store('dokumen_warga/kk', 'public');
        }

        $jalan = $validated['nama_jalan'];
        $nomor = $validated['nomor_rumah'];
        $detail = !empty($validated['detail_alamat']) ? " ({$validated['detail_alamat']})" : '';
        
        $validated['blok_rumah'] = $jalan; // tetap disinkronkan untuk kompatibilitas data lama
        $validated['alamat_lengkap'] = "{$jalan} {$nomor}{$detail}, RT 01 / RW 08, Kelurahan Sukatani, Tapos, Depok";
        $validated['status_administrasi'] = 'Aktif';

        $warga = Warga::create($validated);

        return redirect()->route('admin.warga.index')->with('success', "Data warga {$warga->nama_lengkap} (NIK: {$warga->nik}) berhasil disimpan langsung ke database!");
    }
}
