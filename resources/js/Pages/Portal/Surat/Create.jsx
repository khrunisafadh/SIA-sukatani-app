import ConfirmationModal from '@/Pages/Portal/Surat/Partials/ConfirmationModal';
import ServiceHelpCard from '@/Pages/Portal/Surat/Partials/ServiceHelpCard';
import WargaLayout from '@/Layouts/WargaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, FileText, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const AGAMA_OPTIONS = ['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu'];
const JK_OPTIONS = ['Laki-laki', 'Perempuan'];
const STATUS_KAWIN_OPTIONS = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'];

export default function SuratCreate({ jenisOptions, defaultUserData, helpCard }) {
    const defaultJenis = Object.keys(jenisOptions)[0] || 'kematian';
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        jenis_surat: defaultJenis,
        nama: defaultUserData?.nama || '',
        nik: '',
        nomor_kk_ktp: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: 'Laki-laki',
        pekerjaan: '',
        status_perkawinan: 'Belum Kawin',
        agama: 'Islam',
        kewarganegaraan: 'WNI (Warga Negara Indonesia)',
        alamat: '',
        nomor_hp: '',
        hari_meninggal: '',
        tanggal_meninggal: '',
        jam_meninggal: '',
        jenis_surat_keterangan: '',
        alasan_tidak_bekerja: '',
        alasan_keperluan: '',
    });

    const handleJenisChange = (e) => {
        const nextJenis = e.target.value;
        setData((prev) => {
            const next = { ...prev, jenis_surat: nextJenis };
            if (nextJenis === 'belum_menikah') {
                next.status_perkawinan = 'Belum Kawin';
            }
            if (nextJenis === 'tidak_bekerja' && !next.pekerjaan) {
                next.pekerjaan = 'Belum / Tidak Bekerja';
            }
            if (nextJenis === 'kematian') {
                next.nama = ''; // Surat kematian adalah nama almarhum, bukan nama pemohon
            } else if (!next.nama) {
                next.nama = defaultUserData?.nama || '';
            }
            return next;
        });
    };

    const handleTanggalMeninggalChange = (e) => {
        const val = e.target.value;
        let dayName = '';
        if (val) {
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const d = new Date(val);
            if (!isNaN(d.getTime())) {
                dayName = days[d.getDay()];
            }
        }
        setData((prev) => ({
            ...prev,
            tanggal_meninggal: val,
            hari_meninggal: dayName || prev.hari_meninggal,
        }));
    };

    const handleOpenConfirm = (e) => {
        e.preventDefault();
        setConfirmModalOpen(true);
    };

    const handleFinalSubmit = () => {
        post(route('portal.surat.store'), {
            onSuccess: () => setConfirmModalOpen(false),
            onError: () => setConfirmModalOpen(false),
        });
    };

    return (
        <WargaLayout topBarLabel="Lingkungan RT 01 / RW 08 Kel. Sukatani">
            <Head title="Buat Pengajuan Surat - SIA Sukatani" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-[#68748A]">
                    <Link href={route('portal.dashboard')} className="hover:text-[#0F685D] hover:underline">
                        Layanan Administrasi Warga
                    </Link>
                    <span>/</span>
                    <Link href={route('portal.surat.index')} className="hover:text-[#0F685D] hover:underline">
                        Riwayat Pengajuan Surat
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-[#17233C]">Buat Pengajuan Surat</span>
                </nav>

                {/* Header & Back Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#17233C] font-heading">
                            Formulir Pengajuan Surat
                        </h1>
                        <p className="mt-1 text-xs text-[#68748A]">
                            Lengkapi formulir sesuai jenis surat yang dibutuhkan. Pastikan data kependudukan valid dan teliti.
                        </p>
                    </div>

                    <Link
                        href={route('portal.surat.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition self-start sm:self-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                    </Link>
                </div>

                {/* Form & Sidebar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Main Form Column (Col 1-2) */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleOpenConfirm} className="rounded-2xl border border-[#E6EAF2] bg-white p-6 shadow-sm space-y-6">
                            {/* Card Intro */}
                            <div className="border-b border-[#EDF2F7] pb-4">
                                <h3 className="text-sm font-bold text-[#17233C] font-heading">Data Pemohon Surat</h3>
                                <p className="text-xs text-[#68748A] mt-0.5">
                                    Pastikan rincian data diri sesuai dengan identitas KTP dan KK yang tercatat.
                                </p>
                            </div>

                            {/* Dropdown Jenis Surat Wajib */}
                            <div>
                                <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                    Jenis Surat Permohonan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.jenis_surat}
                                    onChange={handleJenisChange}
                                    className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#1E293B] font-medium focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                >
                                    {Object.entries(jenisOptions).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-[#94A3B8] mt-1.5">
                                    Klasifikasi surat menentukan pengisian form dan template dokumen yang dibutuhkan.
                                </p>
                                {errors.jenis_surat && (
                                    <p className="mt-1 text-xs text-red-600">{errors.jenis_surat}</p>
                                )}
                            </div>

                            <hr className="border-[#EDF2F7]" />

                            {/* DYNAMIC FORM VARIANT: 1. SURAT KETERANGAN KEMATIAN */}
                            {data.jenis_surat === 'kematian' && (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#0F685D]" />
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F685D]">
                                            Data Orang yang Meninggal Dunia
                                        </h4>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Nama Lengkap (Almarhum / Almarhumah) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.nama}
                                            onChange={(e) => setData('nama', e.target.value)}
                                            placeholder="Nama lengkap almarhum/almarhumah"
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                        {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Jenis Kelamin <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.jenis_kelamin}
                                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {JK_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Nomor KK / KTP <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.nomor_kk_ktp}
                                                onChange={(e) => setData('nomor_kk_ktp', e.target.value)}
                                                placeholder="3276..."
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs font-mono text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                            {errors.nomor_kk_ktp && <p className="mt-1 text-xs text-red-600">{errors.nomor_kk_ktp}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tempat Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                placeholder="Contoh: Depok"
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tanggal Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Pekerjaan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.pekerjaan}
                                                onChange={(e) => setData('pekerjaan', e.target.value)}
                                                placeholder="Pensiunan / Tidak Bekerja"
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Agama <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.agama}
                                                onChange={(e) => setData('agama', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {AGAMA_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Kewarganegaraan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.kewarganegaraan}
                                            onChange={(e) => setData('kewarganegaraan', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        >
                                            <option value="WNI (Warga Negara Indonesia)">WNI (Warga Negara Indonesia)</option>
                                            <option value="WNA (Warga Negara Asing)">WNA (Warga Negara Asing)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alamat Lengkap Terakhir Sesuai KTP <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            placeholder="Contoh: Jl. Sukatani Raya No. 12, RT 01 / RW 08, Kel. Sukatani, Kec. Tapos, Kota Depok"
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="h-2 w-2 rounded-full bg-[#0F685D]" />
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F685D]">
                                                Informasi Meninggal Dunia
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                    Hari / Tanggal Meninggal Dunia <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={data.tanggal_meninggal}
                                                    onChange={handleTanggalMeninggalChange}
                                                    className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                                />
                                                {data.hari_meninggal && (
                                                    <p className="text-[11px] text-[#0F685D] font-medium mt-1">
                                                        Hari terhitung: {data.hari_meninggal}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                    Jam Meninggal Dunia <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={data.jam_meninggal}
                                                    onChange={(e) => setData('jam_meninggal', e.target.value)}
                                                    className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                                />
                                                <p className="text-[11px] text-[#94A3B8] mt-1">Format 24 jam (WIB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DYNAMIC FORM VARIANT: 2. SURAT KETERANGAN TEMPAT TINGGAL */}
                            {data.jenis_surat === 'tempat_tinggal' && (
                                <div className="space-y-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F685D]">
                                        Data Pemohon
                                    </h4>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.nama}
                                            onChange={(e) => setData('nama', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                NIK (16 Digit) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={16}
                                                required
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value)}
                                                placeholder="327601..."
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs font-mono text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                            {errors.nik && <p className="mt-1 text-xs text-red-600">{errors.nik}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Pekerjaan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.pekerjaan}
                                                onChange={(e) => setData('pekerjaan', e.target.value)}
                                                placeholder="Karyawan Swasta"
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tempat Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                placeholder="Jakarta"
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tanggal Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Jenis Kelamin <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.jenis_kelamin}
                                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {JK_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Agama <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.agama}
                                                onChange={(e) => setData('agama', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {AGAMA_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Status Perkawinan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            required
                                            value={data.status_perkawinan}
                                            onChange={(e) => setData('status_perkawinan', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        >
                                            {STATUS_KAWIN_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alamat Lengkap Sesuai KTP <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            placeholder="Jl. Dahlia Raya Blok C4 No. 12, RT 01 / RW 08 Kel. Sukatani, Kec. Tapos, Depok"
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alasan / Keperluan <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={data.alasan_keperluan}
                                            onChange={(e) => setData('alasan_keperluan', e.target.value)}
                                            placeholder="Persyaratan kelengkapan administrasi pembukaan rekening payroll bank..."
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                        <p className="text-[11px] text-[#94A3B8] mt-1">
                                            Tuliskan instansi tujuan atau keperluan pengurusan surat secara spesifik.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* DYNAMIC FORM VARIANT: 3. SURAT KETERANGAN */}
                            {data.jenis_surat === 'keterangan' && (
                                <div className="space-y-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F685D]">
                                        Data Pemohon
                                    </h4>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.nama}
                                            onChange={(e) => setData('nama', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                NIK (16 Digit) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={16}
                                                required
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs font-mono text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                            {errors.nik && <p className="mt-1 text-xs text-red-600">{errors.nik}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Pekerjaan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.pekerjaan}
                                                onChange={(e) => setData('pekerjaan', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tempat Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tanggal Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Jenis Kelamin <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.jenis_kelamin}
                                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {JK_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Agama <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.agama}
                                                onChange={(e) => setData('agama', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {AGAMA_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Status Perkawinan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            required
                                            value={data.status_perkawinan}
                                            onChange={(e) => setData('status_perkawinan', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        >
                                            {STATUS_KAWIN_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alamat Lengkap Sesuai KTP <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={2}
                                            required
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Jenis Surat Keterangan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.jenis_surat_keterangan}
                                            onChange={(e) => setData('jenis_surat_keterangan', e.target.value)}
                                            placeholder="Contoh: Keterangan Bersih Diri / Keterangan Usaha / Keterangan Penghasilan"
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                        {errors.jenis_surat_keterangan && <p className="mt-1 text-xs text-red-600">{errors.jenis_surat_keterangan}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alasan / Keperluan <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={data.alasan_keperluan}
                                            onChange={(e) => setData('alasan_keperluan', e.target.value)}
                                            placeholder="Tuliskan alasan/keperluan..."
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                        <p className="text-[11px] text-[#94A3B8] mt-1">
                                            Tuliskan instansi tujuan atau keperluan pengurusan surat secara spesifik.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* DYNAMIC FORM VARIANT: 4. SURAT PERNYATAAN BELUM MENIKAH */}
                            {data.jenis_surat === 'belum_menikah' && (
                                <div className="space-y-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F685D]">
                                        Data Pemohon
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Nama Lengkap Pemohon <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.nama}
                                                onChange={(e) => setData('nama', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                NIK (16 Digit) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={16}
                                                required
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs font-mono text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tempat Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tanggal Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Jenis Kelamin <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.jenis_kelamin}
                                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {JK_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Pekerjaan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.pekerjaan}
                                                onChange={(e) => setData('pekerjaan', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Status Perkawinan <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value="Belum Kawin"
                                                    className="w-full rounded-xl border border-[#CBD5E1] bg-[#F1F5F9] px-3.5 py-2.5 text-xs text-[#475569] font-medium cursor-not-allowed pr-9"
                                                />
                                                <Lock className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#94A3B8]" />
                                            </div>
                                            <p className="text-[11px] text-[#64748B] mt-1">
                                                Terkunci otomatis sesuai jenis surat pernyataan.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Agama <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.agama}
                                                onChange={(e) => setData('agama', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {AGAMA_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alamat Lengkap Sesuai KTP <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    {/* Yellow Notice Box sesuai Figma */}
                                    <div className="rounded-xl border border-[#FDE68A] bg-[#FEF3C7]/60 p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 shrink-0 text-[#D97706] mt-0.5" />
                                            <div>
                                                <h5 className="text-xs font-bold text-[#92400E]">Informasi Pengesahan Surat</h5>
                                                <p className="text-xs text-[#B45309] mt-0.5 leading-relaxed">
                                                    Surat pernyataan ini memerlukan tanda tangan pemohon di atas <strong>materai Rp10.000</strong>, serta <strong>dua orang saksi</strong> yang akan dilengkapi saat proses pengesahan fisik.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DYNAMIC FORM VARIANT: 5. SURAT PERNYATAAN TIDAK BEKERJA */}
                            {data.jenis_surat === 'tidak_bekerja' && (
                                <div className="space-y-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F685D]">
                                        Data Pemohon
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Nama Lengkap Pemohon <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.nama}
                                                onChange={(e) => setData('nama', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                NIK (16 Digit) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={16}
                                                required
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs font-mono text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tempat Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tanggal Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Pekerjaan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.pekerjaan || 'Belum / Tidak Bekerja'}
                                            onChange={(e) => setData('pekerjaan', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alamat Lengkap Sesuai KTP <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={2}
                                            required
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alasan Tidak Bekerja <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={data.alasan_tidak_bekerja}
                                            onChange={(e) => setData('alasan_tidak_bekerja', e.target.value)}
                                            placeholder="Contoh: Mengurus orang tua sakit di rumah / Pemutusan hubungan kerja..."
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                        {errors.alasan_tidak_bekerja && <p className="mt-1 text-xs text-red-600">{errors.alasan_tidak_bekerja}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alasan / Keperluan <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={data.alasan_keperluan}
                                            onChange={(e) => setData('alasan_keperluan', e.target.value)}
                                            placeholder="Contoh: Persyaratan administrasi permohonan beasiswa..."
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* DYNAMIC FORM VARIANT: 6. SURAT PERNYATAAN TIDAK MAMPU */}
                            {data.jenis_surat === 'tidak_mampu' && (
                                <div className="space-y-5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F685D]">
                                        Data Pemohon
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Nama Lengkap <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.nama}
                                                onChange={(e) => setData('nama', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                            <p className="text-[11px] text-[#94A3B8] mt-1">Nama resmi sesuai KTP-el / KK.</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                NIK (16 Digit) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={16}
                                                required
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs font-mono text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                            <p className="text-[11px] text-[#94A3B8] mt-1">Nomor Induk Kependudukan terdaftar.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tempat Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Tanggal Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Jenis Kelamin <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.jenis_kelamin}
                                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {JK_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Pekerjaan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.pekerjaan}
                                                onChange={(e) => setData('pekerjaan', e.target.value)}
                                                placeholder="Buruh Harian Lepas"
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Status Perkawinan <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.status_perkawinan}
                                                onChange={(e) => setData('status_perkawinan', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {STATUS_KAWIN_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                                Agama <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.agama}
                                                onChange={(e) => setData('agama', e.target.value)}
                                                className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                            >
                                                {AGAMA_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alamat Lengkap Sesuai KTP <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={2}
                                            required
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Nomor HP <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={data.nomor_hp}
                                            onChange={(e) => setData('nomor_hp', e.target.value)}
                                            placeholder="0812-9844-3201"
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                        <p className="text-[11px] text-[#94A3B8] mt-1">Masukkan nomor telepon aktif yang dapat dihubungi.</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#17233C] mb-1.5">
                                            Alasan / Keperluan <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={data.alasan_keperluan}
                                            onChange={(e) => setData('alasan_keperluan', e.target.value)}
                                            placeholder="Diperlukan untuk kelengkapan administrasi permohonan keringanan biaya..."
                                            className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#1E293B] focus:border-[#0F685D] focus:ring-1 focus:ring-[#0F685D]"
                                        />
                                        <p className="text-[11px] text-[#94A3B8] mt-1">
                                            Jelaskan tujuan penggunaan surat secara spesifik untuk dicantumkan pada bagian isi surat.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Form Footer Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#EDF2F7] pt-5 gap-4">
                                <div className="flex items-center gap-1.5 text-xs text-[#68748A]">
                                    <Lock className="h-4 w-4 text-[#0F685D]" />
                                    <span>Data terenkripsi</span>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                    <Link
                                        href={route('portal.surat.index')}
                                        className="rounded-xl border border-[#CBD5E1] bg-white px-5 py-2.5 text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-xl bg-[#0F685D] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0C544B] transition disabled:opacity-50"
                                    >
                                        Kirim Pengajuan Surat
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar Bantuan Layanan RT (Col 3) */}
                    <div className="space-y-4">
                        <ServiceHelpCard
                            leadName={helpCard?.rt_lead_name}
                            phone={helpCard?.whatsapp_help}
                            displayPhone={helpCard?.whatsapp_help_display}
                            hours={helpCard?.jam_pelayanan}
                            location={helpCard?.balai_warga}
                        />

                        {/* Info Proses Pengajuan Card */}
                        <div className="rounded-2xl border border-[#E6EAF2] bg-white p-5 shadow-sm space-y-3">
                            <h4 className="text-sm font-bold text-[#17233C] font-heading">Informasi Proses Pengajuan</h4>
                            <ol className="list-decimal list-inside space-y-2 text-xs text-[#68748A] leading-relaxed">
                                <li>Isi data dengan lengkap dan teliti sesuai KTP/KK.</li>
                                <li>Pengajuan diperiksa dan diverifikasi oleh Ketua RT 01.</li>
                                <li>Setelah status <strong>Terbit</strong>, unduh draf PDF dan hubungi pengurus RT/RW via WhatsApp.</li>
                                <li>Bawa cetak draf surat untuk pengesahan tanda tangan basah dan cap fisik.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                show={confirmModalOpen}
                data={data}
                jenisLabel={jenisOptions[data.jenis_surat] || data.jenis_surat}
                processing={processing}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleFinalSubmit}
            />
        </WargaLayout>
    );
}
