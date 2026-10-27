import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Bell,
    Building2,
    ClipboardList,
    FileText,
    HelpCircle,
    Home,
    LogOut,
    Menu,
    ShieldCheck,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { label: 'Beranda', href: 'portal.dashboard', icon: Home },
    { label: 'Data Warga', href: null, icon: Users },
    { label: 'Pindah / Datang', href: 'portal.pindah-datang.create', icon: ArrowLeftRight, match: 'portal.pindah-datang.*' },
    { label: 'Pengajuan Surat', href: null, icon: FileText },
    { label: 'Audit Trail', href: null, icon: ClipboardList },
    { label: 'Bantuan Pengurus RT', href: null, icon: HelpCircle },
];

function isActive(item) {
    if (item.match) {
        return route().current(item.match);
    }

    return item.href ? route().current(item.href) : false;
}

export default function WargaLayout({ children, topBarLabel = 'Lingkungan RT 01 / RW 08 Kel. Sukatani' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F4F6FB] font-sans text-[#17233C]">
            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    aria-label="Tutup menu"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[#147A72] text-white transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center gap-3 px-5 py-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="leading-tight">
                        <div className="font-heading text-[15px] font-extrabold tracking-tight">SIA Sukatani</div>
                        <div className="text-[11px] text-white/80">RT 01 / RW 08</div>
                    </div>
                    <button
                        type="button"
                        className="ml-auto rounded-lg p-1 text-white/80 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="px-6 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                    Menu Warga
                </p>

                <nav className="flex-1 space-y-1 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                            active
                                ? 'bg-[#0E5F59] text-white shadow-sm'
                                : 'text-white/85 hover:bg-white/10'
                        }`;

                        if (!item.href) {
                            return (
                                <span key={item.label} className={`${className} cursor-default opacity-80`}>
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {item.label}
                                </span>
                            );
                        }

                        return (
                            <Link key={item.label} href={route(item.href)} className={className}>
                                <Icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
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

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2.5 text-[13px] font-semibold text-white ring-1 ring-white/10 hover:bg-white/25"
                    >
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </Link>
                </div>
            </aside>

            <div className="lg:pl-[248px]">
                <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#E6EAF2] bg-[#F4F6FB]/90 px-4 py-3 backdrop-blur sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            className="rounded-lg p-2 text-[#147A72] hover:bg-white lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="truncate rounded-lg border border-[#E6EAF2] bg-white px-3 py-1.5 text-[12px] text-[#68748A]">
                            {topBarLabel}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="relative rounded-full border border-[#E6EAF2] bg-white p-2 text-[#68748A] hover:text-[#147A72]"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E24B4A]" />
                        </button>
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-2 rounded-full border border-[#E6EAF2] bg-white py-1 pl-3 pr-1 hover:border-[#147A72] transition-colors cursor-pointer"
                        >
                            <div className="hidden text-right sm:block">
                                <p className="text-[12px] font-semibold leading-tight">{auth.user.name}</p>
                                <p className="text-[10px] text-[#68748A]">Warga RT 01</p>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#147A72] text-xs font-bold text-white">
                                {auth.user.name?.charAt(0) ?? 'W'}
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
