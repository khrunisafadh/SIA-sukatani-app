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
  HelpCircle,
  ChevronRight,
  Shield
} from 'lucide-react';

export default function AdminLayout({ title, description, breadcrumbs = [], actions, children }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const isAdmin = user?.role === 'ketua_rt';
  const canLetters = user?.role === 'ketua_rt' || user?.role === 'sekretaris';

  const logout = (event) => {
    event.preventDefault();
    router.post(route('logout'));
  };

  const getInitials = (name) => {
    if (!name) return 'RT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] font-sans antialiased text-[#1A253C] flex">
      <AppToast />

      {/* ================= SIDEBAR TEAL GELAP (#287971) ================= */}
      <aside className="w-[260px] bg-[#287971] text-white flex flex-col justify-between fixed inset-y-0 left-0 z-30 select-none shadow-sm">
        <div className="p-6">
          {/* Header Brand */}
          <div className="mb-8">
            <h1 className="font-bold text-lg text-white font-heading tracking-tight leading-snug">
              SIA Sukatani
            </h1>
            <p className="text-[11px] text-[#A7D7D0] mt-0.5">
              Administrasi Rukun Tetangga
            </p>
          </div>

          {/* Menu Navigasi */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="block px-3 text-[10px] font-bold tracking-widest uppercase text-[#96C7C0] mb-2">
                MENU UTAMA
              </span>

              {/* Beranda */}
              <Link
                href={route('admin.dashboard')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                  route().current('admin.dashboard')
                    ? 'bg-[#1C5F57] text-white font-semibold shadow-inner'
                    : 'text-[#D0EBE7] hover:bg-[#206760] hover:text-white font-medium'
                }`}
              >
                <Home className="w-4 h-4 text-[#A7D7D0]" />
                <span>Beranda</span>
              </Link>

              {/* Data Warga */}
              <Link
                href={route('admin.warga.index')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                  route().current('admin.warga.*')
                    ? 'bg-[#1C5F57] text-white font-semibold shadow-inner'
                    : 'text-[#D0EBE7] hover:bg-[#206760] hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Data Warga</span>
                </div>
                {route().current('admin.warga.*') && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#89F5E7]" />
                )}
              </Link>

              {/* Pindah / Datang */}
              <Link
                href={route('admin.pindah-datang.index')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                  route().current('admin.pindah-datang.*')
                    ? 'bg-[#1C5F57] text-white font-semibold shadow-inner'
                    : 'text-[#D0EBE7] hover:bg-[#206760] hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ArrowLeftRight className="w-4 h-4 text-[#A7D7D0]" />
                  <span>Pindah / Datang</span>
                </div>
                {route().current('admin.pindah-datang.*') && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#89F5E7]" />
                )}
              </Link>

              {/* Pengajuan Surat */}
              {canLetters && (
                <Link
                  href={route('admin.surat.index')}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                    route().current('admin.surat.*')
                      ? 'bg-[#1C5F57] text-white font-semibold shadow-inner'
                      : 'text-[#D0EBE7] hover:bg-[#206760] hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#A7D7D0]" />
                    <span>Pengajuan Surat</span>
                  </div>
                  {(auth?.pending_letters_count ?? 0) > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#E58917] text-white flex items-center justify-center font-bold text-[10px]">
                      {auth.pending_letters_count}
                    </span>
                  )}
                </Link>
              )}

              {/* Audit Trail */}
              <a
                href="#audit-trail"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#D0EBE7] hover:bg-[#206760] hover:text-white text-xs font-medium transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#A7D7D0]" />
                <span>Audit Trail</span>
              </a>

              {/* Pengguna & Role */}
              {isAdmin && (
                <Link
                  href={route('admin.users.index')}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                    route().current('admin.users.*')
                      ? 'bg-[#1C5F57] text-white font-semibold shadow-inner'
                      : 'text-[#D0EBE7] hover:bg-[#206760] hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCog className="w-4 h-4 text-[#A7D7D0]" />
                    <span>Pengguna & Role</span>
                  </div>
                  {route().current('admin.users.*') && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#89F5E7]" />
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Footer Sidebar: Keamanan data & Tombol Keluar */}
        <div className="p-6 border-t border-[#318B82] space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#1E665E]/90 border border-[#358A81] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#7BD4C9] flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-white">Keamanan data</p>
              <p className="text-[10px] text-[#A7D7D0] leading-relaxed">
                Akses mengikuti matriks RBAC backend RT 01.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 text-[#D0EBE7] hover:text-white text-xs font-medium transition-colors py-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ================= AREA KONTEN UTAMA ================= */}
      <div className="flex-1 pl-[260px] flex flex-col min-w-0">
        {/* Top Bar Header */}
        <header className="h-[72px] bg-white border-b border-[#EAEFF5] px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#0E8F84]">
              SIA RT 01/08 Sukatani
            </span>
            <span className="text-[#A0AEC0]">•</span>
            <span className="text-xs text-[#718096] font-medium">Kecamatan Tapos, Kota Depok</span>
          </div>

          <Link
            href={route('profile.edit')}
            className="flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#EAF0FC] text-[#2F65CB] flex items-center justify-center font-bold text-xs">
              {getInitials(user?.name)}
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#1A253C] leading-none">
                {user?.name || 'Budi Santoso'}
              </h4>
              <p className="text-[10px] text-[#718096] mt-0.5">
                {user?.role_label || 'Ketua RT (Admin)'}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#A0AEC0] ml-1" />
          </Link>
        </header>

        {/* Main Content Workspace */}
        <main className="p-10 space-y-6 max-w-[1240px] w-full">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-xs text-[#718096]" aria-label="Breadcrumb">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                    {index > 0 && <span className="text-[#CBD5E1]">/</span>}
                    {isLast || !item.href ? (
                      <span className={isLast ? 'font-bold text-[#1A253C]' : ''}>
                        {item.label}
                      </span>
                    ) : (
                      <Link href={item.href} className="hover:text-[#0F685D] transition-colors">
                        {item.label}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
          )}

          {/* Page Heading & Header Actions */}
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                {title && (
                  <h2 className="text-[26px] font-bold text-[#1A253C] font-heading tracking-tight leading-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs text-[#718096] mt-1">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="shrink-0 flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          )}

          {/* Children Slot */}
          {children}
        </main>
      </div>
    </div>
  );
}
