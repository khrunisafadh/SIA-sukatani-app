<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\MutasiAdminController;
use App\Http\Controllers\Admin\SuratAdminController;
use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\Admin\WargaController;
use App\Http\Controllers\Portal\PindahDatangController;
use App\Http\Controllers\Portal\PortalDashboardController;
use App\Http\Controllers\Portal\SuratPortalController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| 1. Halaman Publik (Sebelum Login) - Siapapun Dapat Mengakses
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Redirect Universal /dashboard
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user && in_array($user->role, ['ketua_rt', 'sekretaris'], true)) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('portal.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| 2. Dashboard Admin / Pengurus RT (Khusus Ketua RT & Sekretaris)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:ketua_rt,sekretaris'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Pengajuan Surat Admin (Verifikasi, Pantau, Pengesahan Fisik RT & RW, Akses PDF Terbit)
    Route::get('pengajuan-surat', [SuratAdminController::class, 'index'])->name('surat.index');
    Route::get('pengajuan-surat/{pengajuanSurat}', [SuratAdminController::class, 'show'])->name('surat.show');
    Route::post('pengajuan-surat/{pengajuanSurat}/verifikasi', [SuratAdminController::class, 'verify'])->name('surat.verify');
    Route::post('pengajuan-surat/{pengajuanSurat}/pengesahan/rt', [SuratAdminController::class, 'confirmRt'])->name('surat.confirm-rt');
    Route::post('pengajuan-surat/{pengajuanSurat}/pengesahan/rw', [SuratAdminController::class, 'confirmRw'])->name('surat.confirm-rw');
    Route::post('pengajuan-surat/{pengajuanSurat}/pengesahan', [SuratAdminController::class, 'confirmEndorsement'])->name('surat.confirm');
    Route::get('pengajuan-surat/{pengajuanSurat}/pdf', [SuratAdminController::class, 'preview'])->name('surat.pdf.preview');
    Route::get('pengajuan-surat/{pengajuanSurat}/pdf/unduh', [SuratAdminController::class, 'download'])->name('surat.pdf.download');


    // Modul Data Warga
    Route::get('/warga', [WargaController::class, 'index'])->name('warga.index');
    Route::get('/warga/create', [WargaController::class, 'create'])->name('warga.create');
    Route::post('/warga', [WargaController::class, 'store'])->name('warga.store');
    Route::get('/warga/check-nik', [WargaController::class, 'checkNik'])->name('warga.check-nik');

    // Modul Verifikasi Laporan Pindah / Datang
    Route::get('pindah-datang', [MutasiAdminController::class, 'index'])->name('mutasi.index');
    Route::get('pindah-datang/ekspor', [MutasiAdminController::class, 'export'])->name('mutasi.export');
    Route::get('pindah-datang/{permohonanMutasi}', [MutasiAdminController::class, 'show'])->name('mutasi.show');
    Route::post('pindah-datang/{permohonanMutasi}/draft', [MutasiAdminController::class, 'saveDraft'])->name('mutasi.save-draft');
    Route::post('pindah-datang/{permohonanMutasi}/revisi', [MutasiAdminController::class, 'requestRevision'])->name('mutasi.request-revision');
    Route::post('pindah-datang/{permohonanMutasi}/setujui', [MutasiAdminController::class, 'approve'])->name('mutasi.approve');
    Route::get('pindah-datang/{permohonanMutasi}/dokumen/{dokumenMutasi}/unduh', [MutasiAdminController::class, 'downloadDocument'])->name('mutasi.document.download');
    Route::get('pindah-datang/{permohonanMutasi}/dokumen/{dokumenMutasi}/pratinjau', [MutasiAdminController::class, 'previewDocument'])->name('mutasi.document.preview');


    // Alias rute lama Pindah / Datang agar kompatibel
    Route::get('/pindah-datang-redirect', function () {
        return redirect()->route('admin.mutasi.index');
    })->name('pindah-datang.index');
});

Route::middleware(['auth', 'role:ketua_rt'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('pengguna', [UserRoleController::class, 'index'])->name('users.index');
    Route::post('pengguna', [UserRoleController::class, 'store'])->name('users.store');
    Route::patch('pengguna/{user}/role', [UserRoleController::class, 'updateRole'])->name('users.update-role');
    Route::post('pengguna/{user}/reset-akses', [UserRoleController::class, 'resetAccess'])->name('users.reset-access');
});

/*
|--------------------------------------------------------------------------
| 3. Portal Warga (Khusus Warga Terdaftar)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:warga'])->prefix('portal')->name('portal.')->group(function () {
    Route::get('/', [PortalDashboardController::class, 'index'])->name('dashboard');

    // Modul Data Kependudukan Warga (Detail & Pembaruan Mandiri)
    Route::get('data-warga', [PortalDashboardController::class, 'wargaDetail'])->name('warga.index');
    Route::put('data-warga', [PortalDashboardController::class, 'updateWargaDetail'])->name('warga.update');

    // Modul 3: Pengajuan Surat Digital Warga
    Route::get('pengajuan-surat', [SuratPortalController::class, 'index'])->name('surat.index');
    Route::get('pengajuan-surat/buat', [SuratPortalController::class, 'create'])->name('surat.create');
    Route::post('pengajuan-surat', [SuratPortalController::class, 'store'])->name('surat.store');
    Route::get('pengajuan-surat/{pengajuanSurat}', [SuratPortalController::class, 'show'])->name('surat.show');
    Route::get('pengajuan-surat/{pengajuanSurat}/pdf', [SuratPortalController::class, 'preview'])->name('surat.pdf.preview');
    Route::get('pengajuan-surat/{pengajuanSurat}/pdf/unduh', [SuratPortalController::class, 'download'])->name('surat.pdf.download');

    // Lapor Mandiri Mutasi (Anggota 3: Ghita) — frontend & backend pelaporan pindah/datang
    Route::get('pindah-datang', [PindahDatangController::class, 'create'])->name('pindah-datang.create');
    Route::post('pindah-datang', [PindahDatangController::class, 'store'])->name('pindah-datang.store');
    Route::get('pindah-datang/status', [PindahDatangController::class, 'tracking'])->name('pindah-datang.tracking');
});

/*
|--------------------------------------------------------------------------
| Profile Settings
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
