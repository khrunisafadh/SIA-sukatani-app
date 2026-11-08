import React, { useState } from 'react';
import {
    Calendar,
    Check,
    Download,
    FileSpreadsheet,
    FileText,
    Info,
    Lock,
    Shield,
    ShieldCheck,
    X,
} from 'lucide-react';

export default function ExportModal({ isOpen, onClose, onExportSuccess }) {
    const [format, setFormat] = useState('csv'); // 'csv' | 'pdf'
    const [range, setRange] = useState('30'); // '7' | '30' | '90' | 'kustom'
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [maskData, setMaskData] = useState(true);
    const [includeMetadata, setIncludeMetadata] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const handleRangeChange = (selectedRange) => {
        setRange(selectedRange);
        const end = new Date();
        const start = new Date();

        if (selectedRange === '7') {
            start.setDate(end.getDate() - 7);
        } else if (selectedRange === '30') {
            start.setDate(end.getDate() - 30);
        } else if (selectedRange === '90') {
            start.setDate(end.getDate() - 90);
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return '';
        const [y, m, d] = dateString.split('-');
        return `${d}/${m}/${y}`;
    };

    const calculateDays = () => {
        if (!startDate || !endDate) return 30;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return isNaN(diffDays) ? 30 : diffDays;
    };

    const handleDownload = () => {
        setIsExporting(true);

        const params = new URLSearchParams({
            format,
            range,
            start_date: startDate,
            end_date: endDate,
            mask_data: maskData ? '1' : '0',
            include_metadata: includeMetadata ? '1' : '0',
        });

        const exportUrl = format === 'csv'
            ? route('admin.audit-trail.export.csv') + '?' + params.toString()
            : route('admin.audit-trail.export.pdf') + '?' + params.toString();

        // Trigger download
        const link = document.createElement('a');
        link.href = exportUrl;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            setIsExporting(false);
            if (onExportSuccess) {
                onExportSuccess({
                    format: format.toUpperCase(),
                    periodLabel: range === 'kustom' ? `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}` : `${range} Hari Terakhir`,
                });
            }
            onClose();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center shrink-0">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 font-heading">
                                    Ekspor Log Audit Trail
                                </h3>
                                <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                    Keamanan Data &amp; Akuntabilitas RT
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5 text-slate-700">
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Unduh rekaman riwayat aktivitas sistem untuk keperluan kepatuhan regulasi, arsip digital kelurahan, dan audit internal pengurus RT 01/08.
                        </p>

                        {/* Format Selection */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-800">
                                Pilih Format Berkas <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* CSV Option */}
                                <button
                                    type="button"
                                    onClick={() => setFormat('csv')}
                                    className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 relative ${
                                        format === 'csv'
                                            ? 'border-blue-600 bg-[#F4F8FF] ring-2 ring-blue-600/20'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                        <FileSpreadsheet className="w-5 h-5" />
                                    </div>
                                    <div className="pr-5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-slate-900">Format .CSV</span>
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                                                Populer
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                                            Excel Spreadsheet format tabular komprehensif
                                        </p>
                                    </div>
                                    {format === 'csv' && (
                                        <div className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        </div>
                                    )}
                                </button>

                                {/* PDF Option */}
                                <button
                                    type="button"
                                    onClick={() => setFormat('pdf')}
                                    className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 relative ${
                                        format === 'pdf'
                                            ? 'border-blue-600 bg-[#F4F8FF] ring-2 ring-blue-600/20'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="pr-5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-slate-900">Format .PDF</span>
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700">
                                                Resmi
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                                            Laporan stempel digital &amp; tanda tangan Ketua RT
                                        </p>
                                    </div>
                                    {format === 'pdf' && (
                                        <div className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Date Range Selection */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-800">
                                    Rentang Waktu Log <span className="text-red-500">*</span>
                                </label>
                                <span className="text-[11px] text-slate-400 font-medium">
                                    Zona Waktu: WIB (GMT+7)
                                </span>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { id: '7', label: '7 Hari Terakhir' },
                                    { id: '30', label: '30 Hari Terakhir' },
                                    { id: '90', label: '90 Hari' },
                                    { id: 'kustom', label: 'Kustom' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleRangeChange(tab.id)}
                                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition ${
                                            range === tab.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Date Picker Bar */}
                            {range === 'kustom' ? (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div>
                                        <label className="block text-[11px] text-slate-500 mb-1">Dari Tanggal</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full text-xs rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-slate-500 mb-1">Sampai Tanggal</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full text-xs rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        <span>
                                            {formatDateDisplay(startDate)} – {formatDateDisplay(endDate)}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                        {calculateDays()} Hari Terpilih
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Options */}
                        <div className="space-y-2.5 pt-1">
                            <label className="block text-xs font-bold text-slate-800">
                                Opsi Enkripsi &amp; Kolom Data
                            </label>

                            <label className="flex items-start gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={maskData}
                                    onChange={(e) => setMaskData(e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                                />
                                <div className="text-xs">
                                    <p className="font-semibold text-slate-800">
                                        Sertakan masking alamat IP dan nomor NIK warga
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        Direkomendasikan sesuai kepatuhan regulasi UU Perlindungan Data Pribadi (UU PDP).
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-start gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeMetadata}
                                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                                />
                                <div className="text-xs">
                                    <p className="font-semibold text-slate-800">
                                        Sertakan metadata teknis (User-Agent peramban &amp; jenis perangkat)
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        Dibutuhkan khusus untuk investigasi celah keamanan lanjutan.
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Security Assurance Card */}
                        <div className="p-3.5 rounded-2xl bg-[#E8F8F0] border border-[#BDE8D4] flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white text-[#11704E] flex items-center justify-center shrink-0 shadow-xs">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#0F5A45]">
                                    Kerahasiaan Dokumen Terjamin
                                </p>
                                <p className="text-[11px] text-[#0F5A45]/90 mt-0.5 leading-relaxed">
                                    File log terenkripsi SHA-256 dan hanya dapat diverifikasi keasliannya melalui sistem resmi SIA Sukatani.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                            <span>Estimasi ukuran: ~240 KB</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isExporting}
                                onClick={handleDownload}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition shadow-sm disabled:opacity-50"
                            >
                                <Download className="w-3.5 h-3.5" />
                                {isExporting ? 'Menyiapkan File...' : `Download File (.${format.toUpperCase()})`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
