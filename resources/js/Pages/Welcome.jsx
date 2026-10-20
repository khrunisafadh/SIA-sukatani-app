import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  FileText, 
  Home, 
  CheckCircle2, 
  FileCheck, 
  Download, 
  Stamp, 
  Info, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ClipboardCheck,
  UserCheck
} from 'lucide-react';

export default function Welcome({ canLogin = true }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head title="SIA Sukatani - Layanan Administrasi RT 01/08" />

      <div className="min-h-screen bg-white font-sans text-[#10264F] antialiased selection:bg-[#2764D8] selection:text-white">
        {/* ================= HEADER / NAVBAR ================= */}
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E4E9F0]">
          <div className="max-w-[1280px] mx-auto px-6 h-[78px] flex items-center justify-between">
            {/* Left: Brand & Location Badge */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2764D8] flex items-center justify-center text-white font-bold shadow-md shadow-[#2764D8]/20">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[17px] tracking-tight text-[#022448] font-heading leading-tight">
                    SIA Sukatani
                  </span>
                  <span className="text-[11px] text-[#68748A]">Administrasi RT</span>
                </div>
              </div>

              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F6EF] border border-[#0F8F83]/20 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#006A61]" />
                <span className="text-[#006A61]">Sukatani • Tapos • Depok</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#006A61]" />
                <span className="text-[#43474E] font-bold">RT 01 / RW 08</span>
              </div>
            </div>

            {/* Right: Nav Links & Login Action */}
            <nav className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#566175]">
                <button 
                  onClick={() => scrollToSection('beranda')}
                  className="hover:text-[#2764D8] transition-colors cursor-pointer"
                >
                  Beranda
                </button>
                <button 
                  onClick={() => scrollToSection('layanan')}
                  className="hover:text-[#2764D8] transition-colors cursor-pointer"
                >
                  Layanan
                </button>
                <button 
                  onClick={() => scrollToSection('alur')}
                  className="hover:text-[#2764D8] transition-colors cursor-pointer"
                >
                  Alur Pengajuan
                </button>
                <button 
                  onClick={() => scrollToSection('panduan')}
                  className="hover:text-[#2764D8] transition-colors cursor-pointer"
                >
                  Panduan
                </button>
              </div>

              {canLogin && (
                <Link
                  href={route('login')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#2764D8] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-lg shadow-[#2764D8]/20 transition-all hover:shadow-[#2764D8]/30 active:scale-[0.98]"
                >
                  <span>Login Warga</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* ================= HERO SECTION ================= */}
        <section 
          id="beranda" 
          className="relative overflow-hidden bg-gradient-to-b from-[#FBFCFE] to-white pt-14 pb-20 border-b border-[#E4E9F0]/60"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#0F8F83]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-[#2764D8]/5 blur-3xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF4FF] text-[#2764D8] text-[11px] font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  LAYANAN DIGITAL WARGA
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-[#10264F] leading-[1.12] font-heading tracking-tight">
                    Urus Administrasi RT, <br />
                    <span className="text-[#0F8F83]">Lebih Mudah</span> dan Tertata.
                  </h1>
                  <p className="text-base sm:text-lg text-[#68748A] max-w-xl leading-relaxed">
                    Akses informasi layanan administrasi RT 01/08 Sukatani dan ajukan kebutuhan surat melalui layanan digital yang mudah digunakan.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    href={route('login')}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#2764D8] hover:bg-[#1d4ed8] text-white text-sm font-semibold shadow-xl shadow-[#2764D8]/20 transition-all hover:shadow-[#2764D8]/30"
                  >
                    <span>Ajukan Surat</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => scrollToSection('layanan')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#10264F] text-sm font-semibold border border-[#D5DCE6] shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Jelajahi Layanan</span>
                    <ChevronRight className="w-4 h-4 text-[#68748A]" />
                  </button>
                </div>

                {/* Sub Features Bullet */}
                <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#68748A]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F8F83]" />
                    <span>Akses sesuai akun warga</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F8F83]" />
                    <span>Alur pengajuan yang jelas</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Graphic Banner */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[460px] p-8 rounded-3xl bg-gradient-to-br from-[#F5F8FF] to-[#E7EEFB] border border-[#D7E2F2] shadow-xl shadow-blue-900/5">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#D7E2F2] pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                        <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                        <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                      </div>
                      <span className="text-xs font-semibold text-[#68748A]">Portal Warga Sukatani</span>
                    </div>

                    {/* Preview Cards */}
                    <div className="space-y-3.5">
                      <div className="p-4 rounded-xl bg-white border border-[#E4E9F0] shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EEF4FF] flex items-center justify-center text-[#2764D8]">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#10264F]">Surat Pengantar</p>
                            <p className="text-[11px] text-[#68748A]">Pengajuan aktif</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#0F8F83] bg-[#E7F6EF] px-2.5 py-1 rounded-md">
                          Tersedia
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-[#E4E9F0] shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#E7F6EF] flex items-center justify-center text-[#0F8F83]">
                            <Home className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#10264F]">Keterangan Domisili</p>
                            <p className="text-[11px] text-[#68748A]">Kebutuhan warga</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#0F8F83] bg-[#E7F6EF] px-2.5 py-1 rounded-md">
                          Tersedia
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-[#68748A]">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#2764D8]" />
                        <span className="font-medium">Lingkungan RT 01 / RW 08</span>
                      </div>
                      <span className="font-bold text-[#10264F]">Depok</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: LAYANAN TERSEDIA ================= */}
        <section id="layanan" className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="max-w-2xl space-y-3 mb-14">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#2764D8] font-heading">
                LAYANAN TERSEDIA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264F] tracking-tight font-heading">
                Layanan Administrasi Warga
              </h2>
              <p className="text-sm sm:text-base text-[#68748A] leading-relaxed">
                Temukan layanan surat yang tersedia dan pelajari alur pengajuannya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Surat Pengantar */}
              <div className="group relative p-8 sm:p-10 rounded-2xl bg-[#FBFCFE] border border-[#E4E9F0] hover:border-[#2764D8]/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#9AA5B5] tracking-widest font-heading">
                    01
                  </span>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#0F8F83] bg-[#E7F6EF] px-3 py-1 rounded-full">
                    LAYANAN SURAT
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#10264F] font-heading group-hover:text-[#2764D8] transition-colors">
                    Surat Pengantar
                  </h3>
                  <p className="text-sm text-[#68748A] leading-relaxed">
                    Informasi layanan surat pengantar untuk mendukung kebutuhan administrasi warga kepada instansi kelurahan atau instansi terkait lainnya.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E4E9F0]/80 flex items-center justify-between">
                  <Link
                    href={route('login')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#2764D8] hover:text-[#1d4ed8] group-hover:gap-3 transition-all"
                  >
                    <span>Ajukan sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Surat Keterangan Domisili */}
              <div className="group relative p-8 sm:p-10 rounded-2xl bg-[#FBFCFE] border border-[#E4E9F0] hover:border-[#2764D8]/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#9AA5B5] tracking-widest font-heading">
                    02
                  </span>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#0F8F83] bg-[#E7F6EF] px-3 py-1 rounded-full">
                    LAYANAN DOMISILI
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#10264F] font-heading group-hover:text-[#2764D8] transition-colors">
                    Surat Keterangan Domisili
                  </h3>
                  <p className="text-sm text-[#68748A] leading-relaxed">
                    Informasi layanan surat keterangan domisili sesuai ketentuan administrasi RT bagi warga tetap maupun warga yang berdomisili sementara.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E4E9F0]/80 flex items-center justify-between">
                  <Link
                    href={route('login')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#2764D8] hover:text-[#1d4ed8] group-hover:gap-3 transition-all"
                  >
                    <span>Ajukan sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-[#68748A] bg-[#F8FAFC] p-4 rounded-xl border border-[#E4E9F0]">
              <Info className="w-4 h-4 text-[#2764D8] flex-shrink-0" />
              <span>Detail persyaratan akan mengikuti prosedur RT yang berlaku dan diinformasikan pada saat pengajuan.</span>
            </div>
          </div>
        </section>

        {/* ================= SECTION: ALUR PENGAJUAN (Dark Section) ================= */}
        <section id="alur" className="py-24 bg-[#00655C] text-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#65D1C4] font-heading">
                ALUR PENGAJUAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                Pengajuan Surat dalam Beberapa Langkah
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Alur sederhana dari portal warga hingga proses tanda tangan fisik.
              </p>
            </div>

            {/* 4 Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="p-7 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-4">
                <span className="text-2xl font-black text-[#65D1C4] font-heading">
                  01
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#65D1C4]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Login Warga
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Masuk menggunakan akun warga yang telah terdaftar.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-7 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-4">
                <span className="text-2xl font-black text-[#65D1C4] font-heading">
                  02
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#65D1C4]">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Isi Formulir
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Pilih jenis surat dan lengkapi informasi yang diperlukan.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-7 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-4">
                <span className="text-2xl font-black text-[#65D1C4] font-heading">
                  03
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#65D1C4]">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Unduh dan Cetak
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Unduh PDF surat setelah dokumen diterbitkan.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-7 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-4">
                <span className="text-2xl font-black text-[#65D1C4] font-heading">
                  04
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#65D1C4]">
                  <Stamp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Tanda Tangan Fisik
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Bawa surat untuk mendapatkan tanda tangan dan cap sesuai prosedur RT.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center text-xs text-[#BDC9DA]">
              Penandatanganan dan cap tetap dilakukan secara fisik sesuai prosedur pengurus RT.
            </div>
          </div>
        </section>

        {/* ================= SECTION: PANDUAN WARGA ================= */}
        <section id="panduan" className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Heading & Info */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#2764D8] font-heading">
                  PANDUAN WARGA
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264F] tracking-tight font-heading leading-tight">
                  Siapkan Pengajuan dengan Lebih Mudah
                </h2>
                <p className="text-sm sm:text-base text-[#68748A] leading-relaxed">
                  Tiga hal sederhana untuk membantu proses pengajuan berjalan lebih tertata.
                </p>

                <div className="pt-6 space-y-3">
                  <div className="p-4 rounded-xl bg-[#F5F8FF] border border-[#D7E2F2]">
                    <span className="text-[11px] font-bold text-[#2764D8] tracking-wider uppercase block mb-1">
                      01 / SURAT PENGANTAR
                    </span>
                    <p className="text-xs text-[#68748A]">
                      Detail kebutuhan dokumen dan ketentuan layanan mengikuti prosedur RT yang berlaku.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5F8FF] border border-[#D7E2F2]">
                    <span className="text-[11px] font-bold text-[#0F8F83] tracking-wider uppercase block mb-1">
                      02 / DOMISILI
                    </span>
                    <p className="text-xs text-[#68748A]">
                      Informasi persyaratan diberikan sesuai arahan resmi pengurus RT pada saat pengajuan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: 3 Guidance Points */}
              <div className="lg:col-span-7 space-y-5">
                <div className="p-6 rounded-2xl bg-[#FBFCFE] border border-[#E4E9F0] flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F6EF] flex-shrink-0 flex items-center justify-center text-[#0F8F83] font-bold font-heading text-sm">
                    01
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#10264F] font-heading">
                      Gunakan akun warga yang terdaftar
                    </h3>
                    <p className="text-xs text-[#68748A] leading-relaxed">
                      Akses layanan melalui akun yang telah didaftarkan oleh pengurus RT.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#FBFCFE] border border-[#E4E9F0] flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F6EF] flex-shrink-0 flex items-center justify-center text-[#0F8F83] font-bold font-heading text-sm">
                    02
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#10264F] font-heading">
                      Periksa kembali informasi
                    </h3>
                    <p className="text-xs text-[#68748A] leading-relaxed">
                      Pastikan informasi pada formulir sudah sesuai sebelum dikirim.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#FBFCFE] border border-[#E4E9F0] flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F6EF] flex-shrink-0 flex items-center justify-center text-[#0F8F83] font-bold font-heading text-sm">
                    03
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#10264F] font-heading">
                      Simpan dokumen yang diunduh
                    </h3>
                    <p className="text-xs text-[#68748A] leading-relaxed">
                      Ikuti prosedur pengurus RT untuk tahap tanda tangan dan cap fisik.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#68748A] pl-2">
                  Persyaratan dan ketentuan layanan mengikuti informasi resmi dari pengurus RT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: CTA PORTAL WARGA ================= */}
        <section className="py-12 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl bg-[#0F8F83] p-10 sm:p-14 text-white shadow-2xl shadow-[#0F8F83]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              {/* Background Geometric Accent */}
              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

              <div className="space-y-3 max-w-xl z-10">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#65D1C4] font-heading">
                  PORTAL WARGA
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                  Butuh Layanan Administrasi?
                </h2>
                <p className="text-sm sm:text-base text-[#B7C3D4] leading-relaxed">
                  Masuk ke portal warga untuk memulai pengajuan surat dan memantau statusnya.
                </p>
              </div>

              <div className="z-10 flex-shrink-0">
                <Link
                  href={route('login')}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-slate-100 text-[#10264F] text-sm font-bold shadow-xl transition-all active:scale-[0.98]"
                >
                  <span>Login Warga</span>
                  <ArrowRight className="w-4 h-4 text-[#2764D8]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="mt-16 bg-[#00655C] text-white pt-16 pb-12 border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-6 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Left Brand */}
              <div className="md:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#65D1C4]" />
                  <span className="text-[#65D1C4]">Sukatani • Tapos • Depok</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65D1C4]" />
                  <span className="text-white font-bold">RT 01 / RW 08</span>
                </div>
                <p className="text-sm text-[#8291A9] max-w-sm leading-relaxed">
                  Layanan digital untuk membantu administrasi warga RT 01/08 menjadi lebih mudah, tertata, dan transparan.
                </p>
              </div>

              {/* Middle Lokasi */}
              <div className="md:col-span-3 space-y-3">
                <span className="text-xs font-bold tracking-wider uppercase text-[#E565BC] font-heading">
                  LOKASI
                </span>
                <p className="text-xs text-[#C2E186] leading-relaxed">
                  Kelurahan Sukatani<br />
                  Kecamatan Tapos, Kota Depok
                </p>
              </div>

              {/* Right Navigasi */}
              <div className="md:col-span-4 space-y-3">
                <span className="text-xs font-bold tracking-wider uppercase text-[#E565BC] font-heading">
                  NAVIGASI
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#C2E186]">
                  <button 
                    onClick={() => scrollToSection('beranda')}
                    className="text-left hover:text-white transition-colors cursor-pointer"
                  >
                    Beranda
                  </button>
                  <button 
                    onClick={() => scrollToSection('layanan')}
                    className="text-left hover:text-white transition-colors cursor-pointer"
                  >
                    Layanan
                  </button>
                  <button 
                    onClick={() => scrollToSection('alur')}
                    className="text-left hover:text-white transition-colors cursor-pointer"
                  >
                    Alur Pengajuan
                  </button>
                  <button 
                    onClick={() => scrollToSection('panduan')}
                    className="text-left hover:text-white transition-colors cursor-pointer"
                  >
                    Panduan
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#AE557C] gap-4">
              <span>RT 01/08 Sukatani</span>
              <span>Sistem Informasi Administrasi Warga</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
