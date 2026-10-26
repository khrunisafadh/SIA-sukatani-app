<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class FirstLoginPasswordController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user?->must_change_password) {
            if ($user && in_array($user->role, ['ketua_rt', 'sekretaris'], true)) {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('portal.dashboard');
        }

        return Inertia::render('Auth/FirstLoginPassword');
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user?->must_change_password) {
            if ($user && in_array($user->role, ['ketua_rt', 'sekretaris'], true)) {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('portal.dashboard');
        }

        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => [
                'required',
                'confirmed',
                Password::defaults(),
                'different:current_password',
            ],
        ], [
            'current_password.required' => 'Password sementara saat ini wajib diisi.',
            'current_password.current_password' => 'Password sementara saat ini tidak sesuai.',
            'password.required' => 'Password baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
            'password.different' => 'Password baru harus berbeda dari password sementara.',
            'password.min' => 'Password baru minimal :min karakter.',
        ]);

        $user->forceFill([
            'password' => Hash::make($request->string('password')),
            'must_change_password' => false,
            'email_verified_at' => $user->email_verified_at ?? now(),
            'last_activity_at' => now(),
        ])->save();

        $request->session()->regenerate();

        if (in_array($user->role, ['ketua_rt', 'sekretaris'], true)) {
            return redirect()
                ->route('admin.dashboard')
                ->with('success', 'Password baru berhasil disimpan. Selamat datang di Dashboard Pengurus.');
        }

        return redirect()
            ->route('portal.dashboard')
            ->with('success', 'Password baru berhasil disimpan. Selamat datang di Layanan Digital Warga.');
    }
}
