import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
  Home, 
  Users, 
  ArrowLeftRight, 
  FileText, 
  ShieldCheck, 
  UserCog, 
  LogOut, 
  X, 
  UserPlus, 
  Fingerprint, 
  FolderCheck, 
  User, 
  Building2, 
  Calendar, 
  Tag, 
  Phone, 
  Briefcase, 
  UploadCloud, 
  FileImage, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Info, 
  Save, 
  UserCheck, 
  HelpCircle, 
  ChevronRight,
  FileCheck,
  MapPin
} from 'lucide-react';

export default function WargaCreate({ auth }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    nik: '',
    no_kk: '',
    nama_lengkap: '',
    gender: 'L',
    tempat_lahir: 'Depok',
    tgl_lahir: '1995-01-01',
    agama: 'Islam',
    goldar: 'A',
    shdk: 'Kepala Keluarga',
    nama_jalan: 'Jl. Mawar',
    nomor_rumah: '',
    detail_alamat: '',
    status_domisili: 'Warga Tetap (Pemilik Rumah)',
    no_wa: '',
    pekerjaan: '',
    foto_ktp: null,
    foto_kk: null,
    persetujuan: true,
  });

  const [activeTab, setActiveTab] = useState(1);
  const [nikCheckStatus, setNikCheckStatus] = useState({
    checked: false,
    loading: false,
    valid: false,
    message: '',
  });

  const [ktpPreviewName, setKtpPreviewName] = useState('');
  const [kkPreviewName, setKkPreviewName] = useState('');

  // Auto switch tab if errors exist
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      if (errors.nik || errors.no_kk || errors.nama_lengkap || errors.gender || errors.tempat_lahir || errors.tgl_lahir || errors.agama || errors.goldar || errors.shdk) {
        setActiveTab(1);
      } else if (errors.nama_jalan || errors.nomor_rumah || errors.detail_alamat || errors.status_domisili || errors.no_wa || errors.pekerjaan) {
        setActiveTab(2);
      } else if (errors.foto_ktp || errors.foto_kk) {
        setActiveTab(3);
      }
    }
  }, [errors]);

  // Handle NIK live check via backend AJAX
  const handleCheckNik = async () => {
    if (!data.nik || data.nik.length !== 16) {
      setNikCheckStatus({
        checked: true,
        loading: false,
        valid: false,
        message: 'NIK harus berjumlah tepat 16 digit angka.',
      });
      return;
    }

    setNikCheckStatus({ checked: false, loading: true, valid: false, message: 'Memeriksa...' });
    try {
      const res = await fetch(`/admin/warga/check-nik?nik=${data.nik}`);
      const result = await res.json();
      setNikCheckStatus({
        checked: true,
        loading: false,
        valid: result.valid,
        message: result.message,
      });
    } catch (err) {
      setNikCheckStatus({
        checked: true,
        loading: false,
        valid: false,
        message: 'Gagal memeriksa NIK, periksa koneksi server.',
      });
    }
  };

  const handleKtpUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('foto_ktp', file);
      setKtpPreviewName(file.name);
    }
  };

  const handleKkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('foto_kk', file);
      setKkPreviewName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.persetujuan) {
      alert('Silakan centang pernyataan verifikasi berkas terlebih dahulu di Langkah 3.');
      setActiveTab(3);
      return;
    }

    post(route('admin.warga.store'), {
      forceFormData: true,
      preserveScroll: true,
      onError: (errs) => {
        if (errs.nik || errs.no_kk || errs.nama_lengkap || errs.gender || errs.tempat_lahir || errs.tgl_lahir || errs.agama || errs.goldar || errs.shdk) {
          setActiveTab(1);
        } else if (errs.nama_jalan || errs.nomor_rumah || errs.detail_alamat || errs.status_domisili || errs.no_wa || errs.pekerjaan) {
          setActiveTab(2);
        } else if (errs.foto_ktp || errs.foto_kk) {
          setActiveTab(3);
        }
      },
    });
  };

  return (
    <AdminLayout
      title="Data Warga & Kependudukan"
      description="Kelola basis data penduduk, verifikasi domisili, dan kepemilikan rumah RT 01/08."
      breadcrumbs={[
        { label: 'Layanan Administrasi', href: route('admin.dashboard') },
        { label: 'Data Warga', href: route('admin.warga.index') },
        { label: 'Tambah Data Warga' },
      ]}
    >
      <Head title="Tambah Data Warga Baru - SIA RT 01/08 Sukatani" />

      {/* ================= MODAL DIALOG CONTAINER SLICING DARI CODE.HTML ================= */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#022448]/40 backdrop-blur-sm transition-all duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#EAEFF5] bg-[#F8FAFC] flex items-start justify-between shrink-0">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E6F6F4] border border-[#0d9488]/20 text-[#0d9488] flex items-center justify-center shrink-0 mt-0.5">
                  <UserPlus className="w-5 h-5 text-[#0d9488]" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-lg font-bold text-[#1A253C] font-heading tracking-tight">
                      Tambah Data Warga Baru — RT 01/08 Sukatani
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                      Formulir Resmi
                    </span>
                  </div>
                  <p className="text-xs text-[#718096] mt-0.5 leading-relaxed">
                    Masukkan data identitas kependudukan, nomor KK, dan status domisili warga untuk integrasi basis data rukun tetangga.
                  </p>
                </div>
              </div>

              {/* Close Button: Link Back to Warga Index */}
              <Link
                href={route('admin.warga.index')}
                className="text-[#A0AEC0] hover:text-[#1A253C] p-1.5 rounded-lg hover:bg-[#EDF2F7] transition-colors"
                title="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </Link>
            </div>

            {/* Stepper Tabs Indicator (3 Langkah) */}
            <div className="px-6 py-3 bg-white border-b border-[#EAEFF5] shrink-0">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {/* Step 1 */}
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className={`flex items-center gap-2.5 text-left transition-all ${
                    activeTab === 1 ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shadow-xs transition-colors ${
                    activeTab === 1 ? 'bg-[#0d9488] text-white' : 'bg-[#E2E8F0] text-[#4A5568]'
                  }`}>
                    1
                  </span>
                  <div>
                    <span className={`block text-xs font-bold leading-tight ${
                      activeTab === 1 ? 'text-[#0d9488]' : 'text-[#1A253C]'
                    }`}>
                      Data Identitas Warga
                    </span>
                    <span className="block text-[10px] text-[#A0AEC0]">
                      NIK, Nama, & Keluarga
                    </span>
                  </div>
                </button>

                <div className="h-0.5 w-10 sm:w-16 bg-[#E2E8F0]" />

                {/* Step 2 */}
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className={`flex items-center gap-2.5 text-left transition-all ${
                    activeTab === 2 ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${
                    activeTab === 2 ? 'bg-[#0d9488] text-white' : 'bg-[#E2E8F0] text-[#4A5568]'
                  }`}>
                    2
                  </span>
                  <div>
                    <span className={`block text-xs font-bold leading-tight ${
                      activeTab === 2 ? 'text-[#0d9488]' : 'text-[#1A253C]'
                    }`}>
                      Alamat & Hunian
                    </span>
                    <span className="block text-[10px] text-[#A0AEC0]">
                      Jalan, No. Rumah & Status
                    </span>
                  </div>
                </button>

                <div className="h-0.5 w-10 sm:w-16 bg-[#E2E8F0]" />

                {/* Step 3 */}
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className={`flex items-center gap-2.5 text-left transition-all ${
                    activeTab === 3 ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${
                    activeTab === 3 ? 'bg-[#0d9488] text-white' : 'bg-[#E2E8F0] text-[#4A5568]'
                  }`}>
                    3
                  </span>
                  <div>
                    <span className={`block text-xs font-bold leading-tight ${
                      activeTab === 3 ? 'text-[#0d9488]' : 'text-[#1A253C]'
                    }`}>
                      Dokumen Pendukung
                    </span>
                    <span className="block text-[10px] text-[#A0AEC0]">
                      KTP & Kartu Keluarga
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Notification Banner if any validation errors occur */}
            {Object.keys(errors).length > 0 && (
              <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Mohon periksa kembali formulir:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                    {Object.values(errors).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ================= FORM DENGAN ACTIONS BAR DI DALAMNYA ================= */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 custom-scrollbar">
                {/* SECTION 1: IDENTITAS KEPENDUDUKAN */}
                <div className={activeTab === 1 ? 'block' : 'hidden'}>
                  <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-[#0d9488]" />
                      <h3 className="text-sm font-bold text-[#1A253C]">
                        1. Identitas Kependudukan
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
                      * Wajib diisi sesuai KTP
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* NIK Input with Live AJAX Verification Check */}
                    <div className="md:col-span-7">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="nik">
                        Nomor Induk Kependudukan (NIK) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <Fingerprint className="w-4 h-4" />
                        </div>
                        <input
                          id="nik"
                          type="text"
                          maxLength={16}
                          value={data.nik}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setData('nik', val);
                            setNikCheckStatus({ checked: false, loading: false, valid: false, message: '' });
                          }}
                          placeholder="32760xxxxxxxxxxx (16 digit)"
                          className={`w-full pl-9 pr-24 py-2 text-xs bg-white border rounded-xl text-[#1A253C] font-mono focus:outline-none transition-all ${
                            errors.nik 
                              ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                              : 'border-[#CBD5E1] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleCheckNik}
                          disabled={nikCheckStatus.loading}
                          className="absolute right-1.5 px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0d9488] font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 border border-[#CBD5E1]"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#0d9488]" />
                          <span>{nikCheckStatus.loading ? 'Cek...' : 'Cek NIK'}</span>
                        </button>
                      </div>

                      {/* Status Feedback NIK */}
                      {nikCheckStatus.checked && (
                        <p className={`text-[11px] flex items-center gap-1 mt-1.5 font-medium ${
                          nikCheckStatus.valid ? 'text-[#0f766e]' : 'text-red-600'
                        }`}>
                          {nikCheckStatus.valid ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0f766e] shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          )}
                          <span>{nikCheckStatus.message}</span>
                        </p>
                      )}
                      {errors.nik && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.nik}</p>
                      )}
                    </div>

                    {/* Nomor Kartu Keluarga (KK) */}
                    <div className="md:col-span-5">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="no_kk">
                        Nomor Kartu Keluarga (KK) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <FolderCheck className="w-4 h-4" />
                        </div>
                        <input
                          id="no_kk"
                          type="text"
                          maxLength={16}
                          value={data.no_kk}
                          onChange={(e) => setData('no_kk', e.target.value.replace(/\D/g, ''))}
                          placeholder="Nomor KK 16 digit"
                          className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl text-[#1A253C] font-mono focus:outline-none transition-all ${
                            errors.no_kk
                              ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                              : 'border-[#CBD5E1] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20'
                          }`}
                        />
                      </div>
                      {errors.no_kk && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.no_kk}</p>
                      )}
                    </div>

                    {/* Nama Lengkap Sesuai KTP */}
                    <div className="md:col-span-8">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="nama_lengkap">
                        Nama Lengkap (sesuai KTP) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="nama_lengkap"
                          type="text"
                          value={data.nama_lengkap}
                          onChange={(e) => setData('nama_lengkap', e.target.value)}
                          placeholder="Contoh: Muhammad Reza Pratama"
                          className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl text-[#1A253C] focus:outline-none transition-all ${
                            errors.nama_lengkap
                              ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                              : 'border-[#CBD5E1] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20'
                          }`}
                        />
                      </div>
                      {errors.nama_lengkap && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.nama_lengkap}</p>
                      )}
                    </div>

                    {/* Jenis Kelamin: Radio Toggle */}
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 h-[38px]">
                        <label className={`flex items-center justify-center gap-1.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          data.gender === 'L'
                            ? 'border-[#0d9488] bg-[#0d9488]/5 text-[#0d9488]'
                            : 'border-[#CBD5E1] bg-white text-[#4A5568] hover:bg-[#F8FAFC]'
                        }`}>
                          <input
                            type="radio"
                            name="gender"
                            value="L"
                            checked={data.gender === 'L'}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="text-[#0d9488] focus:ring-[#0d9488]/30 h-3.5 w-3.5"
                          />
                          <span>Laki-laki</span>
                        </label>
                        <label className={`flex items-center justify-center gap-1.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          data.gender === 'P'
                            ? 'border-[#0d9488] bg-[#0d9488]/5 text-[#0d9488]'
                            : 'border-[#CBD5E1] bg-white text-[#4A5568] hover:bg-[#F8FAFC]'
                        }`}>
                          <input
                            type="radio"
                            name="gender"
                            value="P"
                            checked={data.gender === 'P'}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="text-[#0d9488] focus:ring-[#0d9488]/30 h-3.5 w-3.5"
                          />
                          <span>Perempuan</span>
                        </label>
                      </div>
                    </div>

                    {/* Tempat Lahir */}
                    <div className="md:col-span-6">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="tempat_lahir">
                        Tempat Lahir <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <input
                          id="tempat_lahir"
                          type="text"
                          value={data.tempat_lahir}
                          onChange={(e) => setData('tempat_lahir', e.target.value)}
                          placeholder="Contoh: Depok"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                        />
                      </div>
                      {errors.tempat_lahir && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.tempat_lahir}</p>
                      )}
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="md:col-span-6">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="tgl_lahir">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          id="tgl_lahir"
                          type="date"
                          value={data.tgl_lahir}
                          onChange={(e) => setData('tgl_lahir', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                        />
                      </div>
                      {errors.tgl_lahir && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.tgl_lahir}</p>
                      )}
                    </div>

                    {/* Agama */}
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="agama">
                        Agama <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="agama"
                        value={data.agama}
                        onChange={(e) => setData('agama', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                      >
                        <option>Islam</option>
                        <option>Kristen Protestan</option>
                        <option>Katolik</option>
                        <option>Hindu</option>
                        <option>Buddha</option>
                        <option>Konghucu</option>
                      </select>
                    </div>

                    {/* Golongan Darah */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="goldar">
                        Gol. Darah
                      </label>
                      <select
                        id="goldar"
                        value={data.goldar}
                        onChange={(e) => setData('goldar', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                      >
                        <option>O</option>
                        <option>A</option>
                        <option>B</option>
                        <option>AB</option>
                        <option>Tidak Tahu</option>
                      </select>
                    </div>

                    {/* Status Hubungan Keluarga (SHDK) */}
                    <div className="md:col-span-5">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="shdk">
                        Status Hubungan Keluarga <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="shdk"
                        value={data.shdk}
                        onChange={(e) => setData('shdk', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                      >
                        <option>Kepala Keluarga</option>
                        <option>Istri</option>
                        <option>Anak</option>
                        <option>Orang Tua / Mertua</option>
                        <option>Famili Lain</option>
                      </select>
                    </div>
                  </div>

                  {/* Tombol Lanjut ke Step 2 */}
                  <div className="pt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab(2)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <span>Lanjut ke Alamat & Hunian</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* SECTION 2: ALAMAT & STATUS HUNIAN */}
                <div className={activeTab === 2 ? 'block' : 'hidden'}>
                  <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-[#0d9488]" />
                      <h3 className="text-sm font-bold text-[#1A253C]">
                        2. Alamat & Status Hunian di RT 01/08
                      </h3>
                    </div>
                    <span className="text-xs text-[#0d9488] font-semibold">
                      Kelurahan Sukatani, Tapos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Nama Jalan / Gang */}
                    <div className="md:col-span-7">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="nama_jalan">
                        Nama Jalan / Gang <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <MapPin className="w-4 h-4 text-[#0d9488]" />
                        </div>
                        <input
                          id="nama_jalan"
                          type="text"
                          list="daftarJalan"
                          value={data.nama_jalan}
                          onChange={(e) => setData('nama_jalan', e.target.value)}
                          placeholder="Pilih atau ketik, cth: Jl. Mawar / Gang Saanan"
                          className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl text-[#1A253C] font-medium focus:outline-none transition-all ${
                            errors.nama_jalan
                              ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                              : 'border-[#CBD5E1] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20'
                          }`}
                        />
                        <datalist id="daftarJalan">
                          <option value="Jl. Melati (Blok A)" />
                          <option value="Jl. Mawar (Blok B)" />
                          <option value="Jl. Anggrek (Blok C)" />
                          <option value="Jl. Kenanga (Blok D)" />
                          <option value="Jl. Sukatani Raya" />
                          <option value="Gang H. Saanan" />
                          <option value="Gang Mushola" />
                        </datalist>
                      </div>
                      {errors.nama_jalan && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.nama_jalan}</p>
                      )}
                    </div>

                    {/* Nomor Rumah */}
                    <div className="md:col-span-5">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="nomor_rumah">
                        Nomor Rumah <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <Tag className="w-4 h-4" />
                        </div>
                        <input
                          id="nomor_rumah"
                          type="text"
                          value={data.nomor_rumah}
                          onChange={(e) => setData('nomor_rumah', e.target.value)}
                          placeholder="Contoh: No. 12 atau No. 14B"
                          className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl text-[#1A253C] font-semibold focus:outline-none transition-all ${
                            errors.nomor_rumah
                              ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                              : 'border-[#CBD5E1] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20'
                          }`}
                        />
                      </div>
                      {errors.nomor_rumah && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.nomor_rumah}</p>
                      )}
                    </div>

                    {/* Detail Alamat (Opsional) */}
                    <div className="md:col-span-12">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="detail_alamat">
                        Detail Alamat <span className="text-[#718096] text-[11px] font-normal">(Opsional)</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <Home className="w-4 h-4" />
                        </div>
                        <input
                          id="detail_alamat"
                          type="text"
                          value={data.detail_alamat}
                          onChange={(e) => setData('detail_alamat', e.target.value)}
                          placeholder="Contoh: Samping Pos Ronda / Pagar Putih / Sebelah Warung Bu Siti"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                        />
                      </div>
                      <span className="text-[10px] text-[#A0AEC0] mt-1 block">
                        Patokan atau informasi tambahan letak hunian di wilayah RT 01.
                      </span>
                    </div>

                    {/* Status Domisili / Kepemilikan */}
                    <div className="md:col-span-6">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="status_domisili">
                        Status Domisili Hunian <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="status_domisili"
                        value={data.status_domisili}
                        onChange={(e) => setData('status_domisili', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                      >
                        <option>Warga Tetap (Pemilik Rumah)</option>
                        <option>Sewa / Kontrak Tahunan</option>
                        <option>Sewa / Kontrak Bulanan</option>
                        <option>Kos Karyawan</option>
                        <option>Menumpang Keluarga</option>
                      </select>
                    </div>

                    {/* Nomor WhatsApp / Telepon */}
                    <div className="md:col-span-6">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="no_wa">
                        Nomor WhatsApp Aktif
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#25D366]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          id="no_wa"
                          type="tel"
                          value={data.no_wa}
                          onChange={(e) => setData('no_wa', e.target.value)}
                          placeholder="081234567890"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                        />
                      </div>
                      <span className="text-[10px] text-[#A0AEC0] mt-1 block">
                        Digunakan untuk kirim notifikasi iuran dan surat pengantar digital.
                      </span>
                    </div>

                    {/* Pekerjaan */}
                    <div className="md:col-span-6">
                      <label className="block text-xs font-semibold text-[#1A253C] mb-1.5" htmlFor="pekerjaan">
                        Pekerjaan / Profesi
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A0AEC0]">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <input
                          id="pekerjaan"
                          type="text"
                          value={data.pekerjaan}
                          onChange={(e) => setData('pekerjaan', e.target.value)}
                          placeholder="Contoh: Karyawan Swasta / Wiraswasta"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl text-[#1A253C] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tombol Navigasi Step 2 */}
                  <div className="pt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab(1)}
                      className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#4A5568] hover:bg-[#F8FAFC] text-xs font-semibold transition-all cursor-pointer"
                    >
                      Kembali ke Step 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab(3)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <span>Lanjut ke Dokumen Pendukung</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* SECTION 3: DOKUMEN PENDUKUNG (UPLOAD DROPZONES) */}
                <div className={activeTab === 3 ? 'block' : 'hidden'}>
                  <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#EAEFF5]">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 text-[#0d9488]" />
                      <h3 className="text-sm font-bold text-[#1A253C]">
                        3. Dokumen Pendukung (Arsip Kependudukan)
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-[#A0AEC0] uppercase">
                      Format JPG / PNG / PDF (Maks. 5MB)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Dropzone 1: Foto KTP */}
                    <label className="border-2 border-dashed border-[#0d9488]/40 hover:border-[#0d9488] bg-[#F0FDF4]/30 hover:bg-[#F0FDF4]/60 rounded-2xl p-5 text-center transition-all cursor-pointer group flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleKtpUpload}
                        className="hidden"
                      />
                      <div className="w-11 h-11 rounded-full bg-[#CCFBF1] text-[#0d9488] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <FileImage className="w-5 h-5 text-[#0d9488]" />
                      </div>
                      <div className="text-xs font-bold text-[#1A253C] group-hover:text-[#0d9488] transition-colors">
                        Unggah Foto KTP Pemohon (Opsional)
                      </div>
                      <p className="text-[11px] text-[#718096] mt-0.5">
                        {ktpPreviewName ? (
                          <span className="text-[#0d9488] font-semibold">{ktpPreviewName}</span>
                        ) : (
                          <>Tarik & lepas file atau <span className="text-[#0d9488] font-semibold underline">pilih dari berkas</span></>
                        )}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 bg-white rounded-full border border-[#CBD5E1] text-[10px] font-medium text-[#4A5568] shadow-xs">
                        <Lock className="w-3 h-3 text-[#0f766e]" />
                        <span>Tersimpan aman dengan enkripsi RT</span>
                      </div>
                    </label>

                    {/* Dropzone 2: Foto Kartu Keluarga */}
                    <label className="border-2 border-dashed border-[#CBD5E1] hover:border-[#0d9488] bg-[#F8FAFC] hover:bg-[#F0FDF4]/30 rounded-2xl p-5 text-center transition-all cursor-pointer group flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleKkUpload}
                        className="hidden"
                      />
                      <div className="w-11 h-11 rounded-full bg-[#E2E8F0] text-[#718096] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <FileCheck className="w-5 h-5 text-[#718096]" />
                      </div>
                      <div className="text-xs font-bold text-[#1A253C] group-hover:text-[#0d9488] transition-colors">
                        Unggah Salinan Kartu Keluarga (KK) (Opsional)
                      </div>
                      <p className="text-[11px] text-[#718096] mt-0.5">
                        {kkPreviewName ? (
                          <span className="text-[#0d9488] font-semibold">{kkPreviewName}</span>
                        ) : (
                          <>Tarik & lepas file atau <span className="text-[#0d9488] font-semibold underline">pilih dari berkas</span></>
                        )}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 bg-white rounded-full border border-[#CBD5E1] text-[10px] font-medium text-[#718096] shadow-xs">
                        <span>Halaman penuh jelas terbaca</span>
                      </div>
                    </label>
                  </div>

                  {/* Checkbox Persetujuan Data Pribadi */}
                  <div className="mt-5 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="persetujuan"
                      checked={data.persetujuan}
                      onChange={(e) => setData('persetujuan', e.target.checked)}
                      className="mt-0.5 rounded text-[#0d9488] focus:ring-[#0d9488]/30 h-4 w-4 border-[#CBD5E1]"
                    />
                    <label htmlFor="persetujuan" className="text-xs text-[#4A5568] leading-relaxed cursor-pointer select-none">
                      Saya menyatakan dengan sesungguhnya bahwa data identitas warga di atas telah diverifikasi sesuai berkas fisik asli, dan didaftarkan sebagai warga binaan RT 01 / RW 08 Sukatani, Tapos, Depok.
                    </label>
                  </div>

                  {/* Tombol Navigasi Step 3 */}
                  <div className="pt-6 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setActiveTab(2)}
                      className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#4A5568] hover:bg-[#F8FAFC] text-xs font-semibold transition-all cursor-pointer"
                    >
                      Kembali ke Step 2
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Actions Bar (Sticky Bottom) - Inside Form */}
              <div className="px-6 py-4 bg-white border-t border-[#EAEFF5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs text-[#718096]">
                  <Info className="w-4 h-4 text-[#A0AEC0]" />
                  <span>Warga baru otomatis tercatat pada buku induk RT.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {/* Batal / Kembali Button */}
                  <Link
                    href={route('admin.warga.index')}
                    className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#4A5568] hover:bg-[#F8FAFC] active:scale-95 text-xs font-semibold transition-all text-center w-full sm:w-auto"
                  >
                    Batal / Kembali
                  </Link>

                  {/* Simpan Draf Button */}
                  <button
                    type="button"
                    onClick={() => alert('Draf data berhasil disimpan sementara pada peramban.')}
                    className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-[#1A253C] hover:bg-[#F8FAFC] active:scale-95 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#718096]" />
                    <span>Simpan Draf</span>
                  </button>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 w-full sm:w-auto focus:ring-4 focus:ring-[#0d9488]/20 disabled:opacity-50 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{processing ? 'Menyimpan...' : 'Simpan Data Warga'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
    </AdminLayout>
  );
}
