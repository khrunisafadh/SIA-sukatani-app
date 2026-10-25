import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
  Building2, 
  Home, 
  Users, 
  ArrowLeftRight, 
  FileText, 
  ShieldCheck, 
  UserCog, 
  LogOut, 
  Plus, 
  ChevronRight, 
  Search, 
  Eye, 
  EyeOff, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function WargaIndex({ wargas, filters, totalWarga, totalTetap, totalKontrak, auth, flash }) {
  const [search, setSearch] = useState(filters.search || '');
  const [statusHunian, setStatusHunian] = useState(filters.status_hunian || 'Semua');
  const [showNikIds, setShowNikIds] = useState([]);

  const toggleShowNik = (id) => {
    if (showNikIds.includes(id)) {
      setShowNikIds(showNikIds.filter(item => item !== id));
    } else {
      setShowNikIds([...showNikIds, id]);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    router.get(route('admin.warga.index'), {
      search: search,
      status_hunian: statusHunian !== 'Semua' ? statusHunian : undefined,
    }, { preserveState: true, replace: true });
  };

  const formatMask = (val) => {
    if (!val) return '';
    if (val.length >= 8) {
      return val.substring(0, 4) + '••••' + val.substring(val.length - 4);
    }
    return val;
  };

  return (
    <>
      <Head title="Data Warga & Kependudukan - SIA Sukatani" />

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

                {/* Beranda */}
                <Link
                  href={route('admin.dashboard')}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <Home className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Beranda</span>
                </Link>

                {/* Data Warga (ACTIVE STATE) */}
                <Link
                  href={route('admin.warga.index')}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#1C5F57] text-white text-xs font-semibold shadow-inner"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#89F5E7]" />
                    <span>Data Warga</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#89F5E7]" />
                </Link>

                {/* Pindah / Datang */}
                <a
                  href="#pindah-datang"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Pindah / Datang</span>
                </a>

                {/* Pengajuan Surat dengan Badge 2 */}
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
            <div className="p-3.5 rounded-2xl bg-[#1E665E]/90 border border-[#358A81] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#7BD4C9] flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-white">Keamanan data</p>
                <p className="text-[10px] text-[#A7D7D0] leading-relaxed">
                  Akses mengikuti matriks RBAC backend RT 01.
                </p>
              </div>
            </div>

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
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#0E8F84]">
                  ADMINISTRASI WARGA
                </span>
                <h2 className="text-[26px] font-bold text-[#1A253C] font-heading tracking-tight leading-tight">
                  Data Warga & Kependudukan
                </h2>
                <p className="text-xs text-[#718096]">
                  Kelola basis data penduduk, verifikasi domisili, dan kepemilikan rumah RT 01/08.
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

            {/* Flash Message Sukses Tambah Data Warga */}
            {flash?.success && (
              <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-[#B6E6C5] flex items-start gap-3.5 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#14833B] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#0D5B28]">Berhasil Menyimpan ke Database</p>
                  <p className="text-[#14833B] mt-0.5 font-medium leading-relaxed">
                    {flash.success}
                  </p>
                </div>
              </div>
            )}

            {/* Banner Proteksi Data Sensitif (Sesuai Figma) */}
            <div className="p-4 rounded-2xl bg-[#EEF4FF] border border-[#C8DCFF] flex items-start gap-3.5">
              <Lock className="w-4 h-4 text-[#2F65CB] flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-[#10264F]">Data sensitif dilindungi</p>
                <p className="text-[#43474E] mt-0.5 leading-relaxed">
                  NIK dan nomor Kartu Keluarga disensor secara default. Klik tombol mata untuk membuka detail lengkap sesuai hak akses pengurus RT.
                </p>
              </div>
            </div>

            {/* Filter & Search Bar Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E9EFF6] shadow-sm">
              <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A0AEC0]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, NIK, No. KK, atau nomor rumah..."
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#0E8F84]/20 focus:border-[#0E8F84] placeholder:text-[#A0AEC0]"
                  />
                </div>

                <div className="w-full sm:w-56">
                  <select
                    value={statusHunian}
                    onChange={(e) => setStatusHunian(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#0E8F84]/20 focus:border-[#0E8F84] text-[#4A5568]"
                  >
                    <option value="Semua">Semua Status Hunian</option>
                    <option value="Tetap">Warga Tetap (Pemilik)</option>
                    <option value="Kontrak">Sewa / Kontrak</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-[#1A253C] hover:bg-[#0F172A] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
              </form>
            </div>

            {/* Tabel Data Warga */}
            <div className="bg-white rounded-2xl border border-[#E9EFF6] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#EAEFF5] text-[11px] font-bold text-[#718096] uppercase tracking-wider">
                      <th className="py-3.5 px-6">Nama Warga</th>
                      <th className="py-3.5 px-6">NIK / Nomor KK</th>
                      <th className="py-3.5 px-6">Alamat Rumah</th>
                      <th className="py-3.5 px-6">Status Hunian</th>
                      <th className="py-3.5 px-6">Administrasi</th>
                      <th className="py-3.5 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F8] text-xs">
                    {wargas.data && wargas.data.length > 0 ? (
                      wargas.data.map((warga) => {
                        const isRevealed = showNikIds.includes(warga.id);
                        return (
                          <tr key={warga.id} className="hover:bg-[#FBFDFF] transition-colors">
                            {/* Nama Warga & Avatar */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#E7EEFB] text-[#2F65CB] font-bold text-xs flex items-center justify-center flex-shrink-0">
                                  {warga.nama_lengkap.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-bold text-[#1A253C]">{warga.nama_lengkap}</h4>
                                  <p className="text-[10px] text-[#718096] mt-0.5">{warga.shdk} • {warga.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                </div>
                              </div>
                            </td>

                            {/* NIK / KK dengan fitur masking */}
                            <td className="py-4 px-6">
                              <div className="space-y-1 font-mono">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-[#10264F]">
                                    {isRevealed ? warga.nik : formatMask(warga.nik)}
                                  </span>
                                  <button
                                    onClick={() => toggleShowNik(warga.id)}
                                    className="text-[#A0AEC0] hover:text-[#2F65CB] p-0.5 transition-colors"
                                    title={isRevealed ? "Sembunyikan NIK" : "Buka sensor NIK"}
                                  >
                                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <p className="text-[10px] text-[#718096]">
                                  {isRevealed ? `KK ${warga.no_kk}` : `KK ${formatMask(warga.no_kk)}`}
                                </p>
                              </div>
                            </td>

                            {/* Alamat */}
                            <td className="py-4 px-6 text-[#4A5568]">
                              <p className="font-medium">{warga.nama_jalan || warga.blok_rumah} {warga.nomor_rumah}</p>
                              <p className="text-[10px] text-[#A0AEC0]">
                                {warga.detail_alamat ? `${warga.detail_alamat} • ` : ''}RT 01 / RW 08
                              </p>
                            </td>

                            {/* Status Hunian */}
                            <td className="py-4 px-6">
                              <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold ${
                                warga.status_domisili.includes('Tetap')
                                  ? 'bg-[#EAF7EE] text-[#14833B] border border-[#B7E7D2]'
                                  : 'bg-[#FFF3DA] text-[#A66700] border border-[#FFE2A4]'
                              }`}>
                                {warga.status_domisili.includes('Tetap') ? 'Tetap' : 'Kontrak'}
                              </span>
                            </td>

                            {/* Administrasi */}
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                warga.status_administrasi === 'Aktif'
                                  ? 'bg-[#EBF2FF] text-[#2F65CB]'
                                  : 'bg-[#FFF2D9] text-[#97620D]'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  warga.status_administrasi === 'Aktif' ? 'bg-[#2F65CB]' : 'bg-[#97620D]'
                                }`} />
                                <span>{warga.status_administrasi}</span>
                              </span>
                            </td>

                            {/* Aksi */}
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => toggleShowNik(warga.id)}
                                className="text-xs font-semibold text-[#0E8F84] hover:underline cursor-pointer"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-[#A0AEC0]">
                          Tidak ada data warga yang sesuai dengan pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Paginasi */}
              <div className="py-3.5 px-6 bg-[#F8FAFC] border-t border-[#EAEFF5] flex items-center justify-between text-xs text-[#718096]">
                <p>Menampilkan {wargas.data ? wargas.data.length : 0} data warga RT 01/08 Sukatani</p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A253C]">Halaman {wargas.current_page || 1}</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
