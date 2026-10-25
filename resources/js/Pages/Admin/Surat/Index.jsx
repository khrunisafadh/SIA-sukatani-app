import Pagination from '@/Components/Pagination';
import StatusBadge from '@/Components/StatusBadge';
import { useToast } from '@/Components/AppToast';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Eye, Plus, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';

export default function SuratIndex({ letters, filters, summary, jenisOptions, statusOptions, canCreate }) {
    const { notify } = useToast();
    const [q, setQ] = useState(filters.q ?? '');
    const [jenis, setJenis] = useState(filters.jenis ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = (next = {}) => {
        router.get(
            route('admin.surat.index'),
            {
                q: next.q ?? q,
                jenis: next.jenis ?? jenis,
                status: next.status ?? status,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setQ('');
        setJenis('');
        setStatus('');
        router.get(route('admin.surat.index'), {}, { preserveState: false, replace: true });
    };

    const downloadRow = async (letter) => {
        if (!letter.can_download) {
            notify(
                'error',
                letter.status === 'selesai'
                    ? 'Draf elektronik tidak dapat diunduh setelah pengesahan fisik.'
                    : 'Dokumen PDF belum tersedia.',
            );
            return;
        }

        try {
            const response = await fetch(route('admin.surat.pdf.download', letter.id), {
                credentials: 'same-origin',
                headers: { Accept: 'application/pdf' },
            });

            if (!response.ok) {
                notify(
                    'error',
                    response.status === 403
                        ? 'Draf elektronik tidak dapat diunduh setelah pengesahan fisik.'
                        : response.status === 404
                          ? 'Dokumen PDF belum tersedia.'
                          : 'Gagal mengunduh dokumen. Coba lagi.',
                );
                return;
            }

            const blob = await response.blob();
            if (!blob.size) {
                notify('error', 'Dokumen PDF belum tersedia.');
                return;
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${letter.jenis_label ? letter.jenis_label.replaceAll(' ', '_') : 'Surat'}_${letter.nomor}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            notify('error', 'Gagal mengunduh dokumen. Coba lagi.');
        }
    };

    return (
        <AdminLayout
            title="Pengajuan Surat"
            description="Pantau pengajuan dan perbarui status setelah proses fisik selesai."
            breadcrumbs={[
                { label: 'Layanan Administrasi', href: route('admin.dashboard') },
                { label: 'Pengajuan Surat' },
            ]}
            actions={
                canCreate ? (
                    <Link
                        href={route('admin.surat.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#267F83] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1F686C]"
                    >
                        <Plus className="h-4 w-4" />
                        Buat Pengajuan
                    </Link>
                ) : null
            }
        >
            <Head title="Pengajuan Surat" />

            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                    ['Total', summary.total],
                    ['Diajukan', summary.diajukan],
                    ['Terbit', summary.terbit],
                    ['Selesai', summary.selesai],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-[#E3E8EC] bg-white px-4 py-3">
                        <p className="text-xs text-[#667085]">{label}</p>
                        <p className="mt-1 text-lg font-semibold">{value}</p>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-[#E3E8EC] bg-white">
                <form
                    className="flex flex-col gap-3 border-b border-[#E3E8EC] p-4 lg:flex-row lg:items-center"
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#97A0AF]" />
                        <input
                            value={q}
                            onChange={(event) => setQ(event.target.value)}
                            placeholder="Cari nomor atau pemohon..."
                            className="h-10 w-full rounded-lg border border-[#E3E8EC] pl-9 pr-3 text-sm focus:border-[#267F83] focus:ring-[#267F83]/20"
                        />
                    </div>
                    <select
                        value={jenis}
                        onChange={(event) => {
                            setJenis(event.target.value);
                            applyFilters({ jenis: event.target.value });
                        }}
                        className="h-10 rounded-lg border border-[#E3E8EC] text-sm"
                    >
                        <option value="">Semua jenis surat</option>
                        {Object.entries(jenisOptions).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value);
                            applyFilters({ status: event.target.value });
                        }}
                        className="h-10 rounded-lg border border-[#E3E8EC] text-sm"
                    >
                        <option value="">Semua status</option>
                        {Object.entries(statusOptions).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="h-10 rounded-lg bg-[#267F83] px-4 text-sm font-semibold text-white hover:bg-[#1F686C]"
                    >
                        Cari
                    </button>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#E3E8EC] px-3 text-sm text-[#667085] hover:bg-slate-50"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-[#F8FAFB] text-xs uppercase tracking-wide text-[#667085]">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Nomor</th>
                                <th className="px-4 py-3 font-semibold">Pemohon</th>
                                <th className="px-4 py-3 font-semibold">Jenis Surat</th>
                                <th className="px-4 py-3 font-semibold">Tanggal</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {letters.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#667085]">
                                        Belum ada pengajuan yang sesuai filter.
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="text-[#267F83] underline"
                                            >
                                                Reset filter
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                letters.data.map((letter) => (
                                    <tr key={letter.id} className="border-t border-[#E3E8EC]">
                                        <td className="px-4 py-3 font-medium">
                                            <Link href={route('admin.surat.show', letter.id)} className="hover:underline">
                                                {letter.nomor}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">{letter.pemohon}</td>
                                        <td className="px-4 py-3">{letter.jenis_label}</td>
                                        <td className="px-4 py-3">{letter.tanggal}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={letter.status} label={letter.status_label} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.surat.show', letter.id)}
                                                    className="rounded-md border border-[#E3E8EC] p-1.5 text-[#267F83] hover:bg-slate-50"
                                                    title="Lihat detail"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => downloadRow(letter)}
                                                    disabled={!letter.can_download}
                                                    title={
                                                        letter.can_download
                                                            ? 'Unduh PDF'
                                                            : letter.status === 'selesai'
                                                              ? 'Draf PDF ditutup setelah pengesahan fisik'
                                                              : 'Dokumen PDF belum tersedia'
                                                    }
                                                    className="rounded-md border border-[#E3E8EC] p-1.5 text-[#267F83] hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-[#E3E8EC] px-4 py-3">
                    <Pagination meta={letters} links={letters.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
