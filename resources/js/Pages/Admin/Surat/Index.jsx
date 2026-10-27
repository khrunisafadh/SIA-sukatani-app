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
            actions={null}
        >
            <Head title="Pengajuan Surat - SIA Sukatani" />

            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                {[
                    ['Total', summary.total],
                    ['Diajukan', summary.diajukan],
                    ['Terbit', summary.terbit],
                    ['Selesai RT', summary.selesai_rt || 0],
                    ['Selesai Akhir', summary.selesai],
                ].map(([label, value]) => (
                    <div key={label} className="card-admin p-4">
                        <p className="text-xs text-[#718096] font-medium">{label}</p>
                        <p className="mt-1 text-xl font-bold text-[#1A253C]">{value}</p>
                    </div>
                ))}
            </div>

            <div className="card-admin overflow-hidden">
                <form
                    className="flex flex-col gap-3 border-b border-[#EDF2F7] p-4 lg:flex-row lg:items-center bg-[#FCFDFE]"
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
                        <input
                            value={q}
                            onChange={(event) => setQ(event.target.value)}
                            placeholder="Cari nomor atau pemohon..."
                            className="input-admin pl-9"
                        />
                    </div>
                    <select
                        value={jenis}
                        onChange={(event) => {
                            setJenis(event.target.value);
                            applyFilters({ jenis: event.target.value });
                        }}
                        className="select-admin"
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
                        className="select-admin"
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
                        className="btn-admin-primary"
                    >
                        Cari
                    </button>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="btn-admin-secondary"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="table-admin">
                        <thead>
                            <tr>
                                <th>Nomor</th>
                                <th>Pemohon</th>
                                <th>Jenis Surat</th>
                                <th>Tanggal</th>
                                <th>Status</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {letters.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-xs text-[#718096]">
                                        Belum ada pengajuan yang sesuai filter.
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="text-[#0F685D] hover:underline font-semibold"
                                            >
                                                Reset filter
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                letters.data.map((letter) => (
                                    <tr key={letter.id}>
                                        <td className="font-semibold text-[#0F685D]">
                                            <Link href={route('admin.surat.show', letter.id)} className="hover:underline">
                                                {letter.nomor}
                                            </Link>
                                        </td>
                                        <td className="font-medium">{letter.pemohon}</td>
                                        <td>{letter.jenis_label}</td>
                                        <td>{letter.tanggal}</td>
                                        <td>
                                            <StatusBadge status={letter.status} label={letter.status_label} />
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-1.5">
                                                <Link
                                                    href={route('admin.surat.show', letter.id)}
                                                    className="btn-admin-icon"
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
                                                    className="btn-admin-icon"
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

                <div className="border-t border-[#EDF2F7] px-5 py-4">
                    <Pagination meta={letters} links={letters.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
