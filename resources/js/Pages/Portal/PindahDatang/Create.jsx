import WargaLayout from '@/Layouts/WargaLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    CloudUpload,
    Eye,
    FileImage,
    FileText,
    Lock,
    LogIn,
    LogOut,
    MapPin,
    MessageCircle,
    Plus,
    ShieldCheck,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';


const STATUS_OPTIONS = ['Kontrak / Sewa Tahunan', 'Milik Sendiri', 'Tinggal dengan Keluarga', 'Kost / Sewa Bulanan'];

function formatBytes(bytes) {
    if (!bytes) {
        return '0 B';
    }
    const units = ['B', 'KB', 'MB'];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
        size /= 1024;
        unit += 1;
    }
    return `${size.toFixed(1)} ${units[unit]}`;
}

function formatLongDate(value) {
    if (!value) {
        return '-';
    }
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function PindahDatangCreate() {
    const { auth } = usePage().props;
    const fileInputRef = useRef(null);

    const [jenis, setJenis] = useState('datang');
    const [form, setForm] = useState({
        nama: auth.user.name || '',
        nik: '',
        kk: '',
        tanggal: '',
        alamatAsal: '',
        unit: '',
        statusTinggal: 'Kontrak / Sewa Tahunan',
    });
    const [files, setFiles] = useState([]);;
    const [errors, setErrors] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(true);

    const ticketId = useMemo(() => {
        const stamp = form.tanggal?.replaceAll('-', '') ?? '20250616';
        return `#MUT-${stamp.slice(0, 4)}-0689`;
    }, [form.tanggal]);

    const updateField = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!form.nama.trim()) next.nama = 'Nama lengkap wajib diisi.';
        if (!/^\d{16}$/.test(form.nik)) next.nik = 'NIK harus 16 digit.';
        if (!/^\d{16}$/.test(form.kk)) next.kk = 'Nomor KK harus 16 digit.';
        if (!form.tanggal) next.tanggal = 'Tanggal rencana wajib diisi.';
        if (!form.alamatAsal.trim()) next.alamatAsal = 'Alamat asal wajib diisi.';
        if (!form.unit) next.unit = 'Pilih unit rumah.';
        if (!form.statusTinggal) next.statusTinggal = 'Pilih status tempat tinggal.';
        if (files.length < 2) next.files = 'Unggah KTP Pemohon dan Kartu Keluarga.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const openConfirm = (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }
        setAgreed(true);
        setShowConfirm(true);
    };

    const submitReport = () => {
        if (!agreed) {
            return;
        }

        const payload = {
            jenis,
            ...form,
            files,
            ticket: ticketId,
            submittedAt: new Date().toISOString(),
        };
        window.sessionStorage.setItem('sia.pindahDatang.latest', JSON.stringify(payload));
        router.visit(route('portal.pindah-datang.tracking'));
    };

    const onPickFiles = (event) => {
        const picked = Array.from(event.target.files || []).map((file) => ({
            id: `${file.name}-${file.lastModified}`,
            name: file.name,
            sizeLabel: formatBytes(file.size),
            kind: file.type.includes('pdf') ? 'Dokumen PDF' : 'Berkas Pendukung',
            type: file.type.includes('pdf') ? 'pdf' : 'image',
        }));
        setFiles((current) => [...current, ...picked]);
        event.target.value = '';
        setErrors((current) => ({ ...current, files: undefined }));
    };

    return (
        <WargaLayout>
            <Head title="Laporan Pindah / Datang" />

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2F6BFF]">
                        Perubahan Data Hunian
                    </p>
                    <h1 className="mt-1 font-heading text-[28px] font-extrabold tracking-tight text-[#12233F]">
                        Laporan Pindah / Datang
                    </h1>
                    <p className="mt-1 max-w-2xl text-[13px] text-[#68748A]">
                        Catat perpindahan warga secara daring untuk verifikasi tertib administrasi RT 01/08.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F6BFF] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#2459B4]"
                >
                    <Plus className="h-4 w-4" />
                    Buat Laporan Baru
                </button>
            </div>

            <div className="mb-5 flex gap-3 rounded-2xl border border-[#F3D7A3] bg-[#FFF6E5] px-4 py-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#C47B16]" />
                <div>
                    <p className="text-[13px] font-bold text-[#8A5A12]">Catatan Kelengkapan Dokumen</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-[#8A5A12]/90">
                        Pastikan foto KTP dan Kartu Keluarga (KK) jelas, tidak terpotong, dan terbaca dengan baik untuk
                        mempercepat proses persetujuan oleh Ketua RT 01.
                    </p>
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <form onSubmit={openConfirm} className="rounded-2xl border border-[#E6EAF2] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between gap-3 border-b border-[#EEF1F6] pb-4">
                        <div>
                            <h2 className="font-heading text-[16px] font-bold">Formulir Pelaporan Warga</h2>
                            <p className="mt-1 text-[12px] text-[#68748A]">
                                Isi informasi kependudukan terbaru dengan benar dan teliti.
                            </p>
                        </div>
                        <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-[11px] font-semibold text-[#2F6BFF]">
                            Langkah 1 dari 2
                        </span>
                    </div>

                    <div className="mt-5">
                        <label className="text-[12px] font-semibold">
                            Jenis Laporan Perpindahan <span className="text-[#E24B4A]">*</span>
                        </label>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setJenis('datang')}
                                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-semibold ${
                                    jenis === 'datang'
                                        ? 'border-[#2F6BFF] bg-[#F3F7FF] text-[#2F6BFF]'
                                        : 'border-[#E6EAF2] bg-[#F8FAFC] text-[#68748A]'
                                }`}
                            >
                                <LogIn className="h-4 w-4" />
                                Warga Datang (Masuk RT)
                            </button>
                            <button
                                type="button"
                                onClick={() => setJenis('pindah')}
                                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-semibold ${
                                    jenis === 'pindah'
                                        ? 'border-[#2F6BFF] bg-[#F3F7FF] text-[#2F6BFF]'
                                        : 'border-[#E6EAF2] bg-[#F8FAFC] text-[#68748A]'
                                }`}
                            >
                                <LogOut className="h-4 w-4" />
                                Warga Pindah (Keluar RT)
                            </button>
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="text-[12px] font-semibold">
                            Nama Lengkap Warga <span className="text-[#E24B4A]">*</span>
                        </label>
                        <div className="relative mt-2">
                            <input
                                value={form.nama}
                                onChange={(event) => updateField('nama', event.target.value)}
                                className="w-full rounded-xl border-0 bg-[#F4F7FB] py-3 pl-4 pr-11 text-[13px] text-[#12233F] ring-1 ring-[#E6EAF2] focus:ring-2 focus:ring-[#2F6BFF]"
                            />
                            <UserRound className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                        </div>
                        {errors.nama && <p className="mt-1 text-[11px] text-[#E24B4A]">{errors.nama}</p>}
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-[12px] font-semibold">
                                NIK Pemohon (16 Digit) <span className="text-[#E24B4A]">*</span>
                            </label>
                            <input
                                value={form.nik}
                                maxLength={16}
                                onChange={(event) => updateField('nik', event.target.value.replace(/\D/g, ''))}
                                className="mt-2 w-full rounded-xl border-0 bg-[#F4F7FB] px-4 py-3 text-[13px] ring-1 ring-[#E6EAF2] focus:ring-2 focus:ring-[#2F6BFF]"
                            />
                            {errors.nik && <p className="mt-1 text-[11px] text-[#E24B4A]">{errors.nik}</p>}
                        </div>
                        <div>
                            <label className="text-[12px] font-semibold">
                                Nomor Kartu Keluarga (KK) <span className="text-[#E24B4A]">*</span>
                            </label>
                            <input
                                value={form.kk}
                                maxLength={16}
                                onChange={(event) => updateField('kk', event.target.value.replace(/\D/g, ''))}
                                className="mt-2 w-full rounded-xl border-0 bg-[#F4F7FB] px-4 py-3 text-[13px] ring-1 ring-[#E6EAF2] focus:ring-2 focus:ring-[#2F6BFF]"
                            />
                            {errors.kk && <p className="mt-1 text-[11px] text-[#E24B4A]">{errors.kk}</p>}
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="text-[12px] font-semibold">
                            Tanggal Rencana Datang / Mulai Menetap <span className="text-[#E24B4A]">*</span>
                        </label>
                        <div className="relative mt-2">
                            <input
                                type="date"
                                value={form.tanggal}
                                onChange={(event) => updateField('tanggal', event.target.value)}
                                className="w-full rounded-xl border-0 bg-[#F4F7FB] px-4 py-3 text-[13px] ring-1 ring-[#E6EAF2] focus:ring-2 focus:ring-[#2F6BFF]"
                            />
                            <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                        </div>
                        {errors.tanggal && <p className="mt-1 text-[11px] text-[#E24B4A]">{errors.tanggal}</p>}
                    </div>

                    <div className="mt-5">
                        <label className="text-[12px] font-semibold">
                            Alamat Asal Lengkap (Sesuai KTP Terakhir) <span className="text-[#E24B4A]">*</span>
                        </label>
                        <textarea
                            rows={2}
                            value={form.alamatAsal}
                            onChange={(event) => updateField('alamatAsal', event.target.value)}
                            className="mt-2 w-full resize-none rounded-xl border-0 bg-[#F4F7FB] px-4 py-3 text-[13px] ring-1 ring-[#E6EAF2] focus:ring-2 focus:ring-[#2F6BFF]"
                        />
                        {errors.alamatAsal && <p className="mt-1 text-[11px] text-[#E24B4A]">{errors.alamatAsal}</p>}
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-[12px] font-semibold">
                                Unit Rumah di RT 01/08 <span className="text-[#E24B4A]">*</span>
                            </label>
                            <input
    type="text"
    value={form.unit}
    onChange={(event) => updateField('unit', event.target.value)}
    placeholder="Masukkan blok dan nomor rumah"
    className="mt-2 w-full rounded-xl border-0 bg-[#F4F7FB] px-4 py-3 text-[13px] ring-1 ring-[#E6EAF2] focus:ring-2 focus:ring-[#2F6BFF]"
/>
                        </div>
                        <div>
                            <label className="text-[12px] font-semibold">
                                Status Tempat Tinggal <span className="text-[#E24B4A]">*</span>
                            </label>
                            <select
                                value={form.statusTinggal}
                                onChange={(event) => updateField('statusTinggal', event.target.value)}
                                className="mt-2 w-full rounded-xl border-0 bg-[#F4F7FB] px-4 py-3 text-[13px] ring-1 ring-[#E6EAF2] focus:ring-2 focus:ring-[#2F6BFF]"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between gap-3">
                            <label className="text-[12px] font-semibold">
                                Dokumen Pendukung Wajib <span className="text-[#E24B4A]">*</span>
                            </label>
                            <span className="text-[11px] text-[#98A2B3]">Format: JPG, PNG, atau PDF (Maks. 5MB)</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-3 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#C9D7F5] bg-[#F7FAFF] px-4 py-8 text-center"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F0FF] text-[#2F6BFF]">
                                <CloudUpload className="h-5 w-5" />
                            </span>
                            <p className="mt-3 text-[13px] font-semibold text-[#2F6BFF]">Pilih berkas atau tarik ke sini</p>
                            <p className="mt-1 text-[12px] text-[#68748A]">Unggah KTP Pemohon &amp; Kartu Keluarga</p>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            multiple
                            className="hidden"
                            onChange={onPickFiles}
                        />
                        {errors.files && <p className="mt-1 text-[11px] text-[#E24B4A]">{errors.files}</p>}

                        <div className="mt-3 space-y-2">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center gap-3 rounded-xl border border-[#E6EAF2] bg-[#F8FBFF] px-3 py-3"
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                            file.type === 'pdf' ? 'bg-[#FFF1E8] text-[#D46B08]' : 'bg-[#E8F0FF] text-[#2F6BFF]'
                                        }`}
                                    >
                                        {file.type === 'pdf' ? <FileText className="h-5 w-5" /> : <FileImage className="h-5 w-5" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[13px] font-semibold">{file.name}</p>
                                        <p className="text-[11px] text-[#68748A]">
                                            {file.sizeLabel} • {file.kind}
                                        </p>
                                    </div>
                                    <span className="hidden items-center gap-1 rounded-full bg-[#E7F6EF] px-2.5 py-1 text-[11px] font-semibold text-[#11704E] sm:inline-flex">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Siap Verifikasi
                                    </span>
                                    <button type="button" className="rounded-lg p-1.5 text-[#98A2B3] hover:bg-white">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}
                                        className="rounded-lg p-1.5 text-[#98A2B3] hover:bg-white hover:text-[#E24B4A]"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-[#EEF1F6] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 text-[12px] text-[#68748A]">
                            <Lock className="h-4 w-4 text-[#147A72]" />
                            Data terenkripsi dan langsung diteruskan ke Ketua RT 01
                        </p>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F6BFF] px-5 py-3 text-[13px] font-semibold text-white hover:bg-[#2459B4]"
                        >
                            Kirim Laporan untuk Diperiksa
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </form>

                <aside className="space-y-4">
                    <div className="rounded-2xl border border-[#F3D7A3] bg-[#FFF7EC] p-4">
                        <div className="flex items-start gap-2">
                            <ShieldCheck className="mt-0.5 h-5 w-5 text-[#C47B16]" />
                            <div>
                                <p className="text-[13px] font-bold text-[#9A4E12]">Konfirmasi Wajib Pengurus</p>
                                <p className="mt-1 text-[12px] leading-relaxed text-[#9A4E12]/90">
                                    Status domisili kependudukan baru aktif resmi dalam buku induk RT setelah Ketua RT /
                                    Sekretaris menyelesaikan verifikasi berkas secara fisik maupun digital.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E6EAF2] bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F6EF] text-[#147A72]">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold">Bantuan Layanan RT 01</p>
                                <p className="text-[11px] text-[#68748A]">Balai Warga Sukatani</p>
                            </div>
                        </div>
                        <dl className="mt-4 space-y-2 text-[12px]">
                            <div className="flex justify-between">
                                <dt className="text-[#68748A]">Ketua RT 01</dt>
                                <dd className="font-semibold">Pak Budi Santoso</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[#68748A]">WhatsApp Resmi</dt>
                                <dd className="font-semibold text-[#147A72]">+62 812-9876-5432</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[#68748A]">Jam Pelayanan</dt>
                                <dd className="font-semibold">19.00 - 21.00 WIB</dd>
                            </div>
                        </dl>
                        <a
                            href="https://wa.me/6281298765432"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#E7F6EF] px-3 py-2.5 text-[12px] font-semibold text-[#147A72]"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Hubungi Pengurus via WA
                        </a>
                    </div>
                </aside>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1B2A4A]/45 p-4">
                    <div className="max-h-[92vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="h-1.5 rounded-t-2xl bg-gradient-to-r from-[#2F6BFF] to-[#147A72]" />
                        <div className="p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F0FF] text-[#2F6BFF]">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2F6BFF]">
                                            Langkah Terakhir
                                        </p>
                                        <h3 className="mt-0.5 font-heading text-[18px] font-extrabold">
                                            Konfirmasi Pengiriman Laporan Warga
                                        </h3>
                                        <p className="mt-1 text-[12px] text-[#68748A]">
                                            Periksa kembali kelengkapan data sebelum diteruskan ke sistem verifikasi
                                            pengurus RT 01/RW 08.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    className="rounded-lg p-1 text-[#98A2B3] hover:bg-[#F4F6FB]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF4FF] px-3 py-1 text-[12px] font-semibold text-[#2F6BFF]">
                                    <UserRound className="h-3.5 w-3.5" />
                                    {jenis === 'datang' ? 'Warga Datang (Domisili Baru RT 01/08)' : 'Warga Pindah (Keluar RT 01/08)'}
                                </span>
                                <span className="text-[11px] text-[#68748A]">ID Pelaporan: {ticketId}</span>
                            </div>

                            <div className="mt-4 rounded-2xl border border-[#E6EAF2] bg-[#F7F9FC] p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                                            Nama Lengkap Pemohon
                                        </p>
                                        <p className="mt-1 font-heading text-[16px] font-extrabold">{form.nama}</p>
                                    </div>
                                    <span className="rounded-full bg-[#E7F6EF] px-2.5 py-1 text-[11px] font-semibold text-[#11704E]">
                                        Warga Tetap
                                    </span>
                                </div>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[11px] text-[#68748A]">Nomor Induk Kependudukan (NIK)</p>
                                        <p className="mt-0.5 text-[13px] font-bold">{form.nik}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-[#68748A]">Nomor Kartu Keluarga (KK)</p>
                                        <p className="mt-0.5 text-[13px] font-bold">{form.kk}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-[11px] text-[#68748A]">Rencana Tanggal Kedatangan</p>
                                    <p className="mt-1 inline-flex items-center gap-2 text-[13px] font-bold">
                                        <CalendarDays className="h-4 w-4 text-[#2F6BFF]" />
                                        {formatLongDate(form.tanggal)}
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-[11px] text-[#68748A]">Alamat Asal Sebelumnya</p>
                                    <p className="mt-1 text-[12px] leading-relaxed">{form.alamatAsal}</p>
                                </div>
                                <div className="mt-4 rounded-xl bg-white px-3 py-3 ring-1 ring-[#E6EAF2]">
                                    <p className="text-[11px] font-semibold text-[#2F6BFF]">Alamat Hunian Tujuan RT 01</p>
                                    <p className="mt-1 text-[13px] font-bold">
                                        {form.unit}{' '}
                                        <span className="font-medium text-[#68748A]">(Status: {form.statusTinggal})</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-[12px] font-semibold">Kelengkapan Berkas Digital Terlampir ({files.length})</p>
                                <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#147A72]">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Format Sesuai Standar RT
                                </p>
                            </div>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                {files.map((file) => (
                                    <div key={file.id} className="flex items-center gap-3 rounded-xl border border-[#E6EAF2] bg-[#F8FBFF] px-3 py-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0FF] text-[#2F6BFF]">
                                            {file.type === 'pdf' ? <FileText className="h-4 w-4" /> : <FileImage className="h-4 w-4" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[12px] font-semibold">{file.name}</p>
                                            <p className="text-[10px] text-[#68748A]">{file.sizeLabel} • Terverifikasi sistem</p>
                                        </div>
                                        <CheckCircle2 className="h-4 w-4 text-[#11704E]" />
                                    </div>
                                ))}
                            </div>

                            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-[#F3F7FF] px-3 py-3 text-[12px] leading-relaxed">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(event) => setAgreed(event.target.checked)}
                                    className="mt-0.5 rounded border-[#C9D7F5] text-[#2F6BFF] focus:ring-[#2F6BFF]"
                                />
                                <span>
                                    Saya menyatakan bahwa seluruh data dan dokumen yang saya kirimkan adalah{' '}
                                    <strong>sah, akurat, dan sesuai</strong> dengan ketentuan peraturan RT 01/RW 08
                                    Kelurahan Sukatani.
                                </span>
                            </label>

                            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    className="rounded-xl bg-[#EEF1F6] px-4 py-2.5 text-[13px] font-semibold text-[#4B5568]"
                                >
                                    Batal &amp; Ubah Data
                                </button>
                                <button
                                    type="button"
                                    disabled={!agreed}
                                    onClick={submitReport}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F6BFF] px-4 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Ya, Kirim Laporan Sekarang
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </WargaLayout>
    );
}
