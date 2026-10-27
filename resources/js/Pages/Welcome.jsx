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
  Stamp,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

export default function Welcome({ canLogin = true }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Januari–Juni 2025');

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

      <div className="min-h-screen bg-white font-sans text-[#10264F] antialiased selection:bg-[#00655C] selection:text-white">
        {/* ================= HEADER / NAVBAR ================= */}
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E4E9F0]">
          <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
            {/* Left: Brand Text & Location Badge */}
            <div className="flex items-center gap-3.5">
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#10264F] font-heading leading-tight">
                  SIA Sukatani
                </span>
                <span className="text-[11px] text-[#68748A]">Administrasi RT 01 / RW 08</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E7F6EF] border border-[#00655C]/15 text-[11px] font-medium text-[#00655C]">
                <MapPin className="w-3.5 h-3.5 text-[#00655C]" />
                <span>Sukatani • Tapos</span>
              </div>
            </div>

            {/* Right: Nav Links & Login Action */}
            <nav className="flex items-center gap-7">
              <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#566175]">
                <button 
                  onClick={() => scrollToSection('beranda')}
                  className="hover:text-[#00655C] transition-colors cursor-pointer"
                >
                  Beranda
                </button>
                <button 
                  onClick={() => scrollToSection('layanan')}
                  className="hover:text-[#00655C] transition-colors cursor-pointer"
                >
                  Layanan
                </button>
                <button 
                  onClick={() => scrollToSection('transparansi-kas')}
                  className="hover:text-[#00655C] transition-colors cursor-pointer"
                >
                  Transparansi Kas
                </button>
                <button 
                  onClick={() => scrollToSection('alur')}
                  className="hover:text-[#00655C] transition-colors cursor-pointer"
                >
                  Alur Pengajuan
                </button>
                <button 
                  onClick={() => scrollToSection('panduan')}
                  className="hover:text-[#00655C] transition-colors cursor-pointer"
                >
                  Panduan
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-[#00655C] transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </div>

              {canLogin && (
                <Link
                  href={route('login')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00655C] hover:bg-[#005049] text-white text-xs font-semibold shadow-sm transition-all"
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
          className="relative bg-gradient-to-b from-[#F8FAFC] to-white pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E4E9F0]"
        >
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F6EF] border border-[#00655C]/15 text-[#00655C] text-[11px] font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00655C]" />
                  <span>SISTEM ADMINISTRASI RT 01 / RW 08</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#10264F] leading-[1.2] font-heading tracking-tight">
                    Urus Administrasi RT, <br />
                    <span className="text-[#00655C]">Lebih Mudah</span> dan Tertata.
                  </h1>
                  <p className="text-sm sm:text-base text-[#566175] max-w-xl leading-relaxed">
                    Akses informasi layanan administrasi RT 01/08 Sukatani dan ajukan kebutuhan surat melalui layanan digital yang mudah digunakan.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    href={route('login')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00655C] hover:bg-[#005049] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
                  >
                    <span>Ajukan Surat</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => scrollToSection('layanan')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#10264F] text-xs sm:text-sm font-semibold border border-[#D5DCE6] shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Jelajahi Layanan</span>
                    <ChevronRight className="w-4 h-4 text-[#68748A]" />
                  </button>
                </div>

                {/* Sub Features Bullet */}
                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#566175]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00655C]" />
                    <span>Akses sesuai akun warga terdaftar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00655C]" />
                    <span>Draf surat siap cetak & pengesahan fisik</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Dokumen Administrasi Warga RT 01/08 Sukatani */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="w-full max-w-[430px] bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
                  {/* Kop Mini Surat Administrasi */}
                  <div className="pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#E7F6EF] text-[#00655C] flex items-center justify-center font-bold text-xs">
                        RT
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#10264F] font-heading leading-tight">
                          RT 01 / RW 08 Sukatani
                        </div>
                        <div className="text-[10px] text-[#68748A]">
                          Kecamatan Tapos, Kota Depok
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#00655C] bg-[#E7F6EF] px-2 py-0.5 rounded-md">
                      Portal Warga
                    </span>
                  </div>

                  {/* Contoh Draf Surat Pengantar */}
                  <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E9EFF6] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#68748A]">
                        CONTOH DRAF SURAT
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#00655C] bg-white px-2 py-0.5 rounded border border-[#00655C]/20">
                        <CheckCircle2 className="w-3 h-3 text-[#00655C]" />
                        Terverifikasi
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#10264F] font-heading">
                        Surat Pengantar RT
                      </h4>
                      <p className="text-[11px] text-[#68748A] mt-0.5">
                        Keperluan: Pengantar Pembuatan KTP / KK Baru
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0]/80 grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-[#8C98A9] block">Nomor Surat</span>
                        <span className="font-semibold text-[#10264F]">024/SP-RT01/2026</span>
                      </div>
                      <div>
                        <span className="text-[#8C98A9] block">Status Dokumen</span>
                        <span className="font-semibold text-[#10264F]">Siap Cetak & Cap RT</span>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Layanan Lingkungan */}
                  <div className="pt-1 flex items-center justify-between text-xs text-[#566175]">
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5 text-[#00655C]" />
                      <span className="text-[11px]">Warga Tetap & Domisili Kontrak</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#00655C]">Pelayanan Mandiri</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: LAYANAN TERSEDIA ================= */}
        <section id="layanan" className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="max-w-2xl space-y-3 mb-12">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#00655C] font-heading">
                LAYANAN TERSEDIA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264F] tracking-tight font-heading">
                Layanan Administrasi Warga
              </h2>
              <p className="text-sm sm:text-base text-[#566175] leading-relaxed">
                Temukan layanan surat yang tersedia dan pelajari alur pengajuannya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Card 1: Surat Pengantar */}
              <div className="group relative p-7 sm:p-8 rounded-2xl bg-[#FBFCFE] border border-[#E2E8F0] hover:border-[#00655C]/40 hover:shadow-md transition-all space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#9AA5B5] tracking-widest font-heading">
                    01
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#00655C] bg-[#E7F6EF] px-3 py-0.5 rounded-full">
                    LAYANAN SURAT
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#10264F] font-heading group-hover:text-[#00655C] transition-colors">
                    Surat Pengantar
                  </h3>
                  <p className="text-xs sm:text-sm text-[#566175] leading-relaxed">
                    Informasi layanan surat pengantar untuk mendukung kebutuhan administrasi warga kepada instansi kelurahan atau instansi terkait lainnya.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <Link
                    href={route('login')}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#00655C] hover:text-[#005049] group-hover:gap-2.5 transition-all"
                  >
                    <span>Ajukan sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Surat Keterangan Domisili */}
              <div className="group relative p-7 sm:p-8 rounded-2xl bg-[#FBFCFE] border border-[#E2E8F0] hover:border-[#00655C]/40 hover:shadow-md transition-all space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#9AA5B5] tracking-widest font-heading">
                    02
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#00655C] bg-[#E7F6EF] px-3 py-0.5 rounded-full">
                    LAYANAN DOMISILI
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#10264F] font-heading group-hover:text-[#00655C] transition-colors">
                    Surat Keterangan Domisili
                  </h3>
                  <p className="text-xs sm:text-sm text-[#566175] leading-relaxed">
                    Informasi layanan surat keterangan domisili sesuai ketentuan administrasi RT bagi warga tetap maupun warga yang berdomisili sementara.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <Link
                    href={route('login')}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#00655C] hover:text-[#005049] group-hover:gap-2.5 transition-all"
                  >
                    <span>Ajukan sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-[#566175] bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <Info className="w-4 h-4 text-[#00655C] flex-shrink-0" />
              <span>Detail persyaratan akan mengikuti prosedur RT yang berlaku dan diinformasikan pada saat pengajuan.</span>
            </div>
          </div>
        </section>

        {/* ================= SECTION: TRANSPARANSI KAS RT (Simulasi Bendahara) ================= */}
        <section id="transparansi-kas" className="py-24 bg-[#F8FAFC] border-t border-[#E4E9F0]">
          <div className="max-w-[1280px] mx-auto px-6">
            {/* Header Transparansi Kas */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-3">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#0F8F83] font-heading">
                  TRANSPARANSI KAS RT
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264F] tracking-tight font-heading">
                  Ringkasan Kas RT
                </h2>
                <p className="text-sm sm:text-base text-[#68748A] leading-relaxed max-w-2xl">
                  Pantau pemasukan, pengeluaran, dan saldo kas berdasarkan periode laporan.
                </p>
              </div>

              {/* Filter Periode Laporan */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#68748A] whitespace-nowrap">Periode laporan</span>
                <div className="relative">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="appearance-none bg-white border border-[#E4E9F0] text-[#10264F] text-xs font-semibold py-2.5 pl-3.5 pr-9 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F8F83] focus:border-transparent cursor-pointer"
                  >
                    <option value="Januari–Juni 2025">Januari–Juni 2025</option>
                    <option value="Juli–Desember 2024">Juli–Desember 2024</option>
                    <option value="Januari–Juni 2024">Januari–Juni 2024</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#68748A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 3 KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Card 1: Saldo Akhir */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0F685D] text-white shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#A8E5DE] uppercase tracking-wider">Saldo Akhir</span>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-[#A8E5DE]" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
                    Rp8.750.000
                  </div>
                  <div className="mt-2 text-[11px] text-[#A8E5DE]/90 font-medium">
                    Saldo awal simulasi Rp0 · per 30 Juni 2025
                  </div>
                </div>
              </div>

              {/* Card 2: Total Pemasukan */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#68748A] uppercase tracking-wider">Total Pemasukan</span>
                  <div className="w-8 h-8 rounded-lg bg-[#E7F6EF] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#0F8F83]" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-[#10264F]">
                    Rp12.500.000
                  </div>
                  <div className="mt-2 text-[11px] text-[#8C98A9] font-medium">
                    Januari–Juni 2025
                  </div>
                </div>
              </div>

              {/* Card 3: Total Pengeluaran */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#68748A] uppercase tracking-wider">Total Pengeluaran</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FEECEB] flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-[#E5484D]" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-[#10264F]">
                    Rp3.750.000
                  </div>
                  <div className="mt-2 text-[11px] text-[#8C98A9] font-medium">
                    Januari–Juni 2025
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Chart Arus Kas & Info Laporan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Left (2 cols): Arus Kas Bulanan */}
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#10264F] font-heading">Arus Kas Bulanan</h3>
                      <p className="text-xs sm:text-sm text-[#68748A] mt-0.5">Perbandingan pemasukan dan pengeluaran per bulan.</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#68748A] bg-[#F1F5F9] px-2.5 py-1 rounded-md">
                      Rupiah
                    </span>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-5 text-xs text-[#566175] mb-6 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-[#0F685D]" />
                      <span>Pemasukan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-[#EB7957]" />
                      <span>Pengeluaran</span>
                    </div>
                  </div>
                </div>

                {/* Bar Chart Container */}
                <div className="pt-2">
                  <div className="relative">
                    {/* Y-Axis lines and labels */}
                    <div className="flex flex-col justify-between h-48 text-[11px] text-[#8C98A9] font-medium">
                      <div className="flex items-center gap-3">
                        <span className="w-14 text-right flex-shrink-0">Rp2,5 jt</span>
                        <div className="flex-1 border-b border-dashed border-[#E4E9F0]" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-14 text-right flex-shrink-0">Rp1,25 jt</span>
                        <div className="flex-1 border-b border-dashed border-[#E4E9F0]" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-14 text-right flex-shrink-0">Rp0</span>
                        <div className="flex-1 border-b border-[#E4E9F0]" />
                      </div>
                    </div>

                    {/* Bars Grid */}
                    <div className="absolute left-[70px] right-4 bottom-[1px] top-2 flex items-end justify-between px-2 sm:px-6">
                      {/* Jan */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-end gap-1 sm:gap-2 h-44">
                          <div 
                            className="w-3 sm:w-6 bg-[#0F685D] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '60%' }} 
                            title="Pemasukan: Rp1.500.000"
                          />
                          <div 
                            className="w-3 sm:w-6 bg-[#EB7957] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '14%' }} 
                            title="Pengeluaran: Rp350.000"
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#68748A]">Jan</span>
                      </div>

                      {/* Feb */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-end gap-1 sm:gap-2 h-44">
                          <div 
                            className="w-3 sm:w-6 bg-[#0F685D] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '76%' }} 
                            title="Pemasukan: Rp1.900.000"
                          />
                          <div 
                            className="w-3 sm:w-6 bg-[#EB7957] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '18%' }} 
                            title="Pengeluaran: Rp450.000"
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#68748A]">Feb</span>
                      </div>

                      {/* Mar */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-end gap-1 sm:gap-2 h-44">
                          <div 
                            className="w-3 sm:w-6 bg-[#0F685D] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '84%' }} 
                            title="Pemasukan: Rp2.100.000"
                          />
                          <div 
                            className="w-3 sm:w-6 bg-[#EB7957] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '20%' }} 
                            title="Pengeluaran: Rp500.000"
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#68748A]">Mar</span>
                      </div>

                      {/* Apr */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-end gap-1 sm:gap-2 h-44">
                          <div 
                            className="w-3 sm:w-6 bg-[#0F685D] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '78%' }} 
                            title="Pemasukan: Rp1.950.000"
                          />
                          <div 
                            className="w-3 sm:w-6 bg-[#EB7957] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '22%' }} 
                            title="Pengeluaran: Rp550.000"
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#68748A]">Apr</span>
                      </div>

                      {/* Mei */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-end gap-1 sm:gap-2 h-44">
                          <div 
                            className="w-3 sm:w-6 bg-[#0F685D] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '92%' }} 
                            title="Pemasukan: Rp2.300.000"
                          />
                          <div 
                            className="w-3 sm:w-6 bg-[#EB7957] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '19%' }} 
                            title="Pengeluaran: Rp480.000"
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#68748A]">Mei</span>
                      </div>

                      {/* Jun */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-end gap-1 sm:gap-2 h-44">
                          <div 
                            className="w-3 sm:w-6 bg-[#0F685D] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '100%' }} 
                            title="Pemasukan: Rp2.500.000"
                          />
                          <div 
                            className="w-3 sm:w-6 bg-[#EB7957] rounded-t transition-all hover:opacity-90 cursor-pointer" 
                            style={{ height: '30%' }} 
                            title="Pengeluaran: Rp750.000"
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#68748A]">Jun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right (1 col): Informasi Laporan */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-[#10264F] font-heading">Informasi Laporan</h3>
                  <div className="divide-y divide-[#E4E9F0] text-xs">
                    <div className="py-3.5 flex justify-between items-center">
                      <span className="text-[#68748A]">Periode laporan</span>
                      <span className="font-semibold text-[#10264F]">{selectedPeriod}</span>
                    </div>
                    <div className="py-3.5 flex justify-between items-center">
                      <span className="text-[#68748A]">Pembaruan terakhir</span>
                      <span className="font-semibold text-[#10264F]">30 Juni 2025</span>
                    </div>
                    <div className="py-3.5 flex justify-between items-center">
                      <span className="text-[#68748A]">Sumber data</span>
                      <span className="font-semibold text-[#10264F]">Transaksi kas yang tercatat</span>
                    </div>
                  </div>
                </div>

                {/* Amber Alert Data Simulasi */}
                <div className="p-4 rounded-xl bg-[#FFF9F2] border border-[#FEE2C7] flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#92400E]">Data simulasi</h4>
                    <p className="text-[11px] text-[#B45309] leading-relaxed">
                      Nominal pada tampilan ini bukan laporan keuangan resmi RT.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card: Transaksi Terbaru */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#10264F] font-heading">Transaksi Terbaru</h3>
                  <p className="text-xs sm:text-sm text-[#68748A] mt-0.5">Transaksi simulasi terbaru pada periode laporan.</p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold text-[#68748A] bg-[#F1F5F9] px-3 py-1 rounded-md">
                  Data simulasi
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E4E9F0] text-[#8C98A9] font-bold text-[10px] tracking-wider uppercase">
                      <th className="pb-3 pr-4 font-semibold">TANGGAL</th>
                      <th className="pb-3 px-4 font-semibold">KETERANGAN TRANSAKSI</th>
                      <th className="pb-3 px-4 font-semibold">JENIS TRANSAKSI</th>
                      <th className="pb-3 pl-4 text-right font-semibold">NOMINAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E9F0]">
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="py-4 pr-4 text-[#566175] font-medium whitespace-nowrap">28 Jun 2025</td>
                      <td className="py-4 px-4 text-[#10264F] font-semibold">Iuran warga bulan Juni</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E7F6EF] text-[#0F8F83]">
                          Pemasukan
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right font-bold text-[#0F8F83] whitespace-nowrap">+Rp2.500.000</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="py-4 pr-4 text-[#566175] font-medium whitespace-nowrap">24 Jun 2025</td>
                      <td className="py-4 px-4 text-[#10264F] font-semibold">Kebutuhan kebersihan lingkungan</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3EB] text-[#D95D39]">
                          Pengeluaran
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right font-bold text-[#D95D39] whitespace-nowrap">-Rp450.000</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="py-4 pr-4 text-[#566175] font-medium whitespace-nowrap">18 Jun 2025</td>
                      <td className="py-4 px-4 text-[#10264F] font-semibold">Perawatan fasilitas lingkungan</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3EB] text-[#D95D39]">
                          Pengeluaran
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right font-bold text-[#D95D39] whitespace-nowrap">-Rp350.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
        <section id="panduan" className="py-20 bg-white border-t border-[#E4E9F0]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="max-w-2xl space-y-3 mb-12">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#00655C] font-heading">
                PANDUAN WARGA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264F] tracking-tight font-heading">
                Tata Cara & Ketentuan Pengajuan
              </h2>
              <p className="text-sm sm:text-base text-[#566175] leading-relaxed">
                Panduan praktis agar permohonan surat pengantar dan administrasi warga RT 01/08 berjalan tertib dan tepat waktu.
              </p>
            </div>

            {/* Grid 2 Kolom: Kiri Langkah Pengajuan, Kanan Persyaratan Berkas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Kolom Kiri: 4 Langkah Alur Pengajuan */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-[#10264F] font-heading pb-3 border-b border-[#E2E8F0]">
                  Langkah Pengajuan Mandiri
                </h3>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E7F6EF] text-[#00655C] text-xs font-bold flex items-center justify-center font-heading">
                      1
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#10264F]">
                        Masuk dengan Akun Warga Terdaftar
                      </h4>
                      <p className="text-xs text-[#566175] leading-relaxed">
                        Gunakan akun yang telah didaftarkan dan diverifikasi oleh Ketua RT atau Sekretaris RT berdasarkan data Kartu Keluarga (KK).
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E7F6EF] text-[#00655C] text-xs font-bold flex items-center justify-center font-heading">
                      2
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#10264F]">
                        Pilih Jenis Surat & Isi Keperluan
                      </h4>
                      <p className="text-xs text-[#566175] leading-relaxed">
                        Tentukan jenis layanan (Surat Pengantar atau Surat Keterangan Domisili), lalu lengkapi detail identitas serta tujuan permohonan secara rinci.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E7F6EF] text-[#00655C] text-xs font-bold flex items-center justify-center font-heading">
                      3
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#10264F]">
                        Pemeriksaan Berkas oleh Pengurus RT
                      </h4>
                      <p className="text-xs text-[#566175] leading-relaxed">
                        Pengurus RT akan memeriksa kesesuaian data kependudukan secara digital dalam 1x24 jam kerja.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E7F6EF] text-[#00655C] text-xs font-bold flex items-center justify-center font-heading">
                      4
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#10264F]">
                        Unduh Draf & Legalitas Cap Fisik
                      </h4>
                      <p className="text-xs text-[#566175] leading-relaxed">
                        Unduh dokumen PDF draf resmi, cetak mandiri, lalu bawa ke pengurus RT untuk mendapatkan tanda tangan basah dan cap stempel resmi RT 01/08.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Persyaratan Berkas Dokumen */}
              <div className="lg:col-span-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-[#10264F] font-heading pb-3 border-b border-[#E2E8F0]">
                  Kelengkapan Dokumen
                </h3>

                <div className="space-y-5">
                  {/* Dokumen 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00655C]" />
                      <span className="text-xs font-bold text-[#10264F]">Surat Pengantar RT</span>
                    </div>
                    <ul className="text-xs text-[#566175] list-disc list-inside space-y-1 pl-1">
                      <li>KTP pemohon yang masih berlaku</li>
                      <li>Kartu Keluarga (KK) terdaftar di RT 01/08</li>
                      <li>Keterangan tujuan (Kelurahan, Kecamatan, SKCK, Bank, dll.)</li>
                    </ul>
                  </div>

                  {/* Dokumen 2 */}
                  <div className="space-y-2 pt-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#00655C]" />
                      <span className="text-xs font-bold text-[#10264F]">Surat Keterangan Domisili</span>
                    </div>
                    <ul className="text-xs text-[#566175] list-disc list-inside space-y-1 pl-1">
                      <li>KTP asli dan salinan pemohon</li>
                      <li>Surat izin / persetujuan dari pemilik rumah kontrakan</li>
                      <li>Keterangan lama tinggal di lingkungan RT 01/08</li>
                    </ul>
                  </div>
                </div>

                {/* Catatan Pelayanan */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#00655C] font-semibold">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Catatan Pengurus RT</span>
                  </div>
                  <p className="text-[#566175] text-[11px] leading-relaxed">
                    Pengesahan tanda tangan basah dan cap stempel tetap wajib dilakukan secara fisik di kediaman/sekretariat RT 01/08 Sukatani.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: FAQ ================= */}
        <section id="faq" className="py-20 bg-[#F8FAFC] border-t border-[#E4E9F0]">
          <div className="max-w-[960px] mx-auto px-6">
            <div className="text-center space-y-3 mb-12">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#00655C] font-heading">
                PERTANYAAN UMUM
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264F] tracking-tight font-heading">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-sm sm:text-base text-[#566175] leading-relaxed">
                Jawaban seputar layanan administrasi, akun warga, dan proses pengajuan surat di RT 01/08 Sukatani.
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-3.5">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#10264F] font-heading">
                      {faq.q}
                    </span>
                    <span className={`w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 text-[#68748A] transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-[#00655C] bg-[#E7F6EF]' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {openFaq === idx && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#566175] leading-relaxed border-t border-[#F1F5F9] bg-[#FCFDFE]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Help Callout */}
            <div className="mt-12 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E7F6EF] text-[#00655C] flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#10264F]">Masih memiliki pertanyaan lain?</h4>
                  <p className="text-xs text-[#566175]">Silakan hubungi Pengurus RT melalui sekretariat atau pos ronda RT 01/08.</p>
                </div>
              </div>
              <Link
                href={route('login')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00655C] hover:bg-[#005049] text-white text-xs font-semibold shadow-sm transition-all flex-shrink-0"
              >
                <span>Masuk ke Akun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-[#00655C] text-white pt-14 pb-10 border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-6 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
              {/* Left Brand */}
              <div className="md:col-span-5 space-y-3.5">
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-white font-heading leading-tight">
                    SIA Sukatani
                  </span>
                  <span className="text-xs text-white/70">
                    Sistem Informasi Administrasi RT 01 / RW 08
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-[#A8E5DE]">
                  <MapPin className="w-3.5 h-3.5 text-[#A8E5DE]" />
                  <span>Sukatani • Tapos • Kota Depok</span>
                </div>

                <p className="text-xs text-white/80 max-w-sm leading-relaxed">
                  Layanan digital untuk mempermudah permohonan administrasi warga dan transparansi laporan kas lingkungan RT 01/RW 08 Sukatani.
                </p>
              </div>

              {/* Middle Lokasi */}
              <div className="md:col-span-3 space-y-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#A8E5DE] font-heading">
                  SEKRETARIAT & LOKASI
                </span>
                <p className="text-xs text-white/80 leading-relaxed">
                  Pengurus RT 01 / RW 08<br />
                  Kelurahan Sukatani, Kecamatan Tapos<br />
                  Kota Depok, Jawa Barat 16454
                </p>
              </div>

              {/* Right Navigasi */}
              <div className="md:col-span-4 space-y-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#A8E5DE] font-heading">
                  NAVIGASI
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/75">
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
                    onClick={() => scrollToSection('transparansi-kas')}
                    className="text-left hover:text-white transition-colors cursor-pointer"
                  >
                    Transparansi Kas
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
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
              <span>© {new Date().getFullYear()} Pengurus RT 01 / RW 08 Sukatani</span>
              <span>Sistem Informasi Administrasi Warga</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
