<?php

use App\Http\Controllers\Admin\MutasiAdminController;
use App\Http\Controllers\Admin\SuratAdminController;
use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\Portal\PindahDatangController;
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

    // Rute Verifikasi Laporan Pindah / Datang (POV Admin/Ketua RT)
    Route::get('pindah-datang', [MutasiAdminController::class, 'index'])->name('mutasi.index');
    Route::get('pindah-datang/ekspor', [MutasiAdminController::class, 'export'])->name('mutasi.export');
    Route::get('pindah-datang/{permohonanMutasi}', [MutasiAdminController::class, 'show'])->name('mutasi.show');
    Route::post('pindah-datang/{permohonanMutasi}/draft', [MutasiAdminController::class, 'saveDraft'])->name('mutasi.save-draft');
    Route::post('pindah-datang/{permohonanMutasi}/revisi', [MutasiAdminController::class, 'requestRevision'])->name('mutasi.request-revision');
    Route::post('pindah-datang/{permohonanMutasi}/setujui', [MutasiAdminController::class, 'approve'])->name('mutasi.approve');
    Route::get('pindah-datang/{permohonanMutasi}/dokumen/{dokumenMutasi}/unduh', [MutasiAdminController::class, 'downloadDocument'])->name('mutasi.document.download');
    Route::get('pindah-datang/{permohonanMutasi}/dokumen/{dokumenMutasi}/pratinjau', [MutasiAdminController::class, 'previewDocument'])->name('mutasi.document.preview');

    // Tempat rute CRUD Warga (Anggota 1: Khoirunnisa)
    // Route::resource('warga', WargaController::class);

    // Tempat rute Verifikasi Mutasi & Audit Log (Anggota 3: Ghita)
    // Route::get('laporan-mutasi', [MutasiController::class, 'index'])->name('mutasi.index');
    // Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit.index');
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
