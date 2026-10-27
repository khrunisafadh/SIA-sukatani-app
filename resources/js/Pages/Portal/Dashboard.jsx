import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Download, Clock, ShieldCheck, MapPin, PlusCircle, ArrowRight } from 'lucide-react';

export default function PortalDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-[#17233C] font-heading">
                            Portal Layanan Warga
                        </h2>
                        <p className="text-xs text-[#68748A]">
                            SIA Sukatani • Layanan Mandiri Warga RT 01 / RW 08
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F6EF] text-[#11704E] text-xs font-semibold border border-[#11704E]/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Akun Warga Terdaftar
                    </span>
                </div>
            }
        >
            <Head title="Portal Warga - SIA Sukatani" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Banner Warga */}
                    <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#00655C] to-[#0F8F83] p-6 text-white shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-semibold text-[#89F5E7] tracking-wider uppercase">
                                    Portal Warga
                                </span>
                                <h1 className="text-2xl font-bold font-heading mt-1">
                                    Halo, {auth.user.name}
                                </h1>
                                <p className="text-xs text-white/80 mt-1 max-w-xl">
                                    Ajukan surat pengantar atau surat domisili secara digital dan pantau status pemeriksaannya tanpa perlu antre.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium self-start sm:self-auto">
                                <MapPin className="w-3.5 h-3.5 text-[#89F5E7]" />
                                <span>Warga RT 01 / RW 08</span>
                            </div>
                        </div>
                    </div>

                    {/* Menu Layanan Warga */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Layanan 1: Ajukan Surat */}
                        <Link
                            href={route('portal.surat.index')}
                            className="p-6 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm space-y-4 hover:border-[#2764D8]/30 transition block"
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2764D8]">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-bold text-[#2764D8] bg-[#EEF4FF] px-2.5 py-1 rounded-md">
                                    Layanan Aktif
                                </span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#17233C] font-heading">
                                    Pengajuan Surat Digital
                                </h3>
                                <p className="text-xs text-[#68748A] mt-1 leading-relaxed">
                                    Pilih jenis surat keterangan atau pernyataan untuk keperluan administrasi resmi Anda dan pantau statusnya secara berkala.
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#E4E9F0] flex items-center justify-between text-xs text-[#2764D8] font-semibold">
                                <span>Buka Riwayat Pengajuan</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Layanan 2: Lapor Pindah / Datang (Tugas Ghita) */}
                        <Link
                            href={route('portal.pindah-datang.create')}
                            className="p-6 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm space-y-4 hover:border-[#11704E]/30 transition"
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 rounded-xl bg-[#E7F6EF] flex items-center justify-center text-[#11704E]">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-bold text-[#11704E] bg-[#E7F6EF] px-2.5 py-1 rounded-md">
                                    Layanan Warga
                                </span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#17233C] font-heading">
                                    Lapor Pindah / Datang
                                </h3>
                                <p className="text-xs text-[#68748A] mt-1 leading-relaxed">
                                    Laporkan pembaruan status hunian Anda (warga datang atau pindah) dan unggah berkas bukti pendukung.
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#E4E9F0] flex items-center justify-between text-xs text-[#11704E] font-semibold">
                                <span>Buka Formulir Pelaporan</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
