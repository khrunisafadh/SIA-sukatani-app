import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
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

export default function Login({ status }) {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    login: '',
    password: '',
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

      <div className="min-h-screen w-full flex bg-[#F4F7FA] font-sans antialiased text-[#10264F]">
        {/* ================= LEFT PANEL: Identitas SIA Sukatani (45%) ================= */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-10 xl:p-14 bg-[#006B61] text-white relative">
          {/* Top: Header Identity */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-white font-heading leading-tight">
                SIA Sukatani
              </span>
              <span className="text-xs text-[#A8E5DE] mt-0.5">
                Sistem Informasi Administrasi RT 01 / RW 08
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-[#A8E5DE]">
              <MapPin className="w-3.5 h-3.5 text-[#A8E5DE]" />
              <span>Sukatani • Tapos • Kota Depok</span>
            </div>
          </div>

          {/* Middle: Deskripsi Layanan Singkat */}
          <div className="space-y-6 my-auto py-8">
            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight font-heading tracking-tight">
                Layanan Administrasi <br />
                Warga RT 01 / RW 08
              </h1>
              <p className="text-sm xl:text-base text-white/80 leading-relaxed max-w-md">
                Portal mandiri untuk pengajuan surat pengantar, verifikasi data kependudukan, serta transparansi laporan kas lingkungan RT Sukatani secara tertata.
              </p>
            </div>

            {/* Ringkasan Fitur Layanan */}
            <div className="pt-4 space-y-3 max-w-sm">
              <div className="flex items-center gap-3 text-xs text-white/90">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-[#A8E5DE]">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span>Pengajuan surat pengantar & domisili online</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/90">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-[#A8E5DE]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span>Data kependudukan warga tetap & sewa terverifikasi</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/90">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-[#A8E5DE]">
                  <Coins className="w-3.5 h-3.5" />
                </div>
                <span>Transparansi pencatatan kas rukun tetangga</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Kelurahan Sukatani, Kec. Tapos</span>
            <span>Kode Pos 16454</span>
          </div>
        </div>

        {/* ================= RIGHT PANEL: Form Login (55%) ================= */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 lg:px-12 xl:px-16 py-12">
          {/* Mobile Branding Indicator */}
          <div className="lg:hidden text-center space-y-1 mb-6">
            <span className="font-extrabold text-xl text-[#10264F] font-heading">
              SIA Sukatani
            </span>
            <p className="text-xs text-[#566175]">
              Administrasi RT 01 / RW 08 Sukatani
            </p>
          </div>

          <div className="w-full max-w-[420px] bg-white p-7 sm:p-9 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-6">
            {/* Header Form */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#006B61] font-heading">
                PORTAL MASUK
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10264F] tracking-tight font-heading">
                Masuk ke Akun
              </h2>
              <p className="text-xs sm:text-sm text-[#566175] leading-relaxed">
                Silakan masukkan username atau email beserta kata sandi yang telah didaftarkan.
              </p>
            </div>

            {/* Session status alert */}
            {status && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                {status}
              </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">
              {/* Field: Username / Email */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="login" 
                  className="block text-xs font-semibold text-[#10264F]"
                >
                  Username atau Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#8C98A9] pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="login"
                    type="text"
                    name="login"
                    value={data.login}
                    placeholder="Masukkan username atau email"
                    autoComplete="username"
                    onChange={(e) => setData('login', e.target.value)}
                    className={`w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border bg-white placeholder-[#9AA5B5] text-[#10264F] transition-all focus:outline-none focus:ring-2 focus:ring-[#006B61]/20 focus:border-[#006B61] ${
                      errors.login ? 'border-red-500 bg-red-50/20' : 'border-[#E2E8F0]'
                    }`}
                    required
                  />
                </div>
                {errors.login && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.login}</p>
                )}
              </div>

              {/* Field: Password */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold text-[#10264F]"
                >
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#8C98A9] pointer-events-none">
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
                    className={`w-full h-11 pl-10 pr-11 text-xs sm:text-sm rounded-xl border bg-white placeholder-[#9AA5B5] text-[#10264F] transition-all focus:outline-none focus:ring-2 focus:ring-[#006B61]/20 focus:border-[#006B61] ${
                      errors.password ? 'border-red-500 bg-red-50/20' : 'border-[#E2E8F0]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#8C98A9] hover:text-[#10264F] transition-colors p-1 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#006B61] focus:ring-[#006B61]/30 cursor-pointer"
                  />
                  <span className="text-xs text-[#566175]">Ingat saya</span>
                </label>
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                disabled={processing}
                className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-xl bg-[#006B61] hover:bg-[#00554d] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{processing ? 'Memproses Masuk...' : 'Masuk ke Sistem'}</span>
                {!processing && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Back to landing page */}
            <div className="pt-2 text-center border-t border-[#E2E8F0]/80">
              <Link
                href="/"
                className="text-xs text-[#566175] hover:text-[#006B61] transition-colors font-medium inline-flex items-center gap-1.5"
              >
                <span>← Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
