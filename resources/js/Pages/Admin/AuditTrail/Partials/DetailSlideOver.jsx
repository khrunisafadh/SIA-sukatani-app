import React, { useState } from 'react';
import {
    CheckCircle2,
    Copy,
    Check,
    Printer,
    Shield,
    X,
    FileEdit,
    Laptop,
    Globe,
    Lock,
    ExternalLink,
} from 'lucide-react';

export default function DetailSlideOver({ log, onClose }) {
    const [viewMode, setViewMode] = useState('diff'); // 'diff' | 'json'
    const [copied, setCopied] = useState(false);

    if (!log) return null;

    const copyRawJson = () => {
        if (!log.payload?.raw_json) return;
        navigator.clipboard.writeText(log.payload.raw_json).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden print:p-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity duration-300 print:hidden"
                onClick={onClose}
            />

            {/* Slide-over panel */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 print:static print:inset-0 print:p-0 print:pl-0">
                <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-y-auto print:shadow-none print:w-full print:max-w-none">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10 print:hidden">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-[#EBF2FF] text-[#2563EB]">
                                <Shield className="w-4 h-4" />
                            </span>
                            <h2 className="text-sm font-bold text-slate-800 font-heading">
                                Detail Log Aktivitas Sistem
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            aria-label="Tutup panel"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 flex-1 text-slate-700">

                        {/* ================= 1. METADATA RINGKASAN ================= */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Metadata Ringkasan
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E7F8F0] text-[#0F5A45] text-xs font-semibold">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#11704E]" />
                                    Tercatat Resmi
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Pengguna Eksekutor</p>
                                    <p className="text-sm font-bold text-slate-900 mt-0.5">{log.user?.name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 font-mono">NIK: {log.user?.nik || '32750801••••0001'}</p>
                                    <p className="text-xs font-semibold text-blue-600 mt-1">{log.user?.role_label || 'Ketua RT 01'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Waktu Kejadian</p>
                                    <p className="text-sm font-bold text-slate-900 mt-0.5">{log.waktu_hari}</p>
                                    <p className="text-xs text-slate-600 mt-0.5">{log.waktu_jam}</p>
                                    <p className="text-xs font-semibold text-blue-600 mt-1">Zona Waktu GMT+7 (WIB)</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1.5">Jenis Tindakan</p>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#BFDBFE]/60">
                                        <FileEdit className="w-3.5 h-3.5" />
                                        {log.action_label}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                                        Modul / Objek Terkait
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">
                                        {log.module_label}: {log.object_name}
                                    </p>
                                    {log.description && (
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            {log.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ================= 2. RINCIAN JARINGAN & KEAMANAN ================= */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Rincian Jaringan &amp; Keamanan
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                                    Sec-Audit V2
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                                    <div>
                                        <p className="text-xs text-slate-500">Alamat IP Asli (Internal)</p>
                                        <p className="text-xs font-bold text-slate-900 font-mono mt-0.5">
                                            {log.network?.ip_internal}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Masking publik: {log.network?.ip_masked}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Lokasi Akses</p>
                                        <p className="text-xs font-bold text-slate-900 mt-0.5">
                                            {log.network?.location_city || 'Depok, Jawa Barat'}
                                        </p>
                                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                                            {log.network?.location_network || 'WiFi Balai Warga RT 01'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">Browser / Perangkat</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-800 font-medium">
                                        <Laptop className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span>{log.network?.device_info}</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs text-slate-500">Hash Integritas Log (SHA-256)</p>
                                        {log.security?.is_valid ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                Valid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                                                Tidak Cocok
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 break-all select-all">
                                        {log.security?.hash}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ================= 3. KOMPARASI PAYLOAD DATA ================= */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Komparasi Payload Data
                                </span>
                                <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold print:hidden">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('diff')}
                                        className={`px-3 py-1 rounded-md transition ${
                                            viewMode === 'diff'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Perubahan Nilai (Diff)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('json')}
                                        className={`px-3 py-1 rounded-md transition ${
                                            viewMode === 'json'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Raw JSON
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'diff' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* SEBELUM (Before) */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-red-600">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                                SEBELUM (Before)
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono font-normal">v1.0.0</span>
                                        </div>
                                        <div className="p-3.5 rounded-2xl bg-[#FEF4F4] border border-[#FCD6D6] text-xs font-mono text-[#991B1B] min-h-[140px] space-y-1">
                                            {log.payload?.before && Object.keys(log.payload.before).length > 0 ? (
                                                Object.entries(log.payload.before).map(([k, v]) => (
                                                    <div key={k} className="break-words">
                                                        <span className="font-semibold text-[#7F1D1D]">{k}</span>:{' '}
                                                        <span>{typeof v === 'object' ? JSON.stringify(v) : JSON.stringify(v)}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-400 font-sans italic text-[11px] pt-8 text-center">
                                                    (Tidak ada data sebelum perubahan / record baru)
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* SESUDAH (After) */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                SESUDAH (After)
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono font-normal">v1.1.0</span>
                                        </div>
                                        <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-mono text-[#166534] min-h-[140px] space-y-1">
                                            {log.payload?.after && Object.keys(log.payload.after).length > 0 ? (
                                                Object.entries(log.payload.after).map(([k, v]) => (
                                                    <div key={k} className="break-words">
                                                        <span className="font-semibold text-[#14532D]">{k}</span>:{' '}
                                                        <span>{typeof v === 'object' ? JSON.stringify(v) : JSON.stringify(v)}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-400 font-sans italic text-[11px] pt-8 text-center">
                                                    (Tidak ada payload perubahan setelah aktivitas)
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-[300px]">
                                    <pre>{log.payload?.raw_json || '{}'}</pre>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 print:hidden">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={copyRawJson}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                                {copied ? 'Tersalin!' : 'Salin Raw JSON'}
                            </button>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                            >
                                <Printer className="w-3.5 h-3.5 text-slate-500" />
                                Cetak Bukti
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition shadow-sm"
                        >
                            Tutup Panel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
