import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  Filter,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Coins,
  LogOut,
  Building2,
  ShieldCheck,
  ChevronDown,
  X
} from 'lucide-react';

export default function BendaharaDashboard({
  summary = { saldoAkhir: 0, totalPemasukan: 0, totalPengeluaran: 0, pembaruanTerakhir: '-' },
  monthlyFlow = [],
  transactions = [],
  periods = ['Januari–Juni 2025'],
  selectedPeriod = 'Januari–Juni 2025',
  kategoriList = ['Iuran Warga', 'Operasional & Kebersihan', 'Perawatan Fasilitas', 'Kegiatan Warga', 'Sosial & Dana Darurat'],
}) {
  const { auth, flash } = usePage().props;
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(selectedPeriod);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  const { data, setData, post, processing, errors, reset } = useForm({
    periode: currentPeriod,
    tanggal: new Date().toISOString().split('T')[0],
    jenis: 'pemasukan',
    kategori: kategoriList[0] || 'Iuran Warga',
    nominal: '',
    keterangan: '',
    catatan: '',
  });

  const handlePeriodChange = (e) => {
    const next = e.target.value;
    setCurrentPeriod(next);
    setData('periode', next);
    router.get(route('bendahara.dashboard'), { periode: next }, { preserveState: true, preserveScroll: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('bendahara.transaksi.store'), {
      onSuccess: () => {
        setShowAddModal(false);
        reset('nominal', 'keterangan', 'catatan');
      },
    });
  };

  const handleDelete = (id, keterangan) => {
    if (confirm(`Hapus catatan transaksi: "${keterangan}"?`)) {
      router.delete(route('bendahara.transaksi.destroy', id), {
        preserveScroll: true,
      });
    }
  };

  const logout = () => {
    router.post(route('logout'));
  };

  // Hitung nilai tertinggi bulanan untuk skala bar chart
  const maxFlow = Math.max(
    ...monthlyFlow.map((m) => Math.max(m.pemasukan, m.pengeluaran)),
    2500000
  );

  return (
    <>
      <Head title="Dashboard Bendahara - Kelola Aliran Kas RT 01/08" />

      <div className="min-h-screen bg-[#F4F7FA] font-sans antialiased text-[#10264F]">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-[#006B61] text-white shadow-md">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white border border-white/20 shadow-inner">
                <Coins className="w-5 h-5 text-[#A8E5DE]" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-base sm:text-lg leading-tight tracking-tight">
                  SIA Sukatani • Modul Bendahara
                </h1>
                <p className="text-[11px] text-[#A8E5DE]">
                  RT 01 / RW 08 Kelurahan Sukatani, Tapos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="/#transparansi-kas"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-[#A8E5DE] hover:text-white transition-all border border-white/10"
              >
                <span>Lihat di Landing Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold leading-none">{auth?.user?.name || 'Ahmad Fauzi'}</div>
                  <div className="text-[10px] text-[#A8E5DE] mt-0.5">Bendahara RT 01</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#00554D] border border-[#A8E5DE]/40 flex items-center justify-center font-bold text-xs text-[#A8E5DE]">
                  BD
                </div>
                <button
                  onClick={logout}
                  title="Keluar dari akun"
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Flash message */}
          {flash?.success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{flash.success}</span>
              </div>
            </div>
          )}

          {/* Sync & Realtime Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#006B61] to-[#0A887B] text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-[#A8E5DE] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A8E5DE]" />
                Sinkronisasi Landing Page Aktif
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading tracking-tight">
                Transparansi &amp; Manajemen Aliran Kas RT
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                Setiap mutasi pemasukan dan pengeluaran kas yang Anda kelola di halaman ini secara otomatis langsung terbit dan memperbarui grafik di beranda publik warga.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#006B61] hover:bg-slate-100 font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#006B61]" />
                <span>Catat Transaksi Kas</span>
              </button>
            </div>
          </div>

          {/* Controls: Periode Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#006B61]" />
              <span className="text-xs sm:text-sm font-bold text-[#10264F]">
                Periode Laporan Keuangan:
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={currentPeriod}
                  onChange={handlePeriodChange}
                  className="appearance-none bg-[#F8FAFC] border border-[#CBD5E1] text-[#10264F] text-xs font-semibold py-2 pl-3.5 pr-9 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006B61] cursor-pointer"
                >
                  {periods.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#68748A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#68748A]">
                Pembaruan: {summary.pembaruanTerakhir}
              </span>
            </div>
          </div>

          {/* 3 KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Saldo Akhir */}
            <div className="p-6 rounded-2xl bg-[#0F685D] text-white shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A8E5DE] uppercase tracking-wider">
                  Saldo Akhir Kas
                </span>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#A8E5DE]" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight font-heading">
                  {formatRupiah(summary.saldoAkhir)}
                </div>
                <div className="mt-2 text-[11px] text-[#A8E5DE]/90 font-medium">
                  {currentPeriod} • Siap diaudit warga
                </div>
              </div>
            </div>

            {/* Card 2: Total Pemasukan */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#68748A] uppercase tracking-wider">
                  Total Pemasukan
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#E7F6EF] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#0F8F83]" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight font-heading text-[#10264F]">
                  {formatRupiah(summary.totalPemasukan)}
                </div>
                <div className="mt-2 text-[11px] text-[#8C98A9] font-medium">
                  Iuran warga &amp; donasi sukarela
                </div>
              </div>
            </div>

            {/* Card 3: Total Pengeluaran */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#68748A] uppercase tracking-wider">
                  Total Pengeluaran
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FEECEB] flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-[#E5484D]" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight font-heading text-[#10264F]">
                  {formatRupiah(summary.totalPengeluaran)}
                </div>
                <div className="mt-2 text-[11px] text-[#8C98A9] font-medium">
                  Operasional, fasilitas &amp; kebersihan
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section: Arus Kas Bulanan */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#10264F] font-heading">
                  Arus Kas Bulanan ({currentPeriod})
                </h3>
                <p className="text-xs text-[#68748A] mt-0.5">
                  Visualisasi grafik perbandingan pemasukan vs pengeluaran kas RT secara real-time.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-5 text-xs text-[#566175] font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#0F685D]" />
                  <span>Pemasukan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#EB7957]" />
                  <span>Pengeluaran</span>
                </div>
              </div>
            </div>

            {/* Visual Bars Container */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <div className="grid grid-cols-6 gap-2 sm:gap-6 items-end h-56 pt-6 pb-2">
                {monthlyFlow.map((item) => {
                  const inHeight = maxFlow > 0 ? Math.min(100, Math.round((item.pemasukan / maxFlow) * 100)) : 0;
                  const outHeight = maxFlow > 0 ? Math.min(100, Math.round((item.pengeluaran / maxFlow) * 100)) : 0;

                  return (
                    <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end">
                      <div className="flex items-end gap-1.5 sm:gap-3 w-full justify-center h-44">
                        {/* Pemasukan Bar */}
                        <div
                          className="w-3.5 sm:w-7 bg-[#0F685D] rounded-t transition-all hover:opacity-90 relative group cursor-pointer"
                          style={{ height: `${Math.max(inHeight, 4)}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-[#10264F] text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none shadow-md">
                            +{formatRupiah(item.pemasukan)}
                          </div>
                        </div>

                        {/* Pengeluaran Bar */}
                        <div
                          className="w-3.5 sm:w-7 bg-[#EB7957] rounded-t transition-all hover:opacity-90 relative group cursor-pointer"
                          style={{ height: `${Math.max(outHeight, 4)}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-[#10264F] text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none shadow-md">
                            -{formatRupiah(item.pengeluaran)}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-[#68748A]">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table Section: Daftar Transaksi */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#10264F] font-heading">
                  Daftar Transaksi Kas RT ({transactions.length} Data)
                </h3>
                <p className="text-xs text-[#68748A] mt-0.5">
                  Rincian transaksi pembukuan kas pada periode {currentPeriod}.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#006B61] text-white hover:bg-[#00554D] text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Transaksi</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#8C98A9] font-bold text-[10px] tracking-wider uppercase">
                    <th className="pb-3 pr-4 font-semibold">TANGGAL</th>
                    <th className="pb-3 px-4 font-semibold">KETERANGAN TRANSAKSI</th>
                    <th className="pb-3 px-4 font-semibold">KATEGORI</th>
                    <th className="pb-3 px-4 font-semibold">JENIS</th>
                    <th className="pb-3 px-4 text-right font-semibold">NOMINAL</th>
                    <th className="pb-3 pl-4 text-center font-semibold">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#8C98A9]">
                        Belum ada transaksi kas yang dicatat pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                        <td className="py-4 pr-4 text-[#566175] font-medium whitespace-nowrap">
                          {tx.tanggal}
                        </td>
                        <td className="py-4 px-4 text-[#10264F] font-semibold">
                          <div>{tx.keterangan}</div>
                          {tx.catatan && (
                            <div className="text-[10px] text-[#8C98A9] mt-0.5">{tx.catatan}</div>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-[11px] font-medium text-[#566175] bg-[#F1F5F9] px-2.5 py-1 rounded-md">
                            {tx.kategori}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              tx.jenis === 'pemasukan'
                                ? 'bg-[#E7F6EF] text-[#0F8F83]'
                                : 'bg-[#FEF3EB] text-[#D95D39]'
                            }`}
                          >
                            {tx.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-bold whitespace-nowrap ${
                            tx.jenis === 'pemasukan' ? 'text-[#0F8F83]' : 'text-[#D95D39]'
                          }`}
                        >
                          {tx.jenis === 'pemasukan' ? '+' : '-'}
                          {formatRupiah(tx.nominal)}
                        </td>
                        <td className="py-4 pl-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDelete(tx.id, tx.keterangan)}
                            className="p-1.5 rounded-lg text-[#8C98A9] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus transaksi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Tambah Transaksi */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#006B61] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Coins className="w-5 h-5 text-[#A8E5DE]" />
                <h3 className="font-heading font-bold text-base">Catat Transaksi Kas Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Jenis Transaksi */}
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-[#10264F]">Jenis Transaksi</label>
                  <select
                    value={data.jenis}
                    onChange={(e) => setData('jenis', e.target.value)}
                    className="w-full h-10 text-xs rounded-xl border border-[#CBD5E1] bg-white px-3 text-[#10264F] focus:ring-2 focus:ring-[#006B61]"
                  >
                    <option value="pemasukan">💰 Pemasukan Kas (+)</option>
                    <option value="pengeluaran">💸 Pengeluaran Kas (-)</option>
                  </select>
                </div>

                {/* Tanggal */}
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-[#10264F]">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={data.tanggal}
                    onChange={(e) => setData('tanggal', e.target.value)}
                    className="w-full h-10 text-xs rounded-xl border border-[#CBD5E1] bg-white px-3 text-[#10264F] focus:ring-2 focus:ring-[#006B61]"
                    required
                  />
                </div>
              </div>

              {/* Kategori */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#10264F]">Kategori</label>
                <select
                  value={data.kategori}
                  onChange={(e) => setData('kategori', e.target.value)}
                  className="w-full h-10 text-xs rounded-xl border border-[#CBD5E1] bg-white px-3 text-[#10264F] focus:ring-2 focus:ring-[#006B61]"
                >
                  {kategoriList.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nominal */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#10264F]">Nominal (Rupiah)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C98A9]">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1000"
                    placeholder="Contoh: 500000"
                    value={data.nominal}
                    onChange={(e) => setData('nominal', e.target.value)}
                    className="w-full h-10 pl-10 pr-3 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#10264F] focus:ring-2 focus:ring-[#006B61]"
                    required
                  />
                </div>
                {errors.nominal && <p className="text-xs text-red-600">{errors.nominal}</p>}
              </div>

              {/* Keterangan */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#10264F]">Keterangan Transaksi</label>
                <input
                  type="text"
                  placeholder="Contoh: Iuran warga Blok B, Perbaikan pompa air, dll"
                  value={data.keterangan}
                  onChange={(e) => setData('keterangan', e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#10264F] focus:ring-2 focus:ring-[#006B61]"
                  required
                />
                {errors.keterangan && <p className="text-xs text-red-600">{errors.keterangan}</p>}
              </div>

              {/* Catatan / Sumber */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#10264F]">Catatan / Lampiran Kuitansi (Opsional)</label>
                <textarea
                  rows="2"
                  placeholder="Catatan tambahan untuk verifikasi"
                  value={data.catatan}
                  onChange={(e) => setData('catatan', e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#10264F] focus:ring-2 focus:ring-[#006B61]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#68748A] hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#006B61] hover:bg-[#00554D] rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {processing ? 'Menyimpan...' : 'Simpan Transaksi Kas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
