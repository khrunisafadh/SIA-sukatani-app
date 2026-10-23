<?php

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
| Mengarahkan pengguna ke ranah masing-masing berdasarkan rolenya:
| - Pengurus (ketua_rt / sekretaris) -> /admin/dashboard
| - Warga -> /portal
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
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Tempat rute CRUD Warga (Anggota 1: Khoirunnisa)
    // Route::resource('warga', WargaController::class);

    // Tempat rute Verifikasi Mutasi & Audit Log (Anggota 3: Ghita)
    // Route::get('laporan-mutasi', [MutasiController::class, 'index'])->name('mutasi.index');
    // Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit.index');
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

    // Tempat rute Lapor Mandiri Mutasi (Anggota 3: Ghita)
    // Route::post('lapor-mutasi', [MutasiController::class, 'store'])->name('mutasi.store');
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
