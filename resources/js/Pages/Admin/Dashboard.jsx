import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, FileText, ArrowLeftRight, ShieldCheck, MapPin } from 'lucide-react';

export default function AdminDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-[#17233C] font-heading">
                            Dashboard Administrasi RT
                        </h2>
                        <p className="text-xs text-[#68748A]">
                            SIA Sukatani • Wilayah RT 01 / RW 08
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF4FF] text-[#2764D8] text-xs font-semibold border border-[#2764D8]/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Role: {auth.user.role === 'ketua_rt' ? 'Ketua RT' : 'Sekretaris'}
                    </span>
                </div>
            }
        >
            <Head title="Dashboard Admin - SIA Sukatani" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Banner */}
                    <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#10264F] to-[#2764D8] p-6 text-white shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-semibold text-[#89F5E7] tracking-wider uppercase">
                                    Selamat Datang
                                </span>
                                <h1 className="text-2xl font-bold font-heading mt-1">
                                    {auth.user.name}
                                </h1>
                                <p className="text-xs text-white/80 mt-1 max-w-xl">
                                    Kelola administrasi warga, verifikasi permohonan surat, dan pantau mutasi domisili warga secara terpusat.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium self-start sm:self-auto">
                                <MapPin className="w-3.5 h-3.5 text-[#89F5E7]" />
                                <span>RT 01 / RW 08 Sukatani</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Grid sesuai Modul P0 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Modul 1: Data Warga (Tugas Khoirunnisa) */}
                        <div className="p-6 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2764D8]">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#17233C] font-heading">
                                    Manajemen Data Warga
                                </h3>
                                <p className="text-xs text-[#68748A] mt-1 leading-relaxed">
                                    Pendataan warga tetap/kontrak, pencarian, dan proteksi sensor data sensitif NIK/KK.
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#E4E9F0] text-xs text-[#2764D8] font-semibold">
                                Modul P0 • Siap Dikembangkan
                            </div>
                        </div>

                        {/* Modul 2: Pengajuan Surat (Tugas Aliya) */}
                        <div className="p-6 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-[#E7F6EF] flex items-center justify-center text-[#11704E]">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#17233C] font-heading">
                                    Verifikasi Pengajuan Surat
                                </h3>
                                <p className="text-xs text-[#68748A] mt-1 leading-relaxed">
                                    Daftar permohonan surat pengantar & domisili dari warga untuk diperiksa dan disetujui.
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#E4E9F0] text-xs text-[#11704E] font-semibold">
                                Modul P0 • Siap Dikembangkan
                            </div>
                        </div>

                        {/* Modul 3: Lapor Mutasi & Audit (Tugas Ghita) */}
                        <div className="p-6 rounded-2xl bg-white border border-[#E4E9F0] shadow-sm space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FFF2D9] flex items-center justify-center text-[#97620D]">
                                <ArrowLeftRight className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#17233C] font-heading">
                                    Laporan Mutasi & Audit Log
                                </h3>
                                <p className="text-xs text-[#68748A] mt-1 leading-relaxed">
                                    Pemeriksaan pelaporan warga pindah/datang dan rekaman jejak aktivitas sistem.
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#E4E9F0] text-xs text-[#97620D] font-semibold">
                                Modul P0 • Siap Dikembangkan
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
