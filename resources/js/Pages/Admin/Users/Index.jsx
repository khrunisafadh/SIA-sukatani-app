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
                    className="btn-admin-primary"
                >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Akun</span>
                </button>
            }
        >
            <Head title="Pengguna & Role - SIA Sukatani" />

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
                            placeholder="Cari nama, username, atau email..."
                            className="input-admin pl-9"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(event) => {
                            setRoleFilter(event.target.value);
                            applyFilters({ role: event.target.value });
                        }}
                        className="select-admin"
                    >
                        <option value="">Semua role</option>
                        {Object.entries(roleOptions).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="btn-admin-primary">
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
                                <th>Nama</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Aktivitas terakhir</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-xs text-[#718096]">
                                        Tidak ada akun yang sesuai filter.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id}>
                                        <td className="font-semibold text-[#1A253C]">{user.name}</td>
                                        <td className="text-[#0F685D] font-medium">{user.username}</td>
                                        <td>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F6F4] text-[#0F685D] border border-[#BDE8E2]">
                                                {user.role_label}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF7EE] text-[#14833B]">
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="text-[#718096]">{user.last_activity_at || '-'}</td>
                                        <td>
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openRole(user)}
                                                    className="btn-admin-icon"
                                                    title="Ubah role"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openReset(user)}
                                                    className="btn-admin-icon"
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
                <div className="border-t border-[#EDF2F7] px-5 py-4">
                    <Pagination meta={users} links={users.links} />
                </div>
            </div>

            <Modal show={createOpen} onClose={closeCreate} maxWidth="lg">
                <form onSubmit={submitCreate} className="p-6 sm:p-8">
                    <div className="mb-5 flex items-start justify-between">
                        <div>
                            <h3 className="text-base font-bold text-[#1A253C] font-heading">Tambah Akun Pengguna</h3>
                            <p className="mt-1 text-xs text-[#718096]">
                                Masukkan data akun dan tetapkan password sementara. Pengguna wajib mengganti password saat login pertama kali.
                            </p>
                        </div>
                        <button type="button" onClick={closeCreate} aria-label="Tutup" className="text-[#94A3B8] hover:text-[#1A253C] p-1 rounded-lg">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-[#1A253C]" htmlFor="name">Nama lengkap</label>
                            <input id="name" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className={`mt-1.5 h-10 w-full rounded-xl border px-3.5 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${createForm.errors.name ? 'border-red-500' : 'border-[#E2E8F0]'}`} />
                            {createForm.errors.name && <p className="mt-1 text-xs text-red-600">{createForm.errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#1A253C]" htmlFor="username">Username</label>
                            <input id="username" value={createForm.data.username} onChange={(e) => createForm.setData('username', e.target.value)} className={`mt-1.5 h-10 w-full rounded-xl border px-3.5 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${createForm.errors.username ? 'border-red-500' : 'border-[#E2E8F0]'}`} />
                            {createForm.errors.username && <p className="mt-1 text-xs text-red-600">{createForm.errors.username}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#1A253C]" htmlFor="email">Email</label>
                            <input id="email" type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} className={`mt-1.5 h-10 w-full rounded-xl border px-3.5 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${createForm.errors.email ? 'border-red-500' : 'border-[#E2E8F0]'}`} />
                            {createForm.errors.email && <p className="mt-1 text-xs text-red-600">{createForm.errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#1A253C]" htmlFor="role">Role</label>
                            <select id="role" value={createForm.data.role} onChange={(e) => createForm.setData('role', e.target.value)} className={`mt-1.5 h-10 w-full rounded-xl border px-3.5 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${createForm.errors.role ? 'border-red-500' : 'border-[#E2E8F0]'}`}>
                                <option value="">Pilih role</option>
                                {Object.entries(roleOptions).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {createForm.errors.role && <p className="mt-1 text-xs text-red-600">{createForm.errors.role}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#1A253C]" htmlFor="password">Password sementara</label>
                            <div className="relative mt-1.5">
                                <input
                                    id="password"
                                    type={createShowPassword ? 'text' : 'password'}
                                    value={createForm.data.password}
                                    placeholder="Minimal 8 karakter"
                                    onChange={(e) => createForm.setData('password', e.target.value)}
                                    className={`h-10 w-full rounded-xl border pl-3.5 pr-10 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${createForm.errors.password ? 'border-red-500' : 'border-[#E2E8F0]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setCreateShowPassword(!createShowPassword)}
                                    className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#1A253C]"
                                    aria-label={createShowPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {createShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {createForm.errors.password && <p className="mt-1 text-xs text-red-600">{createForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#1A253C]" htmlFor="password_confirmation">Konfirmasi password sementara</label>
                            <div className="relative mt-1.5">
                                <input
                                    id="password_confirmation"
                                    type={createShowConfirm ? 'text' : 'password'}
                                    value={createForm.data.password_confirmation}
                                    placeholder="Ulangi password sementara"
                                    onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                    className={`h-10 w-full rounded-xl border pl-3.5 pr-10 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${createForm.errors.password_confirmation ? 'border-red-500' : 'border-[#E2E8F0]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setCreateShowConfirm(!createShowConfirm)}
                                    className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#1A253C]"
                                    aria-label={createShowConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {createShowConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {createForm.errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{createForm.errors.password_confirmation}</p>}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2.5 border-t border-[#EDF2F7] pt-5">
                        <button type="button" onClick={closeCreate} className="btn-admin-secondary">Batal</button>
                        <button type="submit" disabled={createForm.processing} className="btn-admin-primary">
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
                    className={`mt-4 h-10 w-full rounded-xl border px-3.5 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${roleForm.errors.role ? 'border-red-500' : 'border-[#E2E8F0]'}`}
                >
                    {Object.entries(roleOptions).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                {roleForm.errors.role && <p className="mt-1 text-xs text-red-600">{roleForm.errors.role}</p>}
            </ConfirmModal>

            <Modal show={Boolean(resetUser)} onClose={closeReset} maxWidth="md">
                <form onSubmit={submitReset} className="p-6 sm:p-8">
                    <div className="mb-5 flex items-start justify-between">
                        <div>
                            <h3 className="text-base font-bold text-[#1A253C] font-heading">Reset Akses Pengguna</h3>
                            <p className="mt-1 text-xs text-[#718096]">
                                {resetUser ? `Tetapkan password sementara baru untuk akun ${resetUser.name} (${resetUser.username}). Pengguna wajib mengganti password saat login berikutnya.` : ''}
                            </p>
                        </div>
                        <button type="button" onClick={closeReset} aria-label="Tutup" className="text-[#94A3B8] hover:text-[#1A253C] p-1 rounded-lg">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-[#1A253C]" htmlFor="reset_password">Password sementara baru</label>
                            <div className="relative mt-1.5">
                                <input
                                    id="reset_password"
                                    type={resetShowPassword ? 'text' : 'password'}
                                    value={resetForm.data.password}
                                    placeholder="Minimal 8 karakter"
                                    onChange={(e) => resetForm.setData('password', e.target.value)}
                                    className={`h-10 w-full rounded-xl border pl-3.5 pr-10 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${resetForm.errors.password ? 'border-red-500' : 'border-[#E2E8F0]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setResetShowPassword(!resetShowPassword)}
                                    className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#1A253C]"
                                    aria-label={resetShowPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {resetShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {resetForm.errors.password && <p className="mt-1 text-xs text-red-600">{resetForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#1A253C]" htmlFor="reset_password_confirmation">Konfirmasi password sementara</label>
                            <div className="relative mt-1.5">
                                <input
                                    id="reset_password_confirmation"
                                    type={resetShowConfirm ? 'text' : 'password'}
                                    value={resetForm.data.password_confirmation}
                                    placeholder="Ulangi password sementara baru"
                                    onChange={(e) => resetForm.setData('password_confirmation', e.target.value)}
                                    className={`h-10 w-full rounded-xl border pl-3.5 pr-10 text-xs text-[#1A253C] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F685D]/20 focus:border-[#0F685D] ${resetForm.errors.password_confirmation ? 'border-red-500' : 'border-[#E2E8F0]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setResetShowConfirm(!resetShowConfirm)}
                                    className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#1A253C]"
                                    aria-label={resetShowConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {resetShowConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {resetForm.errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{resetForm.errors.password_confirmation}</p>}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2.5 border-t border-[#EDF2F7] pt-5">
                        <button type="button" onClick={closeReset} className="btn-admin-secondary">Batal</button>
                        <button type="submit" disabled={resetForm.processing} className="btn-admin-primary">
                            {resetForm.processing ? 'Menyimpan...' : 'Simpan Password Baru'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
