import ConfirmModal from '@/Components/ConfirmModal';
import StatusBadge from '@/Components/StatusBadge';
import { useToast } from '@/Components/AppToast';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Eye } from 'lucide-react';
import { useState } from 'react';

export default function SuratShow({ letter, canConfirm }) {
    const { notify } = useToast();
    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    const downloadPdf = async () => {
        if (!letter.can_download || !letter.download_url) {
            notify('error', letter.pdf_locked
                ? 'Draf elektronik tidak dapat diunduh setelah pengesahan fisik.'
                : 'Dokumen PDF belum tersedia.');
            return;
        }

        try {
            const response = await fetch(letter.download_url, {
                credentials: 'same-origin',
                headers: { Accept: 'application/pdf' },
            });

            if (!response.ok) {
                notify(
                    'error',
                    response.status === 403
                        ? 'Draf elektronik tidak dapat diunduh setelah pengesahan fisik.'
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
            link.download = `${letter.jenis_label.replaceAll(' ', '_')}_${letter.nomor}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            notify('error', 'Gagal mengunduh dokumen. Coba lagi.');
        }
    };

    const confirm = () => {
        setProcessing(true);
        router.post(route('admin.surat.confirm', letter.id), {}, {
            onFinish: () => {
                setProcessing(false);
                setConfirming(false);
            },
            onError: () => notify('error', 'Gagal menyimpan perubahan. Silakan coba lagi.'),
        });
    };

    return (
        <AdminLayout
            title={`Detail Pengajuan ${letter.nomor}`}
            description="Data permohonan, riwayat status, dan tindakan sesuai kewenangan."
            breadcrumbs={[
                { label: 'Layanan Administrasi', href: route('admin.dashboard') },
                { label: 'Pengajuan Surat', href: route('admin.surat.index') },
                { label: 'Detail Pengajuan' },
            ]}
            actions={
                <Link
                    href={route('admin.surat.index')}
                    className="rounded-lg border border-[#E3E8EC] bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                    Kembali
                </Link>
            }
        >
            <Head title={`Detail ${letter.nomor}`} />

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="space-y-4 rounded-xl border border-[#E3E8EC] bg-white p-5 lg:col-span-2">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#667085]">Nomor pengajuan</p>
                            <h2 className="text-lg font-semibold">{letter.nomor}</h2>
                        </div>
                        <StatusBadge status={letter.status} label={letter.status_label} />
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-[#667085]">Pemohon</dt>
                            <dd className="mt-1 text-sm font-medium">{letter.pemohon.name}</dd>
                            <dd className="text-xs text-[#667085]">{letter.pemohon.username}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#667085]">Dibuat oleh petugas</dt>
                            <dd className="mt-1 text-sm font-medium">{letter.creator.name}</dd>
                            <dd className="text-xs text-[#667085]">{letter.creator.role_label}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#667085]">Jenis surat</dt>
                            <dd className="mt-1 text-sm">{letter.jenis_label}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#667085]">Tanggal pengajuan</dt>
                            <dd className="mt-1 text-sm">{letter.tanggal}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-xs text-[#667085]">Keperluan</dt>
                            <dd className="mt-1 text-sm">{letter.keperluan}</dd>
                        </div>
                        {letter.keterangan && (
                            <div className="sm:col-span-2">
                                <dt className="text-xs text-[#667085]">Keterangan</dt>
                                <dd className="mt-1 text-sm">{letter.keterangan}</dd>
                            </div>
                        )}
                        {letter.completed_by && (
                            <div className="sm:col-span-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                                Diselesaikan {letter.completed_at} oleh {letter.completed_by.name} ({letter.completed_by.role_label}).
                            </div>
                        )}
                    </dl>

                    <div className="flex flex-wrap gap-2 border-t border-[#E3E8EC] pt-4">
                        {letter.can_preview ? (
                            <a
                                href={letter.preview_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-[#E3E8EC] px-3 py-2 text-sm font-medium hover:bg-slate-50"
                            >
                                <Eye className="h-4 w-4" />
                                Preview PDF
                            </a>
                        ) : (
                            <button
                                type="button"
                                disabled
                                title={letter.pdf_locked
                                    ? 'Draf ditutup setelah pengesahan fisik'
                                    : 'Dokumen PDF belum tersedia'}
                                className="inline-flex items-center gap-2 rounded-lg border border-[#E3E8EC] px-3 py-2 text-sm text-slate-400"
                            >
                                <Eye className="h-4 w-4" />
                                Preview PDF
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={downloadPdf}
                            disabled={!letter.can_download}
                            title={letter.can_download ? 'Unduh PDF' : (letter.pdf_locked ? 'Draf ditutup setelah pengesahan fisik' : 'Dokumen PDF belum tersedia')}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#E3E8EC] px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                            <Download className="h-4 w-4" />
                            Unduh PDF
                        </button>

                        {canConfirm ? (
                            <button
                                type="button"
                                onClick={() => setConfirming(true)}
                                className="inline-flex items-center rounded-lg bg-[#267F83] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1F686C]"
                            >
                                Konfirmasi Pengesahan Fisik
                            </button>
                        ) : letter.status === 'selesai' ? (
                            <span className="self-center text-xs text-[#667085]">Pengesahan fisik sudah dicatat. Hanya detail administratif yang tersedia.</span>
                        ) : null}
                    </div>

                    {letter.pdf_unavailable && (
                        <p className="text-sm text-amber-700">Dokumen PDF belum tersedia.</p>
                    )}
                    {letter.pdf_locked && (
                        <p className="text-sm text-[#667085]">
                            Preview dan unduh draf elektronik ditutup karena surat telah disahkan secara fisik.
                        </p>
                    )}
                </section>

                <section className="rounded-xl border border-[#E3E8EC] bg-white p-5">
                    <h3 className="text-sm font-semibold">Riwayat status</h3>
                    <ol className="mt-4 space-y-4">
                        {letter.histories.map((item) => (
                            <li key={item.id} className="border-l-2 border-[#267F83] pl-3">
                                <p className="text-sm font-medium">{item.status_label}</p>
                                <p className="text-xs text-[#667085]">{item.at} · {item.actor || 'Sistem'}</p>
                                {item.keterangan && <p className="mt-1 text-xs">{item.keterangan}</p>}
                            </li>
                        ))}
                    </ol>
                </section>
            </div>

            {letter.can_preview && (
                <section className="mt-6 overflow-hidden rounded-xl border border-[#E3E8EC] bg-white">
                    <div className="border-b border-[#E3E8EC] px-5 py-3 text-sm font-semibold">Pratinjau dokumen</div>
                    <iframe title="Preview PDF" src={letter.preview_url} className="h-[640px] w-full" />
                </section>
            )}

            <ConfirmModal
                show={confirming}
                title="Konfirmasi pengesahan fisik"
                description="Surat telah ditandatangani dan dicap secara fisik? Tindakan ini mencatat status Selesai/Ditandatangani dan menutup akses draf PDF."
                confirmLabel="Ya, sudah disahkan"
                processing={processing}
                onClose={() => !processing && setConfirming(false)}
                onConfirm={confirm}
            />
        </AdminLayout>
    );
}
