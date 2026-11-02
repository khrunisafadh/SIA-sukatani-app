import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  User,
  MapPin,
  Calendar,
  Phone,
  Briefcase,
  FileText,
  ShieldCheck,
  Save,
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

export default function WargaEdit({ warga }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT',
    nik: warga.nik || '',
    no_kk: warga.no_kk || '',
    nama_lengkap: warga.nama_lengkap || '',
    gender: warga.gender || warga.jenis_kelamin || 'L',
    tempat_lahir: warga.tempat_lahir || '',
    tgl_lahir: warga.tgl_lahir ? warga.tgl_lahir.substring(0, 10) : '',
    agama: warga.agama || 'Islam',
    goldar: warga.goldar || 'Tidak Diketahui',
    shdk: warga.shdk || 'Kepala Keluarga',
    nama_jalan: warga.nama_jalan || warga.blok_rumah || 'Jl. Melati',
    nomor_rumah: warga.nomor_rumah || '',
    detail_alamat: warga.detail_alamat || '',
    status_domisili: warga.status_domisili || 'Warga Tetap (Pemilik Rumah)',
    status_administrasi: warga.status_administrasi || 'Aktif',
    no_wa: warga.no_wa || warga.telepon || '',
    pekerjaan: warga.pekerjaan || '',
    foto_ktp: null,
    foto_kk: null,
  });

  const [ktpName, setKtpName] = useState('');
  const [kkName, setKkName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.warga.update', warga.id), {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout
      title={`Edit Data Warga - ${warga.nama_lengkap}`}
      description="Perbarui informasi kependudukan, alamat hunian, dan dokumen warga RT 01/08."
      breadcrumbs={[
        { label: 'Layanan Administrasi', href: route('admin.dashboard') },
        { label: 'Data Warga', href: route('admin.warga.index') },
        { label: warga.nama_lengkap, href: route('admin.warga.show', warga.id) },
        { label: 'Edit' },
      ]}
    >
      <Head title={`Edit Data: ${warga.nama_lengkap} - SIA Sukatani`} />

      <form onSubmit={submit} className="max-w-4xl mx-auto space-y-6">
        {/* Header Action Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href={route('admin.warga.show', warga.id)}
              className="p-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#1A253C] transition shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-[#10264F] font-heading tracking-tight">
                Edit Data Warga
              </h1>
              <p className="text-xs text-[#68748A]">
                Perubahan data akan langsung tersimpan dan disinkronkan ke seluruh modul RT 01.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={route('admin.warga.show', warga.id)}
              className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-slate-50 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006B61] hover:bg-[#00554D] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </div>

        {/* Section 1: Identitas Kependudukan */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <User className="w-5 h-5 text-[#006B61]" />
            <h2 className="text-base font-bold text-[#10264F] font-heading">
              1. Identitas Kependudukan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* NIK */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">
                Nomor Induk Kependudukan (NIK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={data.nik}
                onChange={(e) => setData('nik', e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61] font-mono font-bold"
                required
              />
              {errors.nik && <p className="text-xs text-red-600">{errors.nik}</p>}
            </div>

            {/* No KK */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">
                Nomor Kartu Keluarga (KK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={data.no_kk}
                onChange={(e) => setData('no_kk', e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61] font-mono font-bold"
                required
              />
              {errors.no_kk && <p className="text-xs text-red-600">{errors.no_kk}</p>}
            </div>

            {/* Nama Lengkap */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-[#10264F]">
                Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.nama_lengkap}
                onChange={(e) => setData('nama_lengkap', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61] font-bold"
                required
              />
              {errors.nama_lengkap && <p className="text-xs text-red-600">{errors.nama_lengkap}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* Tempat Lahir */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.tempat_lahir}
                onChange={(e) => setData('tempat_lahir', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
                required
              />
              {errors.tempat_lahir && <p className="text-xs text-red-600">{errors.tempat_lahir}</p>}
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={data.tgl_lahir}
                onChange={(e) => setData('tgl_lahir', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
                required
              />
              {errors.tgl_lahir && <p className="text-xs text-red-600">{errors.tgl_lahir}</p>}
            </div>

            {/* Agama */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">Agama</label>
              <select
                value={data.agama}
                onChange={(e) => setData('agama', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              >
                <option value="Islam">Islam</option>
                <option value="Kristen Protestan">Kristen Protestan</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            {/* Golongan Darah */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">Golongan Darah</label>
              <select
                value={data.goldar}
                onChange={(e) => setData('goldar', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              >
                <option value="Tidak Diketahui">Tidak Diketahui</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>

            {/* Hubungan Keluarga (SHDK) */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">Status Hubungan Keluarga (SHDK)</label>
              <select
                value={data.shdk}
                onChange={(e) => setData('shdk', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              >
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Orang Tua / Mertua">Orang Tua / Mertua</option>
                <option value="Famili Lain">Famili Lain</option>
              </select>
            </div>

            {/* Pekerjaan */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">Pekerjaan</label>
              <input
                type="text"
                value={data.pekerjaan}
                onChange={(e) => setData('pekerjaan', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              />
            </div>

            {/* Status Administrasi */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">Status Administrasi</label>
              <select
                value={data.status_administrasi}
                onChange={(e) => setData('status_administrasi', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pindah">Pindah</option>
                <option value="Meninggal">Meninggal</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Alamat & Domisili RT */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <MapPin className="w-5 h-5 text-[#006B61]" />
            <h2 className="text-base font-bold text-[#10264F] font-heading">
              2. Alamat &amp; Status Domisili di RT 01/08
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Nama Jalan */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">
                Nama Jalan / Blok <span className="text-red-500">*</span>
              </label>
              <select
                value={data.nama_jalan}
                onChange={(e) => setData('nama_jalan', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              >
                <option value="Jl. Melati">Jl. Melati (Blok A)</option>
                <option value="Jl. Mawar">Jl. Mawar (Blok B)</option>
                <option value="Jl. Anggrek">Jl. Anggrek (Blok C)</option>
                <option value="Jl. Kenanga">Jl. Kenanga (Blok D)</option>
              </select>
            </div>

            {/* Nomor Rumah */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">
                Nomor Rumah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: No. 12"
                value={data.nomor_rumah}
                onChange={(e) => setData('nomor_rumah', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
                required
              />
            </div>

            {/* Status Domisili */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">Status Domisili</label>
              <select
                value={data.status_domisili}
                onChange={(e) => setData('status_domisili', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              >
                <option value="Warga Tetap (Pemilik Rumah)">Warga Tetap (Pemilik Rumah)</option>
                <option value="Warga Kontrak / Sewa Tahunan">Warga Kontrak / Sewa Tahunan</option>
                <option value="Warga Kos / Sewa Bulanan">Warga Kos / Sewa Bulanan</option>
              </select>
            </div>

            {/* No WhatsApp */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#10264F]">Nomor WhatsApp / HP</label>
              <input
                type="text"
                placeholder="Contoh: 081234567890"
                value={data.no_wa}
                onChange={(e) => setData('no_wa', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              />
            </div>

            {/* Detail Alamat / Patokan */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-[#10264F]">Keterangan Tambahan / Patokan Rumah</label>
              <input
                type="text"
                placeholder="Contoh: Pagar hitam, samping pos ronda"
                value={data.detail_alamat}
                onChange={(e) => setData('detail_alamat', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#006B61]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Berkas Dokumen (Opsional Ganti) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <FileText className="w-5 h-5 text-[#006B61]" />
            <h2 className="text-base font-bold text-[#10264F] font-heading">
              3. Berkas Dokumen Pendukung (Opsional jika ingin mengganti)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Foto KTP */}
            <div className="p-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#10264F]">Ganti Foto KTP</span>
                <span className="text-[10px] text-[#68748A]">Maks. 5 MB</span>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setData('foto_ktp', file);
                    setKtpName(file.name);
                  }
                }}
                className="w-full text-xs text-[#68748A] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E7F6EF] file:text-[#006B61]"
              />
              {ktpName && <p className="text-[11px] text-[#006B61] font-semibold">Dipilih: {ktpName}</p>}
            </div>

            {/* Foto KK */}
            <div className="p-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#10264F]">Ganti Foto Kartu Keluarga</span>
                <span className="text-[10px] text-[#68748A]">Maks. 5 MB</span>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setData('foto_kk', file);
                    setKkName(file.name);
                  }
                }}
                className="w-full text-xs text-[#68748A] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E7F6EF] file:text-[#006B61]"
              />
              {kkName && <p className="text-[11px] text-[#006B61] font-semibold">Dipilih: {kkName}</p>}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href={route('admin.warga.show', warga.id)}
            className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-slate-50 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#006B61] hover:bg-[#00554D] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan Data'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
