<?php

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
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Modul Data Warga
    Route::get('/warga', [WargaController::class, 'index'])->name('warga.index');
    Route::get('/warga/create', [WargaController::class, 'create'])->name('warga.create');
    Route::post('/warga', [WargaController::class, 'store'])->name('warga.store');
    Route::get('/warga/check-nik', [WargaController::class, 'checkNik'])->name('warga.check-nik');
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
