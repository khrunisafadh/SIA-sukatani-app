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
                    className="btn-admin-secondary"
                >
                    Kembali
                </Link>
            }
        >
            <Head title={`Detail ${letter.nomor} - SIA Sukatani`} />

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="card-admin p-6 space-y-4 lg:col-span-2">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Nomor pengajuan</p>
                            <h2 className="text-xl font-bold text-[#1A253C] font-heading">{letter.nomor}</h2>
                        </div>
                        <StatusBadge status={letter.status} label={letter.status_label} />
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2 pt-2">
                        <div>
                            <dt className="text-xs text-[#718096]">Pemohon</dt>
                            <dd className="mt-1 text-sm font-semibold text-[#1A253C]">{letter.pemohon.name}</dd>
                            <dd className="text-xs text-[#718096]">{letter.pemohon.username}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#718096]">Dibuat oleh petugas</dt>
                            <dd className="mt-1 text-sm font-semibold text-[#1A253C]">{letter.creator.name}</dd>
                            <dd className="text-xs text-[#718096]">{letter.creator.role_label}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#718096]">Jenis surat</dt>
                            <dd className="mt-1 text-sm text-[#1A253C]">{letter.jenis_label}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#718096]">Tanggal pengajuan</dt>
                            <dd className="mt-1 text-sm text-[#1A253C]">{letter.tanggal}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-xs text-[#718096]">Keperluan</dt>
                            <dd className="mt-1 text-sm text-[#1A253C]">{letter.keperluan}</dd>
                        </div>
                        {letter.keterangan && (
                            <div className="sm:col-span-2">
                                <dt className="text-xs text-[#718096]">Keterangan</dt>
                                <dd className="mt-1 text-sm text-[#1A253C]">{letter.keterangan}</dd>
                            </div>
                        )}
                        {letter.completed_by && (
                            <div className="sm:col-span-2 rounded-xl bg-[#EAF7EE] border border-[#B6E6C5] p-3 text-xs text-[#14833B]">
                                Diselesaikan {letter.completed_at} oleh {letter.completed_by.name} ({letter.completed_by.role_label}).
                            </div>
                        )}
                    </dl>

                    <div className="flex flex-wrap gap-2.5 border-t border-[#EDF2F7] pt-5">
                        {letter.can_preview ? (
                            <a
                                href={letter.preview_url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-admin-secondary"
                            >
                                <Eye className="h-4 w-4" />
                                <span>Preview PDF</span>
                            </a>
                        ) : (
                            <button
                                type="button"
                                disabled
                                title={letter.pdf_locked
                                    ? 'Draf ditutup setelah pengesahan fisik'
                                    : 'Dokumen PDF belum tersedia'}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-xs font-semibold text-slate-400 bg-slate-50 cursor-not-allowed"
                            >
                                <Eye className="h-4 w-4" />
                                <span>Preview PDF</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={downloadPdf}
                            disabled={!letter.can_download}
                            title={letter.can_download ? 'Unduh PDF' : (letter.pdf_locked ? 'Draf ditutup setelah pengesahan fisik' : 'Dokumen PDF belum tersedia')}
                            className="btn-admin-secondary"
                        >
                            <Download className="h-4 w-4" />
                            <span>Unduh PDF</span>
                        </button>

                        {canConfirm ? (
                            <button
                                type="button"
                                onClick={() => setConfirming(true)}
                                className="btn-admin-primary"
                            >
                                Konfirmasi Pengesahan Fisik
                            </button>
                        ) : letter.status === 'selesai' ? (
                            <span className="self-center text-xs text-[#718096]">Pengesahan fisik sudah dicatat. Hanya detail administratif yang tersedia.</span>
                        ) : null}
                    </div>

                    {letter.pdf_unavailable && (
                        <p className="text-xs text-amber-700 font-medium">Dokumen PDF belum tersedia.</p>
                    )}
                    {letter.pdf_locked && (
                        <p className="text-xs text-[#718096]">
                            Preview dan unduh draf elektronik ditutup karena surat telah disahkan secara fisik.
                        </p>
                    )}
                </section>

                <section className="card-admin p-6 space-y-3">
                    <h3 className="text-sm font-bold text-[#1A253C] font-heading">Riwayat status</h3>
                    <ol className="mt-4 space-y-4">
                        {letter.histories.map((item) => (
                            <li key={item.id} className="border-l-2 border-[#0F685D] pl-3.5 space-y-0.5">
                                <p className="text-xs font-bold text-[#1A253C]">{item.status_label}</p>
                                <p className="text-[11px] text-[#718096]">{item.at} · {item.actor || 'Sistem'}</p>
                                {item.keterangan && <p className="mt-1 text-xs text-[#4A5568]">{item.keterangan}</p>}
                            </li>
                        ))}
                    </ol>
                </section>
            </div>

            {letter.can_preview && (
                <section className="mt-6 overflow-hidden card-admin">
                    <div className="border-b border-[#EDF2F7] px-6 py-4 text-xs font-bold text-[#1A253C] uppercase tracking-wider bg-[#FAFCFD]">Pratinjau dokumen</div>
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
