import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileCheck,
    FileText,
    HelpCircle,
    Home,
    LogIn,
    LogOut,
    MessageCircle,
    MessageSquare,
    Printer,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
    SlidersHorizontal,
    Timer,
    Users,
} from 'lucide-react';
import { useState } from 'react';

export default function MutasiIndex({
    mutations,
    filters,
    summary,
    hunianStats,
    jenisOptions,
    statusOptions,
}) {
    const [q, setQ] = useState(filters.q ?? '');
    const [jenis, setJenis] = useState(filters.jenis ?? '');
    const [tab, setTab] = useState(filters.tab ?? 'menunggu_pemeriksaan');
    const [periode, setPeriode] = useState(filters.periode ?? '');

    const applyFilters = (next = {}) => {
        router.get(
            route('admin.mutasi.index'),
            {
                q: next.q !== undefined ? next.q : q,
                jenis: next.jenis !== undefined ? next.jenis : jenis,
                tab: next.tab !== undefined ? next.tab : tab,
                periode: next.periode !== undefined ? next.periode : periode,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ q });
    };

    const handleTabChange = (selectedTab) => {
        setTab(selectedTab);
        applyFilters({ tab: selectedTab });
    };

    const resetFilter = () => {
        setQ('');
        setJenis('');
        setTab('all');
        setPeriode('');
        router.get(route('admin.mutasi.index'), { tab: 'all' }, { replace: true });
    };

    const refreshData = () => {
        router.reload({ preserveScroll: true });
    };

    const avatarBgColors = [
        'bg-[#147A72] text-white',
        'bg-[#2A374A] text-white',
        'bg-[#E11D48] text-white',
        'bg-[#0D9488] text-white',
        'bg-[#2563EB] text-white',
    ];

    return (
        <AdminLayout>
            <Head title="Verifikasi Laporan Pindah / Datang - SIA Sukatani" />

            {/* Top Header Section */}
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#E7F6EF] px-3 py-1 text-xs font-semibold text-[#0F766E]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
                        <span>ADMINISTRASI KETUA RT 01 / RW 08</span>
                    </div>
                    <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#17233C] sm:text-3xl">
                        Verifikasi Laporan Pindah / Datang
                    </h1>
                    <p className="mt-1 text-sm text-[#68748A]">
                        Kelola antrean permohonan mutasi kependudukan warga secara berkala untuk pembaruan buku induk RT.
                    </p>
                </div>

                    <a
                        href={route('admin.mutasi.export')}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0D655E] transition"
                    >
                        <Download className="h-4 w-4" />
                        <span>Ekspor Rekap</span>
                    </a>
                </div>

            {/* 4 Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Menunggu Verifikasi */}
                <div
                    onClick={() => handleTabChange('menunggu_pemeriksaan')}
                    className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                        tab === 'menunggu_pemeriksaan' ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/20' : 'border-[#E4E9F0]'
                    }`}
                >
                    <div className="flex items-center justify-between text-[#68748A]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#68748A]">
                            Menunggu Verifikasi
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706]">
                            <Clock className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-3">
                        <span className="font-heading text-3xl font-extrabold text-[#17233C]">
                            {summary.menunggu}
                        </span>
                        <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[11px] font-bold text-[#B45309]">
                            Perlu Respon
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-[#68748A]">Segera periksa sebelum 1x24 jam</p>
                </div>

                {/* 2. Sedang Diperiksa */}
                <div
                    onClick={() => handleTabChange('sedang_diperiksa')}
                    className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                        tab === 'sedang_diperiksa' ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20' : 'border-[#E4E9F0]'
                    }`}
                >
                    <div className="flex items-center justify-between text-[#68748A]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#68748A]">
                            Sedang Diperiksa
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E0F2FE] text-[#0284C7]">
                            <FileCheck className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-3">
                        <span className="font-heading text-3xl font-extrabold text-[#17233C]">
                            {summary.diperiksa}
                        </span>
                        <span className="rounded-full bg-[#E0F2FE] px-2.5 py-0.5 text-[11px] font-bold text-[#0369A1]">
                            Validasi Berkas
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-[#68748A]">Pengecekan NIK &amp; SKP Dukcapil</p>
                </div>

                {/* 3. Disetujui Bulan Ini */}
                <div
                    onClick={() => handleTabChange('selesai')}
                    className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                        tab === 'selesai' ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20' : 'border-[#E4E9F0]'
                    }`}
                >
                    <div className="flex items-center justify-between text-[#68748A]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#68748A]">
                            Disetujui Bulan Ini
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#16A34A]">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-3">
                        <span className="font-heading text-3xl font-extrabold text-[#17233C]">
                            {summary.selesai}
                        </span>
                        <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-bold text-[#15803D]">
                            +{summary.kk_baru_bulan_ini} KK Baru
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-[#68748A]">Tercatat di buku induk kependudukan</p>
                </div>

                {/* 4. Perlu Revisi */}
                <div
                    onClick={() => handleTabChange('perlu_revisi')}
                    className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                        tab === 'perlu_revisi' ? 'border-[#E11D48] ring-2 ring-[#E11D48]/20' : 'border-[#E4E9F0]'
                    }`}
                >
                    <div className="flex items-center justify-between text-[#68748A]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#68748A]">
                            Perlu Revisi
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE4E6] text-[#E11D48]">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-3">
                        <span className="font-heading text-3xl font-extrabold text-[#17233C]">
                            {summary.revisi}
                        </span>
                        <span className="rounded-full bg-[#FFE4E6] px-2.5 py-0.5 text-[11px] font-bold text-[#BE123C]">
                            Koreksi Warga
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-[#68748A]">Menunggu perbaikan berkas foto KK</p>
                </div>
            </div>


            {/* Main Card with Tabs & Table */}
            <div className="rounded-2xl border border-[#E4E9F0] bg-white shadow-sm">
                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E9F0] px-6 pt-4 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => handleTabChange('all')}
                        className={`flex items-center gap-2 pb-3.5 transition border-b-2 ${
                            tab === 'all'
                                ? 'border-[#0F766E] font-bold text-[#0F766E]'
                                : 'border-transparent text-[#68748A] hover:text-[#17233C]'
                        }`}
                    >
                        <span>Semua Permohonan</span>
                        <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] text-[#475569]">
                            {summary.total}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTabChange('menunggu_pemeriksaan')}
                        className={`flex items-center gap-2 pb-3.5 transition border-b-2 ${
                            tab === 'menunggu_pemeriksaan'
                                ? 'border-[#0F766E] font-bold text-[#0F766E]'
                                : 'border-transparent text-[#68748A] hover:text-[#17233C]'
                        }`}
                    >
                        <span>Menunggu Pemeriksaan</span>
                        <span
                            className={`rounded-full px-2 py-0.5 text-[11px] ${
                                tab === 'menunggu_pemeriksaan'
                                    ? 'bg-[#E7F6EF] text-[#0F766E]'
                                    : 'bg-[#F1F5F9] text-[#475569]'
                            }`}
                        >
                            {summary.menunggu}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTabChange('sedang_diperiksa')}
                        className={`flex items-center gap-2 pb-3.5 transition border-b-2 ${
                            tab === 'sedang_diperiksa'
                                ? 'border-[#0F766E] font-bold text-[#0F766E]'
                                : 'border-transparent text-[#68748A] hover:text-[#17233C]'
                        }`}
                    >
                        <span>Sedang Diperiksa</span>
                        <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] text-[#475569]">
                            {summary.diperiksa}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTabChange('selesai')}
                        className={`flex items-center gap-2 pb-3.5 transition border-b-2 ${
                            tab === 'selesai'
                                ? 'border-[#0F766E] font-bold text-[#0F766E]'
                                : 'border-transparent text-[#68748A] hover:text-[#17233C]'
                        }`}
                    >
                        <span>Selesai / Terverifikasi</span>
                        <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] text-[#475569]">
                            {summary.selesai}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTabChange('perlu_revisi')}
                        className={`flex items-center gap-2 pb-3.5 transition border-b-2 ${
                            tab === 'perlu_revisi'
                                ? 'border-[#0F766E] font-bold text-[#0F766E]'
                                : 'border-transparent text-[#68748A] hover:text-[#17233C]'
                        }`}
                    >
                        <span>Perlu Revisi</span>
                        <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] text-[#475569]">
                            {summary.revisi}
                        </span>
                    </button>
                </div>

                {/* Search & Filter Row */}
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Cari nama warga, 16 digit NIK, atau nomor tiket..."
                            className="h-10 w-full rounded-xl border border-[#D5DCE6] pl-10 pr-4 text-xs text-[#17233C] placeholder-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={jenis}
                            onChange={(e) => {
                                setJenis(e.target.value);
                                applyFilters({ jenis: e.target.value });
                            }}
                            className="h-10 rounded-xl border border-[#D5DCE6] bg-white px-3 text-xs text-[#39445A] focus:border-[#0F766E] focus:outline-none"
                        >
                            <option value="">Semua Kategori Mutasi</option>
                            <option value="datang">Warga Datang</option>
                            <option value="pindah">Warga Pindah</option>
                        </select>

                        <select
                            value={periode}
                            onChange={(e) => {
                                setPeriode(e.target.value);
                                applyFilters({ periode: e.target.value });
                            }}
                            className="h-10 rounded-xl border border-[#D5DCE6] bg-white px-3 text-xs text-[#39445A] focus:border-[#0F766E] focus:outline-none"
                        >
                            <option value="">Bulan Juni 2025</option>
                            <option value="2025-05">Bulan Mei 2025</option>
                            <option value="2025-04">Bulan April 2025</option>
                        </select>

                        <button
                            type="button"
                            onClick={resetFilter}
                            title="Reset Filter"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5DCE6] text-[#68748A] hover:bg-[#F8FAFC]"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-y border-[#E4E9F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#68748A]">
                                <th className="px-6 py-3.5">Pemohon &amp; NIK</th>
                                <th className="px-4 py-3.5">Jenis Mutasi</th>
                                <th className="px-4 py-3.5">Unit Rumah RT 01</th>
                                <th className="px-4 py-3.5">Lampiran Dokumen</th>
                                <th className="px-4 py-3.5">Tanggal Pengajuan</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E9F0]">
                            {mutations.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="h-8 w-8 text-[#94A3B8]" />
                                            <p className="mt-2 text-sm font-semibold text-[#17233C]">
                                                Tidak ada permohonan mutasi
                                            </p>
                                            <p className="text-xs text-[#68748A]">
                                                Coba sesuaikan pencarian atau tab status Anda.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                mutations.data.map((item, idx) => {
                                    const isDatang = item.jenis === 'datang';
                                    const avatarClass = avatarBgColors[idx % avatarBgColors.length];

                                    return (
                                        <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition">
                                            {/* Pemohon & NIK */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarClass}`}
                                                    >
                                                        {item.pemohon.initials}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5 font-bold text-[#17233C]">
                                                            <span>{item.pemohon.nama}</span>
                                                            {item.status === 'menunggu_pemeriksaan' && (
                                                                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                                                            )}
                                                            {item.status === 'sedang_diperiksa' && (
                                                                <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                                                            )}
                                                            {item.status === 'perlu_revisi' && (
                                                                <span className="h-2 w-2 rounded-full bg-[#E11D48]" />
                                                            )}
                                                            {item.status === 'selesai' && (
                                                                <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                                                            )}
                                                        </div>
                                                        <p className="font-mono text-[11px] text-[#68748A]">
                                                            {item.pemohon.nik_masked}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Jenis Mutasi */}
                                            <td className="px-4 py-4">
                                                {isDatang ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-bold text-[#1D4ED8]">
                                                        <LogIn className="h-3 w-3" />
                                                        <span>Warga Datang</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-bold text-[#475569]">
                                                        <LogOut className="h-3 w-3" />
                                                        <span>Warga Pindah</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Unit Rumah RT 01 */}
                                            <td className="px-4 py-4">
                                                <p className="font-bold text-[#17233C]">{item.unit_rumah.nama}</p>
                                                <p className="text-[11px] text-[#68748A]">
                                                    Status: {item.unit_rumah.status_tinggal}
                                                </p>
                                            </td>

                                            {/* Lampiran Dokumen */}
                                            <td className="px-4 py-4">
                                                {item.dokumen.type === 'buram' ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#FECDD3] bg-[#FFF1F2] px-2.5 py-1 text-[11px] font-bold text-[#E11D48]">
                                                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                                        <span>{item.dokumen.label}</span>
                                                    </span>
                                                ) : item.dokumen.type === 'valid' ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-[11px] font-bold text-[#16A34A]">
                                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                                        <span>{item.dokumen.label}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-medium text-[#475569]">
                                                        <FileText className="h-3.5 w-3.5 text-[#64748B]" />
                                                        <span>{item.dokumen.label}</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Tanggal Pengajuan */}
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-[#17233C]">{item.tanggal.formatted}</p>
                                                <p
                                                    className={`text-[11px] ${
                                                        item.status === 'perlu_revisi'
                                                            ? 'font-semibold text-[#E11D48]'
                                                            : item.status === 'menunggu_pemeriksaan'
                                                            ? 'font-semibold text-[#D97706]'
                                                            : 'text-[#68748A]'
                                                    }`}
                                                >
                                                    {item.tanggal.relative}
                                                </p>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                {item.status === 'menunggu_pemeriksaan' && (
                                                    <span className="inline-flex rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-bold text-[#B45309]">
                                                        Menunggu Pemeriksaan
                                                    </span>
                                                )}
                                                {item.status === 'sedang_diperiksa' && (
                                                    <span className="inline-flex rounded-full border border-[#BAE6FD] bg-[#E0F2FE] px-2.5 py-1 text-[11px] font-bold text-[#0369A1]">
                                                        Dokumen Diperiksa
                                                    </span>
                                                )}
                                                {item.status === 'perlu_revisi' && (
                                                    <span className="inline-flex rounded-full border border-[#FECDD3] bg-[#FFE4E6] px-2.5 py-1 text-[11px] font-bold text-[#BE123C]">
                                                        Revisi: Foto KK Blur
                                                    </span>
                                                )}
                                                {item.status === 'selesai' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-bold text-[#15803D]">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />
                                                        <span>Selesai / Terdaftar</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Aksi Button */}
                                            <td className="px-6 py-4 text-right">
                                                {item.status === 'menunggu_pemeriksaan' && (
                                                    <Link
                                                        href={route('admin.mutasi.show', item.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0D655E] transition"
                                                    >
                                                        <span>Periksa Detail</span>
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                )}
                                                {item.status === 'sedang_diperiksa' && (
                                                    <Link
                                                        href={route('admin.mutasi.show', item.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#0284C7]/30 bg-[#F0F9FF] px-3.5 py-2 text-xs font-semibold text-[#0369A1] hover:bg-[#E0F2FE] transition"
                                                    >
                                                        <span>Lanjutkan</span>
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                )}
                                                {item.status === 'perlu_revisi' && (
                                                    <Link
                                                        href={route('admin.mutasi.show', item.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#FECDD3] bg-[#FFF1F2] px-3.5 py-2 text-xs font-semibold text-[#E11D48] hover:bg-[#FFE4E6] transition"
                                                    >
                                                        <span>Lihat Catatan</span>
                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                    </Link>
                                                )}
                                                {item.status === 'selesai' && (
                                                    <Link
                                                        href={route('admin.mutasi.show', item.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5DCE6] bg-white px-3.5 py-2 text-xs font-semibold text-[#39445A] hover:bg-[#F8FAFC] transition"
                                                    >
                                                        <Printer className="h-3.5 w-3.5 text-[#68748A]" />
                                                        <span>Cetak Arsip</span>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E4E9F0] px-6 py-4 sm:flex-row text-xs text-[#68748A]">
                    <p>
                        Menampilkan <span className="font-bold text-[#17233C]">{mutations.data.length}</span> dari{' '}
                        <span className="font-bold text-[#17233C]">{mutations.total}</span> permohonan mutasi warga
                    </p>

                    <div className="flex items-center gap-1">
                        {mutations.links?.map((link, i) => {
                            const isCurrent = link.active;
                            const isArrow = link.label.includes('&laquo;') || link.label.includes('&raquo;');
                            const label = link.label
                                .replace('&laquo; Previous', '<')
                                .replace('Next &raquo;', '>');

                            if (!link.url) {
                                return (
                                    <span
                                        key={i}
                                        className="flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs text-[#94A3B8]"
                                    >
                                        {label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2.5 text-xs font-semibold transition ${
                                        isCurrent
                                            ? 'bg-[#0F766E] text-white shadow-sm'
                                            : 'border border-[#D5DCE6] bg-white text-[#39445A] hover:bg-[#F8FAFC]'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
