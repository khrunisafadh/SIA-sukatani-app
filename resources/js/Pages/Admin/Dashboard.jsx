import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  Home,
  Users, 
  ArrowLeftRight, 
  FileText, 
  ShieldCheck, 
  UserCog, 
  LogOut, 
  Plus, 
  ChevronRight,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard({ auth }) {
  // 4 Kartu Statistik sesuai Gambar
  const stats = [
    {
      title: 'Total warga',
      value: '248',
      desc: 'Contoh data aktif',
      icon: Users,
      bgIcon: 'bg-[#EDF3FF]',
      iconColor: 'text-[#2F65CB]',
    },
    {
      title: 'Surat diajukan',
      value: '02',
      desc: 'Perlu ditinjau hari ini',
      icon: FileText,
      bgIcon: 'bg-[#FFF6E5]',
      iconColor: 'text-[#C97A00]',
    },
    {
      title: 'Laporan hunian',
      value: '03',
      desc: 'Menunggu pemeriksaan',
      icon: ArrowLeftRight,
      bgIcon: 'bg-[#E6F6F4]',
      iconColor: 'text-[#0E8F84]',
    },
    {
      title: 'Surat selesai',
      value: '18',
      desc: 'Contoh bulan Juni',
      icon: Check,
      bgIcon: 'bg-[#EBF7EE]',
      iconColor: 'text-[#188A42]',
    },
  ];

  // Pengajuan surat terbaru (List Horizontal lebar sesuai gambar)
  const recentLetters = [
    {
      id: 'SRT-2025-014',
      date: '18 Jun 2025',
      name: 'Siti Rahmawati',
      type: 'Surat Keterangan Domisili',
      status: 'Diajukan',
      statusClass: 'bg-[#FFF3DA] text-[#A66700]',
    },
    {
      id: 'SRT-2025-013',
      date: '17 Jun 2025',
      name: 'Dimas Saputra',
      type: 'Surat Pengantar',
      status: 'Terbit',
      statusClass: 'bg-[#EBF2FF] text-[#2F65CB]',
    },
    {
      id: 'SRT-2025-012',
      date: '16 Jun 2025',
      name: 'Rizky Pratama',
      type: 'Surat Pengantar',
      status: 'Selesai / Ditandatangani',
      statusClass: 'bg-[#EAF7EE] text-[#14833B]',
    },
  ];

  // Aktivitas terbaru (List vertikal berbaris)
  const recentActivities = [
    {
      title: 'Status surat diperbarui',
      desc: 'SRT-2025-012 ditandai selesai',
      time: '10.24',
      icon: Check,
      bgIcon: 'bg-[#EAF7EE]',
      iconColor: 'text-[#14833B]',
    },
    {
      title: 'Pengajuan surat baru',
      desc: 'Surat Domisili oleh Siti R.',
      time: '09.12',
      icon: FileText,
      bgIcon: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2F65CB]',
    },
    {
      title: 'Data warga diperbarui',
      desc: 'Alamat Dimas Saputra',
      time: 'Kemarin',
      icon: Users,
      bgIcon: 'bg-[#F1F3F7]',
      iconColor: 'text-[#687588]',
    },
  ];

  return (
    <>
      <Head title="Dashboard - SIA Sukatani" />

      <div className="min-h-screen bg-[#F6F8FB] font-sans antialiased text-[#1A253C] flex">
        {/* ================= SIDEBAR TEAL GELAP (#287971) ================= */}
        <aside className="w-[260px] bg-[#287971] text-white flex flex-col justify-between fixed inset-y-0 left-0 z-30 select-none shadow-sm">
          <div className="p-6">
            {/* Header Brand */}
            <div className="mb-8">
              <h1 className="font-bold text-lg text-white font-heading tracking-tight leading-snug">
                SIA Sukatani
              </h1>
              <p className="text-[11px] text-[#A7D7D0] mt-0.5">
                Administrasi Rukun Tetangga
              </p>
            </div>

            {/* Menu Navigasi */}
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="block px-3 text-[10px] font-bold tracking-widest uppercase text-[#96C7C0] mb-2">
                  MENU UTAMA
                </span>

                {/* Beranda (Active State: rounded gelap #1C5F57) */}
                <Link
                  href={route('admin.dashboard')}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#1C5F57] text-white text-xs font-semibold shadow-inner"
                >
                  <Home className="w-4 h-4 text-white" />
                  <span>Beranda</span>
                </Link>

                {/* Data Warga */}
                <Link
                  href={route('admin.warga.index')}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <Users className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Data Warga</span>
                </Link>

                {/* Pindah / Datang */}
                <a
                  href="#pindah-datang"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Pindah / Datang</span>
                </a>

                {/* Pengajuan Surat dengan Badge Oranye 2 */}
                <a
                  href="#pengajuan-surat"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#A7D7D0]" />
                    <span>Pengajuan Surat</span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#E58917] text-white flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                </a>

                {/* Audit Trail */}
                <a
                  href="#audit-trail"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Audit Trail</span>
                </a>

                {/* Pengguna & Role */}
                <a
                  href="#pengguna-role"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <UserCog className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Pengguna & Role</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bagian Bawah: Card Keamanan Data & Tombol Keluar */}
          <div className="p-5 space-y-4">
            {/* Card Keamanan Data Semi-Transparan (#1E665E) */}
            <div className="p-3.5 rounded-2xl bg-[#1E665E]/90 border border-[#358A81] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#7BD4C9] flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-white">Keamanan data</p>
                <p className="text-[10px] text-[#A7D7D0] leading-relaxed">
                  Akses mengikuti matriks RBAC backend.
                </p>
              </div>
            </div>

            {/* Tombol Keluar */}
            <Link
              method="post"
              href={route('logout')}
              as="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#D0EBE7] hover:text-white hover:bg-[#206760] rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </Link>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 pl-[260px] flex flex-col min-w-0">
          {/* Header Bar Bersih (Hanya Profil di Kanan Atas) */}
          <header className="h-[72px] bg-white border-b border-[#EAEFF5] px-10 flex items-center justify-end sticky top-0 z-20">
            <div className="flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#EAF0FC] text-[#2F65CB] flex items-center justify-center font-bold text-xs">
                BS
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#1A253C] leading-none">Budi Santoso</h4>
                <p className="text-[10px] text-[#718096] mt-0.5">Ketua RT</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#A0AEC0] ml-1" />
            </div>
          </header>

          {/* Konten Halaman */}
          <main className="p-10 space-y-6 max-w-[1200px] w-full">
            {/* Greeting Header & Tombol Tambah Data Warga */}
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#2F65CB]">
                  RABU, 18 JUNI 2025
                </span>
                <h2 className="text-[26px] font-bold text-[#1A253C] font-heading tracking-tight leading-tight">
                  Selamat datang, Pak Budi
                </h2>
                <p className="text-xs text-[#718096]">
                  Berikut ringkasan administrasi RT 01/08 hari ini.
                </p>
              </div>

              {/* Tombol Hijau Gelap: + Tambah data warga */}
              <Link
                href={route('admin.warga.create')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F685D] hover:bg-[#0B5249] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah data warga</span>
              </Link>
            </div>

            {/* 4 Stat Cards Row */}
            <div className="grid grid-cols-4 gap-4 pt-1">
              {stats.map((stat, i) => {
                const IconComp = stat.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white border border-[#E9EFF6] shadow-[0px_2px_4px_0px_rgba(20,30,55,0.02)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl ${stat.bgIcon} ${stat.iconColor} flex items-center justify-center flex-shrink-0`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#718096]">{stat.title}</p>
                        <p className="text-[10px] text-[#A0AEC0] mt-0.5">{stat.desc}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-[#1A253C] font-heading pl-2">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ================= CARD 1: PENGAJUAN SURAT TERBARU (LEBAR) ================= */}
            <div className="p-6 rounded-2xl bg-white border border-[#E9EFF6] shadow-[0px_2px_4px_0px_rgba(20,30,55,0.02)] space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1A253C] font-heading">
                    Pengajuan surat terbaru
                  </h3>
                  <p className="text-xs text-[#718096] mt-0.5">
                    Pengajuan yang perlu dipantau pengurus.
                  </p>
                </div>
                <a
                  href="#pengajuan-surat"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F65CB] hover:underline"
                >
                  <span>Lihat semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* List Baris Surat */}
              <div className="space-y-2.5">
                {recentLetters.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#F0F4F8] hover:border-[#D6E4F0] hover:bg-[#FBFDFF] transition-all flex items-center justify-between gap-4"
                  >
                    {/* Sisi Kiri: Ikon Biru & Nama + ID Surat */}
                    <div className="flex items-center gap-3.5 w-1/3">
                      <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2F65CB] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A253C]">{item.name}</h4>
                        <p className="text-[10px] text-[#718096] mt-0.5">
                          {item.id} • {item.date}
                        </p>
                      </div>
                    </div>

                    {/* Sisi Tengah: Jenis Surat */}
                    <div className="text-xs text-[#4A5568] w-1/3 text-left">
                      {item.type}
                    </div>

                    {/* Sisi Kanan: Badge Status Pill & Chevron */}
                    <div className="flex items-center justify-end gap-3 w-1/3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-semibold ${item.statusClass}`}>
                        {item.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#A0AEC0]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= CARD 2: AKTIVITAS TERBARU (LEBAR) ================= */}
            <div className="p-6 rounded-2xl bg-white border border-[#E9EFF6] shadow-[0px_2px_4px_0px_rgba(20,30,55,0.02)] space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#1A253C] font-heading">
                  Aktivitas terbaru
                </h3>
                <p className="text-xs text-[#718096] mt-0.5">
                  Catatan sistem hari ini.
                </p>
              </div>

              {/* List Vertikal Aktivitas */}
              <div className="space-y-4">
                {recentActivities.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className={`w-8 h-8 rounded-xl ${act.bgIcon} ${act.iconColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <h5 className="text-xs font-bold text-[#1A253C]">{act.title}</h5>
                        <p className="text-[11px] text-[#718096]">{act.desc}</p>
                        <p className="text-[10px] text-[#A0AEC0] pt-0.5">{act.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
