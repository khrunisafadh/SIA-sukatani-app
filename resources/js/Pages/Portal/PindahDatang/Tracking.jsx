import WargaLayout from '@/Layouts/WargaLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Download,
    Eye,
    FileText,
    HelpCircle,
    Info,
    Lock,
    MapPin,
    MessageCircle,
    Phone,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
} from 'lucide-react';
import { useMemo } from 'react';

const DEFAULT_REPORT = {
    jenis: 'datang',
    nama: 'Budi Santoso',
    unit: 'Blok B3 No. 12',
    statusTinggal: 'Kontrak / Sewa Tahunan',
    files: [
        { id: 'ktp', name: 'eKTP_BudiSantoso.jpg', sizeLabel: '1.8 MB', kind: 'Terenkripsi' },
        { id: 'kk', name: 'KartuKeluarga_Terbaru.pdf', sizeLabel: '2.4 MB', kind: 'Disetujui Dukcapil' },
    ],
    submittedAt: '2025-06-16T09:30:00',
};

function formatSubmittedAt(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '16 Jun 2025, 09:30 WIB';
    }
    return `${date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${date.toLocaleTimeString(
        'id-ID',
        { hour: '2-digit', minute: '2-digit' },
    )} WIB`;
}

export default function PindahDatangTracking({ permohonan = null, history = [] }) {
    if (!permohonan && (!history || history.length === 0)) {
        return (
            <WargaLayout>
                <Head title="Tracking Status Laporan" />
                <div className="mx-auto max-w-2xl py-16 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6F6F4] text-[#0F685D] border border-[#BDE8E2] shadow-sm">
                        <FileText className="h-8 w-8" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-[#1A253C]">
                        Belum Ada Laporan Mutasi Terkirim
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-xs text-[#718096] leading-relaxed">
                        Anda belum pernah mengirim laporan kepindahan atau kedatangan warga ke pengurus RT 01/RW 08 Sukatani.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <Link
                            href={route('portal.pindah-datang.create')}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0F685D] hover:bg-[#0B5249] px-6 py-3 text-xs font-semibold text-white shadow-sm transition cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Lapor Pindah / Datang Sekarang</span>
                        </Link>
                    </div>
                </div>
            </WargaLayout>
        );
    }

    const report = permohonan || (history && history.length > 0 ? history[0] : DEFAULT_REPORT);

    const rawTicket = report.ticket || report.nomor_tiket || '#PD-2025-0616-01';
    const ticketClean = rawTicket.replace('#MUT-', '#PD-');
    const displayTicket = ticketClean.startsWith('#') ? ticketClean : `#${ticketClean}`;

    const steps = useMemo(() => {
        const status = report.status || 'menunggu_pemeriksaan';
        const isSelesai = status === 'selesai';
        const isSedangDiperiksa = status === 'sedang_diperiksa';
        const isRevisi = status === 'perlu_revisi';

        return [
            {
                n: 1,
                title: 'Tahap 1: Laporan Terkirim',
                desc: `${formatSubmittedAt(report.submittedAt)}`,
                note: 'Selesai Diverifikasi Sistem',
                state: 'done',
            },
            {
                n: 2,
                title: 'Tahap 2: Diperiksa Ketua RT',
                desc: isSelesai || isSedangDiperiksa ? 'Selesai Diperiksa' : isRevisi ? 'Perlu Revisi Dokumen' : 'Sedang Berlangsung',
                note: isRevisi ? (report.alasanRevisi || 'Ada catatan perbaikan pengurus') : 'Penelitian kelengkapan domisili',
                state: isSelesai || isSedangDiperiksa ? 'done' : 'current',
            },
            {
                n: 3,
                title: 'Tahap 3: Verifikasi Berkas',
                desc: isSelesai ? 'Berkas Valid' : isSedangDiperiksa ? 'Sedang Diverifikasi' : 'Menunggu Tahap 2',
                note: 'Pencocokan e-KTP & Kartu Keluarga',
                state: isSelesai ? 'done' : isSedangDiperiksa ? 'current' : 'todo',
            },
            {
                n: 4,
                title: 'Tahap 4: Penerbitan Surat & Buku Induk',
                desc: isSelesai ? 'Disetujui & Masuk Buku Induk RT' : 'Tahap Akhir',
                note: isSelesai ? 'Data Mutasi Berhasil Dicatat Resmi' : 'Update Buku Induk RT & TTE Surat',
                state: isSelesai ? 'done' : 'todo',
            },
        ];
    }, [report]);

    const isSelesai = report.status === 'selesai';
    const isRevisi = report.status === 'perlu_revisi';
    const isSedangDiperiksa = report.status === 'sedang_diperiksa';

    return (
        <WargaLayout>
            <Head title="Tracking Status Laporan" />

            {/* Top Status Banner */}
            <div
                className={`mb-5 flex items-start justify-between gap-3 rounded-2xl border px-4 py-4 ${
                    isSelesai
                        ? 'border-[#BFE8D8] bg-[#E7F8F0]'
                        : isRevisi
                          ? 'border-[#FECDD3] bg-[#FFF1F2]'
                          : isSedangDiperiksa
                            ? 'border-[#BAE6FD] bg-[#F0F9FF]'
                            : 'border-[#FDE68A] bg-[#FFFBEB]'
                }`}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ${
                            isSelesai
                                ? 'text-[#11704E]'
                                : isRevisi
                                  ? 'text-[#E11D48]'
                                  : isSedangDiperiksa
                                    ? 'text-[#0284C7]'
                                    : 'text-[#D97706]'
                        }`}
                    >
                        {isSelesai ? (
                            <CheckCircle2 className="h-6 w-6" />
                        ) : isRevisi ? (
                            <AlertTriangle className="h-6 w-6" />
                        ) : (
                            <Clock3 className="h-6 w-6" />
                        )}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <p
                                className={`font-heading text-[15px] font-extrabold ${
                                    isSelesai
                                        ? 'text-[#0F5A45]'
                                        : isRevisi
                                          ? 'text-[#9F1239]'
                                          : isSedangDiperiksa
                                            ? 'text-[#0369A1]'
                                            : 'text-[#92400E]'
                                }`}
                            >
                                {isSelesai
                                    ? 'Laporan Mutasi Disetujui & Masuk Buku Induk RT!'
                                    : isRevisi
                                      ? 'Laporan Memerlukan Perbaikan / Revisi Berkas!'
                                      : isSedangDiperiksa
                                        ? 'Laporan Sedang Dalam Proses Verifikasi Lapangan'
                                        : 'Laporan Berhasil Terkirim ke Ketua RT 01/RW 08!'}
                            </p>
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                                    isSelesai
                                        ? 'bg-[#11704E]'
                                        : isRevisi
                                          ? 'bg-[#E11D48]'
                                          : isSedangDiperiksa
                                            ? 'bg-[#0284C7]'
                                            : 'bg-[#D97706]'
                                }`}
                            >
                                {report.statusLabel || 'Menunggu Pemeriksaan'}
                            </span>
                        </div>
                        <p
                            className={`mt-1 text-[12px] leading-relaxed ${
                                isSelesai
                                    ? 'text-[#0F5A45]/90'
                                    : isRevisi
                                      ? 'text-[#9F1239]/90'
                                      : isSedangDiperiksa
                                        ? 'text-[#0369A1]/90'
                                        : 'text-[#92400E]/90'
                            }`}
                        >
                            {isRevisi ? (
                                <>
                                    <strong>Catatan Pengurus:</strong> {report.alasanRevisi || 'Silakan lengkapi berkas atau kontak pengurus RT.'}
                                </>
                            ) : (
                                <>
                                    Permohonan {report.jenis === 'pindah' ? 'pindah' : 'datang'} warga Anda telah terhubung dengan antrean pengurus{' '}
                                    <strong>RT 01/RW 08 Sukatani</strong>. No. Tiket: <span className="font-semibold">{displayTicket}</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F685D]">
                        Perubahan Data Hunian • RT 01 / RW 08
                    </p>
                    <h1 className="mt-1 font-heading text-[26px] font-extrabold tracking-tight text-[#1A253C]">
                        Tracking Status &amp; Riwayat Laporan
                    </h1>
                    <p className="mt-1 text-[13px] text-[#68748A]">
                        Pantau progres verifikasi permohonan kepindahan dan kedatangan secara transparan dari database.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {history && history.length > 1 && (
                        <div className="flex items-center gap-1.5 mr-2">
                            <span className="text-xs text-[#718096]">Tiket:</span>
                            <select
                                value={report.ticket || report.nomor_tiket}
                                onChange={(e) => {
                                    window.location.href = route('portal.pindah-datang.tracking', { ticket: e.target.value });
                                }}
                                className="rounded-xl border border-[#CBD5E1] bg-white px-2.5 py-2 text-xs font-semibold text-[#1A253C] focus:border-[#0F685D] focus:outline-none"
                            >
                                {history.map((h) => (
                                    <option key={h.ticket} value={h.ticket}>
                                        {h.ticket} - {h.jenis === 'datang' ? 'Datang' : 'Pindah'} ({h.statusLabel})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E6EAF2] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#4B5568] hover:bg-slate-50 transition cursor-pointer"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Perbarui
                    </button>
                    <Link
                        href={route('portal.pindah-datang.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0F685D] hover:bg-[#0B5249] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        Buat Laporan Baru
                    </Link>
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                <section className="rounded-2xl border border-[#E6EAF2] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-3 rounded-2xl bg-[#F4F7FB] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#147A72] shadow-sm">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                                    Nomor Pelaporan Aktif
                                </p>
                                <p className="font-heading text-[18px] font-extrabold">{displayTicket}</p>
                            </div>
                        </div>
                        {report.status === 'selesai' ? (
                            <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#E7F6EF] px-3 py-1 text-[12px] font-semibold text-[#11704E]">
                                <span className="h-2 w-2 rounded-full bg-[#11704E]" />
                                Selesai / Terverifikasi
                            </span>
                        ) : report.status === 'sedang_diperiksa' ? (
                            <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#FFF1E8] px-3 py-1 text-[12px] font-semibold text-[#D46B08]">
                                <span className="h-2 w-2 rounded-full bg-[#D46B08]" />
                                Sedang Diperiksa
                            </span>
                        ) : report.status === 'perlu_revisi' ? (
                            <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#FFEAE8] px-3 py-1 text-[12px] font-semibold text-[#E24B4A]">
                                <span className="h-2 w-2 rounded-full bg-[#E24B4A]" />
                                Perlu Revisi Dokumen
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#E8F0FF] px-3 py-1 text-[12px] font-semibold text-[#2F6BFF]">
                                <span className="h-2 w-2 rounded-full bg-[#2F6BFF]" />
                                Menunggu Pemeriksaan
                            </span>
                        )}
                    </div>

                    <div className="mt-5 grid gap-4 border-b border-[#EEF1F6] pb-5 sm:grid-cols-3">
                        <div>
                            <p className="text-[11px] text-[#68748A]">Jenis Pelaporan</p>
                            <p className="mt-1 text-[13px] font-bold text-[#147A72]">
                                {report.jenis === 'pindah' ? 'Lapor Warga Pindah' : 'Lapor Warga Datang'}
                            </p>
                            <p className="text-[11px] text-[#68748A]">{report.unit}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-[#68748A]">Pemohon / Kepala Keluarga</p>
                            <p className="mt-1 text-[13px] font-bold">{report.nama} &amp; Keluarga</p>
                            <p className="text-[11px] text-[#68748A]">Total 3 Anggota Keluarga</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-[#68748A]">Waktu Pengajuan</p>
                            <p className="mt-1 text-[13px] font-bold">{formatSubmittedAt(report.submittedAt)}</p>
                            <p className="inline-flex items-center gap-1 text-[11px] text-[#147A72]">
                                <Clock3 className="h-3.5 w-3.5" />
                                15 Menit yang lalu
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#68748A]">
                            Progres Verifikasi Rukun Tetangga
                        </p>
                        <div className="mt-5 grid grid-cols-4 gap-2">
                            {steps.map((step, index) => (
                                <div key={step.n} className="relative text-center">
                                    {index < steps.length - 1 && (
                                        <span
                                            className={`absolute left-[calc(50%+18px)] right-[-50%] top-4 h-[3px] ${
                                                step.state === 'done' ? 'bg-[#147A72]' : 'bg-[#E6EAF2]'
                                            }`}
                                        />
                                    )}
                                    <div
                                        className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ${
                                            step.state === 'done'
                                                ? 'bg-[#147A72] text-white'
                                                : step.state === 'current'
                                                  ? 'bg-[#2F6BFF] text-white'
                                                  : 'bg-[#EEF1F6] text-[#98A2B3]'
                                        }`}
                                    >
                                        {step.state === 'done' ? <CheckCircle2 className="h-4 w-4" /> : step.state === 'current' ? <Search className="h-4 w-4" /> : step.n}
                                    </div>
                                    <p className={`mt-3 text-[12px] font-bold ${step.state === 'todo' ? 'text-[#98A2B3]' : 'text-[#12233F]'}`}>
                                        {step.title}
                                    </p>
                                    <p className="mt-1 text-[11px] text-[#68748A]">{step.desc}</p>
                                    <p className={`mt-1 text-[11px] ${step.state === 'done' ? 'font-semibold text-[#147A72]' : 'text-[#98A2B3]'}`}>
                                        {step.note}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3 rounded-2xl border border-[#D7E4FF] bg-[#F3F7FF] px-4 py-4">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2F6BFF]" />
                        <div>
                            <p className="text-[13px] font-bold text-[#1D4ED8]">Estimasi Waktu Pelayanan (SLA)</p>
                            <p className="mt-1 text-[12px] leading-relaxed text-[#3B5B9A]">
                                Estimasi verifikasi oleh Ketua RT adalah <strong>1×24 jam kerja</strong>. Anda akan
                                menerima notifikasi otomatis WhatsApp/Sistem bila diperlukan revisi berkas atau saat
                                surat pengantar siap diunduh.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-[#EEF1F6] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl border border-[#E6EAF2] bg-[#F4F7FB] px-4 py-2.5 text-[13px] font-semibold text-[#4B5568]"
                            >
                                <Download className="h-4 w-4" />
                                Unduh Bukti Pengajuan (PDF)
                            </button>
                            <a
                                href="https://wa.me/6281298765432"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#147A72] px-4 py-2.5 text-[13px] font-semibold text-white"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp Pengurus RT
                            </a>
                        </div>
                    </div>
                </section>

                <aside className="space-y-4">
                    <div className="rounded-2xl border border-[#E6EAF2] bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-[12px] font-bold uppercase tracking-wide text-[#68748A]">Berkas Dilampirkan</p>
                            <p className="text-[11px] font-semibold text-[#147A72]">
                                {report.files && report.files.length > 0 ? `${report.files.length} Dokumen Lengkap` : '2 Dokumen Lengkap'}
                            </p>
                        </div>
                        <div className="mt-3 space-y-2">
                            {(report.files && report.files.length > 0 ? report.files : DEFAULT_REPORT.files).map((file) => (
                                <div key={file.id || file.name} className="flex items-center gap-3 rounded-xl bg-[#F7F9FC] px-3 py-3">
                                    <FileText className="h-4 w-4 text-[#147A72]" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[12px] font-semibold">{file.name}</p>
                                        <p className="text-[10px] text-[#68748A]">
                                            {file.sizeLabel} • {file.kind}
                                        </p>
                                    </div>
                                    {file.url ? (
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            title="Buka Pratinjau Dokumen"
                                            className="rounded-lg p-1 text-[#98A2B3] hover:bg-white hover:text-[#147A72]"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <Eye className="h-4 w-4 text-[#98A2B3]" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 flex items-center gap-2 rounded-xl bg-[#F4F7FB] px-3 py-2 text-[11px] text-[#68748A]">
                            <ShieldCheck className="h-4 w-4 text-[#147A72]" />
                            Privasi dilindungi UU Perlindungan Data Pribadi (PDP)
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E6EAF2] bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F6EF] text-[#147A72]">
                                <Clock3 className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold">Jadwal Sekretariat RT 01</p>
                                <p className="text-[11px] text-[#68748A]">Pelayanan Tatap Muka &amp; Legalitas</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-[12px]">
                            <div className="flex justify-between">
                                <span>Senin – Jumat</span>
                                <span className="font-semibold">19:30 – 21:00 WIB</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sabtu &amp; Minggu</span>
                                <span className="font-semibold">Dengan Perjanjian</span>
                            </div>
                            <p className="flex items-start gap-2 pt-1 text-[#68748A]">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                Pos Balai Warga RT 01 (Samping Lapangan)
                            </p>
                            <div className="flex items-center justify-between pt-1">
                                <p className="inline-flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5" />
                                    Kontak Sekretaris RT 0812-9876-5432
                                </p>
                                <span className="rounded-full bg-[#E7F6EF] px-2 py-0.5 text-[10px] font-semibold text-[#11704E]">
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E6EAF2] bg-white p-4 shadow-sm">
                        <div className="flex items-start gap-2">
                            <HelpCircle className="mt-0.5 h-4 w-4 text-[#68748A]" />
                            <div>
                                <p className="text-[13px] font-bold">Butuh Surat Pengantar Cepat?</p>
                                <p className="mt-1 text-[12px] leading-relaxed text-[#68748A]">
                                    Untuk keperluan darurat rumah sakit atau kepolisian, gunakan fitur prioritas di pos
                                    ronda atau kontak langsung nomor darurat RT.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </WargaLayout>
    );
}
