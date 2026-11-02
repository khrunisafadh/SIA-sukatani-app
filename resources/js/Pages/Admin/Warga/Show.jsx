import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  User,
  MapPin,
  Calendar,
  Phone,
  Briefcase,
  FileText,
  ShieldCheck,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  Building2,
  Users,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  AlertTriangle,
  X
} from 'lucide-react';

export default function WargaShow({ warga }) {
  const [showNik, setShowNik] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatMask = (val) => {
    if (!val) return '-';
    if (val.length >= 8) {
      return val.substring(0, 4) + ' •••• •••• ' + val.substring(val.length - 4);
    }
    return val;
  };

  const formatNikDisplay = (val) => {
    if (!val) return '-';
    return val.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleDelete = () => {
    setDeleting(true);
    router.delete(route('admin.warga.destroy', warga.id), {
      onFinish: () => {
        setDeleting(false);
        setShowDeleteModal(false);
      },
    });
  };

  const getInitials = (name) => {
    if (!name) return 'W';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout
      title={`Detail Data Warga - ${warga.nama_lengkap}`}
      description="Informasi kependudukan lengkap warga RT 01/08 Kelurahan Sukatani."
      breadcrumbs={[
        { label: 'Layanan Administrasi', href: route('admin.dashboard') },
        { label: 'Data Warga', href: route('admin.warga.index') },
        { label: warga.nama_lengkap },
      ]}
    >
      <Head title={`Detail Warga: ${warga.nama_lengkap} - SIA Sukatani`} />

      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <Link
              href={route('admin.warga.index')}
              className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#1A253C] transition shadow-xs cursor-pointer shrink-0"
              title="Kembali ke Daftar Warga"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F8F83] to-[#00554D] text-white font-extrabold text-xl flex items-center justify-center shadow-md shrink-0">
              {getInitials(warga.nama_lengkap)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#10264F] font-heading tracking-tight">
                  {warga.nama_lengkap}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                    warga.status_administrasi === 'Aktif'
                      ? 'bg-[#EBF2FF] text-[#2F65CB] border border-[#BFDBFE]'
                      : 'bg-[#FFF2D9] text-[#97620D] border border-[#FDE68A]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      warga.status_administrasi === 'Aktif' ? 'bg-[#2F65CB]' : 'bg-[#97620D]'
                    }`}
                  />
                  {warga.status_administrasi || 'Aktif'}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    warga.status_domisili?.includes('Tetap')
                      ? 'bg-[#EAF7EE] text-[#14833B] border border-[#B7E7D2]'
                      : 'bg-[#FFF3DA] text-[#A66700] border border-[#FFE2A4]'
                  }`}
                >
                  {warga.status_domisili?.includes('Tetap') ? 'Warga Tetap' : 'Warga Kontrak / Sewa'}
                </span>
              </div>
              <p className="text-xs text-[#68748A]">
                Status Hubungan Keluarga:{' '}
                <strong className="text-[#10264F] font-semibold">{warga.shdk || 'Kepala Keluarga'}</strong> • Terdaftar sejak{' '}
                {formatDate(warga.created_at)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <Link
              href={route('admin.warga.edit', warga.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006B61] hover:bg-[#00554D] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Data Warga</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </div>

        {/* Grid Information: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Identitas & Alamat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Data Identitas Kependudukan */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#006B61]" />
                  <h2 className="text-base font-bold text-[#10264F] font-heading">
                    Identitas Kependudukan (KTP &amp; KK)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNik(!showNik)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#006B61] hover:text-[#00554D] font-semibold cursor-pointer"
                >
                  {showNik ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showNik ? 'Sensor NIK & KK' : 'Tampilkan NIK & KK Lengkap'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* NIK */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Nomor Induk Kependudukan (NIK)
                  </span>
                  <div className="font-mono text-sm font-bold text-[#10264F]">
                    {showNik ? formatNikDisplay(warga.nik) : formatMask(warga.nik)}
                  </div>
                </div>

                {/* No KK */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Nomor Kartu Keluarga (KK)
                  </span>
                  <div className="font-mono text-sm font-bold text-[#10264F]">
                    {showNik ? formatNikDisplay(warga.no_kk) : formatMask(warga.no_kk)}
                  </div>
                </div>

                {/* Tempat & Tanggal Lahir */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Tempat, Tanggal Lahir
                  </span>
                  <div className="text-sm font-bold text-[#10264F]">
                    {warga.tempat_lahir || '-'}, {formatDate(warga.tgl_lahir || warga.tanggal_lahir)}
                  </div>
                </div>

                {/* Jenis Kelamin */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Jenis Kelamin
                  </span>
                  <div className="text-sm font-bold text-[#10264F]">
                    {warga.gender === 'L' || warga.jenis_kelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                  </div>
                </div>

                {/* Agama */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Agama
                  </span>
                  <div className="text-sm font-bold text-[#10264F]">
                    {warga.agama || 'Islam'}
                  </div>
                </div>

                {/* Golongan Darah */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Golongan Darah
                  </span>
                  <div className="text-sm font-bold text-[#10264F]">
                    {warga.goldar || 'Tidak Diketahui'}
                  </div>
                </div>

                {/* Pekerjaan */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Pekerjaan / Profesi
                  </span>
                  <div className="text-sm font-bold text-[#10264F]">
                    {warga.pekerjaan || 'Karyawan Swasta'}
                  </div>
                </div>

                {/* Hubungan Keluarga (SHDK) */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Status Hubungan Keluarga
                  </span>
                  <div className="text-sm font-bold text-[#10264F]">
                    {warga.shdk || 'Kepala Keluarga'}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Alamat & Domisili RT */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
                <MapPin className="w-5 h-5 text-[#006B61]" />
                <h2 className="text-base font-bold text-[#10264F] font-heading">
                  Alamat Rumah &amp; Domisili RT 01/08
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1 sm:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Alamat Lengkap Terdata
                  </span>
                  <div className="text-sm font-bold text-[#10264F] leading-relaxed">
                    {warga.alamat_lengkap || `${warga.nama_jalan || warga.blok_rumah} ${warga.nomor_rumah}, RT 01 / RW 08 Sukatani, Tapos, Depok`}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Nama Jalan / Blok
                  </span>
                  <div className="text-sm font-bold text-[#10264F]">
                    {warga.nama_jalan || warga.blok_rumah || 'Jl. Melati'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Nomor Rumah
                  </span>
                  <div className="text-sm font-bold text-[#10264F]">
                    {warga.nomor_rumah || '-'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-1 sm:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68748A]">
                    Keterangan Tambahan / Patokan Unit
                  </span>
                  <div className="text-sm font-medium text-[#475569]">
                    {warga.detail_alamat || 'Tidak ada catatan patokan khusus.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Kontak & Berkas Dokumen */}
          <div className="space-y-6">
            {/* Card: Kontak Warga */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
                <Phone className="w-5 h-5 text-[#006B61]" />
                <h3 className="text-base font-bold text-[#10264F] font-heading">
                  Kontak &amp; Komunikasi
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] text-[#68748A] block">Nomor WhatsApp / HP</span>
                  <span className="font-mono text-sm font-bold text-[#10264F]">
                    {warga.no_wa || warga.telepon || '-'}
                  </span>
                </div>

                {warga.no_wa && (
                  <a
                    href={`https://wa.me/${warga.no_wa.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#E7F6EF] text-[#0F8F83] font-bold text-xs hover:bg-[#d8efe5] transition"
                  >
                    <span>Hubungi via WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Card: Berkas Dokumen */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
                <FileText className="w-5 h-5 text-[#006B61]" />
                <h3 className="text-base font-bold text-[#10264F] font-heading">
                  Berkas Dokumen Warga
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {/* Dokumen KTP */}
                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#10264F]">Foto / Scan KTP</span>
                    <span className="text-[10px] text-[#006B61] bg-[#E7F6EF] px-2 py-0.5 rounded font-semibold">
                      {warga.foto_ktp ? 'Terlampir' : 'Belum Ada'}
                    </span>
                  </div>
                  {warga.foto_ktp ? (
                    <a
                      href={`/storage/${warga.foto_ktp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#006B61] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Lihat Dokumen KTP</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <p className="text-[11px] text-[#94A3B8]">Berkas fisik belum diunggah.</p>
                  )}
                </div>

                {/* Dokumen KK */}
                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#10264F]">Foto / Scan Kartu Keluarga</span>
                    <span className="text-[10px] text-[#006B61] bg-[#E7F6EF] px-2 py-0.5 rounded font-semibold">
                      {warga.foto_kk ? 'Terlampir' : 'Belum Ada'}
                    </span>
                  </div>
                  {warga.foto_kk ? (
                    <a
                      href={`/storage/${warga.foto_kk}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#006B61] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Lihat Dokumen KK</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <p className="text-[11px] text-[#94A3B8]">Berkas fisik belum diunggah.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Audit Info */}
            <div className="p-4 rounded-2xl bg-[#E6F6F4] border border-[#0d9488]/20 flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-[#0d9488] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[#00554D]">Data Terlindungi</span>
                <p className="text-[#0d9488] text-[11px] leading-relaxed">
                  Akses data warga tercatat dalam log aktivitas rukun tetangga sesuai mandat keamanan administrasi RT 01.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl border border-rose-100 p-6 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#10264F] font-heading">
                  Hapus Data Warga?
                </h3>
                <p className="text-xs text-[#68748A] leading-relaxed">
                  Apakah Anda yakin ingin menghapus data warga{' '}
                  <strong className="text-[#10264F]">{warga.nama_lengkap}</strong> (NIK: {warga.nik})? Data yang dihapus tidak dapat dipulihkan secara langsung.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus Data Warga'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
