import ServiceHelpCard from '@/Pages/Portal/Surat/Partials/ServiceHelpCard';
import WargaLayout from '@/Layouts/WargaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle,
    Download,
    Eye,
    FileCheck,
    FileText,
    HelpCircle,
    Info,
    Lock,
    MessageCircle,
    PenTool,
    RotateCcw,
    Shield,
    ShieldCheck,
} from 'lucide-react';

export default function SuratShow({ letter }) {
    const status = letter.status; // diajukan, terbit, selesai_rt, selesai
    const d = letter.data_surat || {};

    // Progress timeline calculator
    let progressStep = 1;
    if (status === 'terbit') progressStep = 2;
    if (status === 'selesai_rt') progressStep = 3;
    if (status === 'selesai') progressStep = 4;

    const handleRefresh = () => {
        router.reload({ preserveScroll: true });
    };

    const applicantName = d.nama || letter.nomor;
    const nik = d.nik || d.nomor_kk_ktp || '-';
    const ttl = [d.tempat_lahir, d.tanggal_lahir].filter(Boolean).join(', ') || '-';
    const jk = d.jenis_kelamin || '-';
    const pekerjaan = d.pekerjaan || '-';
    const statusKawinAgama = [d.status_perkawinan, d.agama].filter(Boolean).join(' / ') || d.agama || d.status_perkawinan || '-';
    const alamat = d.alamat || '-';
    const alasan = d.alasan_keperluan || d.keperluan || d.alasan_tidak_bekerja || '-';

    return (
        <WargaLayout topBarLabel="Lingkungan RT 01 / RW 08 Kel. Sukatani">
            <Head title={`Detail ${letter.nomor} - SIA Sukatani`} />

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
                    <span className="font-semibold text-[#17233C]">Detail Permohonan {letter.nomor}</span>
                </nav>

                {/* Top Header Card */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold text-[#17233C] font-heading">
                                Detail Pengajuan Surat
                            </h1>
                            {status === 'diajukan' && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F2FE] px-3 py-1 text-xs font-bold text-[#0369A1] border border-[#BAE6FD]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                                    Diajukan
                                </span>
                            )}
                            {status === 'terbit' && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F7F2] px-3 py-1 text-xs font-bold text-[#0F766E] border border-[#A7F3D0]">
                                    <Check className="h-3.5 w-3.5" />
                                    Terbit
                                </span>
                            )}
                            {status === 'selesai_rt' && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#CCFBF1] px-3 py-1 text-xs font-bold text-[#0F766E] border border-[#99F6E4]">
                                    <PenTool className="h-3 w-3" />
                                    Sign (RT)
                                </span>
                            )}
                            {status === 'selesai' && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF7EE] px-3 py-1 text-xs font-bold text-[#14833B] border border-[#B6E6C5]">
                                    <Check className="h-3.5 w-3.5" />
                                    Selesai / Ditandatangani
                                </span>
                            )}
                        </div>

                        <p className="mt-1 text-xs text-[#68748A]">
                            {status === 'diajukan' && 'Pantau status pengajuan surat dan alur verifikasi resmi pengurus RT 01 / RW 08.'}
                            {status === 'terbit' && 'Surat permohonan Anda telah diverifikasi dan diterbitkan. Lanjutkan ke tahap pengesahan fisik.'}
                            {status === 'selesai_rt' && 'Pengesahan tanda tangan dan cap Ketua RT telah selesai dikonfirmasi. Menunggu pengesahan fisik dari pihak Ketua RW 08.'}
                            {status === 'selesai' && 'Seluruh tahapan pengesahan surat telah selesai secara lengkap oleh pengurus RT 01 dan RW 08.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start lg:self-auto">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition shadow-sm"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Perbarui Status</span>
                        </button>

                        <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-1.5 text-right shadow-sm">
                            <span className="block text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                                No. Register Pelayanan
                            </span>
                            <span className="text-xs font-bold font-mono text-[#0F685D]">{letter.nomor}</span>
                        </div>
                    </div>
                </div>

                {/* State Alert Banner */}
                {status === 'diajukan' && (
                    <div className="rounded-2xl border border-[#BAE6FD] bg-[#E0F2FE]/70 p-5">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0284C7] text-white">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0369A1]">Pengajuan Berhasil Terkirim ke Sistem RT</h4>
                                <p className="mt-1 text-xs text-[#075985] leading-relaxed">
                                    Pengajuan Anda berhasil dikirim dan sedang menunggu verifikasi Ketua RT. Dokumen draft PDF belum diterbitkan pada tahap ini. Anda akan menerima notifikasi otomatis ketika pengurus melakukan pemeriksaan data kependudukan.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'terbit' && (
                    <div className="rounded-2xl border border-[#A7F3D0] bg-[#E6F7F2] p-5">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0F766E]">Verifikasi Pengurus Selesai</h4>
                                <p className="mt-1 text-xs text-[#134E48] leading-relaxed">
                                    Surat telah diverifikasi Ketua RT dan nomor resmi telah diterbitkan. Silakan unduh draf PDF dan hubungi Ketua RT serta Ketua RW untuk pengesahan fisik (tanda tangan basah &amp; cap RT/RW).
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'selesai_rt' && (
                    <div className="rounded-2xl border border-[#A7F3D0] bg-[#E6F7F2] p-5">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                                <PenTool className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0F766E]">Pengesahan Fisik Tingkat RT Selesai</h4>
                                <p className="mt-1 text-xs text-[#134E48] leading-relaxed">
                                    Pengesahan fisik oleh Ketua RT telah selesai dicatat oleh pengurus. Berkas saat ini sedang dalam proses atau menunggu pencatatan pengesahan fisik dari pihak Ketua RW 08. Akses kepada draf berkas digital tidak lagi dibuka untuk pratinjau maupun unduhan.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'selesai' && (
                    <div className="rounded-2xl border border-[#A7F3D0] bg-[#E6F7F2] p-5">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0F766E]">Pengesahan Fisik Telah Selesai Menyeluruh</h4>
                                <p className="mt-1 text-xs text-[#134E48] leading-relaxed">
                                    Dokumen fisik bertanda tangan basah dan berstempel resmi Ketua RT 01 serta Ketua RW 08 telah diserahkan / selesai diproses. Sesuai regulasi kependudukan SOP RT/RW Sukatani (US-06), akses kepada draf berkas digital tidak lagi dibuka untuk pratinjau maupun unduhan.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column (Col 1-2): Timeline, Actions (if Terbit), Summary, Rincian */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Timeline Alur Pengajuan Surat */}
                        <div className="rounded-2xl border border-[#E6EAF2] bg-white p-6 shadow-sm space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileCheck className="h-4 w-4 text-[#0F685D]" />
                                    <h3 className="text-sm font-bold text-[#17233C] font-heading">Alur Pengajuan Surat</h3>
                                </div>
                                <span className="rounded-full bg-[#EAF7EE] px-3 py-1 text-xs font-semibold text-[#0F685D]">
                                    {progressStep} dari 4 tahap Selesai
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                {/* Step 1: Diajukan */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F685D] text-white">
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <div className="h-0.5 flex-1 bg-[#0F685D]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#17233C]">Tahap 1: Diajukan</p>
                                        <p className="text-[11px] text-[#64748B]">{letter.created_at_formatted}</p>
                                        <p className="text-[10px] text-[#0F685D] mt-0.5">Selesai diverifikasi sistem</p>
                                    </div>
                                </div>

                                {/* Step 2: Terbit */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${progressStep >= 2 ? 'bg-[#0F685D] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {progressStep >= 2 ? <Check className="h-4 w-4" /> : <Calendar className="h-3.5 w-3.5" />}
                                        </div>
                                        <div className={`h-0.5 flex-1 ${progressStep >= 2 ? 'bg-[#0F685D]' : 'bg-slate-200'}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#17233C]">Tahap 2: Terbit</p>
                                        {progressStep >= 2 ? (
                                            <>
                                                <p className="text-[11px] text-[#64748B]">{letter.issued_at_formatted}</p>
                                                <p className="text-[10px] text-[#0F685D] mt-0.5">Surat siap diunduh</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-[11px] text-[#94A3B8]">Menunggu verifikasi RT</p>
                                                <p className="text-[10px] text-[#94A3B8] mt-0.5">Draft siap cetak</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Step 3: Sign (RT) */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${progressStep >= 3 ? 'bg-[#0F685D] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {progressStep >= 3 ? <Check className="h-4 w-4" /> : <PenTool className="h-3.5 w-3.5" />}
                                        </div>
                                        <div className={`h-0.5 flex-1 ${progressStep >= 3 ? 'bg-[#0F685D]' : 'bg-slate-200'}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#17233C]">Tahap 3: Sign (RT)</p>
                                        {progressStep >= 3 ? (
                                            <>
                                                <p className="text-[11px] text-[#64748B]">{letter.rt_confirmed_at_formatted}</p>
                                                <p className="text-[10px] text-[#0F685D] mt-0.5">Sudah Ditandatangani RT</p>
                                            </>
                                        ) : (
                                            <p className="text-[11px] text-[#94A3B8]">Tanda tangan oleh Ketua RT</p>
                                        )}
                                    </div>
                                </div>

                                {/* Step 4: Sign (RW) */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${progressStep >= 4 ? 'bg-[#0F685D] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {progressStep >= 4 ? <Check className="h-4 w-4" /> : <Shield className="h-3.5 w-3.5" />}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#17233C]">Tahap 4: Sign (RW)</p>
                                        {progressStep >= 4 ? (
                                            <>
                                                <p className="text-[11px] text-[#64748B]">{letter.rw_confirmed_at_formatted}</p>
                                                <p className="text-[10px] text-[#0F685D] mt-0.5">Sudah disahkan oleh RW</p>
                                            </>
                                        ) : (
                                            <p className="text-[11px] text-[#94A3B8]">Pengesahan oleh Ketua RW</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KHUSUS STATUS TERBIT: Tindakan Lanjutan & Kontak Pengesahan */}
                        {status === 'terbit' && (
                            <>
                                <div className="rounded-2xl border border-[#E6EAF2] bg-white p-6 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#EDF2F7] pb-3">
                                        <div className="flex items-center gap-2">
                                            <FileCheck className="h-4 w-4 text-[#0F685D]" />
                                            <h3 className="text-sm font-bold text-[#17233C] font-heading">
                                                Tindakan Lanjutan Pemohon
                                            </h3>
                                        </div>
                                        <span className="text-[11px] text-[#94A3B8]">
                                            Format Dokumen: PDF/{letter.jenis_label.replaceAll(' ', '')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <a
                                            href={letter.preview_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-xs font-semibold text-[#1E293B] hover:bg-[#F8FAFC] transition shadow-sm"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>Preview Surat</span>
                                        </a>

                                        <a
                                            href={letter.download_url}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F685D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0C544B] transition shadow-sm"
                                        >
                                            <Download className="h-4 w-4" />
                                            <span>Unduh Surat (PDF)</span>
                                        </a>
                                    </div>

                                    <div className="flex items-start gap-2 rounded-xl bg-[#F8FAFC] p-3 text-[11px] text-[#64748B] border border-[#E2E8F0]">
                                        <Info className="h-4 w-4 shrink-0 text-[#0F685D] mt-0.5" />
                                        <span>
                                            <strong>Catatan:</strong> Dokumen ini merupakan draf resmi yang telah terdaftar di sistem SIA Sukatani, namun belum sah secara hukum kependudukan sebelum dibubuhi tanda tangan dan stempel basah.
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#E6EAF2] bg-white p-6 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-[#0F685D]" />
                                        <h3 className="text-sm font-bold text-[#17233C] font-heading">
                                            Koordinasi Pengesahan Fisik RT / RW
                                        </h3>
                                    </div>

                                    <p className="text-xs text-[#68748A] leading-relaxed">
                                        Silakan hubungi kedua pengurus di atas untuk menjadwalkan pembubuhan tanda tangan basah dan stempel di Balai Warga atau kediaman pengurus.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <a
                                            href={letter.whatsapp_rw_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 rounded-xl bg-[#EEF5FF] px-4 py-2.5 text-xs font-semibold text-[#2764D8] hover:bg-[#DCEBFF] transition"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            <span>Hubungi Ketua RW via WhatsApp</span>
                                        </a>

                                        <a
                                            href={letter.whatsapp_rt_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 rounded-xl bg-[#EEF5FF] px-4 py-2.5 text-xs font-semibold text-[#2764D8] hover:bg-[#DCEBFF] transition"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            <span>Hubungi Ketua RT via WhatsApp</span>
                                        </a>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Ringkasan Permohonan Card */}
                        <div className="rounded-2xl border border-[#E6EAF2] bg-white p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-[#EDF2F7] pb-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-[#0F685D]" />
                                    <h3 className="text-sm font-bold text-[#17233C] font-heading">Ringkasan Permohonan</h3>
                                </div>
                                <span className="rounded-md bg-[#F1F5F9] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#475569] uppercase">
                                    DATA TERCATAT
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-[11px] text-[#64748B]">Nomor Pengajuan</span>
                                    <p className="font-bold font-mono text-[#0F685D] mt-0.5">{letter.nomor}</p>
                                </div>
                                <div>
                                    <span className="text-[11px] text-[#64748B]">Jenis Surat Layanan</span>
                                    <p className="font-semibold text-[#1E293B] mt-0.5">{letter.jenis_label}</p>
                                </div>
                                <div>
                                    <span className="text-[11px] text-[#64748B]">Tanggal Diajukan</span>
                                    <p className="font-medium text-[#1E293B] mt-0.5">{letter.created_at_formatted}</p>
                                </div>
                                <div>
                                    <span className="text-[11px] text-[#64748B]">Nama Pemohon</span>
                                    <p className="font-semibold text-[#1E293B] mt-0.5">{applicantName}</p>
                                </div>
                                {letter.nomor_surat && (
                                    <div className="sm:col-span-2">
                                        <span className="text-[11px] text-[#64748B]">Nomor Surat Resmi RT</span>
                                        <p className="font-bold font-mono text-[#0F685D] mt-0.5">{letter.nomor_surat}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rincian Data Permohonan Surat Card */}
                        <div className="rounded-2xl border border-[#E6EAF2] bg-white p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-[#EDF2F7] pb-3">
                                <div className="flex items-center gap-2">
                                    <FileCheck className="h-4 w-4 text-[#0F685D]" />
                                    <h3 className="text-sm font-bold text-[#17233C] font-heading">
                                        Rincian Data Permohonan Surat
                                    </h3>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#F1F5F9] px-2.5 py-0.5 text-[10px] font-bold text-[#475569]">
                                    <Lock className="h-3 w-3 text-[#64748B]" />
                                    <span>Data Terkunci</span>
                                </span>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[11px] text-[#64748B]">Nama Lengkap Pemohon</span>
                                        <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B]">
                                            {applicantName}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-[#64748B]">Nomor Induk Kependudukan (NIK)</span>
                                        <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-mono font-medium text-[#1E293B]">
                                            {nik}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[11px] text-[#64748B]">Tempat, Tanggal Lahir</span>
                                        <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B]">
                                            {ttl}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-[#64748B]">Jenis Kelamin</span>
                                        <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B]">
                                            {jk}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[11px] text-[#64748B]">Pekerjaan</span>
                                        <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B]">
                                            {pekerjaan}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-[#64748B]">Status Perkawinan / Agama</span>
                                        <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B]">
                                            {statusKawinAgama}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[11px] text-[#64748B]">Alamat Lengkap Sesuai KTP &amp; Domisili</span>
                                    <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B] leading-relaxed">
                                        {alamat}
                                    </div>
                                </div>

                                {d.alasan_tidak_bekerja && (
                                    <div>
                                        <span className="text-[11px] text-[#64748B]">Alasan Tidak Bekerja</span>
                                        <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B] leading-relaxed">
                                            {d.alasan_tidak_bekerja}
                                        </div>
                                    </div>
                                )}

                                {d.jenis_surat_keterangan && (
                                    <div>
                                        <span className="text-[11px] text-[#64748B]">Jenis Surat Keterangan</span>
                                        <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B] leading-relaxed">
                                            {d.jenis_surat_keterangan}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <span className="text-[11px] text-[#64748B]">Alasan / Keperluan Surat</span>
                                    <div className="mt-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 font-medium text-[#1E293B] leading-relaxed">
                                        {alasan}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Col 3): ServiceHelpCard & Panduan Pengesahan */}
                    <div className="space-y-4">
                        <ServiceHelpCard
                            leadName={letter.helpCard?.rt_lead_name}
                            phone={letter.helpCard?.whatsapp_help}
                            displayPhone={letter.helpCard?.whatsapp_help_display}
                            hours={letter.helpCard?.jam_pelayanan}
                            location={letter.helpCard?.balai_warga}
                        />

                        {status === 'terbit' && (
                            <div className="rounded-2xl border border-[#E6EAF2] bg-white p-5 shadow-sm space-y-3">
                                <h4 className="text-sm font-bold text-[#17233C] font-heading flex items-center gap-2">
                                    <FileCheck className="h-4 w-4 text-[#0F685D]" />
                                    <span>Panduan Pengesahan Fisik</span>
                                </h4>
                                <p className="text-xs text-[#68748A]">
                                    Harap bawa kelengkapan berikut saat bertemu pengurus:
                                </p>

                                <ul className="space-y-2.5 text-xs text-[#1E293B]">
                                    <li className="flex items-start gap-2">
                                        <Check className="h-4 w-4 shrink-0 text-[#0F685D] mt-0.5" />
                                        <span><strong>Cetak Draf Surat:</strong> Minimal 2 rangkap (1 untuk arsip warga, 1 untuk arsip pengurus RT/RW).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-4 w-4 shrink-0 text-[#0F685D] mt-0.5" />
                                        <span><strong>KTP Asli Pemohon:</strong> Wajib ditunjukkan untuk pencocokan fisik wajah &amp; identitas pemohon.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-4 w-4 shrink-0 text-[#0F685D] mt-0.5" />
                                        <span><strong>Kartu Keluarga (KK):</strong> Salinan atau bukti digital di aplikasi kependudukan.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-4 w-4 shrink-0 text-[#0F685D] mt-0.5" />
                                        <span><strong>Urutan Pengesahan:</strong> Datangi Ketua RT terlebih dahulu untuk tanda tangan 1, baru ke Ketua RW untuk tanda tangan 2 dan stempel RW.</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </WargaLayout>
    );
}
