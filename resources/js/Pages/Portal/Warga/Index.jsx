import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { 
  Users, 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  Home, 
  Phone, 
  Briefcase, 
  Save, 
  User, 
  MapPin, 
  FileText 
} from 'lucide-react';

export default function WargaPortalIndex({ warga, flash }) {
  const [showNik, setShowNik] = useState(false);
  const [showKk, setShowKk] = useState(false);

  const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
    no_wa: warga?.no_wa || '',
    pekerjaan: warga?.pekerjaan || '',
    detail_alamat: warga?.detail_alamat || '',
    agama: warga?.agama || 'Islam',
    goldar: warga?.goldar || 'O',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('portal.warga.update'), {
      preserveScroll: true,
    });
  };

  const formatMask = (val) => {
    if (!val) return '••••••••••••••••';
    if (val.length >= 8) {
      return val.substring(0, 4) + '••••••••' + val.substring(val.length - 4);
    }
    return val;
  };

  return (
    <WargaLayout
      title="Data Kependudukan Saya"
      description="Data identitas resmi, alamat domisili RT 01/08, dan kontak mandiri Anda yang terdaftar pada sistem rukun tetangga."
      breadcrumbs={[
        { label: 'Beranda', href: route('portal.dashboard') },
        { label: 'Data Warga' },
      ]}
    >
      <Head title="Data Warga Saya - SIA Sukatani" />

      <div className="space-y-6 max-w-[1240px]">
        {/* Flash message sukses */}
        {(flash?.success || recentlySuccessful) && (
          <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-[#B6E6C5] flex items-start gap-3.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-[#14833B] flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-[#0D5B28]">Data Berhasil Diperbarui</p>
              <p className="text-[#14833B] mt-0.5 font-medium leading-relaxed">
                {flash?.success || 'Perubahan kontak dan data kependudukan mandiri Anda telah tersimpan.'}
              </p>
            </div>
          </div>
        )}

        {/* Banner Proteksi Privasi */}
        <div className="p-4 rounded-2xl bg-[#EEF4FF] border border-[#C8DCFF] flex items-start gap-3.5">
          <Lock className="w-4 h-4 text-[#2F65CB] flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-[#10264F]">Privasi & Keamanan Data Warga</p>
            <p className="text-[#43474E] mt-0.5 leading-relaxed">
              Nomor Induk Kependudukan (NIK) dan No. KK disensor demi keamanan. Klik ikon mata untuk melihat data lengkap.
            </p>
          </div>
        </div>

        {/* ================= KARTU IDENTITAS RESMI (VIEW ONLY RESMI DUKCAPIL) ================= */}
        <div className="bg-white rounded-2xl border border-[#E9EFF6] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EAEFF5] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#0E8F84]" />
              <h3 className="font-bold text-sm text-[#1A253C]">Identitas Kependudukan Resmi</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7EE] text-[#14833B] border border-[#B7E7D2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Status: {warga?.status_administrasi || 'Aktif'}
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {/* NIK */}
            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Nomor Induk Kependudukan (NIK)</span>
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-[#1A253C]">
                <span>{showNik ? warga?.nik : formatMask(warga?.nik)}</span>
                <button
                  type="button"
                  onClick={() => setShowNik(!showNik)}
                  className="text-[#718096] hover:text-[#0E8F84] transition-colors p-1"
                  title={showNik ? "Sembunyikan NIK" : "Tampilkan NIK"}
                >
                  {showNik ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* No. KK */}
            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Nomor Kartu Keluarga (KK)</span>
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-[#1A253C]">
                <span>{showKk ? warga?.no_kk : formatMask(warga?.no_kk)}</span>
                <button
                  type="button"
                  onClick={() => setShowKk(!showKk)}
                  className="text-[#718096] hover:text-[#0E8F84] transition-colors p-1"
                  title={showKk ? "Sembunyikan No KK" : "Tampilkan No KK"}
                >
                  {showKk ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nama Lengkap */}
            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Nama Lengkap (Sesuai KTP)</span>
              <p className="font-bold text-sm text-[#1A253C]">{warga?.nama_lengkap || '-'}</p>
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Jenis Kelamin</span>
              <p className="font-semibold text-[#1A253C]">
                {warga?.gender === 'L' || warga?.jenis_kelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
              </p>
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Tempat, Tanggal Lahir</span>
              <p className="font-semibold text-[#1A253C]">
                {warga?.tempat_lahir || 'Depok'}, {warga?.tgl_lahir || warga?.tanggal_lahir || '-'}
              </p>
            </div>

            {/* Hubungan Keluarga (SHDK) */}
            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Status Hubungan Keluarga (SHDK)</span>
              <p className="font-semibold text-[#1A253C]">{warga?.shdk || 'Kepala Keluarga'}</p>
            </div>
          </div>
        </div>

        {/* ================= ALAMAT & STATUS DOMISILI RT 01/08 ================= */}
        <div className="bg-white rounded-2xl border border-[#E9EFF6] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EAEFF5] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#0E8F84]" />
              <h3 className="font-bold text-sm text-[#1A253C]">Alamat & Status Domisili Wilayah RT 01 / RW 08</h3>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#EAF7EE] text-[#14833B] border border-[#B7E7D2]">
              {warga?.status_domisili || 'Warga Tetap'}
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Nama Jalan / Blok</span>
              <p className="font-semibold text-[#1A253C]">{warga?.nama_jalan || warga?.blok_rumah || 'Jl. Mawar'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Nomor Rumah</span>
              <p className="font-semibold text-[#1A253C]">{warga?.nomor_rumah || 'No. 12'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Rukun Tetangga / RW</span>
              <p className="font-semibold text-[#1A253C]">RT 01 / RW 08 Sukatani, Tapos</p>
            </div>

            <div className="col-span-full space-y-1">
              <span className="text-[#718096] text-[11px] font-medium block">Alamat Lengkap Kependudukan</span>
              <p className="font-semibold text-[#1A253C]">
                {warga?.alamat_lengkap || `${warga?.nama_jalan || 'Jl. Mawar'} ${warga?.nomor_rumah || 'No. 12'}, RT 01 / RW 08, Kelurahan Sukatani, Kecamatan Tapos, Kota Depok`}
              </p>
            </div>
          </div>
        </div>

        {/* ================= FORM PEMBARUAN DATA MANDIRI (KONTAK & PEKERJAAN) ================= */}
        <div className="bg-white rounded-2xl border border-[#E9EFF6] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EAEFF5] bg-[#F8FAFC]">
            <div className="flex items-center gap-2.5">
              <Save className="w-4 h-4 text-[#0E8F84]" />
              <h3 className="font-bold text-sm text-[#1A253C]">Pembaruan Kontak & Data Mandiri</h3>
            </div>
            <p className="text-[11px] text-[#718096] mt-0.5">
              Anda dapat memperbarui nomor kontak aktif WhatsApp, pekerjaan, atau keterangan patokan tempat tinggal sewaktu-waktu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Nomor WhatsApp */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1A253C] block">
                  Nomor WhatsApp / Telepon Aktif
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-[#A0AEC0]" />
                  <input
                    type="text"
                    value={data.no_wa}
                    onChange={(e) => setData('no_wa', e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#0E8F84]/20 focus:border-[#0E8F84]"
                  />
                </div>
                {errors.no_wa && (
                  <p className="text-red-500 text-[11px]">{errors.no_wa}</p>
                )}
              </div>

              {/* Pekerjaan */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1A253C] block">
                  Pekerjaan / Profesi
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-2.5 text-[#A0AEC0]" />
                  <input
                    type="text"
                    value={data.pekerjaan}
                    onChange={(e) => setData('pekerjaan', e.target.value)}
                    placeholder="Contoh: Karyawan Swasta, Wiraswasta, PNS, dll"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#0E8F84]/20 focus:border-[#0E8F84]"
                  />
                </div>
                {errors.pekerjaan && (
                  <p className="text-red-500 text-[11px]">{errors.pekerjaan}</p>
                )}
              </div>

              {/* Agama */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1A253C] block">
                  Agama
                </label>
                <select
                  value={data.agama}
                  onChange={(e) => setData('agama', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#0E8F84]/20 focus:border-[#0E8F84]"
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
                <label className="font-semibold text-[#1A253C] block">
                  Golongan Darah
                </label>
                <select
                  value={data.goldar}
                  onChange={(e) => setData('goldar', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#0E8F84]/20 focus:border-[#0E8F84]"
                >
                  <option value="O">O</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>

              {/* Detail Alamat / Patokan */}
              <div className="col-span-full space-y-1.5">
                <label className="font-semibold text-[#1A253C] block">
                  Detail Alamat / Patokan Rumah (Opsional)
                </label>
                <input
                  type="text"
                  value={data.detail_alamat}
                  onChange={(e) => setData('detail_alamat', e.target.value)}
                  placeholder="Contoh: Depan Taman RT 01, Pagar Hitam, Samping Warung Bu Siti"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#0E8F84]/20 focus:border-[#0E8F84]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAEFF5] flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E8F84] hover:bg-[#0B756C] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </WargaLayout>
  );
}
