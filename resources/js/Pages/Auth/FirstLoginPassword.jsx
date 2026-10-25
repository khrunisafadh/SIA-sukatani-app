import { Head, router, useForm } from '@inertiajs/react';
import { Eye, EyeOff, KeyRound, Lock, LogOut, MapPin, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export default function FirstLoginPassword() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.first-login.update'), {
            onFinish: () => reset('current_password', 'password', 'password_confirmation'),
        });
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Ganti Password Sementara - SIA Sukatani" />

            <div className="flex min-h-screen flex-col justify-center bg-[#F4F6F8] px-4 py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    {/* Badge Lokasi */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#C4C6CF]/60 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-sm">
                            <MapPin className="h-3.5 w-3.5 text-[#267F83]" />
                            <span className="text-[#267F83]">Sukatani • Tapos • Depok</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-[#267F83]" />
                            <span className="font-bold text-[#43474E]">RT 01 / RW 08</span>
                        </div>
                    </div>

                    <h2 className="mt-4 text-center font-heading text-2xl font-extrabold tracking-tight text-[#17233C] sm:text-3xl">
                        Ganti Password Sementara
                    </h2>
                    <p className="mt-2 text-center text-sm text-[#667085]">
                        Sistem Informasi & Administrasi Warga RT 01/08
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="rounded-xl border border-[#E3E8EC] bg-white px-6 py-8 shadow-sm sm:px-10">
                        {/* Notice Banner */}
                        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-800">
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <div className="leading-relaxed">
                                <span className="font-semibold text-amber-900">Perhatian: </span>
                                Akun Anda menggunakan password sementara yang ditetapkan oleh Ketua RT. Demi keamanan data warga, Anda wajib menggantinya sebelum dapat mengakses layanan sistem.
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Current Temporary Password */}
                            <div>
                                <label
                                    htmlFor="current_password"
                                    className="block text-xs font-semibold text-[#39445A]"
                                >
                                    Password Sementara Saat Ini
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <span className="pointer-events-none absolute left-3 text-[#97A0AF]">
                                        <KeyRound className="h-4 w-4" />
                                    </span>
                                    <input
                                        id="current_password"
                                        type={showCurrent ? 'text' : 'password'}
                                        name="current_password"
                                        value={data.current_password}
                                        placeholder="Masukkan password sementara"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-10 text-sm text-[#17233C] placeholder-[#97A0AF] transition-colors focus:border-[#267F83] focus:outline-none focus:ring-2 focus:ring-[#267F83]/20 ${
                                            errors.current_password ? 'border-red-500' : 'border-[#E3E8EC]'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-3 p-0.5 text-[#68748A] hover:text-[#17233C] focus:outline-none"
                                        aria-label={showCurrent ? 'Sembunyikan password' : 'Tampilkan password'}
                                    >
                                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.current_password && (
                                    <p className="mt-1 text-xs text-red-600">{errors.current_password}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-semibold text-[#39445A]"
                                >
                                    Password Baru
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <span className="pointer-events-none absolute left-3 text-[#97A0AF]">
                                        <Lock className="h-4 w-4" />
                                    </span>
                                    <input
                                        id="password"
                                        type={showNew ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        placeholder="Minimal 8 karakter"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-10 text-sm text-[#17233C] placeholder-[#97A0AF] transition-colors focus:border-[#267F83] focus:outline-none focus:ring-2 focus:ring-[#267F83]/20 ${
                                            errors.password ? 'border-red-500' : 'border-[#E3E8EC]'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 p-0.5 text-[#68748A] hover:text-[#17233C] focus:outline-none"
                                        aria-label={showNew ? 'Sembunyikan password' : 'Tampilkan password'}
                                    >
                                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-xs font-semibold text-[#39445A]"
                                >
                                    Konfirmasi Password Baru
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <span className="pointer-events-none absolute left-3 text-[#97A0AF]">
                                        <Lock className="h-4 w-4" />
                                    </span>
                                    <input
                                        id="password_confirmation"
                                        type={showConfirm ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        placeholder="Ulangi password baru"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-10 text-sm text-[#17233C] placeholder-[#97A0AF] transition-colors focus:border-[#267F83] focus:outline-none focus:ring-2 focus:ring-[#267F83]/20 ${
                                            errors.password_confirmation ? 'border-red-500' : 'border-[#E3E8EC]'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 p-0.5 text-[#68748A] hover:text-[#17233C] focus:outline-none"
                                        aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                                    >
                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex h-10 w-full items-center justify-center rounded-lg bg-[#267F83] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1F686C] focus:outline-none focus:ring-2 focus:ring-[#267F83] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Password Baru'}
                                </button>
                            </div>
                        </form>

                        {/* Sign Out Option */}
                        <div className="mt-6 border-t border-[#E3E8EC] pt-4 text-center">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#667085] hover:text-[#17233C] transition-colors"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span>Keluar dari Akun</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
