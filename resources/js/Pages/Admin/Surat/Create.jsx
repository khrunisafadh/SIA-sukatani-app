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
        `mt-1 h-10 w-full rounded-lg border px-3 text-sm focus:border-[#267F83] focus:ring-[#267F83]/20 ${
            errors[name] ? 'border-red-500' : 'border-[#E3E8EC]'
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
            <Head title="Buat Pengajuan" />

            <form onSubmit={submit} className="max-w-3xl space-y-5 rounded-xl border border-[#E3E8EC] bg-white p-6">
                <div>
                    <label htmlFor="pemohon_id" className="text-sm font-medium">
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
                    <label htmlFor="jenis_surat" className="text-sm font-medium">
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
                    <label htmlFor="keperluan" className="text-sm font-medium">
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
                    <label htmlFor="keterangan" className="text-sm font-medium">
                        Keterangan tambahan
                    </label>
                    <textarea
                        id="keterangan"
                        value={data.keterangan}
                        onChange={(event) => setData('keterangan', event.target.value)}
                        rows={4}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-[#267F83] focus:ring-[#267F83]/20 ${
                            errors.keterangan ? 'border-red-500' : 'border-[#E3E8EC]'
                        }`}
                    />
                    {errors.keterangan && <p className="mt-1 text-xs text-red-600">{errors.keterangan}</p>}
                </div>

                <div className="flex justify-end gap-2 border-t border-[#E3E8EC] pt-4">
                    <Link
                        href={route('admin.surat.index')}
                        className="rounded-lg border border-[#E3E8EC] px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-[#267F83] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1F686C] disabled:opacity-60"
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
