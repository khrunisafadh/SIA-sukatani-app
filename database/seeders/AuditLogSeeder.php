<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ketua = User::where('role', 'ketua_rt')->first();
        $sekretaris = User::where('role', 'sekretaris')->first();
        $bendahara = User::where('role', 'bendahara')->first();

        $samples = [
            [
                'user_id' => $ketua?->id,
                'action' => 'warga.create',
                'subject_type' => 'App\Models\Warga',
                'subject_id' => '1',
                'ip_address' => '192.168.1.10',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
                'meta' => [
                    'actor_name' => $ketua?->name ?? 'Budi Santoso',
                    'actor_role' => 'ketua_rt',
                    'nama' => 'Ahmad Fauzi',
                    'description' => 'Penambahan data warga baru dengan NIK 3275080102900001 di RT 01/08.',
                    'after' => [
                        'nama_lengkap' => 'Ahmad Fauzi',
                        'nik' => '3275080102900001',
                        'status_domisili' => 'Tetap',
                        'alamat' => 'Blok B1 No. 12',
                    ],
                ],
                'created_at' => now()->subDays(2)->setHour(9)->setMinute(15),
            ],
            [
                'user_id' => $sekretaris?->id,
                'action' => 'surat.approve',
                'subject_type' => 'App\Models\PengajuanSurat',
                'subject_id' => '2',
                'ip_address' => '192.168.1.15',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
                'meta' => [
                    'actor_name' => $sekretaris?->name ?? 'Siti Rahmawati',
                    'actor_role' => 'sekretaris',
                    'nomor_surat' => '045/SKD/RT01/XI/2026',
                    'description' => 'Persetujuan dan pengesahan surat keterangan domisili pemohon Rizky Pratama.',
                    'before' => ['status' => 'Diajukan'],
                    'after' => ['status' => 'Disetujui RT', 'nomor_surat' => '045/SKD/RT01/XI/2026'],
                ],
                'created_at' => now()->subDay()->setHour(14)->setMinute(30),
            ],
            [
                'user_id' => $bendahara?->id,
                'action' => 'kas.create',
                'subject_type' => 'App\Models\TransaksiKas',
                'subject_id' => '5',
                'ip_address' => '192.168.1.20',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
                'meta' => [
                    'actor_name' => $bendahara?->name ?? 'Ahmad Fauzi',
                    'actor_role' => 'bendahara',
                    'subject_name' => 'Iuran Warga Blok A-C (November 2026)',
                    'description' => 'Pencatatan pemasukan kas iuran kebersihan dan keamanan warga.',
                    'after' => ['tipe' => 'pemasukan', 'nominal' => 2500000, 'kategori' => 'Iuran Rutin'],
                ],
                'created_at' => now()->subHours(6),
            ],
            [
                'user_id' => $ketua?->id,
                'action' => 'warga.update',
                'subject_type' => 'App\Models\Warga',
                'subject_id' => '1',
                'ip_address' => '192.168.1.10',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
                'meta' => [
                    'actor_name' => $ketua?->name ?? 'Budi Santoso',
                    'actor_role' => 'ketua_rt',
                    'nama' => 'Ahmad Fauzi',
                    'description' => 'Pembaruan nomor kontak dan kepemilikan unit rumah.',
                    'before' => ['telepon' => '08123456789'],
                    'after' => ['telepon' => '08129876543'],
                ],
                'created_at' => now()->subHours(2),
            ],
        ];

        foreach ($samples as $sample) {
            AuditLog::create($sample);
        }
    }
}
