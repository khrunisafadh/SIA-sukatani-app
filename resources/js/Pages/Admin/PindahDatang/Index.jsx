import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
  ArrowLeftRight, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Home, 
  CheckCircle2, 
  AlertCircle,
  Users
} from 'lucide-react';

export default function PindahDatangAdmin() {
  return (
    <AdminLayout
      title="Laporan Pindah / Datang Warga"
      description="Monitoring mutasi domisili dan verifikasi pelaporan hunian warga RT 01/08 Sukatani."
      breadcrumbs={[
        { label: 'Layanan Administrasi', href: route('admin.dashboard') },
        { label: 'Pindah / Datang' },
      ]}
    >
      <Head title="Pindah / Datang - SIA Sukatani" />

      <div className="space-y-6 max-w-5xl">
        {/* Main Development Card */}
        <div className="bg-white rounded-2xl border border-[#E9EFF6] shadow-sm p-8 text-center relative overflow-hidden">
          {/* Accent decoration bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0F685D] via-[#2F65CB] to-[#E58917]" />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E6F6F4] text-[#0F685D] border border-[#0F685D]/20 flex items-center justify-center mb-4">
            <ArrowLeftRight className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3DA] text-[#A66700] text-xs font-bold border border-[#FDE6B8] mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Fitur Masih Dalam Pengembangan (Modul Anggota 3: Ghita)</span>
          </div>

          <h2 className="text-xl font-bold text-[#1A253C] font-heading">
            Verifikasi Pelaporan Pindah / Datang Pengurus RT
          </h2>

          <p className="text-xs text-[#718096] max-w-xl mx-auto mt-2 leading-relaxed">
            Halaman persetujuan dan rekapitulasi berkas mutasi kependudukan untuk Ketua RT & Sekretaris sedang dalam proses integrasi dengan sistem pelaporan mandiri warga.
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={route('admin.dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F685D] hover:bg-[#0B5249] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda Admin</span>
            </Link>

            <Link
              href={route('admin.warga.index')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#4A5568] hover:bg-[#F8FAFC] text-xs font-semibold transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#718096]" />
              <span>Kelola Data Master Warga</span>
            </Link>
          </div>
        </div>

        {/* Blueprint Flow Box sesuai Dokumen Laporan Gate D */}
        <div className="bg-white rounded-2xl border border-[#E9EFF6] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#1A253C]">
            <ShieldCheck className="w-5 h-5 text-[#0F685D]" />
            <h3 className="text-sm font-bold font-heading">
              Alur Bisnis Pelaporan Pindah / Datang (Sesuai Gate D Report)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEFF5] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#E7EEFB] text-[#2F65CB] font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="text-xs font-bold text-[#1A253C]">Lapor Mandiri (Warga)</h4>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Warga mengisi data asal/tujuan serta mengunggah berkas KTP & KK melalui Portal Warga Sukatani.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEFF5] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFF6E5] text-[#C97A00] font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="text-xs font-bold text-[#1A253C]">Verifikasi Pengurus (RT)</h4>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Ketua RT / Sekretaris memeriksa kesesuaian berkas fisik dan menyetujui atau menolak permohonan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEFF5] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#EBF7EE] text-[#188A42] font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="text-xs font-bold text-[#1A253C]">Update Otomatis Master</h4>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Status hunian diperbarui otomatis pada Buku Induk RT dan tercatat pada jejak audit (*Audit Trail*).
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EEF4FF] border border-[#C8DCFF] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#10264F]">
              <FileText className="w-4 h-4 text-[#2F65CB] shrink-0" />
              <span>
                Formulir lapor mandiri warga saat ini sudah tersedia di <strong>Portal Warga</strong> (diuji oleh akun role warga).
              </span>
            </div>
            <a
              href="/portal/pindah-datang"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F65CB] hover:underline shrink-0"
            >
              <span>Buka Pratinjau Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
