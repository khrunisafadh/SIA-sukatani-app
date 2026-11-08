import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Download,
    Filter,
    Lock,
    Search,
    ShieldCheck,
    X,
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    Eye,
} from 'lucide-react';
import DetailSlideOver from './Partials/DetailSlideOver';
import ExportModal from './Partials/ExportModal';

export default function AuditTrailIndex({
    logs,
    filters = {},
    actionOptions = [],
    totalLogs = 0,
    filteredCount = 0,
    activeRangeLabel = '30 Hari Terakhir',
}) {
    const [search, setSearch] = useState(filters.q || '');
    const [action, setAction] = useState(filters.action || '');
    const [range, setRange] = useState(filters.range || '30');
    const [selectedLog, setSelectedLog] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [exportBanner, setExportBanner] = useState(null);

    const applyFilter = (e) => {
        if (e) e.preventDefault();
        router.get(
            route('admin.audit-trail.index'),
            {
                q: search,
                action: action === 'all' ? '' : action,
                range: range,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const resetFilter = () => {
        setSearch('');
        setAction('');
        setRange('30');
        router.get(route('admin.audit-trail.index'), {}, { preserveState: true });
    };

    const openDetail = async (logId) => {
        setIsLoadingDetail(true);
        try {
            const res = await fetch(route('admin.audit-trail.show', logId));
            const data = await res.json();
            setSelectedLog(data.log);
        } catch (err) {
            console.error('Gagal mengambil detail log:', err);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleExportSuccess = ({ format, periodLabel }) => {
        setExportBanner(
            `Log aktivitas berhasil diekspor! (Format .${format} — Periode ${periodLabel}, ${filteredCount} entri tercatat)`
        );
    };

    return (
        <AdminLayout>
            <Head title="Audit Trail - SIA Sukatani" />

            <div className="space-y-6">
                
                {/* Header Page */}
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                        <span>KEAMANAN &amp; AKUNTABILITAS</span>
                        <span>•</span>
                        <span className="text-slate-400 font-semibold">Read-Only Logs</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-1">
                        Audit Trail
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                        Riwayat aktivitas sistem bersifat read-only dan hanya dapat diakses Ketua RT untuk keperluan kepatuhan, pengawasan hak akses, dan verifikasi tindakan warga.
                    </p>
                </div>

                {/* Banner Notifikasi Ekspor Berhasil */}
                {exportBanner && (
                    <div className="p-4 rounded-2xl bg-[#E7F8F0] border border-[#BEE8D8] flex items-center justify-between gap-3 text-xs text-[#0F5A45] shadow-xs">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#11704E] shrink-0" />
                            <span className="font-medium">
                                <strong className="font-bold">Sukses:</strong> {exportBanner}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setExportBanner(null)}
                            className="p-1 rounded-lg hover:bg-[#D5F2E4] text-[#0F5A45] transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="space-y-3">
                    <form onSubmit={applyFilter} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari pengguna atau tindakan..."
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 shadow-xs"
                            />
                        </div>

                        {/* Dropdown Action */}
                        <div className="w-full sm:w-48">
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:border-blue-500 focus:ring-blue-500 shadow-xs"
                            >
                                <option value="">Semua Tindakan</option>
                                {actionOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dropdown Periode */}
                        <div className="w-full sm:w-44">
                            <select
                                value={range}
                                onChange={(e) => setRange(e.target.value)}
                                className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:border-blue-500 focus:ring-blue-500 shadow-xs"
                            >
                                <option value="7">7 Hari Terakhir</option>
                                <option value="30">30 Hari Terakhir</option>
                                <option value="90">90 Hari Terakhir</option>
                            </select>
                        </div>

                        {/* Tombol Terapkan */}
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
                        >
                            <Filter className="w-3.5 h-3.5 text-slate-500" />
                            <span>Terapkan filter</span>
                        </button>

                        {/* Tombol Ekspor Log */}
                        <button
                            type="button"
                            onClick={() => setIsExportOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition shrink-0"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Ekspor log</span>
                        </button>
                    </form>

                    {/* Filter Active Badges */}
                    {(search || action || range !== '30') && (
                        <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                            <span className="text-slate-400">Filter Aktif:</span>
                            {range && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                                    <span>Filter: {activeRangeLabel}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRange('30');
                                            router.get(route('admin.audit-trail.index'), { q: search, action }, { preserveState: true });
                                        }}
                                        className="hover:text-blue-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {search && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                                    <span>Pencarian: "{search}"</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('');
                                            router.get(route('admin.audit-trail.index'), { action, range }, { preserveState: true });
                                        }}
                                        className="hover:text-blue-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {action && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                                    <span>Tindakan: {actionOptions.find((o) => o.value === action)?.label || action}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAction('');
                                            router.get(route('admin.audit-trail.index'), { q: search, range }, { preserveState: true });
                                        }}
                                        className="hover:text-blue-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={resetFilter}
                                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline ml-1"
                            >
                                Reset Semua
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Table Card */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 px-5">PENGGUNA</th>
                                    <th className="py-3.5 px-4">WAKTU</th>
                                    <th className="py-3.5 px-4">JENIS TINDAKAN</th>
                                    <th className="py-3.5 px-4">OBJEK</th>
                                    <th className="py-3.5 px-4">ALAMAT IP</th>
                                    <th className="py-3.5 px-5 text-right">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {logs.data && logs.data.length > 0 ? (
                                    logs.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition group">
                                            {/* Pengguna */}
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${item.user.avatar_color || 'bg-[#147A72] text-white'}`}>
                                                        {item.user.initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-tight">
                                                            {item.user.name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                                            {item.user.role_label}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Waktu */}
                                            <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                                                {item.waktu}
                                            </td>

                                            {/* Jenis Tindakan */}
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EBF2FF] text-[#2563EB] text-[11px] font-semibold whitespace-nowrap border border-[#BFDBFE]/50">
                                                    {item.action_label}
                                                </span>
                                            </td>

                                            {/* Objek */}
                                            <td className="py-3.5 px-4 font-bold text-slate-900 max-w-[200px] truncate" title={item.object_name}>
                                                {item.object_name}
                                            </td>

                                            {/* Alamat IP */}
                                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                                {item.ip_address_masked}
                                            </td>

                                            {/* Aksi */}
                                            <td className="py-3.5 px-5 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetail(item.id)}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition"
                                                >
                                                    <span>Detail</span>
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 px-4 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                                <Search className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-800">
                                                Tidak Ada Log Aktivitas Ditemukan
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                                Tidak ada rekaman aktivitas yang sesuai dengan kriteria pencarian atau filter yang dipilih.
                                            </p>
                                            {(search || action) && (
                                                <button
                                                    type="button"
                                                    onClick={resetFilter}
                                                    className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                                                >
                                                    Reset Filter
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                        <p>
                            Menampilkan <span className="font-bold text-slate-800">{logs.data ? logs.data.length : 0}</span> dari{' '}
                            <span className="font-bold text-slate-800">{logs.total || 0}</span> entri audit log
                        </p>

                        {logs.links && logs.links.length > 3 && (
                            <div className="flex items-center gap-1">
                                {logs.links.map((link, idx) => {
                                    if (link.label.includes('Previous') || link.label.includes('&laquo;')) {
                                        return (
                                            <button
                                                key={idx}
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" />
                                            </button>
                                        );
                                    }
                                    if (link.label.includes('Next') || link.label.includes('&raquo;')) {
                                        return (
                                            <button
                                                key={idx}
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
                                            >
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        );
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            disabled={!link.url || link.active}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            className={`min-w-7 h-7 px-2 rounded-lg font-semibold text-xs flex items-center justify-center transition ${
                                                link.active
                                                    ? 'bg-[#147A72] text-white'
                                                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {link.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Security Cards (3 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* Card 1: Integritas Read-Only */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#E7F8F0] text-[#147A72] flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 font-heading">
                                Integritas Read-Only
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                Log dicatat secara otomatis oleh sistem, tidak dapat disunting atau dihapus oleh siapapun.
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Masking Alamat IP */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 font-heading">
                                Masking Alamat IP
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                Oktet kedua dan ketiga disamarkan sesuai protokol privasi data Permenkominfo.
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Retensi 365 Hari */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#E7F8F0] text-[#11704E] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 font-heading">
                                Retensi 365 Hari
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                Seluruh arsip aktivitas tersimpan aman di server lokal RT 01/08 selama 1 tahun kalender.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide-over Detail Log */}
            {selectedLog && (
                <DetailSlideOver
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                />
            )}

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                onExportSuccess={handleExportSuccess}
            />
        </AdminLayout>
    );
}
