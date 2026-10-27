import ConfirmModal from '@/Components/ConfirmModal';
import StatusBadge from '@/Components/StatusBadge';
import { useToast } from '@/Components/AppToast';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Check, CheckCircle2, Download, Eye, FileCheck, PenTool, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function SuratShow({ letter, canVerify, canConfirmRt, canConfirmRw }) {
    const { notify } = useToast();
    const [actionType, setActionType] = useState(null); // 'verify', 'confirmRt', 'confirmRw'
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
            link.download = `${letter.jenis_label.replaceAll(' ', '_')}_${letter.nomor_surat ? letter.nomor_surat.replaceAll('/', '-') : letter.nomor}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            notify('error', 'Gagal mengunduh dokumen. Coba lagi.');
        }
    };

    const handleConfirmAction = () => {
        if (!actionType) return;
        setProcessing(true);

        let endpoint = '';
        if (actionType === 'verify') {
            endpoint = route('admin.surat.verify', letter.id);
        } else if (actionType === 'confirmRt') {
            endpoint = route('admin.surat.confirm-rt', letter.id);
        } else if (actionType === 'confirmRw') {
            endpoint = route('admin.surat.confirm-rw', letter.id);
        }

        router.post(endpoint, {}, {
            onFinish: () => {
                setProcessing(false);
                setActionType(null);
            },
            onSuccess: () => {
                notify('success', 'Tindakan berhasil diproses.');
            },
            onError: () => notify('error', 'Gagal memproses permohonan. Silakan coba lagi.'),
        });
    };

    const d = letter.data_surat || {};

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
                <section className="card-admin p-6 space-y-5 lg:col-span-2">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Nomor Registrasi Tracking</p>
                            <h2 className="text-xl font-bold text-[#1A253C] font-heading font-mono">{letter.nomor}</h2>
                            {letter.nomor_surat && (
                                <p className="text-xs font-semibold text-[#0F685D] mt-0.5">
                                    Nomor Resmi: <span className="font-mono">{letter.nomor_surat}</span>
                                </p>
                            )}
                        </div>
                        <StatusBadge status={letter.status} label={letter.status_label} />
                    </div>

                    {/* Progress Pengesahan Fisik Alerts */}
                    {letter.status === 'selesai' ? (
                        <div className="rounded-xl bg-[#EAF7EE] border border-[#B6E6C5] p-3 text-xs text-[#14833B] flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#14833B]" />
                            <span>Pengesahan fisik lengkap (Ketua RT dan Ketua RW telah selesai dicatat). Akses berkas digital resmi ditutup.</span>
                        </div>
                    ) : letter.status === 'selesai_rt' ? (
                        <div className="rounded-xl bg-[#E6F7F2] border border-[#A7F3D0] p-3 text-xs text-[#0F766E] flex items-center gap-2">
                            <PenTool className="h-4 w-4 shrink-0" />
                            <span>Pengesahan fisik tingkat RT telah selesai. Menunggu konfirmasi pengesahan tingkat RW oleh Sekretaris.</span>
                        </div>
                    ) : null}

                    <dl className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-[#EDF2F7]">
                        <div>
                            <dt className="text-xs text-[#718096]">Pemohon</dt>
                            <dd className="mt-1 text-sm font-semibold text-[#1A253C]">{letter.pemohon.name}</dd>
                            <dd className="text-xs text-[#718096]">{letter.pemohon.username}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#718096]">Jenis surat</dt>
                            <dd className="mt-1 text-sm font-semibold text-[#1A253C]">{letter.jenis_label}</dd>
                            {letter.nomor_surat && (
                                <dd className="text-xs text-[#0F685D] font-mono">{letter.nomor_surat}</dd>
                            )}
                        </div>
                        <div>
                            <dt className="text-xs text-[#718096]">Tanggal pengajuan</dt>
                            <dd className="mt-1 text-sm text-[#1A253C]">{letter.tanggal}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#718096]">Diterbitkan pada</dt>
                            <dd className="mt-1 text-sm text-[#1A253C]">{letter.issued_at || '-'}</dd>
                        </div>

                        {letter.verified_by && (
                            <div className="sm:col-span-2 text-xs text-[#4A5568]">
                                <span className="text-[#718096]">Diverifikasi oleh:</span> {letter.verified_by.name} ({letter.verified_by.role_label})
                            </div>
                        )}

                        {/* Rincian Tambahan Data Surat */}
                        <div className="sm:col-span-2 border-t border-[#EDF2F7] pt-3">
                            <dt className="text-xs font-bold text-[#1A253C] mb-2 uppercase tracking-wider">Rincian Data Formulir</dt>
                            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                <div>
                                    <span className="text-[#718096]">Nama Tercatat:</span>
                                    <p className="font-semibold text-[#1A253C]">{d.nama || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-[#718096]">NIK / Identitas:</span>
                                    <p className="font-mono font-semibold text-[#1A253C]">{d.nik || d.nomor_kk_ktp || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-[#718096]">Tempat, Tanggal Lahir:</span>
                                    <p className="text-[#1A253C]">{[d.tempat_lahir, d.tanggal_lahir].filter(Boolean).join(', ') || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-[#718096]">Pekerjaan:</span>
                                    <p className="text-[#1A253C]">{d.pekerjaan || '-'}</p>
                                </div>
                                {d.jenis_kelamin && (
                                    <div>
                                        <span className="text-[#718096]">Jenis Kelamin:</span>
                                        <p className="text-[#1A253C]">{d.jenis_kelamin}</p>
                                    </div>
                                )}
                                {d.agama && (
                                    <div>
                                        <span className="text-[#718096]">Agama:</span>
                                        <p className="text-[#1A253C]">{d.agama}</p>
                                    </div>
                                )}
                                {d.alamat && (
                                    <div className="col-span-2">
                                        <span className="text-[#718096]">Alamat:</span>
                                        <p className="text-[#1A253C]">{d.alamat}</p>
                                    </div>
                                )}
                                {d.jenis_surat_keterangan && (
                                    <div className="col-span-2">
                                        <span className="text-[#718096]">Jenis Keterangan Spesifik:</span>
                                        <p className="font-semibold text-[#0F685D]">{d.jenis_surat_keterangan}</p>
                                    </div>
                                )}
                                {d.alasan_tidak_bekerja && (
                                    <div className="col-span-2">
                                        <span className="text-[#718096]">Alasan Tidak Bekerja:</span>
                                        <p className="text-[#1A253C]">{d.alasan_tidak_bekerja}</p>
                                    </div>
                                )}
                                {d.hari_meninggal && (
                                    <div>
                                        <span className="text-[#718096]">Hari / Tgl Meninggal:</span>
                                        <p className="text-[#1A253C]">{d.hari_meninggal}, {d.tanggal_meninggal}</p>
                                    </div>
                                )}
                                {d.jam_meninggal && (
                                    <div>
                                        <span className="text-[#718096]">Jam Meninggal:</span>
                                        <p className="text-[#1A253C]">{d.jam_meninggal} WIB</p>
                                    </div>
                                )}
                                {(d.alasan_keperluan || letter.keperluan) && (
                                    <div className="col-span-2">
                                        <span className="text-[#718096]">Keperluan / Alasan:</span>
                                        <p className="text-[#1A253C] font-medium">{d.alasan_keperluan || letter.keperluan}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {letter.rt_confirmed_at && (
                            <div className="sm:col-span-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-2.5 text-xs text-[#15803D]">
                                Pengesahan RT dicatat pada {letter.rt_confirmed_at} oleh {letter.rt_confirmed_by?.name || 'Petugas RT'}.
                            </div>
                        )}
                        {letter.rw_confirmed_at && (
                            <div className="sm:col-span-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-2.5 text-xs text-[#15803D]">
                                Pengesahan RW dicatat pada {letter.rw_confirmed_at} oleh {letter.rw_confirmed_by?.name || 'Sekretaris'}.
                            </div>
                        )}
                    </dl>

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center gap-2.5 border-t border-[#EDF2F7] pt-5">
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

                        {/* Tombol Verifikasi Ketua RT (Status Diajukan) */}
                        {canVerify && (
                            <button
                                type="button"
                                onClick={() => setActionType('verify')}
                                className="btn-admin-primary bg-[#0F685D] hover:bg-[#0C544B]"
                            >
                                <FileCheck className="h-4 w-4" />
                                <span>Verifikasi &amp; Terbitkan Surat</span>
                            </button>
                        )}

                        {/* Tombol Konfirmasi RT (Ketua RT atau Sekretaris) */}
                        {canConfirmRt && (
                            <button
                                type="button"
                                onClick={() => setActionType('confirmRt')}
                                className="btn-admin-primary bg-[#0284C7] hover:bg-[#0369A1]"
                            >
                                <PenTool className="h-4 w-4" />
                                <span>Konfirmasi Tanda Tangan RT</span>
                            </button>
                        )}

                        {/* Tombol Konfirmasi RW (Khusus Sekretaris) */}
                        {canConfirmRw && (
                            <button
                                type="button"
                                onClick={() => setActionType('confirmRw')}
                                className="btn-admin-primary bg-[#7C3AED] hover:bg-[#6D28D9]"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                <span>Konfirmasi Tanda Tangan RW</span>
                            </button>
                        )}
                    </div>
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
                    <div className="border-b border-[#EDF2F7] px-6 py-4 text-xs font-bold text-[#1A253C] uppercase tracking-wider bg-[#FAFCFD]">
                        Pratinjau dokumen draf terbit
                    </div>
                    <iframe title="Preview PDF" src={letter.preview_url} className="h-[640px] w-full" />
                </section>
            )}

            {/* Modal Konfirmasi Tindakan Admin */}
            <ConfirmModal
                show={actionType !== null}
                title={
                    actionType === 'verify'
                        ? 'Verifikasi & Terbitkan Surat'
                        : actionType === 'confirmRt'
                          ? 'Konfirmasi Pengesahan Ketua RT'
                          : 'Konfirmasi Pengesahan Ketua RW'
                }
                description={
                    actionType === 'verify'
                        ? 'Data permohonan warga telah valid? Tindakan ini menerbitkan nomor surat resmi (khusus surat keterangan), menghasilkan dokumen PDF draf, dan mengubah status menjadi Terbit.'
                        : actionType === 'confirmRt'
                          ? 'Tanda tangan basah dan stempel Ketua RT telah selesai dibubuhkan secara fisik?'
                          : 'Tanda tangan basah dan stempel Ketua RW telah selesai dibubuhkan secara fisik?'
                }
                confirmLabel={
                    actionType === 'verify'
                        ? 'Ya, Terbitkan Surat'
                        : 'Ya, Sudah Disahkan'
                }
                processing={processing}
                onClose={() => !processing && setActionType(null)}
                onConfirm={handleConfirmAction}
            />
        </AdminLayout>
    );
}
