import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  FileText, 
  Home, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  HelpCircle,
  UserCheck,
  ClipboardCheck,
  Download,
  Stamp
} from 'lucide-react';

export default function Welcome({ canLogin = true }) {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Bagaimana cara mendapatkan akun warga untuk masuk ke sistem?',
      a: 'Akun warga didaftarkan langsung oleh Pengurus RT 01/08 Sukatani berdasarkan data kependudukan (Kartu Keluarga). Anda dapat menghubungi ketua RT atau sekretaris RT untuk verifikasi dan aktivasi akun Anda.'
    },
    {
      q: 'Berapa lama proses verifikasi pengajuan surat?',
      a: 'Pemeriksaan surat secara digital biasanya diproses oleh pengurus RT dalam waktu 1x24 jam pada hari kerja setelah formulir diajukan melalui portal warga.'
    },
    {
      q: 'Apakah surat yang diunduh langsung sah tanpa tanda tangan fisik?',
      a: 'Tidak. Surat yang diunduh dari sistem merupakan draf resmi yang telah diverifikasi. Anda tetap wajib membawa dokumen fisik tersebut ke Pengurus RT untuk mendapatkan tanda tangan basah dan cap stempel resmi RT 01/08.'
    },
    {
      q: 'Dokumen apa saja yang perlu disiapkan saat mengajukan surat?',
      a: 'Secara umum Anda memerlukan file identitas (KTP) dan Kartu Keluarga (KK). Untuk keperluan surat domisili warga kontrak, pengurus mungkin meminta bukti perjanjian sewa atau surat pengantar pemilik rumah.'
    },
    {
      q: 'Apakah warga non-permanen / pengontrak bisa mengajukan surat domisili?',
      a: 'Bisa. Warga yang berdomisili atau bertempat tinggal di wilayah RT 01/08 Sukatani (baik tetap maupun kontrak) dapat mengajukan Surat Keterangan Domisili setelah data huniannya diverifikasi oleh pengurus.'
    }
  ];

  return (
    <>
      <Head title="SIA Sukatani - Layanan Administrasi RT 01/08" />

      <div className="min-h-screen bg-white font-sans text-[#10264F] antialiased selection:bg-[#2764D8] selection:text-white">
        {/* ================= HEADER / NAVBAR (Tanpa Logo Kotak) ================= */}
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E4E9F0]">
          <div className="max-w-[1280px] mx-auto px-6 h-[78px] flex items-center justify-between">
            {/* Left: Brand Text & Location Badge (Tanpa Icon Logo Kotak) */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#022448] font-heading leading-tight">
                  SIA Sukatani
                </span>
                <span className="text-[11px] text-[#68748A]">Administrasi Rukun Tetangga</span>
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
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-[#2764D8] transition-colors cursor-pointer"
                >
                  FAQ
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

              {/* Right Column: Visual Graphic Banner Sesuai Figma (Isometric Neighborhood RT 01/08) */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[480px] h-[380px] rounded-3xl bg-gradient-to-br from-[#EAF6F4] via-[#F2F8F7] to-[#E3EFEA] border border-[#C2D8D1] shadow-2xl shadow-teal-900/10 overflow-hidden flex items-center justify-center">
                  
                  {/* Concentric Ambient Ring (dari figma #8:834) */}
                  <div className="absolute w-72 h-72 rounded-full border border-[#0F8F83]/20 shadow-[0_0_0_40px_rgba(15,143,131,0.03),0_0_0_80px_rgba(15,143,131,0.02)] pointer-events-none" />

                  {/* Isometric House & Landmark Illustration Graphic */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Isometric Building Representation */}
                    <div className="relative w-52 h-44 flex items-center justify-center">
                      {/* Ground Base Polygon */}
                      <div className="absolute bottom-2 w-48 h-20 bg-[#DCEEE7] rounded-[40px] transform -rotate-3 border-4 border-[#C2D8D1]/80 shadow-sm" />
                      
                      {/* Center Home Building Card */}
                      <div className="relative z-10 w-40 p-4 bg-[#F9FBFB] border-2 border-[#10264F] rounded-2xl shadow-lg transform -rotate-1">
                        <div className="h-3 w-16 bg-[#C88A5E] rounded mb-2 border border-[#10264F]" />
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="h-2 w-12 bg-[#DCECF0] rounded border border-[#10264F]" />
                            <div className="h-2 w-16 bg-[#DCECF0] rounded border border-[#10264F]" />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-[#0F8F83] text-white flex items-center justify-center font-bold text-xs shadow-md">
                            01
                          </div>
                        </div>
                      </div>

                      {/* Right Secondary Badge Pin */}
                      <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-lg bg-[#0F8F83] text-white text-[10px] font-bold shadow-md flex items-center gap-1 border border-white">
                        <span>RW 08</span>
                      </div>
                    </div>

                    {/* Badge Floating: Lingkungan RT 01 / RW 08 (dari Figma #8:868) */}
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 border border-[#C2D8D1] shadow-md backdrop-blur-md">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0F8F83] animate-pulse" />
                      <span className="text-xs font-bold text-[#10264F] font-heading">
                        Lingkungan RT 01 / RW 08
                      </span>
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

        {/* ================= SECTION: ALUR PENGAJUAN (Sesuai Presisi Figma #8:929) ================= */}
        <section id="alur" className="py-24 bg-[#00655C] text-white">
          <div className="max-w-[1280px] mx-auto px-6">
            {/* Header Alur Pengajuan (Figma: #8:934) */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#65D1C4] font-heading">
                ALUR PENGAJUAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight font-heading">
                Pengajuan Surat dalam Beberapa Langkah
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                Alur sederhana dari portal warga hingga proses tanda tangan fisik.
              </p>
            </div>

            {/* Step Grid dengan Garis Penghubung (Figma layout: #8:942) */}
            <div className="relative">
              {/* Garis Horizontal Penghubung (Figma: #8:943) */}
              <div className="hidden lg:block absolute top-4 left-[10%] right-[10%] h-[1px] bg-white/20 z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {/* Step 1: Login Warga */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#65D1C4] font-heading">
                      01
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#65D1C4]" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Login Warga
                  </h3>
                  <p className="text-xs text-[#E4E9F0]/80 leading-relaxed">
                    Masuk menggunakan akun warga yang telah terdaftar.
                  </p>
                </div>

                {/* Step 2: Isi Formulir */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#65D1C4] font-heading">
                      02
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#65D1C4]" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Isi Formulir
                  </h3>
                  <p className="text-xs text-[#E4E9F0]/80 leading-relaxed">
                    Pilih jenis surat dan lengkapi informasi yang diperlukan.
                  </p>
                </div>

                {/* Step 3: Unduh dan Cetak */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#65D1C4] font-heading">
                      03
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#65D1C4]" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Unduh dan Cetak
                  </h3>
                  <p className="text-xs text-[#E4E9F0]/80 leading-relaxed">
                    Unduh PDF surat setelah dokumen diterbitkan.
                  </p>
                </div>

                {/* Step 4: Tanda Tangan Fisik */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#65D1C4] font-heading">
                      04
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#65D1C4]" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Tanda Tangan Fisik
                  </h3>
                  <p className="text-xs text-[#E4E9F0]/80 leading-relaxed">
                    Bawa surat untuk mendapatkan tanda tangan dan cap sesuai prosedur RT.
                  </p>
                </div>
              </div>
            </div>

            {/* Note Box Bawah (Figma: #8:990) */}
            <div className="mt-14 max-w-lg mx-auto flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-center">
              <Info className="w-4 h-4 text-[#65D1C4] flex-shrink-0" />
              <p className="text-xs text-[#BDC9DA]">
                Penandatanganan dan cap tetap dilakukan secara fisik sesuai prosedur pengurus RT.
              </p>
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

        {/* ================= SECTION: FAQ (MENGGANTIKAN CTA PORTAL WARGA) ================= */}
        <section id="faq" className="py-24 bg-[#F8FAFC] border-t border-[#E4E9F0]">
          <div className="max-w-[960px] mx-auto px-6">
            <div className="text-center space-y-3 mb-14">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#2764D8] font-heading">
                PERTANYAAN UMUM
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264F] tracking-tight font-heading">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-sm sm:text-base text-[#68748A] leading-relaxed">
                Jawaban seputar layanan administrasi, akun warga, dan proses pengajuan surat di RT 01/08 Sukatani.
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-[#E4E9F0] bg-white shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#10264F] font-heading">
                      {faq.q}
                    </span>
                    <span className={`w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 text-[#68748A] transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-[#2764D8] bg-[#EEF4FF]' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {openFaq === idx && (
                    <div className="px-6 pb-6 pt-1 text-sm text-[#43474E] leading-relaxed border-t border-[#F1F5F9] bg-[#FCFDFE]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Help Callout */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#EEF4FF] to-[#E7EEFB] border border-[#2764D8]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2764D8] text-white flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#022448]">Masih memiliki pertanyaan lain?</h4>
                  <p className="text-xs text-[#43474E]">Silakan hubungi Pengurus RT melalui sekretariat atau pos ronda RT 01/08.</p>
                </div>
              </div>
              <Link
                href={route('login')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2764D8] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all flex-shrink-0"
              >
                <span>Masuk ke Akun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-[#00655C] text-white pt-16 pb-12 border-t border-white/10">
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
                  <button 
                    onClick={() => scrollToSection('faq')}
                    className="text-left hover:text-white transition-colors cursor-pointer"
                  >
                    FAQ
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
