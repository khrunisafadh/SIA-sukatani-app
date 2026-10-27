import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  Filter, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

export default function WargaIndex({ wargas, filters, totalWarga, totalTetap, totalKontrak, auth, flash }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [statusHunian, setStatusHunian] = useState(filters?.status_hunian || 'Semua');
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
    <AdminLayout
      title="Data Warga & Kependudukan"
      description="Kelola basis data penduduk, verifikasi domisili, dan kepemilikan rumah RT 01/08."
      breadcrumbs={[
        { label: 'Layanan Administrasi', href: route('admin.dashboard') },
        { label: 'Data Warga' },
      ]}
      actions={
        <Link
          href={route('admin.warga.create')}
          className="btn-admin-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah data warga</span>
        </Link>
      }
    >
      <Head title="Data Warga & Kependudukan - SIA Sukatani" />

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

      {/* Banner Proteksi Data Sensitif */}
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
              {wargas?.data && wargas.data.length > 0 ? (
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
                              type="button"
                              onClick={() => toggleShowNik(warga.id)}
                              className="text-[#A0AEC0] hover:text-[#2F65CB] p-0.5 transition-colors cursor-pointer"
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
                          warga.status_domisili?.includes('Tetap')
                            ? 'bg-[#EAF7EE] text-[#14833B] border border-[#B7E7D2]'
                            : 'bg-[#FFF3DA] text-[#A66700] border border-[#FFE2A4]'
                        }`}>
                          {warga.status_domisili?.includes('Tetap') ? 'Tetap' : 'Kontrak'}
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
                          type="button"
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
        <div className="py-3.5 px-6 bg-[#F8FAFC] border-t border-[#EAEFF5]">
          <Pagination meta={wargas} links={wargas?.links} />
        </div>
      </div>
    </AdminLayout>
  );
}
