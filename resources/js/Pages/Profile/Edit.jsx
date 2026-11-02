import React, { useState, useRef } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import WargaLayout from '@/Layouts/WargaLayout';
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Home, 
  CreditCard, 
  ArrowLeft, 
  Upload, 
  Save, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function Edit({ mustVerifyEmail, status, profile }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  
  // URL param or internal mode toggle ('profile' | 'photo')
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'photo') return 'photo';
    }
    return 'profile';
  });

  // State for photo preview
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoSavedSuccess, setPhotoSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const { data, setData, patch, processing, errors, reset, recentlySuccessful } = useForm({
    name: profile?.name || user?.name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '0812 3456 7890',
    address: profile?.address || 'Jl. Sukatani Raya No. 18',
  });

  const getInitials = (name) => {
    if (!name) return 'BS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    patch(route('profile.update'), {
      preserveScroll: true,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoPreview(uploadEvent.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e) => {
    e.preventDefault();
    setPhotoSavedSuccess(true);
    setTimeout(() => {
      setPhotoSavedSuccess(false);
      setMode('profile');
    }, 1200);
  };

  // Adaptive layout based on user role
  const isWarga = user?.role === 'warga';
  const Layout = isWarga ? WargaLayout : AdminLayout;

  const breadcrumbs = isWarga 
    ? [] 
    : [
        { label: 'Beranda', href: route('dashboard') },
        { label: 'Profil Saya' }
      ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title={mode === 'photo' ? 'Ganti Foto Profil - SIA Sukatani' : 'Edit Profil Saya - SIA Sukatani'} />

      <div className="space-y-6 max-w-[1080px]">
        {/* ================= VIEW 1: EDIT PROFIL SAYA ================= */}
        {mode === 'profile' && (
          <div className="space-y-6">
            {/* Header Area */}
            <div> 
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A253C] font-heading tracking-tight">
                Edit profil saya
              </h1>
              <p className="text-xs sm:text-sm text-[#718096] mt-1">
                Perbarui informasi pribadi yang digunakan dalam administrasi RT.
              </p>
            </div>

            {/* Flash Status Feedback */}
            {(recentlySuccessful || status === 'profile-updated') && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Informasi profil berhasil diperbarui.</span>
              </div>
            )}

            {/* Main Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              {/* Card Section Header */}
              <div className="border-b border-[#EAEFF5] pb-4">
                <h3 className="text-sm font-bold text-[#1A253C] font-heading">
                  Informasi profil
                </h3>
                <p className="text-xs text-[#718096] mt-0.5">
                  Pastikan informasi yang tercantum sudah benar dan aktif.
                </p>
              </div>

              {/* Avatar & User Meta Row */}
              <div className="flex items-center gap-4 pb-6 border-b border-[#EAEFF5]">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Foto Profil"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#EAF0FC] text-[#2F65CB] flex items-center justify-center font-bold text-xl font-heading flex-shrink-0">
                    {getInitials(data.name)}
                  </div>
                )}
                <div className="space-y-0.5">
                  <h4 className="text-base font-bold text-[#1A253C] font-heading leading-tight">
                    {data.name || 'Budi Santoso'}
                  </h4>
                  <p className="text-xs text-[#718096]">
                    {profile?.role_label || 'Ketua RT 01 / RW 08'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode('photo')}
                    className="text-xs font-semibold text-[#0E8F84] hover:underline pt-0.5 cursor-pointer block"
                  >
                    Ganti foto profil
                  </button>
                </div>
              </div>

              {/* Form Input Grid */}
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1A253C]">
                      Nama lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#9AA5B5] pointer-events-none">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nama lengkap"
                        className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[#D9DFE8] bg-white text-[#1A253C] focus:outline-none focus:ring-2 focus:ring-[#006B61]/20 focus:border-[#006B61] transition-all"
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Jabatan */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1A253C]">
                      Jabatan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#9AA5B5] pointer-events-none">
                        <Briefcase className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={profile?.role_label || (user?.role === 'ketua_rt' ? 'Ketua RT' : 'Warga RT 01')}
                        readOnly
                        disabled
                        className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[#D9DFE8] bg-[#F8FAFC] text-[#566175] cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Nomor WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1A253C]">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#9AA5B5] pointer-events-none">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="0812 3456 7890"
                        className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[#D9DFE8] bg-white text-[#1A253C] focus:outline-none focus:ring-2 focus:ring-[#006B61]/20 focus:border-[#006B61] transition-all"
                        required
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Alamat Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1A253C]">
                      Alamat email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#9AA5B5] pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="alamat@email.com"
                        className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[#D9DFE8] bg-white text-[#1A253C] focus:outline-none focus:ring-2 focus:ring-[#006B61]/20 focus:border-[#006B61] transition-all"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Alamat Tempat Tinggal */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1A253C]">
                      Alamat tempat tinggal
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#9AA5B5] pointer-events-none">
                        <Home className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Jl. Sukatani Raya No. 18"
                        className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[#D9DFE8] bg-white text-[#1A253C] focus:outline-none focus:ring-2 focus:ring-[#006B61]/20 focus:border-[#006B61] transition-all"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-xs text-red-600 mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Nomor Induk Kependudukan */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1A253C]">
                      Nomor Induk Kependudukan
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#9AA5B5] pointer-events-none">
                        <CreditCard className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={profile?.nik || '3276••••••••0182'}
                        readOnly
                        disabled
                        className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[#D9DFE8] bg-[#F8FAFC] text-[#566175] cursor-not-allowed select-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 border-t border-[#EAEFF5] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="px-5 py-2.5 rounded-xl border border-[#D5DCE6] bg-white hover:bg-slate-50 text-xs font-semibold text-[#4B5563] shadow-sm transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2.5 rounded-xl bg-[#00655C] hover:bg-[#005049] text-white text-xs font-semibold shadow-sm inline-flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{processing ? 'Menyimpan...' : 'Simpan profil'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: GANTI FOTO PROFIL ================= */}
        {mode === 'photo' && (
          <div className="space-y-6">
            {/* Nav Back to Profile */}
            <div>
              <button
                type="button"
                onClick={() => setMode('profile')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E8F84] hover:underline cursor-pointer mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke profil</span>
              </button>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A253C] font-heading tracking-tight">
                Ganti foto profil
              </h1>
              <p className="text-xs sm:text-sm text-[#718096] mt-1">
                Gunakan foto yang jelas agar mudah dikenali oleh pengurus dan warga.
              </p>
            </div>

            {/* Flash Feedback */}
            {photoSavedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Foto profil baru berhasil disimpan.</span>
              </div>
            )}

            {/* Main Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-8">
              {/* Card Section Header */}
              <div className="border-b border-[#EAEFF5] pb-4">
                <h3 className="text-sm font-bold text-[#1A253C] font-heading">
                  Foto profil baru
                </h3>
                <p className="text-xs text-[#718096] mt-0.5">
                  Format JPG atau PNG dengan ukuran maksimal 5MB.
                </p>
              </div>

              {/* Photo Upload Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Avatar Circle Preview */}
                <div className="lg:col-span-5 flex justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Pratinjau foto profil baru"
                      className="w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-8 border-white shadow-xl ring-1 ring-[#D9DFE8]"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#EAF0FC] text-[#2F65CB] flex items-center justify-center font-bold text-4xl sm:text-5xl font-heading border-8 border-white shadow-xl ring-1 ring-[#D9DFE8]">
                      {getInitials(data.name)}
                    </div>
                  )}
                </div>

                {/* Right: Dropzone & Tips */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Dropzone Container */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 sm:p-10 rounded-2xl border-2 border-dashed border-[#7BD4C9] bg-[#F0FAF8] hover:bg-[#E6F6F2] hover:border-[#0E8F84] transition-all text-center cursor-pointer space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center mx-auto text-[#0E8F84] group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A253C] font-heading">
                        Unggah foto dari perangkat
                      </h4>
                      <p className="text-xs text-[#718096] mt-0.5">
                        Klik untuk memilih berkas JPG atau PNG
                      </p>
                    </div>
                  </div>

                  {/* Tips foto yang baik */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E9EFF6] space-y-2 text-xs">
                    <h5 className="font-bold text-[#1A253C] text-xs">
                      Tips foto yang baik
                    </h5>
                    <ul className="text-[#718096] space-y-1 pl-1 list-disc list-inside">
                      <li>Gunakan foto wajah terbaru.</li>
                      <li>Pastikan pencahayaan cukup terang.</li>
                      <li>Posisikan wajah di tengah lingkaran.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-[#EAEFF5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setMode('profile');
                  }}
                  className="px-5 py-2.5 rounded-xl border border-[#D5DCE6] bg-white hover:bg-slate-50 text-xs font-semibold text-[#4B5563] shadow-sm transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSavePhoto}
                  className="px-5 py-2.5 rounded-xl bg-[#00655C] hover:bg-[#005049] text-white text-xs font-semibold shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan foto</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
