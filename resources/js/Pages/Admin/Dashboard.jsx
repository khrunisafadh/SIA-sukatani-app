import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  X,
  IdCard,
  Contact,
  HelpCircle
} from 'lucide-react';

export default function AdminDashboard({ auth, stats: propStats, recentLetters: propRecentLetters, recentHistories: propRecentHistories }) {
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedLetter(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4 Kartu Statistik Real-time
  const stats = [
    {
      title: 'Total warga',
      value: propStats?.total_warga || '248',
      desc: 'Data warga aktif',
      icon: Users,
      bgIcon: 'bg-[#EDF3FF]',
      iconColor: 'text-[#2F65CB]',
    },
    {
      title: 'Surat diajukan',
      value: propStats?.surat_diajukan || '02',
      desc: 'Perlu ditinjau hari ini',
      icon: FileText,
      bgIcon: 'bg-[#FFF6E5]',
      iconColor: 'text-[#C97A00]',
    },
    {
      title: 'Laporan hunian',
      value: propStats?.laporan_hunian || '03',
      desc: 'Menunggu pemeriksaan',
      icon: ArrowLeftRight,
      bgIcon: 'bg-[#E6F6F4]',
      iconColor: 'text-[#0E8F84]',
    },
    {
      title: 'Surat selesai',
      value: propStats?.surat_selesai || '18',
      desc: 'Pengesahan fisik tercatat',
      icon: Check,
      bgIcon: 'bg-[#EBF7EE]',
      iconColor: 'text-[#188A42]',
    },
  ];

  // Data Pengajuan Surat Cadangan (Demo Fallback) jika DB kosong
  const fallbackRecentLetters = [
    {
      id: 1,
      nomor: 'SRT-2025-014',
      date: '18 Jun 2025',
      pemohon_name: 'Siti Rahmawati',
      pemohon_nik: '3276010022334455',
      jenis_label: 'Surat Keterangan Domisili',
      keperluan: 'Pengurusan administrasi perbankan',
      status: 'diajukan',
      status_label: 'Diajukan',
      status_class: 'bg-[#FFF3DA] text-[#A66700] border border-[#FDE6B8]',
      petugas_name: 'Budi Santoso',
      updated_at_formatted: '18 Juni 2025, 10.24',
    },
    {
      id: 2,
      nomor: 'SRT-2025-013',
      date: '17 Jun 2025',
      pemohon_name: 'Dimas Saputra',
      pemohon_nik: '3276010099887766',
      jenis_label: 'Surat Pengantar',
      keperluan: 'Pembuatan SKCK Polsek Tapos',
      status: 'terbit',
      status_label: 'Terbit',
      status_class: 'bg-[#EBF2FF] text-[#2F65CB] border border-[#CDE0FD]',
      petugas_name: 'Budi Santoso',
      updated_at_formatted: '17 Juni 2025, 14.10',
    },
    {
      id: 3,
      nomor: 'SRT-2025-012',
      date: '16 Jun 2025',
      pemohon_name: 'Rizky Pratama',
      pemohon_nik: '3276010011223344',
      jenis_label: 'Surat Pengantar',
      keperluan: 'Perpanjangan KTP Elektronik',
      status: 'selesai',
      status_label: 'Selesai / Ditandatangani',
      status_class: 'bg-[#EAF7EE] text-[#14833B] border border-[#B6E6C5]',
      petugas_name: 'Budi Santoso',
      updated_at_formatted: '16 Juni 2025, 11.30',
    },
  ];

  // Gunakan data real-time dari backend (fitur Zafi)
  const lettersList = (propRecentLetters && propRecentLetters.length > 0)
    ? propRecentLetters
    : fallbackRecentLetters;

  // Aktivitas terbaru real-time atau fallback
  const fallbackActivities = [
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

  const activitiesList = (propRecentHistories && propRecentHistories.length > 0)
    ? propRecentHistories.map((act) => ({
        title: act.title,
        desc: act.desc,
        time: act.time,
        icon: act.status === 'selesai' ? Check : FileText,
        bgIcon: act.status === 'selesai' ? 'bg-[#EAF7EE]' : 'bg-[#EBF2FF]',
        iconColor: act.status === 'selesai' ? 'text-[#14833B]' : 'text-[#2F65CB]',
      }))
    : fallbackActivities;

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
                <Link
                  href={route('admin.pindah-datang.index')}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Pindah / Datang</span>
                </Link>

                {/* Pengajuan Surat dengan Badge Oranye 2 */}
                <Link
                  href={route('admin.surat.index')}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#A7D7D0]" />
                    <span>Pengajuan Surat</span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#E58917] text-white flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                </Link>

                {/* Audit Trail */}
                <a
                  href="#audit-trail"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Audit Trail</span>
                </a>

                {/* Pengguna & Role */}
                <Link
                  href={route('admin.users.index')}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <UserCog className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Pengguna & Role</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Sidebar: Keamanan data & Tombol Keluar */}
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
          {/* Header Bar */}
          <header className="h-[72px] bg-white border-b border-[#EAEFF5] px-10 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#0E8F84]">
                SIA RT 01/08 Sukatani
              </span>
              <span className="text-[#A0AEC0]">•</span>
              <span className="text-xs text-[#718096] font-medium">Kecamatan Tapos, Kota Depok</span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#EAF0FC] text-[#2F65CB] flex items-center justify-center font-bold text-xs">
                BS
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#1A253C] leading-none">Budi Santoso</h4>
                <p className="text-[10px] text-[#718096] mt-0.5">Ketua RT 01/08</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#A0AEC0] ml-1" />
            </div>
          </header>

          {/* Konten Halaman */}
          <main className="p-10 space-y-6 max-w-[1240px] w-full">
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
                className="btn-admin-primary"
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
                    className="p-5 rounded-2xl bg-white border border-[#E9EFF6] shadow-sm flex items-center justify-between"
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
            <div className="p-6 rounded-2xl bg-white border border-[#E9EFF6] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1A253C] font-heading">
                    Pengajuan surat terbaru
                  </h3>
                  <p className="text-xs text-[#718096] mt-0.5">
                    Pengajuan yang perlu dipantau pengurus.
                  </p>
                </div>
                {/* Link Lihat Semua -> Masuk ke Pengajuan Surat Zafi */}
                <Link
                  href={route('admin.surat.index')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F685D] hover:underline cursor-pointer"
                >
                  <span>Lihat semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* List Baris Surat Real-time */}
              <div className="space-y-2.5">
                {lettersList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => setSelectedLetter(item)}
                    className="p-4 rounded-xl border border-[#F0F4F8] hover:border-[#0F685D]/30 hover:bg-[#F9FBFC] transition-all flex items-center justify-between gap-4 cursor-pointer group"
                    title="Klik untuk melihat detail pengajuan"
                  >
                    {/* Sisi Kiri: Ikon Biru & Nama + ID Surat */}
                    <div className="flex items-center gap-3.5 w-1/3">
                      <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2F65CB] group-hover:bg-[#E6F6F4] group-hover:text-[#0F685D] transition-colors flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A253C] group-hover:text-[#0F685D] transition-colors">
                          {item.pemohon_name || item.name}
                        </h4>
                        <p className="text-[10px] text-[#718096] mt-0.5">
                          {item.nomor || item.id} • {item.date}
                        </p>
                      </div>
                    </div>

                    {/* Sisi Tengah: Jenis Surat */}
                    <div className="text-xs text-[#4A5568] w-1/3 text-left">
                      {item.jenis_label || item.type}
                    </div>

                    {/* Sisi Kanan: Badge Status Pill & Chevron */}
                    <div className="flex items-center justify-end gap-3 w-1/3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-semibold ${item.status_class || item.statusClass}`}>
                        {item.status_label || item.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#0F685D] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= CARD 2: AKTIVITAS TERBARU (LEBAR) ================= */}
            <div className="p-6 rounded-2xl bg-white border border-[#E9EFF6] shadow-sm space-y-5">
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
                {activitiesList.map((act, idx) => {
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

      {/* ================= DRAWER SLIDE-OVER DETAIL PENGURUS RT ================= */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Gelap */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300"
            onClick={() => setSelectedLetter(null)}
          />

          {/* Drawer Panel di Sisi Kanan */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-white shadow-2xl flex flex-col justify-between p-8 overflow-y-auto transform transition-transform duration-300 ease-in-out">
            {/* Tombol Tutup Silang di Kanan Atas */}
            <button
              type="button"
              onClick={() => setSelectedLetter(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#94A3B8] hover:text-[#1A253C] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup detail"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Konten Atas Drawer */}
            <div className="space-y-6 pt-2">
              {/* Ikon Kartu Identitas Hijau/Teal */}
              <div className="w-12 h-12 rounded-2xl bg-[#E6F6F4] text-[#0F685D] border border-[#BDE8E2] flex items-center justify-center">
                <IdCard className="w-6 h-6" />
              </div>

              {/* Judul & Nama Warga */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#0E8F84]">
                  DETAIL ADMINISTRASI
                </span>
                <h2 className="text-2xl font-bold text-[#1A253C] font-heading leading-tight">
                  {selectedLetter.pemohon_name || selectedLetter.name}
                </h2>
                <p className="text-xs text-[#718096] leading-relaxed">
                  Informasi lengkap telah terhubung dengan arsip RT 01/08 Sukatani.
                </p>
              </div>

              {/* Status Badge */}
              <div className="pt-2">
                <p className="text-xs text-[#718096] font-medium mb-2">Status</p>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E6F6F4] text-[#0F685D] border border-[#BDE8E2]">
                  {selectedLetter.status === 'selesai'
                    ? 'Selesai & Ditandatangani'
                    : selectedLetter.status === 'terbit'
                      ? 'Aktif & terverifikasi'
                      : (selectedLetter.status_label || selectedLetter.status || 'Aktif & terverifikasi')}
                </span>
              </div>

              <div className="border-t border-[#F0F4F8]" />

              {/* Terakhir Diperbarui */}
              <div>
                <p className="text-xs text-[#718096] font-medium mb-1">Terakhir diperbarui</p>
                <p className="text-sm font-bold text-[#1A253C]">
                  {selectedLetter.updated_at_formatted || '18 Juni 2025, 10.24'}
                </p>
              </div>

              <div className="border-t border-[#F0F4F8]" />

              {/* Petugas */}
              <div>
                <p className="text-xs text-[#718096] font-medium mb-1">Petugas</p>
                <p className="text-sm font-bold text-[#1A253C]">
                  {selectedLetter.petugas_name || 'Budi Santoso'}
                </p>
              </div>

              {/* Rincian Surat */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEFF5] space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">Nomor Pengajuan</span>
                  <span className="font-bold text-[#0F685D]">{selectedLetter.nomor || selectedLetter.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">Jenis Surat</span>
                  <span className="font-semibold text-[#1A253C]">{selectedLetter.jenis_label || selectedLetter.type}</span>
                </div>
                {selectedLetter.keperluan && (
                  <div className="pt-2 border-t border-[#EAEFF5]">
                    <span className="text-[#718096] block mb-0.5">Keperluan</span>
                    <span className="text-[#1A253C] font-medium">{selectedLetter.keperluan}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Aksi di Bawah Drawer */}
            <div className="pt-6 border-t border-[#F0F4F8] space-y-3 mt-6">
              <Link
                href={selectedLetter.id && typeof selectedLetter.id === 'number'
                  ? route('admin.surat.show', selectedLetter.id)
                  : route('admin.surat.index')}
                className="w-full py-3 rounded-xl bg-[#0F685D] hover:bg-[#0B5249] text-white text-xs font-semibold shadow-sm transition-all text-center flex items-center justify-center cursor-pointer"
              >
                Perbarui data
              </Link>
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="w-full py-3 rounded-xl border border-[#CBD5E1] text-[#4A5568] hover:bg-slate-50 text-xs font-semibold transition-all text-center cursor-pointer"
              >
                Tutup detail
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
