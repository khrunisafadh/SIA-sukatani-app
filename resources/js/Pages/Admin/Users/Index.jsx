import ConfirmModal from '@/Components/ConfirmModal';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Eye, EyeOff, KeyRound, Pencil, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function UsersIndex({ users, filters, roleOptions, total }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [roleFilter, setRoleFilter] = useState(filters.role ?? '');
    const [createOpen, setCreateOpen] = useState(false);
    const [roleUser, setRoleUser] = useState(null);
    const [resetUser, setResetUser] = useState(null);
    const [createShowPassword, setCreateShowPassword] = useState(false);
    const [createShowConfirm, setCreateShowConfirm] = useState(false);
    const [resetShowPassword, setResetShowPassword] = useState(false);
    const [resetShowConfirm, setResetShowConfirm] = useState(false);

    const createForm = useForm({
        name: '',
        username: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    });

    const roleForm = useForm({
        role: '',
    });

    const resetForm = useForm({
        password: '',
        password_confirmation: '',
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
        setCreateShowPassword(false);
        setCreateShowConfirm(false);
    };

    const submitCreate = (event) => {
        event.preventDefault();
        createForm.post(route('admin.users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
                setCreateShowPassword(false);
                setCreateShowConfirm(false);
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

    const openReset = (user) => {
        setResetUser(user);
        resetForm.reset();
        resetForm.clearErrors();
        setResetShowPassword(false);
        setResetShowConfirm(false);
    };

    const closeReset = () => {
        if (resetForm.processing) {
            return;
        }
        setResetUser(null);
        resetForm.reset();
        resetForm.clearErrors();
        setResetShowPassword(false);
        setResetShowConfirm(false);
    };

    const submitReset = (event) => {
        event.preventDefault();
        if (!resetUser) {
            return;
        }

        resetForm.post(route('admin.users.reset-access', resetUser.id), {
            preserveScroll: true,
            onSuccess: () => closeReset(),
        });
    };

    return (
        <AdminLayout
            title="Pengguna & Role"
            description="Kelola akun dan tetapkan salah satu dari empat role resmi. Perubahan role berlaku pada izin akses berikutnya."
            breadcrumbs={[
                { label: 'Layanan Administrasi', href: route('admin.dashboard') },
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
                                                    onClick={() => openReset(user)}
                                                    className="rounded-md border border-[#E3E8EC] p-1.5 text-[#267F83] hover:bg-slate-50"
                                                    title="Reset akses akun"
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
                    <Pagination meta={users} links={users.links} />
                </div>
            </div>

            <Modal show={createOpen} onClose={closeCreate} maxWidth="lg">
                <form onSubmit={submitCreate} className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h3 className="text-base font-semibold">Tambah Akun Pengguna</h3>
                            <p className="mt-1 text-sm text-[#667085]">
                                Masukkan data akun dan tetapkan password sementara. Pengguna wajib mengganti password saat login pertama kali.
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
                        <div>
                            <label className="text-sm font-medium" htmlFor="password">Password sementara</label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    type={createShowPassword ? 'text' : 'password'}
                                    value={createForm.data.password}
                                    placeholder="Minimal 8 karakter"
                                    onChange={(e) => createForm.setData('password', e.target.value)}
                                    className={`h-10 w-full rounded-lg border pl-3 pr-10 text-sm ${createForm.errors.password ? 'border-red-500' : 'border-[#E3E8EC]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setCreateShowPassword(!createShowPassword)}
                                    className="absolute right-3 top-2.5 text-[#68748A] hover:text-[#17233C]"
                                    aria-label={createShowPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {createShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {createForm.errors.password && <p className="mt-1 text-xs text-red-600">{createForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium" htmlFor="password_confirmation">Konfirmasi password sementara</label>
                            <div className="relative mt-1">
                                <input
                                    id="password_confirmation"
                                    type={createShowConfirm ? 'text' : 'password'}
                                    value={createForm.data.password_confirmation}
                                    placeholder="Ulangi password sementara"
                                    onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                    className={`h-10 w-full rounded-lg border pl-3 pr-10 text-sm ${createForm.errors.password_confirmation ? 'border-red-500' : 'border-[#E3E8EC]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setCreateShowConfirm(!createShowConfirm)}
                                    className="absolute right-3 top-2.5 text-[#68748A] hover:text-[#17233C]"
                                    aria-label={createShowConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {createShowConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {createForm.errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{createForm.errors.password_confirmation}</p>}
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

            <Modal show={Boolean(resetUser)} onClose={closeReset} maxWidth="md">
                <form onSubmit={submitReset} className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h3 className="text-base font-semibold">Reset Akses Pengguna</h3>
                            <p className="mt-1 text-sm text-[#667085]">
                                {resetUser ? `Tetapkan password sementara baru untuk akun ${resetUser.name} (${resetUser.username}). Pengguna wajib mengganti password saat login berikutnya.` : ''}
                            </p>
                        </div>
                        <button type="button" onClick={closeReset} aria-label="Tutup">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium" htmlFor="reset_password">Password sementara baru</label>
                            <div className="relative mt-1">
                                <input
                                    id="reset_password"
                                    type={resetShowPassword ? 'text' : 'password'}
                                    value={resetForm.data.password}
                                    placeholder="Minimal 8 karakter"
                                    onChange={(e) => resetForm.setData('password', e.target.value)}
                                    className={`h-10 w-full rounded-lg border pl-3 pr-10 text-sm ${resetForm.errors.password ? 'border-red-500' : 'border-[#E3E8EC]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setResetShowPassword(!resetShowPassword)}
                                    className="absolute right-3 top-2.5 text-[#68748A] hover:text-[#17233C]"
                                    aria-label={resetShowPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {resetShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {resetForm.errors.password && <p className="mt-1 text-xs text-red-600">{resetForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium" htmlFor="reset_password_confirmation">Konfirmasi password sementara</label>
                            <div className="relative mt-1">
                                <input
                                    id="reset_password_confirmation"
                                    type={resetShowConfirm ? 'text' : 'password'}
                                    value={resetForm.data.password_confirmation}
                                    placeholder="Ulangi password sementara baru"
                                    onChange={(e) => resetForm.setData('password_confirmation', e.target.value)}
                                    className={`h-10 w-full rounded-lg border pl-3 pr-10 text-sm ${resetForm.errors.password_confirmation ? 'border-red-500' : 'border-[#E3E8EC]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setResetShowConfirm(!resetShowConfirm)}
                                    className="absolute right-3 top-2.5 text-[#68748A] hover:text-[#17233C]"
                                    aria-label={resetShowConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {resetShowConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {resetForm.errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{resetForm.errors.password_confirmation}</p>}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <button type="button" onClick={closeReset} className="rounded-lg border border-[#E3E8EC] px-4 py-2 text-sm">Batal</button>
                        <button type="submit" disabled={resetForm.processing} className="rounded-lg bg-[#267F83] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                            {resetForm.processing ? 'Menyimpan...' : 'Simpan Password Baru'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
