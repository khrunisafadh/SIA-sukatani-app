<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Warga;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Ketua RT (Budi Santoso - sesuai Figma)
        $ketua = User::updateOrCreate(
            ['username' => 'ketua.rt01'],
            [
                'name' => 'Budi Santoso',
                'email' => 'ketua.rt01@sukatani.id',
                'role' => 'ketua_rt',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Akun Sekretaris RT
        User::updateOrCreate(
            ['username' => 'sekretaris.rt01'],
            [
                'name' => 'Siti Rahmawati',
                'email' => 'sekretaris.rt01@sukatani.id',
                'role' => 'sekretaris',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 3. Akun Bendahara RT
        User::updateOrCreate(
            ['username' => 'bendahara.rt01'],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'bendahara.rt01@sukatani.id',
                'role' => 'bendahara',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 4. Akun Warga Contoh (Rizky Pratama - sesuai Figma)
        $wargaUser = User::updateOrCreate(
            ['username' => 'rizky.pratama'],
            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky@gmail.com',
                'role' => 'warga',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 5. Data Warga Awal (Sesuai 5 Sampel di Desain Figma)
        $samples = [
            [
                'nik' => '3276011402940142',
                'no_kk' => '3276010508120008',
                'nama_lengkap' => 'Rizky Pratama',
                'user_id' => $wargaUser->id,
                'gender' => 'L',
                'tempat_lahir' => 'Depok',
                'tgl_lahir' => '1994-02-14',
                'shdk' => 'Kepala Keluarga',
                'nama_jalan' => 'Jl. Melati',
                'blok_rumah' => 'Jl. Melati (Blok A)',
                'nomor_rumah' => 'No. 12',
                'detail_alamat' => 'Dekat Pos Ronda Utama',
                'alamat_lengkap' => 'Jl. Melati No. 12 (Dekat Pos Ronda Utama), RT 01/08 Sukatani',
                'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
                'no_wa' => '081299281726',
                'pekerjaan' => 'Karyawan Swasta',
                'status_administrasi' => 'Aktif',
            ],
            [
                'nik' => '3276015509970087',
                'no_kk' => '3276012204150031',
                'nama_lengkap' => 'Siti Rahmawati',
                'gender' => 'P',
                'tempat_lahir' => 'Jakarta',
                'tgl_lahir' => '1997-09-15',
                'shdk' => 'Istri',
                'nama_jalan' => 'Jl. Anggrek',
                'blok_rumah' => 'Jl. Anggrek (Blok C)',
                'nomor_rumah' => 'No. 7',
                'detail_alamat' => null,
                'alamat_lengkap' => 'Jl. Anggrek No. 7, RT 01/08 Sukatani',
                'status_domisili' => 'Sewa / Kontrak Tahunan',
                'no_wa' => '085718293019',
                'pekerjaan' => 'Guru',
                'status_administrasi' => 'Aktif',
            ],
            [
                'nik' => '3276012008910203',
                'no_kk' => '3276011101180045',
                'nama_lengkap' => 'Dimas Saputra',
                'gender' => 'L',
                'tempat_lahir' => 'Bogor',
                'tgl_lahir' => '1991-08-20',
                'shdk' => 'Kepala Keluarga',
                'nama_jalan' => 'Jl. Sukatani Raya',
                'blok_rumah' => 'Jl. Sukatani Raya',
                'nomor_rumah' => 'No. 4',
                'detail_alamat' => 'Pagar Hitam Depan Lapangan',
                'alamat_lengkap' => 'Jl. Sukatani Raya No. 4, RT 01/08 Sukatani',
                'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
                'no_wa' => '081399018273',
                'pekerjaan' => 'Wiraswasta',
                'status_administrasi' => 'Aktif',
            ],
            [
                'nik' => '3276014406980176',
                'no_kk' => '3276011907160022',
                'nama_lengkap' => 'Nur Aisyah',
                'gender' => 'P',
                'tempat_lahir' => 'Depok',
                'tgl_lahir' => '1998-06-24',
                'shdk' => 'Anak',
                'nama_jalan' => 'Gang Mawar',
                'blok_rumah' => 'Gang Mawar',
                'nomor_rumah' => 'No. 3',
                'detail_alamat' => null,
                'alamat_lengkap' => 'Gang Mawar No. 3, RT 01/08 Sukatani',
                'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
                'no_wa' => '087819283746',
                'pekerjaan' => 'Mahasiswi',
                'status_administrasi' => 'Verifikasi',
            ],
            [
                'nik' => '3276010503880119',
                'no_kk' => '3276010101140014',
                'nama_lengkap' => 'Bambang Setiawan',
                'gender' => 'L',
                'tempat_lahir' => 'Solo',
                'tgl_lahir' => '1988-03-05',
                'shdk' => 'Kepala Keluarga',
                'nama_jalan' => 'Jl. Melati',
                'blok_rumah' => 'Jl. Melati (Blok A)',
                'nomor_rumah' => 'No. 19',
                'detail_alamat' => null,
                'alamat_lengkap' => 'Jl. Melati No. 19, RT 01/08 Sukatani',
                'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
                'no_wa' => '081277382910',
                'pekerjaan' => 'PNS',
                'status_administrasi' => 'Aktif',
            ],
        ];

        foreach ($samples as $sample) {
            Warga::updateOrCreate(['nik' => $sample['nik']], $sample);
        }

        // Jalankan MutasiSeeder untuk sinkronisasi master unit rumah RT 01 & permohonan mutasi
        $this->call(MutasiSeeder::class);
    }
}
