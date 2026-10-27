
import React from 'react';
import AppToast from '@/Components/AppToast';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Home,
    Users,
    ArrowLeftRight,
    FileText,
    ShieldCheck,
    UserCog,
    LogOut,
    ChevronRight,
} from 'lucide-react';

export default function AdminLayout({
    title,
    description,
    breadcrumbs = [],
    actions,
    children,
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const isAdmin = user?.role === 'ketua_rt';
    const canLetters =
        user?.role === 'ketua_rt' ||
        user?.role === 'sekretaris';

    const logout = (event) => {
        event.preventDefault();
        router.post(route('logout'));
    };

    const getInitials = (name) => {
        if (!name) return 'RT';

        const parts = name.trim().split(/\s+/);

        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }

        return name.substring(0, 2).toUpperCase();
    };

    const menuClass = (active) =>
        `flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
            active
                ? 'bg-[#1C5F57] text-white font-semibold'
                : 'text-[#D0EBE7] hover:bg-[#206760] hover:text-white font-medium'
        }`;

    const iconClass = 'w-4 h-4 text-[#A7D7D0] shrink-0';

    return (
        <div className="min-h-screen bg-[#F4F7FA] font-sans antialiased text-[#1A253C]">
            <AppToast />

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col justify-between bg-[#287971] text-white shadow-sm">
                <div className="overflow-y-auto p-6">
                    <div className="mb-8">
                        <h1 className="font-heading text-lg font-bold leading-snug tracking-tight">
                            SIA Sukatani
                        </h1>
                        <p className="mt-1 text-[11px] text-[#A7D7D0]">
                            Administrasi Rukun Tetangga
                        </p>
                    </div>

                    <nav aria-label="Navigasi admin" className="space-y-6">
                        <div className="space-y-1">
                            <span className="mb-2 block px-3 text-[10px] font-bold uppercase tracking-widest text-[#96C7C0]">
                                Menu Utama
                            </span>

                            {/* Beranda */}
                            <Link
                                href={route('admin.dashboard')}
                                className={menuClass(
                                    route().current('admin.dashboard')
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <Home className={iconClass} />
                                    Beranda
                                </span>
                            </Link>

                            {/* Data Warga */}
                            <Link
                                href={route('admin.warga.index')}
                                className={menuClass(
                                    route().current('admin.warga.*')
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <Users className={iconClass} />
                                    Data Warga
                                </span>

                                {route().current('admin.warga.*') && (
                                    <ChevronRight className="h-3.5 w-3.5 text-[#89F5E7]" />
                                )}
                            </Link>

                            {/* Pindah / Datang */}
                            <Link
                                href={route('admin.pindah-datang.index')}
                                className={menuClass(
                                    route().current('admin.pindah-datang.*')
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <ArrowLeftRight className={iconClass} />
                                    Pindah / Datang
                                </span>

                                {route().current('admin.pindah-datang.*') && (
                                    <ChevronRight className="h-3.5 w-3.5 text-[#89F5E7]" />
                                )}
                            </Link>

                            {/* Pengajuan Surat */}
                            {canLetters && (
                                <Link
                                    href={route('admin.surat.index')}
                                    className={menuClass(
                                        route().current('admin.surat.*')
                                    )}
                                >
                                    <span className="flex items-center gap-3">
                                        <FileText className={iconClass} />
                                        Pengajuan Surat
                                    </span>

                                    {(auth?.pending_letters_count ?? 0) > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E58917] px-1 text-[10px] font-bold text-white">
                                            {auth.pending_letters_count}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Audit Trail */}
                            <Link
                                href={route('admin.audit-trail.index')}
                                className={menuClass(
                                    route().current('admin.audit-trail.*')
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <ShieldCheck className={iconClass} />
                                    Audit Trail
                                </span>

                                {route().current('admin.audit-trail.*') && (
                                    <ChevronRight className="h-3.5 w-3.5 text-[#89F5E7]" />
                                )}
                            </Link>

                            {/* Pengguna & Role */}
                            {isAdmin && (
                                <Link
                                    href={route('admin.users.index')}
                                    className={menuClass(
                                        route().current('admin.users.*')
                                    )}
                                >
                                    <span className="flex items-center gap-3">
                                        <UserCog className={iconClass} />
                                        Pengguna &amp; Role
                                    </span>

                                    {route().current('admin.users.*') && (
                                        <ChevronRight className="h-3.5 w-3.5 text-[#89F5E7]" />
                                    )}
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Sidebar footer */}
                <div className="space-y-4 border-t border-[#318B82] p-6">
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#358A81] bg-[#1E665E] p-3.5">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7BD4C9]" />
                        <div>
                            <p className="text-[11px] font-bold text-white">
                                Keamanan data
                            </p>
                            <p className="mt-1 text-[10px] leading-relaxed text-[#A7D7D0]">
                                Akses mengikuti hak akses pengguna yang berlaku.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 py-1 text-xs font-medium text-[#D0EBE7] transition-colors hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
                {/* Topbar */}
                <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-6 lg:px-10">
                    <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0E8F84]">
                            SIA RT 01/08 Sukatani
                        </p>
                        <p className="mt-1 text-xs text-[#718096]">
                            Kecamatan Tapos, Kota Depok
                        </p>
                    </div>

                    <Link
                        href={route('profile.edit')}
                        className="flex shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF0FC] text-xs font-bold text-[#2F65CB]">
                            {getInitials(user?.name)}
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-xs font-bold leading-tight text-[#1A253C]">
                                {user?.name || 'Pengguna'}
                            </p>
                            <p className="mt-1 text-[10px] text-[#718096]">
                                {user?.role_label || 'Pengguna'}
                            </p>
                        </div>

                        <ChevronRight className="h-3.5 w-3.5 text-[#A0AEC0]" />
                    </Link>
                </header>

                {/* Page workspace */}
                <main className="w-full max-w-[1500px] flex-1 space-y-6 p-5 sm:p-7 lg:p-10">
                    {breadcrumbs.length > 0 && (
                        <nav
                            className="flex flex-wrap items-center gap-1.5 text-xs text-[#718096]"
                            aria-label="Breadcrumb"
                        >
                            {breadcrumbs.map((item, index) => {
                                const isLast =
                                    index === breadcrumbs.length - 1;

                                return (
                                    <span
                                        key={`${item.label}-${index}`}
                                        className="flex items-center gap-1.5"
                                    >
                                        {index > 0 && (
                                            <span className="text-[#CBD5E1]">
                                                /
                                            </span>
                                        )}

                                        {isLast || !item.href ? (
                                            <span
                                                className={
                                                    isLast
                                                        ? 'font-bold text-[#1A253C]'
                                                        : ''
                                                }
                                            >
                                                {item.label}
                                            </span>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="transition-colors hover:text-[#0F685D]"
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </span>
                                );
                            })}
                        </nav>
                    )}

                    {(title || actions) && (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                {title && (
                                    <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-[#1A253C] sm:text-[26px]">
                                        {title}
                                    </h2>
                                )}

                                {description && (
                                    <p className="mt-1 text-xs leading-relaxed text-[#718096] sm:text-sm">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {actions && (
                                <div className="flex shrink-0 items-center gap-2">
                                    {actions}
                                </div>
                            )}
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
