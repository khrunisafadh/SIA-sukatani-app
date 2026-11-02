import ConfirmModal from '@/Components/ConfirmModal';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function SuratCreate({ wargaOptions, jenisOptions }) {
    const [confirming, setConfirming] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        pemohon_id: '',
        jenis_surat: '',
        keperluan: '',
        keterangan: '',
    });

    const submit = (event) => {
        event.preventDefault();
        setConfirming(true);
    };

    const save = () => {
        post(route('admin.surat.store'), {
            onFinish: () => setConfirming(false),
        });
    };

    const fieldClass = (name) =>
        `mt-1.5 h-10 w-full rounded-xl border px-3.5 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${
            errors[name] ? 'border-red-500' : 'border-[#E2E8F0]'
        }`;

    return (
        <AdminLayout
            title="Buat Pengajuan"
            description="Buat pengajuan surat atas nama warga terdaftar. Pemohon dan petugas pembuat dicatat terpisah."
            breadcrumbs={[
                { label: 'Layanan Administrasi', href: route('admin.dashboard') },
                { label: 'Pengajuan Surat', href: route('admin.surat.index') },
                { label: 'Buat Pengajuan' },
            ]}
        >
            <Head title="Buat Pengajuan - SIA Sukatani" />

            <form onSubmit={submit} className="card-admin max-w-3xl space-y-5 p-6 sm:p-8">
                <div>
                    <label htmlFor="pemohon_id" className="text-xs font-semibold text-[#1A253C]">
                        Warga pemohon
                    </label>
                    <select
                        id="pemohon_id"
                        value={data.pemohon_id}
                        onChange={(event) => setData('pemohon_id', event.target.value)}
                        className={fieldClass('pemohon_id')}
                    >
                        <option value="">Pilih warga terdaftar</option>
                        {wargaOptions.map((warga) => (
                            <option key={warga.id} value={warga.id}>
                                {warga.name} ({warga.username})
                            </option>
                        ))}
                    </select>
                    {errors.pemohon_id && <p className="mt-1 text-xs text-red-600">{errors.pemohon_id}</p>}
                </div>

                <div>
                    <label htmlFor="jenis_surat" className="text-xs font-semibold text-[#1A253C]">
                        Jenis surat
                    </label>
                    <select
                        id="jenis_surat"
                        value={data.jenis_surat}
                        onChange={(event) => setData('jenis_surat', event.target.value)}
                        className={fieldClass('jenis_surat')}
                    >
                        <option value="">Pilih jenis surat</option>
                        {Object.entries(jenisOptions).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    {errors.jenis_surat && <p className="mt-1 text-xs text-red-600">{errors.jenis_surat}</p>}
                </div>

                <div>
                    <label htmlFor="keperluan" className="text-xs font-semibold text-[#1A253C]">
                        Keperluan
                    </label>
                    <input
                        id="keperluan"
                        value={data.keperluan}
                        onChange={(event) => setData('keperluan', event.target.value)}
                        className={fieldClass('keperluan')}
                        placeholder="Contoh: Pengurusan KTP"
                    />
                    {errors.keperluan && <p className="mt-1 text-xs text-red-600">{errors.keperluan}</p>}
                </div>

                <div>
                    <label htmlFor="keterangan" className="text-xs font-semibold text-[#1A253C]">
                        Keterangan tambahan
                    </label>
                    <textarea
                        id="keterangan"
                        value={data.keterangan}
                        onChange={(event) => setData('keterangan', event.target.value)}
                        rows={4}
                        className={`mt-1.5 w-full rounded-xl border p-3 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${
                            errors.keterangan ? 'border-red-500' : 'border-[#E2E8F0]'
                        }`}
                        placeholder="Catatan atau keterangan pendukung pengajuan..."
                    />
                    {errors.keterangan && <p className="mt-1 text-xs text-red-600">{errors.keterangan}</p>}
                </div>

                <div className="flex justify-end gap-2.5 border-t border-[#EDF2F7] pt-5">
                    <Link
                        href={route('admin.surat.index')}
                        className="btn-admin-secondary"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-admin-primary"
                    >
                        Simpan Pengajuan
                    </button>
                </div>
            </form>

            <ConfirmModal
                show={confirming}
                title="Simpan pengajuan?"
                description="Pengajuan akan dicatat atas nama warga yang dipilih, bukan atas nama Admin. Sistem akan mencoba menerbitkan PDF draf."
                confirmLabel="Ya, simpan"
                processing={processing}
                onClose={() => !processing && setConfirming(false)}
                onConfirm={save}
            />
        </AdminLayout>
    );
}
