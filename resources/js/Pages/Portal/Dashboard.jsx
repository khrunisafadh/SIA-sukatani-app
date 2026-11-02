import React from 'react';
import { Head, Link } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { 
  FileText, 
  ArrowLeftRight, 
  ArrowRight, 
  Check, 
  Users, 
  Clock, 
  Plus
} from 'lucide-react';

export default function PortalDashboard({ auth, warga, recentLetters = [], notifications = [] }) {
  const user = auth?.user;
  const displayName = warga?.nama_lengkap || user?.name || 'Warga';
  const firstName = displayName.split(' ')[0] || 'Warga';

  const getInitials = (name) => {
    if (!name) return 'DS';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Fallback pengajuan jika belum ada data di database warga
  const displayLetters = (recentLetters && recentLetters.length > 0) ? recentLetters : [
    {
      id: 1,
      jenis_label: 'Surat Pengantar',
      nomor: 'SIA-250128-014',
      tanggal_format: 'Diajukan 20 Januari 2025',
      status: 'diproses',
      status_label: 'Diproses'
    },
    {
      id: 2,
      jenis_label: 'Keterangan Domisili',
      nomor: 'SIA-250110-002',
      tanggal_format: 'Diajukan 10 Januari 2025',
      status: 'terbit',
      status_label: 'Terbit'
    }
  ];

  // Fallback notifikasi aktivitas
  const displayNotifications = (notifications && notifications.length > 0) ? notifications : [
    {
      id: 1,
      type: 'surat',
      title: 'Pengajuan surat baru',
      desc: 'Siti Rahmawati mengajukan Surat Pengantar',
      time: '5 menit lalu',
      icon: 'file-text'
    },
    {
      id: 2,
      type: 'terbit',
      title: 'Status surat diperbarui',
      desc: 'Pengajuan SIA-250125-007 telah terbit',
      time: '1 jam lalu',
      icon: 'check'
    },
    {
      id: 3,
      type: 'warga',
      title: 'Data warga diperbarui',
      desc: 'Profil keluarga Budi Santoso diperbarui',
      time: 'Kemarin, 16.40',
      icon: 'users'
    }
  ];

  return (
    <WargaLayout>
      <Head title="Portal Warga - SIA Sukatani" />

      <div className="space-y-6 max-w-[1240px]">
        {/* ================= GREETING HEADER ================= */}
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#1A253C] tracking-tight">
            Selamat datang, {firstName}
          </h1>
          <p className="text-xs text-[#718096] mt-1">
            Kelola kebutuhan administrasi Anda dengan aman dan mudah.
          </p>
        </div>

        {/* ================= HERO BANNER AKUN WARGA (DEEP TEAL) ================= */}
        <div className="rounded-2xl bg-[#00554E] p-6 text-white shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar Bulat Inisial Warga */}
              <div className="w-13 h-13 rounded-2xl bg-[#E8F6F4] text-[#00554E] flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                {getInitials(displayName)}
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#A7D7D0] block">
                  Akun warga terverifikasi
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5 leading-snug">
                  {displayName}
                </h2>
                <p className="text-xs text-[#D0EBE7] font-mono mt-0.5">
                  RT 01/RW 08 • NIK {warga?.masked_nik || '3276••••••••1042'}
                </p>
              </div>
            </div>

            {/* Status Pill Aktif */}
            <div className="self-start sm:self-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#00554E] font-semibold text-xs shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Aktif</span>
              </span>
            </div>
          </div>
        </div>

        {/* ================= 2 KARTU AKSI CEPAT ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: Ajukan Surat */}
          <Link
            href={route('portal.surat.create')}
            className="p-5 rounded-2xl bg-white border border-[#E9EFF6] shadow-xs flex items-center justify-between hover:border-[#0E8F84]/40 hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#E8F6F4] text-[#0E8F84] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1A253C] group-hover:text-[#0E8F84] transition-colors">
                  Ajukan Surat
                </h3>
                <p className="text-xs text-[#718096] mt-0.5">
                  Buat pengajuan administrasi baru
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2563EB] group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>

          {/* Card 2: Lapor Pindah/Datang */}
          <Link
            href={route('portal.pindah-datang.create')}
            className="p-5 rounded-2xl bg-white border border-[#E9EFF6] shadow-xs flex items-center justify-between hover:border-[#0E8F84]/40 hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#E8F6F4] text-[#0E8F84] flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1A253C] group-hover:text-[#0E8F84] transition-colors">
                  Lapor Pindah/Datang
                </h3>
                <p className="text-xs text-[#718096] mt-0.5">
                  Sampaikan perubahan domisili
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2563EB] group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>
        </div>

        {/* ================= 2 KOLOM KONTEN UTAMA ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri (7 Kolom): Status Pengajuan Saya */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1A253C]">
                Status Pengajuan Saya
              </h3>
              <Link
                href={route('portal.surat.index')}
                className="text-xs font-semibold text-[#0E8F84] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E9EFF6] shadow-xs space-y-3">
              {displayLetters.length > 0 ? (
                displayLetters.map((item) => {
                  const isDiproses = item.status_label === 'Diproses' || item.status === 'diajukan';
                  const isTerbit = item.status_label === 'Terbit' || item.status === 'selesai';

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-[#EDF2F7] bg-white hover:bg-[#FBFDFF] flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="text-[11px] text-[#718096] block">
                          {item.jenis_label}
                        </span>
                        <h4 className="font-bold text-sm text-[#1A253C] font-mono mt-0.5">
                          {item.nomor}
                        </h4>
                        <p className="text-[11px] text-[#A0AEC0] mt-0.5">
                          {item.tanggal_format}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            isDiproses
                              ? 'bg-[#FFF3DA] text-[#A66700] border border-[#FFE4A8]'
                              : isTerbit
                              ? 'bg-[#EAF7EE] text-[#14833B] border border-[#B7E7D2]'
                              : 'bg-[#EEF4FF] text-[#2F65CB] border border-[#C8DCFF]'
                          }`}
                        >
                          {item.status_label}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-[#718096] space-y-3">
                  <p className="text-xs">Belum ada pengajuan surat yang aktif.</p>
                  <Link
                    href={route('portal.surat.create')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E8F84] text-white text-xs font-semibold hover:bg-[#0B756C] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajukan Surat Sekarang</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan (5 Kolom): Notifikasi Terbaru */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-bold text-sm text-[#1A253C]">
              Notifikasi Terbaru
            </h3>

            <div className="p-6 rounded-2xl bg-white border border-[#E9EFF6] shadow-xs space-y-5">
              {displayNotifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F6F4] text-[#0E8F84] flex items-center justify-center shrink-0 mt-0.5">
                    {notif.icon === 'check' ? (
                      <Check className="w-4 h-4 text-[#14833B]" />
                    ) : notif.icon === 'users' ? (
                      <Users className="w-4 h-4 text-[#0E8F84]" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#0E8F84]" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-[#1A253C]">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-[#718096] leading-relaxed">
                      {notif.desc}
                    </p>
                    <span className="text-[10px] text-[#A0AEC0] block">
                      {notif.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WargaLayout>
  );
}
