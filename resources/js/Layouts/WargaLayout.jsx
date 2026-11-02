import React, { useState } from 'react';
import AppToast from '@/Components/AppToast';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Home,
    Users,
    ArrowLeftRight,
    FileText,
    History,
    Headphones,
    ShieldCheck,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Phone,
    MapPin,
    AlertCircle
} from 'lucide-react';

export default function WargaLayout({
    title,
    description,
    breadcrumbs = [],
    actions,
    children,
    topBarLabel = 'Lingkungan RT 01 / RW 08 Kel. Sukatani'
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [auditModalOpen, setAuditModalOpen] = useState(false);

    const logout = (event) => {
        event.preventDefault();
        router.post(route('logout'));
    };

    const getInitials = (name) => {
        if (!name) return 'WG';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const menuClass = (active) =>
        `flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
            active
                ? 'bg-[#1C5F57] text-white font-semibold shadow-inner'
                : 'text-[#D0EBE7] hover:bg-[#206760] hover:text-white font-medium'
        }`;

    const iconClass = 'w-4 h-4 text-[#A7D7D0] shrink-0';

    return (
        <div className="min-h-screen bg-[#F4F7FA] font-sans antialiased text-[#1A253C]">
            <AppToast />

            {/* Mobile Sidebar Backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Warga - Sesuai Design System Admin Layout (#287971) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col justify-between bg-[#287971] text-white shadow-sm transition-transform duration-200 lg:translate-x-0 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="overflow-y-auto p-6">
                    {/* Header Brand */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="font-heading text-lg font-bold leading-snug tracking-tight text-white">
                                SIA Sukatani
                            </h1>
                            <p className="mt-0.5 text-[11px] text-[#A7D7D0]">
                                Administrasi Rukun Tetangga
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg p-1 text-[#A7D7D0] hover:text-white lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigasi Menu Warga */}
                    <nav aria-label="Navigasi warga" className="space-y-6">
                        <div className="space-y-1">
                            <span className="mb-2 block px-3 text-[10px] font-bold uppercase tracking-widest text-[#96C7C0]">
                                MENU WARGA
                            </span>

                            {/* 1. Beranda */}
                            <Link
                                href={route('portal.dashboard')}
                                className={menuClass(route().current('portal.dashboard'))}
                            >
                                <span className="flex items-center gap-3">
                                    <Home className={iconClass} />
                                    <span>Beranda</span>
                                </span>
                                {route().current('portal.dashboard') && (
                                    <ChevronRight className="h-3.5 w-3.5 text-[#89F5E7]" />
                                )}
                            </Link>

                            {/* 2. Data Warga (Detail & Edit Mandiri) */}
                            <Link
                                href={route('portal.warga.index')}
                                className={menuClass(route().current('portal.warga.*'))}
                            >
                                <span className="flex items-center gap-3">
                                    <Users className={iconClass} />
                                    <span>Data Warga</span>
                                </span>
                                {route().current('portal.warga.*') && (
                                    <ChevronRight className="h-3.5 w-3.5 text-[#89F5E7]" />
                                )}
                            </Link>

                            {/* 3. Pindah / Datang */}
                            <Link
                                href={route('portal.pindah-datang.create')}
                                className={menuClass(route().current('portal.pindah-datang.*'))}
                            >
                                <span className="flex items-center gap-3">
                                    <ArrowLeftRight className={iconClass} />
                                    <span>Pindah / Datang</span>
                                </span>
                                {route().current('portal.pindah-datang.*') && (
                                    <ChevronRight className="h-3.5 w-3.5 text-[#89F5E7]" />
                                )}
                            </Link>

                            {/* 4. Pengajuan Surat */}
                            <Link
                                href={route('portal.surat.index')}
                                className={menuClass(route().current('portal.surat.*'))}
                            >
                                <span className="flex items-center gap-3">
                                    <FileText className={iconClass} />
                                    <span>Pengajuan Surat</span>
                                </span>
                                {route().current('portal.surat.*') && (
                                    <ChevronRight className="h-3.5 w-3.5 text-[#89F5E7]" />
                                )}
                            </Link>

                            {/* 5. Audit Trail */}
                            <button
                                type="button"
                                onClick={() => setAuditModalOpen(true)}
                                className={menuClass(false)}
                            >
                                <span className="flex items-center gap-3">
                                    <History className={iconClass} />
                                    <span>Audit Trail</span>
                                </span>
                            </button>

                            {/* 6. Bantuan Pengurus RT */}
                            <button
                                type="button"
                                onClick={() => setHelpModalOpen(true)}
                                className={menuClass(false)}
                            >
                                <span className="flex items-center gap-3">
                                    <Headphones className={iconClass} />
                                    <span>Bantuan Pengurus RT</span>
                                </span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Footer Sidebar */}
                <div className="space-y-4 border-t border-[#318B82] p-6">
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#358A81] bg-[#1E665E] p-3.5">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7BD4C9]" />
                        <div>
                            <p className="text-[11px] font-bold text-white">
                                Keamanan Data RT
                            </p>
                            <p className="mt-1 text-[10px] leading-relaxed text-[#A7D7D0]">
                                Akses warga terenkripsi &amp; mengikuti matriks RBAC wilayah.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 py-1 text-xs font-medium text-[#D0EBE7] transition-colors hover:text-white cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Area Konten Utama */}
            <div className="ml-0 flex min-h-screen min-w-0 flex-col lg:ml-[260px]">
                {/* Topbar Header */}
                <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-5 sm:px-8 lg:px-10">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="rounded-lg p-1.5 text-[#1A253C] hover:bg-slate-100 lg:hidden"
                            aria-label="Buka menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0E8F84]">
                                SIA RT 01/08 Sukatani
                            </p>
                            <p className="mt-0.5 text-xs text-[#718096]">
                                Kecamatan Tapos, Kota Depok
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('profile.edit')}
                        className="flex shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50 cursor-pointer"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF0FC] text-xs font-bold text-[#2F65CB]">
                            {getInitials(user?.name)}
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-xs font-bold leading-tight text-[#1A253C]">
                                {user?.name || 'Warga'}
                            </p>
                            <p className="mt-0.5 text-[10px] text-[#718096]">
                                Warga RT 01/08
                            </p>
                        </div>

                        <ChevronRight className="h-3.5 w-3.5 text-[#A0AEC0]" />
                    </Link>
                </header>

                {/* Workspace Konten */}
                <main className="w-full max-w-[1500px] flex-1 space-y-6 p-5 sm:p-7 lg:p-10">
                    {breadcrumbs.length > 0 && (
                        <nav
                            className="flex flex-wrap items-center gap-1.5 text-xs text-[#718096]"
                            aria-label="Breadcrumb"
                        >
                            {breadcrumbs.map((item, index) => {
                                const isLast = index === breadcrumbs.length - 1;

                                return (
                                    <span
                                        key={`${item.label}-${index}`}
                                        className="flex items-center gap-1.5"
                                    >
                                        {index > 0 && (
                                            <span className="text-[#CBD5E1]">/</span>
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

            {/* Modal Dialog Bantuan Pengurus RT */}
            {helpModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-[#EAEFF5]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-[#E8F6F4] text-[#0E8F84] flex items-center justify-center font-bold">
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-[#1A253C]">Bantuan Pengurus RT</h3>
                                    <p className="text-[11px] text-[#718096]">RT 01 / RW 08 Sukatani, Tapos</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setHelpModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-[#4A5568]">
                            <p className="leading-relaxed">
                                Jika mengalami kendala dalam pengajuan surat atau pelaporan mutasi domisili, Anda dapat langsung menghubungi narahubung pengurus RT:
                            </p>

                            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#1A253C]">Ketua RT 01</span>
                                    <span className="text-[#0E8F84] font-semibold">Pak Budi Santoso</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#718096]">
                                    <Phone className="w-3.5 h-3.5 text-[#0E8F84]" />
                                    <span>WhatsApp: 0812-3456-7890</span>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#1A253C]">Sekretaris RT</span>
                                    <span className="text-[#0E8F84] font-semibold">Ibu Siti Aminah</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#718096]">
                                    <Phone className="w-3.5 h-3.5 text-[#0E8F84]" />
                                    <span>WhatsApp: 0812-9876-5432</span>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-[#EEF4FF] border border-[#C8DCFF] flex items-start gap-2 text-[#2F65CB]">
                                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                <span className="text-[11px] leading-relaxed">
                                    Kantor Sekretariat RT: Pos Ronda Blok A No. 01, Buka setiap hari kerja pukul 19.30 - 21.00 WIB.
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setHelpModalOpen(false)}
                            className="w-full py-2.5 rounded-xl bg-[#0E8F84] hover:bg-[#0B756C] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Dialog Info Audit Trail */}
            {auditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-[#EAEFF5]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-[#E8F6F4] text-[#0E8F84] flex items-center justify-center font-bold">
                                    <History className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-[#1A253C]">Audit Trail Layanan Warga</h3>
                                    <p className="text-[11px] text-[#718096]">Pencatatan Aktivitas Digital Terverifikasi</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAuditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-[#4A5568]">
                            <p className="leading-relaxed">
                                Setiap pengajuan surat dan laporan mutasi domisili Anda dicatat secara otomatis dalam sistem audit digital RT 01/RW 08 untuk menjaga integritas data dan transparansi administrasi.
                            </p>
                            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                                <div className="flex items-center gap-2 text-[#0E8F84] font-semibold">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Pencatatan Berkas Aman</span>
                                </div>
                                <p className="text-[11px] text-[#718096] leading-relaxed">
                                    Riwayat status surat Anda dapat dipantau langsung di menu <strong>Pengajuan Surat</strong> atau riwayat mutasi di menu <strong>Pindah / Datang</strong>.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setAuditModalOpen(false)}
                            className="w-full py-2.5 rounded-xl bg-[#1A253C] hover:bg-[#0F172A] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
