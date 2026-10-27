import { Dialog, Transition } from '@headlessui/react';
import { FileText, Lock } from 'lucide-react';
import { Fragment, useState } from 'react';

export default function ConfirmationModal({
    show,
    data,
    jenisLabel,
    processing,
    onClose,
    onConfirm,
}) {
    const [agreed, setAgreed] = useState(false);

    if (!show) return null;

    const applicantName = data.nama || '-';
    const nik = data.nik || data.nomor_kk_ktp || '-';
    const alamat = data.alamat || '-';
    const phone = data.nomor_hp || '-';
    const keperluan = data.alasan_keperluan || data.keperluan || data.alasan_tidak_bekerja || '-';

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-5">
                                <div>
                                    <Dialog.Title as="h3" className="text-lg font-bold text-[#17233C] font-heading">
                                        Konfirmasi Pengajuan Surat
                                    </Dialog.Title>
                                    <p className="mt-1 text-xs text-[#68748A]">
                                        Pastikan seluruh informasi pengajuan sudah benar sebelum dikirim kepada pengurus RT.
                                    </p>
                                </div>

                                {/* Ringkasan Card */}
                                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
                                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#17233C]">
                                            <FileText className="h-4 w-4 text-[#0F685D]" />
                                            <span>{jenisLabel}</span>
                                        </div>
                                        <span className="rounded-md bg-white border border-[#CBD5E1] px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                                            Draf Permohonan
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <span className="text-[11px] text-[#64748B]">Nama Lengkap Pemohon</span>
                                            <p className="font-semibold text-[#1E293B] truncate">{applicantName}</p>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-[#64748B]">NIK Pemohon</span>
                                            <p className="font-semibold text-[#1E293B] font-mono">{nik}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-[11px] text-[#64748B]">Alamat Sesuai KTP</span>
                                            <p className="font-medium text-[#1E293B] line-clamp-2">{alamat}</p>
                                        </div>
                                        {phone !== '-' && (
                                            <div>
                                                <span className="text-[11px] text-[#64748B]">Nomor WhatsApp Aktif</span>
                                                <p className="font-semibold text-[#1E293B]">{phone}</p>
                                            </div>
                                        )}
                                        {data.jenis_surat_keterangan && (
                                            <div className="col-span-2">
                                                <span className="text-[11px] text-[#64748B]">Jenis Surat Keterangan</span>
                                                <p className="font-semibold text-[#1E293B]">{data.jenis_surat_keterangan}</p>
                                            </div>
                                        )}
                                        <div className="col-span-2">
                                            <span className="text-[11px] text-[#64748B]">Keperluan / Keterangan</span>
                                            <p className="font-medium text-[#1E293B] line-clamp-2">{keperluan}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pernyataan Kebenaran Data */}
                                <label className="flex items-start gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0F685D] focus:ring-[#0F685D]"
                                    />
                                    <span className="text-xs text-[#475569] leading-relaxed select-none">
                                        Saya menyatakan bahwa seluruh data yang saya masukkan adalah sah, akurat, dan dapat dipertanggungjawabkan sesuai ketentuan administrasi RT 01/RW 08 Kelurahan Sukatani.
                                    </span>
                                </label>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={onClose}
                                        className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] transition disabled:opacity-50"
                                    >
                                        Batal &amp; Ubah Data
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!agreed || processing}
                                        onClick={onConfirm}
                                        className="rounded-xl bg-[#0F685D] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0C544B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Mengirim...' : 'Ya, Kirim Pengajuan Sekarang'}
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#94A3B8]">
                                    <Lock className="h-3.5 w-3.5" />
                                    <span>Data terenkripsi dan langsung diteruskan ke dasbor verifikasi Ketua RT 01.</span>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
