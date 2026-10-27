import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Check,
    CheckCircle2,
    CreditCard,
    Download,
    Eye,
    FileText,
    Home,
    MapPin,
    MessageCircle,
    Paperclip,
    Printer,
    RotateCcw,
    RotateCw,
    Save,
    Share2,
    ShieldAlert,
    ShieldCheck,
    Users,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function MutasiShow({ mutation }) {
    // Active Document Tab
    const [activeDocIndex, setActiveDocIndex] = useState(0);

    // Checklist states (interactive)
    const [checklistAlamat, setChecklistAlamat] = useState(mutation.checklist.alamat);
    const [checklistNik, setChecklistNik] = useState(mutation.checklist.nik);
    const [checklistDokumen, setChecklistDokumen] = useState(mutation.checklist.dokumen);
    const [catatan, setCatatan] = useState(mutation.catatan_pemeriksaan || '');

    // Document physical check status map (docId -> 'valid' | 'buram' | 'belum_diperiksa')
    const [docStatuses, setDocStatuses] = useState(() => {
        const initial = {};
        mutation.dokumen.forEach((d) => {
            initial[d.id] = d.status_pemeriksaan || 'belum_diperiksa';
        });
        return initial;
    });

    // Canvas transformation states
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Modals
    const [modalRevisiOpen, setModalRevisiOpen] = useState(false);
    const [modalApproveOpen, setModalApproveOpen] = useState(false);
    const [alasanRevisi, setAlasanRevisi] = useState(mutation.alasan_revisi || '');
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const activeDoc = mutation.dokumen[activeDocIndex] || mutation.dokumen[0] || null;

    // Hitung tingkat kelengkapan checklist
    const completedChecklistCount = useMemo(() => {
        let count = 0;
        if (checklistAlamat) count++;
        if (checklistNik) count++;
        if (checklistDokumen) count++;
        return count;
    }, [checklistAlamat, checklistNik, checklistDokumen]);

    const allChecklistsCompleted = completedChecklistCount === 3;

    // Periksa apakah ada berkas buram
    const hasBuramDocs = Object.values(docStatuses).some((s) => s === 'buram');

    // Pan / Drag handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const resetTransform = () => {
        setZoom(100);
        setRotation(0);
        setPan({ x: 0, y: 0 });
    };

    // Actions
    const handleSaveDraft = () => {
        setProcessing(true);
        setErrorMessage('');
        router.post(
            route('admin.mutasi.save-draft', mutation.id),
            {
                checklist_alamat: checklistAlamat,
                checklist_nik: checklistNik,
                checklist_dokumen: checklistDokumen,
                catatan_pemeriksaan: catatan,
                dokumen_status: docStatuses,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onError: (errors) => setErrorMessage(Object.values(errors)[0] || 'Gagal menyimpan draf.'),
            },
        );
    };

    const handleRequestRevision = (e) => {
        e.preventDefault();
        if (!alasanRevisi.trim()) {
            setErrorMessage('Alasan revisi wajib diisi.');
            return;
        }

        const buramIds = Object.entries(docStatuses)
            .filter(([_, status]) => status === 'buram')
            .map(([id]) => parseInt(id, 10));

        setProcessing(true);
        router.post(
            route('admin.mutasi.request-revision', mutation.id),
            {
                alasan_revisi: alasanRevisi,
                catatan_pemeriksaan: catatan,
                dokumen_buram_ids: buramIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setModalRevisiOpen(false);
                },
                onFinish: () => setProcessing(false),
                onError: (errors) => setErrorMessage(Object.values(errors)[0] || 'Gagal meminta revisi.'),
            },
        );
    };

    const handleApprove = () => {
        setProcessing(true);
        setErrorMessage('');
        router.post(
            route('admin.mutasi.approve', mutation.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setModalApproveOpen(false);
                },
                onFinish: () => setProcessing(false),
                onError: (errors) => setErrorMessage(Object.values(errors)[0] || 'Gagal menyetujui permohonan.'),
            },
        );
    };

    const currentDocStatus = activeDoc ? docStatuses[activeDoc.id] || 'belum_diperiksa' : 'belum_diperiksa';

    return (
        <AdminLayout>
            <Head title={`Verifikasi ${mutation.nomor_tiket} - ${mutation.pemohon.nama}`} />

            {/* Subheader & Top Bar */}
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E4E9F0] pb-4 lg:flex-row lg:items-center">
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href={route('admin.mutasi.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCE6] bg-white px-3.5 py-2 text-xs font-bold text-[#39445A] shadow-sm hover:bg-[#F8FAFC] transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Daftar Antrean</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 rounded-xl bg-[#F1F5F9] px-3 py-1.5 font-mono text-xs font-bold text-[#17233C]">
                        <span>#</span>
                        <span>{mutation.nomor_tiket}</span>
                    </div>

                    {mutation.status === 'menunggu_pemeriksaan' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-3 py-1 text-xs font-bold text-[#B45309]">
                            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                            <span>Menunggu Pemeriksaan</span>
                        </span>
                    )}
                    {mutation.status === 'sedang_diperiksa' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BAE6FD] bg-[#E0F2FE] px-3 py-1 text-xs font-bold text-[#0369A1]">
                            <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                            <span>Dokumen Diperiksa</span>
                        </span>
                    )}
                    {mutation.status === 'perlu_revisi' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FECDD3] bg-[#FFE4E6] px-3 py-1 text-xs font-bold text-[#BE123C]">
                            <span className="h-2 w-2 rounded-full bg-[#E11D48]" />
                            <span>Perlu Revisi</span>
                        </span>
                    )}
                    {mutation.status === 'selesai' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#15803D]">
                            <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                            <span>Selesai / Terdaftar</span>
                        </span>
                    )}

                    <span className="text-xs text-[#68748A]">
                        Waktu Masuk: <span className="font-medium text-[#17233C]">{mutation.waktu_masuk}</span>
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-[#E4E9F0] bg-white px-3.5 py-2 shadow-sm text-xs">
                        <CheckCircle2 className="h-4 w-4 text-[#0F766E]" />
                        <span className="text-[#68748A]">Tingkat Kelengkapan:</span>
                        <span className="font-bold text-[#17233C]">
                            {completedChecklistCount} dari 3 Syarat Terpenuhi
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        title="Cetak Berkas"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5DCE6] bg-white text-[#39445A] hover:bg-[#F8FAFC] shadow-sm"
                    >
                        <Printer className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Error Banner if any */}
            {errorMessage && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-[#FECDD3] bg-[#FFF1F2] p-4 text-xs font-semibold text-[#E11D48]">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errorMessage}</span>
                    </div>
                    <button type="button" onClick={() => setErrorMessage('')}>
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Two-Column Grid Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 pb-24">
                {/* ================= LEFT COLUMN: Pemohon Info & Checklist (7 cols) ================= */}
                <div className="space-y-6 lg:col-span-7">
                    {/* Pemohon Header Card */}
                    <div className="rounded-2xl border border-[#E4E9F0] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#147A72] text-xl font-bold text-white shadow-md">
                                    {mutation.pemohon.nama.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-heading text-lg font-bold text-[#17233C]">
                                            {mutation.pemohon.nama}
                                        </h2>
                                        <CheckCircle2 className="h-4 w-4 text-[#0F766E]" />
                                    </div>
                                    <p className="text-xs text-[#68748A]">
                                        Permohonan mutasi masuk warga RT 01 / RW 08
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#1D4ED8]">
                                {mutation.jenis_label}
                            </span>
                        </div>

                        {/* 4 Grid Info Cards */}
                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {/* NIK */}
                            <div className="rounded-xl border border-[#E4E9F0] bg-[#F8FAFC] p-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-[#68748A]">
                                        Nomor Induk Kependudukan (NIK)
                                    </span>
                                    <span className="rounded bg-[#DCFCE7] px-1.5 py-0.5 text-[10px] font-bold text-[#15803D]">
                                        16 Digit
                                    </span>
                                </div>
                                <p className="mt-1 font-mono text-sm font-bold text-[#17233C]">
                                    {mutation.pemohon.nik}
                                </p>
                            </div>

                            {/* KK */}
                            <div className="rounded-xl border border-[#E4E9F0] bg-[#F8FAFC] p-3.5">
                                <span className="text-[11px] font-medium text-[#68748A]">
                                    Nomor Kartu Keluarga (KK)
                                </span>
                                <p className="mt-1 font-mono text-sm font-bold text-[#17233C]">
                                    {mutation.pemohon.no_kk}
                                </p>
                            </div>

                            {/* Tanggal Rencana */}
                            <div className="rounded-xl border border-[#E4E9F0] bg-[#F8FAFC] p-3.5">
                                <span className="text-[11px] font-medium text-[#68748A]">
                                    Tanggal Rencana Kedatangan
                                </span>
                                <p className="mt-1 text-xs font-bold text-[#17233C]">
                                    {mutation.pemohon.tanggal_rencana}
                                </p>
                            </div>

                            {/* Kontak WhatsApp */}
                            <div className="rounded-xl border border-[#E4E9F0] bg-[#F8FAFC] p-3.5">
                                <span className="text-[11px] font-medium text-[#68748A]">Kontak WhatsApp</span>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-[#17233C]">
                                        {mutation.pemohon.telepon || '-'}
                                    </span>
                                    {mutation.pemohon.whatsapp_url && (
                                        <a
                                            href={mutation.pemohon.whatsapp_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 rounded-lg bg-[#22C55E] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#16A34A] transition"
                                        >
                                            <MessageCircle className="h-3 w-3" />
                                            <span>Chat</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Unit Hunian */}
                        <div className="mt-4 rounded-xl border border-[#E4E9F0] bg-white p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#17233C]">
                                    <Home className="h-4 w-4 text-[#0F766E]" />
                                    <span>Unit Hunian di RT 01 / RW 08:</span>
                                </div>
                                <span className="rounded-lg bg-[#0F766E] px-2.5 py-1 text-xs font-bold text-white">
                                    {mutation.unit_hunian.nama}
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-[#566175]">
                                Status:{' '}
                                <span className="font-bold text-[#17233C]">
                                    {mutation.unit_hunian.status_tinggal}
                                </span>{' '}
                                • Pemilik Rumah:{' '}
                                <span className="font-medium text-[#17233C]">
                                    {mutation.unit_hunian.nama_pemilik}
                                </span>
                            </p>
                        </div>

                        {/* Alamat Asal KTP */}
                        <div className="mt-3 rounded-xl border border-[#E4E9F0] bg-white p-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#17233C]">
                                <MapPin className="h-4 w-4 text-[#0F766E]" />
                                <span>Alamat Asal Sesuai KTP</span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-[#566175]">
                                {mutation.alamat_asal}
                            </p>
                        </div>

                        {/* Rincian Pengikut Pindah */}
                        {mutation.rincian_pengikut.length > 0 && (
                            <div className="mt-4 rounded-xl border border-[#E4E9F0] bg-[#F8FAFC] p-4">
                                <div className="flex items-center justify-between border-b border-[#E4E9F0] pb-2 text-xs">
                                    <div className="flex items-center gap-2 font-bold text-[#17233C]">
                                        <Users className="h-4 w-4 text-[#0F766E]" />
                                        <span>Rincian Pengikut Pindah ({mutation.rincian_pengikut.length} Jiwa)</span>
                                    </div>
                                    <span className="text-[#68748A]">
                                        Istri &amp; {mutation.rincian_pengikut.length - 1} Anak
                                    </span>
                                </div>

                                <div className="mt-3 space-y-2 text-xs">
                                    {mutation.rincian_pengikut.map((p, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                                                <span className="font-bold text-[#17233C]">
                                                    {p.nama}{' '}
                                                    <span className="font-normal text-[#68748A]">
                                                        ({p.hubungan} • {p.umur} Thn)
                                                    </span>
                                                </span>
                                            </div>
                                            <span className="font-mono text-[11px] text-[#68748A]">
                                                {p.nik_masked}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Checklist Verifikasi Lapangan RT Card */}
                    <div className="rounded-2xl border border-[#E4E9F0] bg-white p-6 shadow-sm space-y-5">
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="font-heading text-base font-bold text-[#17233C]">
                                    Checklist Verifikasi Lapangan RT
                                </h3>
                                <span className="rounded-full bg-[#E7F6EF] px-2.5 py-0.5 text-xs font-bold text-[#0F766E]">
                                    {completedChecklistCount} dari 3 Lengkap
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs text-[#68748A]">
                                Tinjauan cepat sebelum persetujuan akhir diterbitkan
                            </p>
                        </div>

                        {/* Checklist Item 1 */}
                        <label
                            className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition ${
                                checklistAlamat
                                    ? 'border-[#0F766E]/40 bg-[#F0FDF4]'
                                    : 'border-[#E4E9F0] bg-white hover:bg-[#F8FAFC]'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={checklistAlamat}
                                onChange={(e) => setChecklistAlamat(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-[#D5DCE6] text-[#0F766E] focus:ring-[#0F766E]"
                            />
                            <div>
                                <p className="text-xs font-bold text-[#17233C]">
                                    Kesesuaian Alamat Tujuan &amp; Kapasitas Rumah
                                </p>
                                <p className="mt-1 text-xs text-[#566175] leading-relaxed">
                                    Rumah {mutation.unit_hunian.nama} telah dikonfirmasi kosong &amp; disewakan oleh pemilik rumah ({mutation.unit_hunian.nama_pemilik}).
                                </p>
                            </div>
                        </label>

                        {/* Checklist Item 2 */}
                        <label
                            className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition ${
                                checklistNik
                                    ? 'border-[#0F766E]/40 bg-[#F0FDF4]'
                                    : 'border-[#E4E9F0] bg-white hover:bg-[#F8FAFC]'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={checklistNik}
                                onChange={(e) => setChecklistNik(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-[#D5DCE6] text-[#0F766E] focus:ring-[#0F766E]"
                            />
                            <div>
                                <p className="text-xs font-bold text-[#17233C]">
                                    Validasi Format NIK Kependudukan
                                </p>
                                <p className="mt-1 text-xs text-[#566175] leading-relaxed">
                                    Struktur NIK terdaftar sinkron dengan format Disdukcapil Kota Depok (Prov 32, Kota 75).
                                </p>
                            </div>
                        </label>

                        {/* Checklist Item 3 */}
                        <label
                            className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition ${
                                checklistDokumen
                                    ? 'border-[#0F766E]/40 bg-[#F0FDF4]'
                                    : 'border-[#FDE68A] bg-[#FFFBEB] hover:bg-[#FEF3C7]/40'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={checklistDokumen}
                                onChange={(e) => setChecklistDokumen(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-[#D5DCE6] text-[#0F766E] focus:ring-[#0F766E]"
                            />
                            <div>
                                <p className="text-xs font-bold text-[#17233C]">
                                    Validasi Fisik e-KTP &amp; Kartu Keluarga
                                </p>
                                <p className="mt-1 text-xs text-[#566175] leading-relaxed">
                                    Periksa keterbacaan scan dokumen digital di panel kanan, pastikan tidak buram atau kadaluarsa.
                                </p>
                            </div>
                        </label>

                        {/* Catatan Tambahan */}
                        <div>
                            <label className="block text-xs font-bold text-[#17233C] mb-1.5">
                                Catatan Tambahan untuk Petugas RW / Buku Tamu RT:
                            </label>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                rows="3"
                                placeholder="Tuliskan catatan internal jika ada (misal: konfirmasi lisan via WhatsApp selesai)..."
                                className="w-full rounded-xl border border-[#D5DCE6] p-3 text-xs text-[#17233C] placeholder-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT COLUMN: Document Viewer & Physical Inspection (5 cols) ================= */}
                <div className="space-y-6 lg:col-span-5">
                    <div className="rounded-2xl border border-[#E4E9F0] bg-white p-6 shadow-sm">
                        {/* Document Tabs */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E9F0] pb-3">
                            {mutation.dokumen.map((doc, idx) => {
                                const isActive = idx === activeDocIndex;
                                return (
                                    <button
                                        key={doc.id}
                                        type="button"
                                        onClick={() => {
                                            setActiveDocIndex(idx);
                                            resetTransform();
                                        }}
                                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                            isActive
                                                ? 'bg-[#E7F6EF] text-[#0F766E] ring-1 ring-[#0F766E]/30'
                                                : 'bg-[#F8FAFC] text-[#68748A] hover:bg-[#F1F5F9]'
                                        }`}
                                    >
                                        {doc.jenis_dokumen === 'ktp' ? (
                                            <CreditCard className="h-3.5 w-3.5" />
                                        ) : (
                                            <FileText className="h-3.5 w-3.5" />
                                        )}
                                        <span>{doc.nama_dokumen}</span>
                                        {doc.file_size_label && (
                                            <span className="rounded bg-white/80 px-1 py-0.5 text-[10px] text-[#566175]">
                                                {doc.file_size_label}
                                            </span>
                                        )}
                                        {doc.keterangan_tambahan && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Viewer Canvas */}
                        <div className="mt-4">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between rounded-t-xl bg-[#1E293B] px-4 py-2.5 text-white text-xs">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setZoom((z) => Math.max(50, z - 25))}
                                        title="Zoom Out"
                                        className="rounded p-1 hover:bg-white/10"
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </button>
                                    <span className="font-mono text-xs font-semibold">{zoom}%</span>
                                    <button
                                        type="button"
                                        onClick={() => setZoom((z) => Math.min(250, z + 25))}
                                        title="Zoom In"
                                        className="rounded p-1 hover:bg-white/10"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </button>
                                    <span className="h-4 w-px bg-white/20 mx-1" />
                                    <button
                                        type="button"
                                        onClick={resetTransform}
                                        title="Reset"
                                        className="rounded p-1 hover:bg-white/10"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRotation((r) => (r + 90) % 360)}
                                        title="Rotate 90"
                                        className="rounded p-1 hover:bg-white/10"
                                    >
                                        <RotateCw className="h-4 w-4" />
                                    </button>
                                </div>

                                {activeDoc?.download_url && (
                                    <a
                                        href={activeDoc.download_url}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/25 transition"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Unduh Berkas</span>
                                    </a>
                                )}
                            </div>

                            {/* Canvas Area */}
                            <div
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-b-xl border border-t-0 border-[#1E293B] bg-[#F1F5F9] p-4 cursor-grab active:cursor-grabbing select-none"
                            >
                                {activeDoc ? (
                                    <div
                                        style={{
                                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
                                            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                                        }}
                                        className="max-h-[380px] max-w-full drop-shadow-md"
                                    >
                                        <img
                                            src={activeDoc.preview_url}
                                            alt={activeDoc.nama_dokumen}
                                            className="rounded-lg object-contain"
                                            draggable={false}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center text-xs text-[#68748A]">
                                        <FileText className="mx-auto h-8 w-8 text-[#94A3B8]" />
                                        <p className="mt-2">Dokumen tidak tersedia</p>
                                    </div>
                                )}

                                <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[10px] text-white backdrop-blur-sm">
                                    Geser untuk memindahkan kanvas
                                </div>
                            </div>
                        </div>

                        {/* Status Pemeriksaan Fisik Berkas Ini */}
                        <div className="mt-5 border-t border-[#E4E9F0] pt-4">
                            <p className="text-xs font-bold text-[#17233C] mb-2.5">
                                Status Pemeriksaan Fisik Berkas Ini:
                            </p>

                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {/* Option 1: Valid & Jelas */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (activeDoc) {
                                            setDocStatuses((prev) => ({ ...prev, [activeDoc.id]: 'valid' }));
                                        }
                                    }}
                                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                                        currentDocStatus === 'valid'
                                            ? 'border-[#16A34A] bg-[#F0FDF4] ring-1 ring-[#16A34A]'
                                            : 'border-[#E4E9F0] bg-white hover:bg-[#F8FAFC]'
                                    }`}
                                >
                                    <div
                                        className={`flex h-4 w-4 mt-0.5 items-center justify-center rounded-full border ${
                                            currentDocStatus === 'valid'
                                                ? 'border-[#16A34A] bg-[#16A34A] text-white'
                                                : 'border-[#94A3B8]'
                                        }`}
                                    >
                                        {currentDocStatus === 'valid' && <Check className="h-3 w-3" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#17233C]">Berkas Valid &amp; Jelas</p>
                                        <p className="text-[10px] text-[#566175] mt-0.5">Teks terbaca &amp; foto asli</p>
                                    </div>
                                </button>

                                {/* Option 2: Buram / Perlu Perbaikan */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (activeDoc) {
                                            setDocStatuses((prev) => ({ ...prev, [activeDoc.id]: 'buram' }));
                                        }
                                    }}
                                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                                        currentDocStatus === 'buram'
                                            ? 'border-[#E11D48] bg-[#FFF1F2] ring-1 ring-[#E11D48]'
                                            : 'border-[#E4E9F0] bg-white hover:bg-[#F8FAFC]'
                                    }`}
                                >
                                    <div
                                        className={`flex h-4 w-4 mt-0.5 items-center justify-center rounded-full border ${
                                            currentDocStatus === 'buram'
                                                ? 'border-[#E11D48] bg-[#E11D48] text-white'
                                                : 'border-[#94A3B8]'
                                        }`}
                                    >
                                        {currentDocStatus === 'buram' && <Check className="h-3 w-3" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#E11D48]">Buram / Perlu Perbaikan</p>
                                        <p className="text-[10px] text-[#566175] mt-0.5">Memerlukan upload ulang</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* SKPWNI Document Card if available */}
                        {mutation.dokumen.some((d) => d.jenis_dokumen === 'skpwni') && (
                            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E4E9F0] bg-[#F8FAFC] p-3 text-xs">
                                <div className="flex items-center gap-2.5">
                                    <Paperclip className="h-4 w-4 text-[#0F766E]" />
                                    <div>
                                        <p className="font-bold text-[#17233C]">
                                            Surat Pengantar Pindah Asal (SKPWNI)
                                        </p>
                                        <p className="text-[10px] text-[#68748A]">
                                            Dilampirkan terpisah • No: 471.2/108/Kel.PC/2025
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const skIdx = mutation.dokumen.findIndex((d) => d.jenis_dokumen === 'skpwni');
                                        if (skIdx >= 0) {
                                            setActiveDocIndex(skIdx);
                                            resetTransform();
                                        }
                                    }}
                                    className="inline-flex items-center gap-1 font-bold text-[#0F766E] hover:underline"
                                >
                                    <span>Lihat</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= FIXED BOTTOM ACTION BAR ================= */}
            <div className="fixed bottom-0 left-[248px] right-0 z-30 flex flex-col justify-between gap-3 border-t border-[#E4E9F0] bg-white/95 px-6 py-3.5 backdrop-blur shadow-lg sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5 text-xs">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F6EF] text-[#0F766E]">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-bold text-[#17233C]">
                            Status Hasil Peninjauan:{' '}
                            <span className="text-[#0F766E]">
                                {mutation.dokumen.length} Dokumen Siap Divalidasi
                            </span>
                        </p>
                        <p className="text-[11px] text-[#566175]">
                            {allChecklistsCompleted
                                ? '• Memenuhi Syarat Administratif'
                                : `• ${completedChecklistCount} dari 3 Syarat Administratif Terpenuhi`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Button Minta Revisi / Tolak */}
                    <button
                        type="button"
                        onClick={() => setModalRevisiOpen(true)}
                        disabled={processing || mutation.status === 'selesai'}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#FECDD3] bg-white px-4 py-2.5 text-xs font-bold text-[#E11D48] hover:bg-[#FFF1F2] transition disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                        <span>Minta Revisi / Tolak</span>
                    </button>

                    {/* Button Simpan Draft */}
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={processing || mutation.status === 'selesai'}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5DCE6] bg-white px-4 py-2.5 text-xs font-bold text-[#39445A] hover:bg-[#F8FAFC] transition shadow-sm disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        <span>{processing ? 'Menyimpan...' : 'Simpan Draft'}</span>
                    </button>

                    {/* Button Setujui & Perbarui Data Warga */}
                    <button
                        type="button"
                        onClick={() => {
                            if (!allChecklistsCompleted) {
                                setErrorMessage('Lengkapi seluruh 3 checklist verifikasi lapangan sebelum menyetujui.');
                                return;
                            }
                            if (hasBuramDocs) {
                                setErrorMessage('Terdapat berkas yang ditandai Buram. Mohon periksa kembali berkas.');
                                return;
                            }
                            setModalApproveOpen(true);
                        }}
                        disabled={processing || mutation.status === 'selesai'}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#16A34A] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#15803D] transition disabled:opacity-50"
                    >
                        <Check className="h-4 w-4" />
                        <span>Setujui &amp; Perbarui Data Warga</span>
                    </button>
                </div>
            </div>

            {/* Modal Minta Revisi */}
            <Modal show={modalRevisiOpen} onClose={() => setModalRevisiOpen(false)} maxWidth="md">
                <form onSubmit={handleRequestRevision} className="p-6">
                    <div className="flex items-center justify-between border-b border-[#E4E9F0] pb-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#E11D48]">
                            <ShieldAlert className="h-5 w-5" />
                            <span>Minta Revisi Dokumen ke Warga</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModalRevisiOpen(false)}
                            className="text-[#68748A] hover:text-[#17233C]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-4 space-y-4 text-xs">
                        <p className="text-[#566175] leading-relaxed">
                            Status permohonan akan diubah menjadi{' '}
                            <span className="font-bold text-[#E11D48]">Perlu Revisi</span>. Berikan instruksi jelas
                            kepada warga mengenai berkas yang perlu diperbaiki atau diunggah ulang.
                        </p>

                        <div>
                            <label className="block font-bold text-[#17233C] mb-1">
                                Alasan Revisi (Wajib Diisi):
                            </label>
                            <textarea
                                value={alasanRevisi}
                                onChange={(e) => setAlasanRevisi(e.target.value)}
                                rows="3"
                                placeholder="Contoh: Foto Kartu Keluarga buram / tidak terbaca jelas. Mohon unggah ulang foto asli KK dengan pencahayaan terang."
                                required
                                className="w-full rounded-xl border border-[#D5DCE6] p-3 text-xs text-[#17233C] focus:border-[#E11D48] focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E4E9F0] pt-4">
                        <button
                            type="button"
                            onClick={() => setModalRevisiOpen(false)}
                            className="rounded-xl border border-[#D5DCE6] px-4 py-2 text-xs font-semibold text-[#39445A] hover:bg-[#F8FAFC]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !alasanRevisi.trim()}
                            className="rounded-xl bg-[#E11D48] px-4 py-2 text-xs font-bold text-white hover:bg-[#BE123C] disabled:opacity-50"
                        >
                            {processing ? 'Memproses...' : 'Kirim Permintaan Revisi'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Persetujuan */}
            <Modal show={modalApproveOpen} onClose={() => setModalApproveOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between border-b border-[#E4E9F0] pb-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#16A34A]">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Konfirmasi Persetujuan Mutasi</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModalApproveOpen(false)}
                            className="text-[#68748A] hover:text-[#17233C]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#566175]">
                        <p>
                            Apakah Anda yakin ingin menyetujui permohonan mutasi{' '}
                            <span className="font-bold text-[#17233C]">{mutation.nomor_tiket}</span> atas nama{' '}
                            <span className="font-bold text-[#17233C]">{mutation.pemohon.nama}</span>?
                        </p>

                        <div className="rounded-xl bg-[#F0FDF4] p-3.5 border border-[#BBF7D0] text-[#166534] space-y-1.5">
                            <p className="font-bold">Aksi ini akan memperbarui data kependudukan:</p>
                            {mutation.jenis_mutasi === 'datang' ? (
                                <ul className="list-disc list-inside space-y-1 text-[11px]">
                                    <li>Mendaftarkan pemohon sebagai warga di buku induk RT 01/08.</li>
                                    {mutation.rincian_pengikut.length > 0 && (
                                        <li>
                                            Mendaftarkan {mutation.rincian_pengikut.length} anggota keluarga ke dalam KK.
                                        </li>
                                    )}
                                    <li>
                                        Memperbarui status hunian unit{' '}
                                        <span className="font-bold">{mutation.unit_hunian.nama}</span> menjadi terisi.
                                    </li>
                                </ul>
                            ) : (
                                <ul className="list-disc list-inside space-y-1 text-[11px]">
                                    <li>Mencatat status kepindahan warga di buku induk kependudukan RT 01/08.</li>
                                    <li>Mempertahankan riwayat kependudukan warga tanpa menghapus data.</li>
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E4E9F0] pt-4">
                        <button
                            type="button"
                            onClick={() => setModalApproveOpen(false)}
                            className="rounded-xl border border-[#D5DCE6] px-4 py-2 text-xs font-semibold text-[#39445A] hover:bg-[#F8FAFC]"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={processing}
                            className="rounded-xl bg-[#16A34A] px-4 py-2 text-xs font-bold text-white hover:bg-[#15803D] disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Ya, Setujui & Perbarui Data Warga'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
