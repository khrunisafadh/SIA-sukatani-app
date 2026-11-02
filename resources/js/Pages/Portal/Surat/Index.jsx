import Pagination from '@/Components/Pagination';
import WargaLayout from '@/Layouts/WargaLayout';
import { Head, Link } from '@inertiajs/react';
import { Download, Eye, FileText, Plus } from 'lucide-react';

function StatusPill({ status, label }) {
    switch (status) {
        case 'diajukan':
            return (
                <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E] border border-[#FDE68A]">
                    {label || 'Diajukan'}
                </span>
            );
        case 'terbit':
            return (
                <span className="inline-flex items-center rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-semibold text-[#1E40AF] border border-[#BFDBFE]">
                    {label || 'Terbit'}
                </span>
            );
        case 'selesai_rt':
            return (
                <span className="inline-flex items-center rounded-full bg-[#CCFBF1] px-3 py-1 text-xs font-semibold text-[#0F766E] border border-[#99F6E4]">
                    {label || 'Selesai (oleh Ketua RT)'}
                </span>
            );
        case 'selesai':
            return (
                <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#166534] border border-[#BBF7D0]">
                    {label || 'Selesai / Ditandatangani'}
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {label || status}
                </span>
            );
    }
}

export default function SuratIndex({ letters }) {
    const list = letters?.data || [];
    const total = letters?.total ?? list.length;

    return (
        <WargaLayout topBarLabel="Lingkungan RT 01 / RW 08 Kel. Sukatani">
            <Head title="Riwayat Pengajuan Surat - SIA Sukatani" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-[#68748A]">
                    <Link href={route('portal.dashboard')} className="hover:text-[#0F685D] hover:underline">
                        Layanan Administrasi Warga
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-[#17233C]">Riwayat Pengajuan Surat</span>
                </nav>

                {/* Header & CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#17233C] font-heading">
                            Riwayat Pengajuan Surat
                        </h1>
                        <p className="mt-1 text-xs text-[#68748A]">
                            Pantau status surat administrasi RT secara daring dan ajukan permohonan baru sesuai kebutuhan anda.
                        </p>
                    </div>

                    <Link
                        href={route('portal.surat.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F685D] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0C544B] transition self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Buat Pengajuan Baru</span>
                    </Link>
                </div>

                {/* Table Card (Tanpa Search / Filter sesuai Figma) */}
                <div className="overflow-hidden rounded-2xl border border-[#E6EAF2] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#EDF2F7] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#68748A]">
                                <tr>
                                    <th className="px-6 py-4">Nomor</th>
                                    <th className="px-6 py-4">Jenis Surat</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EDF2F7]">
                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF7EE] text-[#0F685D] mb-3">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-sm font-bold text-[#17233C]">Belum ada pengajuan surat</h3>
                                            <p className="mt-1 text-xs text-[#68748A]">
                                                Anda belum memiliki permohonan surat administrasi aktif.
                                            </p>
                                            <Link
                                                href={route('portal.surat.create')}
                                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0F685D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0C544B] transition"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>Buat Pengajuan Baru</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition">
                                            <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-[#0F685D]">
                                                {item.nomor}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-[#17233C]">
                                                {item.jenis_label}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-[#68748A]">
                                                {item.tanggal}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center">
                                                <StatusPill status={item.status} label={item.status_label} />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <div className="inline-flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('portal.surat.show', item.id)}
                                                        title="Lihat Detail Permohonan"
                                                        className="rounded-lg p-1.5 text-[#68748A] hover:bg-[#F1F5F9] hover:text-[#0F685D] transition"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>

                                                    {item.can_download && (
                                                        <a
                                                            href={route('portal.surat.pdf.download', item.id)}
                                                            title="Unduh Draf PDF"
                                                            className="rounded-lg p-1.5 text-[#2764D8] hover:bg-[#EEF5FF] transition"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#EDF2F7] px-6 py-3.5 gap-3">
                        <span className="text-xs text-[#68748A]">
                            Menampilkan <span className="font-semibold text-[#17233C]">{list.length}</span> dari{' '}
                            <span className="font-semibold text-[#17233C]">{total}</span> pengajuan
                        </span>

                        {letters?.links && letters.links.length > 3 && (
                            <Pagination links={letters.links} />
                        )}
                    </div>
                </div>
            </div>
        </WargaLayout>
    );
}
