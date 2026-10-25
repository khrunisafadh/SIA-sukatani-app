import ConfirmModal from '@/Components/ConfirmModal';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { KeyRound, Pencil, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function UsersIndex({ users, filters, roleOptions, total }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [roleFilter, setRoleFilter] = useState(filters.role ?? '');
    const [createOpen, setCreateOpen] = useState(false);
    const [roleUser, setRoleUser] = useState(null);
    const [resetUser, setResetUser] = useState(null);

    const createForm = useForm({
        name: '',
        username: '',
        email: '',
        role: '',
    });

    const roleForm = useForm({
        role: '',
    });

    const applyFilters = (next = {}) => {
        router.get(
            route('admin.users.index'),
            {
                q: next.q ?? q,
                role: next.role ?? roleFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setQ('');
        setRoleFilter('');
        router.get(route('admin.users.index'), {}, { replace: true });
    };

    const closeCreate = () => {
        if (createForm.processing) {
            return;
        }
        setCreateOpen(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const submitCreate = (event) => {
        event.preventDefault();
        createForm.post(route('admin.users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openRole = (user) => {
        setRoleUser(user);
        roleForm.setData('role', user.role);
        roleForm.clearErrors();
    };

    const submitRole = () => {
        if (!roleUser) {
            return;
        }

        roleForm.patch(route('admin.users.update-role', roleUser.id), {
            preserveScroll: true,
            onSuccess: () => setRoleUser(null),
        });
    };

    const submitReset = () => {
        if (!resetUser) {
            return;
        }

        router.post(route('admin.users.reset-access', resetUser.id), {}, {
            preserveScroll: true,
            onFinish: () => setResetUser(null),
        });
    };

    return (
        <AdminLayout
            title="Pengguna & Role"
            description="Kelola akun dan tetapkan salah satu dari empat role resmi. Perubahan role berlaku pada izin akses berikutnya."
            breadcrumbs={[
                { label: 'Pengguna & Role' },
            ]}
            actions={
                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#267F83] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1F686C]"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Akun
                </button>
            }
        >
            <Head title="Pengguna & Role" />

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
                            placeholder="Cari nama, username, atau email..."
                            className="h-10 w-full rounded-lg border border-[#E3E8EC] pl-9 pr-3 text-sm"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(event) => {
                            setRoleFilter(event.target.value);
                            applyFilters({ role: event.target.value });
                        }}
                        className="h-10 rounded-lg border border-[#E3E8EC] text-sm"
                    >
                        <option value="">Semua role</option>
                        {Object.entries(roleOptions).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="h-10 rounded-lg bg-[#267F83] px-4 text-sm font-semibold text-white">
                        Cari
                    </button>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#E3E8EC] px-3 text-sm text-[#667085]"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-[#F8FAFB] text-xs uppercase tracking-wide text-[#667085]">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Nama</th>
                                <th className="px-4 py-3 font-semibold">Username</th>
                                <th className="px-4 py-3 font-semibold">Role</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Aktivitas terakhir</th>
                                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#667085]">
                                        Tidak ada akun yang sesuai filter.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="border-t border-[#E3E8EC]">
                                        <td className="px-4 py-3 font-medium">{user.name}</td>
                                        <td className="px-4 py-3">{user.username}</td>
                                        <td className="px-4 py-3">{user.role_label}</td>
                                        <td className="px-4 py-3">{user.status}</td>
                                        <td className="px-4 py-3">{user.last_activity_at || '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openRole(user)}
                                                    className="rounded-md border border-[#E3E8EC] p-1.5 text-[#267F83] hover:bg-slate-50"
                                                    title="Ubah role"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setResetUser(user)}
                                                    className="rounded-md border border-[#E3E8EC] p-1.5 text-[#267F83] hover:bg-slate-50"
                                                    title="Kirim tautan reset akses"
                                                >
                                                    <KeyRound className="h-4 w-4" />
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
                    <Pagination meta={users.meta ?? { total, last_page: 1 }} links={users.links} />
                </div>
            </div>

            <Modal show={createOpen} onClose={closeCreate} maxWidth="lg">
                <form onSubmit={submitCreate} className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h3 className="text-base font-semibold">Tambah Akun Pengguna</h3>
                            <p className="mt-1 text-sm text-[#667085]">
                                Kredensial awal tidak ditampilkan. Tautan aktivasi dikirim ke email.
                            </p>
                        </div>
                        <button type="button" onClick={closeCreate} aria-label="Tutup">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium" htmlFor="name">Nama lengkap</label>
                            <input id="name" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm ${createForm.errors.name ? 'border-red-500' : 'border-[#E3E8EC]'}`} />
                            {createForm.errors.name && <p className="mt-1 text-xs text-red-600">{createForm.errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium" htmlFor="username">Username</label>
                            <input id="username" value={createForm.data.username} onChange={(e) => createForm.setData('username', e.target.value)} className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm ${createForm.errors.username ? 'border-red-500' : 'border-[#E3E8EC]'}`} />
                            {createForm.errors.username && <p className="mt-1 text-xs text-red-600">{createForm.errors.username}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium" htmlFor="email">Email</label>
                            <input id="email" type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm ${createForm.errors.email ? 'border-red-500' : 'border-[#E3E8EC]'}`} />
                            {createForm.errors.email && <p className="mt-1 text-xs text-red-600">{createForm.errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium" htmlFor="role">Role</label>
                            <select id="role" value={createForm.data.role} onChange={(e) => createForm.setData('role', e.target.value)} className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm ${createForm.errors.role ? 'border-red-500' : 'border-[#E3E8EC]'}`}>
                                <option value="">Pilih role</option>
                                {Object.entries(roleOptions).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {createForm.errors.role && <p className="mt-1 text-xs text-red-600">{createForm.errors.role}</p>}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <button type="button" onClick={closeCreate} className="rounded-lg border border-[#E3E8EC] px-4 py-2 text-sm">Batal</button>
                        <button type="submit" disabled={createForm.processing} className="rounded-lg bg-[#267F83] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                            {createForm.processing ? 'Menyimpan...' : 'Simpan Akun Baru'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                show={Boolean(roleUser)}
                title="Ubah role akun"
                description={roleUser ? `Akun ${roleUser.name} saat ini: ${roleUser.role_label}.` : ''}
                confirmLabel="Simpan role"
                processing={roleForm.processing}
                onClose={() => !roleForm.processing && setRoleUser(null)}
                onConfirm={submitRole}
            >
                <select
                    value={roleForm.data.role}
                    onChange={(event) => roleForm.setData('role', event.target.value)}
                    className={`mt-4 h-10 w-full rounded-lg border px-3 text-sm ${roleForm.errors.role ? 'border-red-500' : 'border-[#E3E8EC]'}`}
                >
                    {Object.entries(roleOptions).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                {roleForm.errors.role && <p className="mt-1 text-xs text-red-600">{roleForm.errors.role}</p>}
            </ConfirmModal>

            <ConfirmModal
                show={Boolean(resetUser)}
                title="Reset akses akun"
                description={resetUser
                    ? `Sistem akan mengirim tautan reset kata sandi ke ${resetUser.email}. Kata sandi tidak ditampilkan dan tidak diubah menjadi nilai default.`
                    : ''}
                confirmLabel="Kirim tautan reset"
                onClose={() => setResetUser(null)}
                onConfirm={submitReset}
            />
        </AdminLayout>
    );
}
