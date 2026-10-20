import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  Building2, 
  MapPin, 
  FileText, 
  Users, 
  Coins, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    login: 'ketua.rt01',
    password: 'password123',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head title="Masuk ke Sistem - SIA Sukatani" />

      <div className="min-h-screen w-full flex bg-[#F5F7FA] font-sans antialiased text-[#17233C]">
        {/* ================= LEFT PANEL: Neighborhood Identity (45%) ================= */}
        <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] relative flex-col justify-between p-12 bg-gradient-to-br from-[#EEF4FF] via-[#F2F3FF] to-[#E7EEFB] border-r border-[#C4C6CF]/40 overflow-hidden">
          {/* Backdrop Blur Accents */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#89F5E7]/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#D5E3FF]/50 blur-3xl pointer-events-none" />

          {/* Top: Brand Logo & Title */}
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2764D8] flex items-center justify-center text-white font-bold shadow-md shadow-[#2764D8]/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-[#022448] font-heading">
                  SIA Sukatani
                </span>
                <p className="text-xs text-[#43474E]">Administrasi Rukun Tetangga</p>
              </div>
            </div>

            {/* Badge Lokasi */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#C4C6CF]/60 shadow-sm text-xs font-semibold backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-[#006A61]" />
              <span className="text-[#006A61]">Sukatani • Tapos • Depok</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#006A61]" />
              <span className="text-[#43474E] font-bold">RT 01 / RW 08</span>
            </div>

            {/* Heading & Deskripsi */}
            <div className="space-y-4 max-w-lg">
              <h1 className="text-3xl xl:text-4xl font-extrabold text-[#022448] leading-tight font-heading tracking-tight">
                Sistem Informasi <br />
                Administrasi RT 01/08 <br />
                Sukatani
              </h1>
              <p className="text-sm xl:text-base text-[#43474E] leading-relaxed">
                Layanan administrasi warga dalam satu akses yang lebih mudah, tertib, dan transparan untuk seluruh warga rukun tetangga.
              </p>
            </div>

            {/* 3 Value Proposition Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg">
              <div className="p-3.5 bg-white/80 rounded-2xl border border-white shadow-sm backdrop-blur-sm space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#E7EEFB] flex items-center justify-center text-[#2764D8] mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#022448] leading-tight font-heading">Data Pengurus</h4>
                <p className="text-[11px] text-[#43474E]">Terpusat & akurat</p>
              </div>

              <div className="p-3.5 bg-white/80 rounded-2xl border border-white shadow-sm backdrop-blur-sm space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#E7F6EF] flex items-center justify-center text-[#11704E] mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#022448] leading-tight font-heading">Surat Pengantar</h4>
                <p className="text-[11px] text-[#43474E]">Proses cepat digital</p>
              </div>

              <div className="p-3.5 bg-white/80 rounded-2xl border border-white shadow-sm backdrop-blur-sm space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#FFF2D9] flex items-center justify-center text-[#97620D] mb-2">
                  <Coins className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#022448] leading-tight font-heading">Iuran Transparan</h4>
                <p className="text-[11px] text-[#43474E]">Laporan kas terbuka</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#74777F] pt-8 border-t border-[#C4C6CF]/30">
            <span>Kelurahan Sukatani, Kec. Tapos</span>
            <span className="font-semibold tracking-wider font-heading">KODEPOS 16454</span>
          </div>
        </div>

        {/* ================= RIGHT PANEL: Login Form (55%) ================= */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-white">
          <div className="w-full max-w-[430px] space-y-8">
            {/* Header Form */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#2764D8]">
                Selamat datang
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight font-heading">
                Masuk ke sistem
              </h2>
              <p className="text-sm text-[#43474E]">
                Masuk ke akun Anda untuk mengakses layanan administrasi warga.
              </p>
            </div>

            {/* Session status alert */}
            {status && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700">
                {status}
              </div>
            )}

            {/* Demo credential tip box */}
            <div className="p-3 rounded-xl bg-[#EEF4FF] border border-[#2764D8]/20 text-xs text-[#10264F] space-y-1">
              <p className="font-bold text-[#2764D8]">Akun Default (Siap Digunakan):</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#68748A]">Username / Email:</span><br />
                  <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#D5DCE6]">ketua.rt01</code>
                </div>
                <div>
                  <span className="text-[#68748A]">Kata Sandi:</span><br />
                  <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#D5DCE6]">password123</code>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-5">
              {/* Field: Username / Email */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="login" 
                  className="block text-xs font-semibold text-[#39445A]"
                >
                  Email atau username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#97A0AF] pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="login"
                    type="text"
                    name="login"
                    value={data.login}
                    placeholder="Contoh: ketua.rt01"
                    autoComplete="username"
                    onChange={(e) => setData('login', e.target.value)}
                    className={`w-full h-11 pl-10 pr-4 text-sm rounded-lg border bg-white placeholder-[#97A0AF] text-[#17233C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2764D8]/20 focus:border-[#2764D8] ${
                      errors.login ? 'border-red-500' : 'border-[#D9DFE8]'
                    }`}
                    required
                  />
                </div>
                {errors.login && (
                  <p className="text-xs text-red-600 mt-1">{errors.login}</p>
                )}
              </div>

              {/* Field: Password */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold text-[#39445A]"
                >
                  Kata sandi
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#97A0AF] pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={data.password}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e.target.value)}
                    className={`w-full h-11 pl-10 pr-11 text-sm rounded-lg border bg-white placeholder-[#97A0AF] text-[#17233C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2764D8]/20 focus:border-[#2764D8] ${
                      errors.password ? 'border-red-500' : 'border-[#D9DFE8]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#68748A] hover:text-[#17233C] transition-colors p-0.5 focus:outline-none"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="w-4 h-4 rounded border-[#D9DFE8] text-[#2764D8] focus:ring-[#2764D8]/30 cursor-pointer"
                  />
                  <span className="text-xs text-[#68748A]">Ingat saya</span>
                </label>

                {canResetPassword && (
                  <Link
                    href={route('password.request')}
                    className="text-xs text-[#2764D8] hover:text-[#1d4ed8] font-medium transition-colors"
                  >
                    Lupa kata sandi?
                  </Link>
                )}
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                disabled={processing}
                className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-lg bg-[#2764D8] hover:bg-[#1f54ba] text-white text-sm font-semibold shadow-md shadow-[#2764D8]/20 hover:shadow-[#2764D8]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{processing ? 'Memproses...' : 'Masuk ke sistem'}</span>
                {!processing && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Footer Tambahan */}
            <div className="pt-4 text-center">
              <p className="text-xs text-[#68748A]">
                Butuh bantuan akses akun?{' '}
                <a 
                  href="#" 
                  className="text-[#2764D8] font-semibold hover:underline"
                >
                  Hubungi Pengurus RT
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
