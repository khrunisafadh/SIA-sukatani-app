<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\SuratAdminController;
use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\WargaController;
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

    Route::get('pengajuan-surat', [SuratAdminController::class, 'index'])->name('surat.index');
    Route::get('pengajuan-surat/buat', [SuratAdminController::class, 'create'])
        ->middleware('role:ketua_rt')
        ->name('surat.create');
    Route::post('pengajuan-surat', [SuratAdminController::class, 'store'])
        ->middleware('role:ketua_rt')
        ->name('surat.store');
    Route::get('pengajuan-surat/{pengajuanSurat}', [SuratAdminController::class, 'show'])->name('surat.show');
    Route::post('pengajuan-surat/{pengajuanSurat}/pengesahan', [SuratAdminController::class, 'confirmEndorsement'])->name('surat.confirm');
    Route::get('pengajuan-surat/{pengajuanSurat}/pdf', [SuratAdminController::class, 'preview'])->name('surat.pdf.preview');
    Route::get('pengajuan-surat/{pengajuanSurat}/pdf/unduh', [SuratAdminController::class, 'download'])->name('surat.pdf.download');

    // Modul Data Warga
    Route::get('/warga', [WargaController::class, 'index'])->name('warga.index');
    Route::get('/warga/create', [WargaController::class, 'create'])->name('warga.create');
    Route::post('/warga', [WargaController::class, 'store'])->name('warga.store');
    Route::get('/warga/check-nik', [WargaController::class, 'checkNik'])->name('warga.check-nik');

    // Modul Laporan Pindah / Datang (Fitur Masih Dalam Pengembangan)
    Route::get('/pindah-datang', function () {
        return Inertia::render('Admin/PindahDatang/Index');
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
    Route::get('/', function () {
        return Inertia::render('Portal/Dashboard');
    })->name('dashboard');

    // Tempat rute Pengajuan Surat & PDF (Anggota 2: Aliya)
    // Route::resource('surat', SuratController::class);

    // Lapor Mandiri Mutasi (Anggota 3: Ghita) — frontend pelaporan pindah/datang
    Route::get('pindah-datang', function () {
        return Inertia::render('Portal/PindahDatang/Create');
    })->name('pindah-datang.create');

    Route::get('pindah-datang/status', function () {
        return Inertia::render('Portal/PindahDatang/Tracking');
    })->name('pindah-datang.tracking');
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
