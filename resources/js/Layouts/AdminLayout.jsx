import AppToast from '@/Components/AppToast';
import { Link, usePage, router } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Bell,
    Building2,
    FileText,
    Home,
    LogOut,
    MapPin,
    ScrollText,
    Shield,
    ShieldCheck,
    Users,
} from 'lucide-react';

const TEAL = '#147A72';

function NavItem({ href, active, icon: Icon, children, disabled, reason }) {
    if (disabled) {
        return (
            <div
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/50"
                title={reason}
            >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{children}</span>
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                active
                    ? 'bg-[#0E5F59] font-semibold text-white shadow-sm'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
            }`}
        >
            <Icon className="h-4 w-4 shrink-0" />
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

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : 'RT';

    return (
        <div className="relative min-h-screen bg-[#F4F6FB] font-sans text-[#17233C] antialiased">
            <AppToast />

            {/* Sidebar */}
            <aside
                className="fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col text-white shadow-lg"
                style={{ backgroundColor: TEAL }}
            >
                <div className="flex items-center gap-3 px-5 py-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="leading-tight">
                        <div className="font-heading text-[15px] font-extrabold tracking-tight">SIA Sukatani</div>
                        <div className="text-[11px] text-white/80">RT 01 / RW 08</div>
                    </div>
                </div>

                <p className="px-6 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                    Menu Warga
                </p>

                <nav className="flex-1 space-y-1 px-3">
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
                        href={route('admin.mutasi.index')}
                        active={route().current('admin.mutasi.*')}
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
                            Pengguna &amp; Role
                        </NavItem>
                    )}
                </nav>

                <div className="space-y-3 p-4">
                    <div className="rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/10">
                        <div className="flex items-start gap-2">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9FF0E4]" />
                            <div>
                                <p className="text-[12px] font-semibold">Keamanan Data RT</p>
                                <p className="mt-0.5 text-[10px] leading-relaxed text-white/75">
                                    Terenkripsi &amp; Terverifikasi
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2.5 text-[13px] font-semibold text-white ring-1 ring-white/10 hover:bg-white/25 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="pl-[248px]">
                {/* Header Top Bar */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E6EAF2] bg-[#F4F6FB]/90 px-6 backdrop-blur">
                    <div className="flex items-center gap-2 text-xs text-[#566175]">
                        <MapPin className="h-4 w-4 text-[#006A61]" />
                        <span className="font-semibold text-[#17233C]">RT 01 / RW 08</span>
                        <span>•</span>
                        <span>Kelurahan Sukatani, Tapos - Kota Depok</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="relative rounded-full border border-[#E4E9F0] bg-white p-2 text-[#566175] hover:text-[#006A61] transition"
                            aria-label="Notifikasi"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E24B4A]" />
                        </button>

                        <div className="flex items-center gap-2.5 rounded-full border border-[#E4E9F0] bg-white py-1 pl-3.5 pr-1.5 shadow-sm">
                            <div className="text-right leading-tight">
                                <p className="text-xs font-bold text-[#17233C]">{user?.name}</p>
                                <p className="text-[10px] font-medium text-[#68748A]">{user?.role_label}</p>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#147A72] text-xs font-bold text-white">
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="px-6 py-6 sm:px-8">
                    {breadcrumbs.length > 0 && (
                        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[#68748A]" aria-label="Breadcrumb">
                            {breadcrumbs.map((item, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                return (
                                    <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                                        {index > 0 && <span>/</span>}
                                        {isLast || !item.href ? (
                                            <span className={isLast ? 'font-semibold text-[#17233C]' : ''}>
                                                {item.label}
                                            </span>
                                        ) : (
                                            <Link href={item.href} className="hover:text-[#006A61] hover:underline">
                                                {item.label}
                                            </Link>
                                        )}
                                    </span>
                                );
                            })}
                        </nav>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
