import AppToast from '@/Components/AppToast';
import { Link, usePage, router } from '@inertiajs/react';
import {
    ArrowLeftRight,
    FileText,
    Home,
    LogOut,
    ScrollText,
    Shield,
    Users,
} from 'lucide-react';

const TEAL = '#267F83';

function NavItem({ href, active, icon: Icon, children, disabled, reason }) {
    if (disabled) {
        return (
            <div
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/45"
                title={reason}
            >
                <Icon className="h-4 w-4" />
                <span>{children}</span>
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active ? 'bg-white/15 font-semibold text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
        >
            <Icon className="h-4 w-4" />
            <span>{children}</span>
        </Link>
    );
}

export default function AdminLayout({ title, description, breadcrumbs = [], actions, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user?.role === 'ketua_rt';
    const canLetters = user?.role === 'ketua_rt' || user?.role === 'sekretaris';

    const logout = (event) => {
        event.preventDefault();
        router.post(route('logout'));
    };

    return (
            <div className="relative min-h-screen bg-[#F4F6F8] text-[#202833]">
                <AppToast />
                <aside
                    className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col text-white"
                    style={{ backgroundColor: TEAL }}
                >
                    <div className="border-b border-white/15 px-5 py-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">SIA Sukatani</p>
                        <p className="mt-1 text-sm font-semibold">RT 01 / RW 08</p>
                    </div>

                    <nav className="flex-1 space-y-1 px-3 py-4">
                        <NavItem href={route('admin.dashboard')} active={route().current('admin.dashboard')} icon={Home}>
                            Beranda
                        </NavItem>
                        <NavItem
                            disabled
                            reason="Modul Data Warga dikerjakan anggota tim lain."
                            icon={Users}
                        >
                            Data Warga
                        </NavItem>
                        <NavItem
                            disabled
                            reason="Modul Pindah / Datang dikerjakan anggota tim lain."
                            icon={ArrowLeftRight}
                        >
                            Pindah / Datang
                        </NavItem>
                        {canLetters && (
                            <NavItem
                                href={route('admin.surat.index')}
                                active={route().current('admin.surat.*')}
                                icon={FileText}
                            >
                                Pengajuan Surat
                            </NavItem>
                        )}
                        <NavItem
                            disabled
                            reason="Modul Audit Trail dikerjakan anggota tim lain."
                            icon={ScrollText}
                        >
                            Audit Trail
                        </NavItem>
                        {isAdmin && (
                            <NavItem
                                href={route('admin.users.index')}
                                active={route().current('admin.users.*')}
                                icon={Shield}
                            >
                                Pengguna & Role
                            </NavItem>
                        )}
                    </nav>

                    <div className="space-y-3 border-t border-white/15 px-4 py-4 text-[11px] leading-relaxed text-white/70">
                        <p>Data warga bersifat terbatas. Gunakan akses sesuai kewenangan peran Anda.</p>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-white hover:bg-white/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Keluar
                        </button>
                    </div>
                </aside>

                <div className="pl-56">
                    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#E3E8EC] bg-white px-6">
                        <p className="text-sm text-[#667085]">RT 01 / RW 08 · Sukatani, Tapos, Depok</p>
                        <div className="text-right">
                            <p className="text-sm font-semibold">{user?.name}</p>
                            <p className="text-xs text-[#667085]">{user?.role_label}</p>
                        </div>
                    </header>

                    <main className="relative px-6 py-6">
                        {breadcrumbs.length > 0 && (
                            <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-[#667085]" aria-label="Breadcrumb">
                                {breadcrumbs.map((item, index) => {
                                    const isLast = index === breadcrumbs.length - 1;

                                    return (
                                        <span key={`${item.label}-${index}`} className="flex items-center gap-1">
                                            {index > 0 && <span>/</span>}
                                            {isLast || !item.href ? (
                                                <span className={isLast ? 'font-semibold text-[#202833]' : ''}>
                                                    {item.label}
                                                </span>
                                            ) : (
                                                <Link href={item.href} className="hover:text-[#267F83] hover:underline">
                                                    {item.label}
                                                </Link>
                                            )}
                                        </span>
                                    );
                                })}
                            </nav>
                        )}

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                {title && <h1 className="text-xl font-semibold tracking-tight">{title}</h1>}
                                {description && <p className="mt-1 text-sm text-[#667085]">{description}</p>}
                            </div>
                            {actions}
                        </div>

                        {children}
                    </main>
                </div>
            </div>
    );
}
