<?php

namespace Database\Seeders;

use App\Models\User;
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
        User::updateOrCreate(
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
        User::updateOrCreate(
            ['username' => 'rizky.pratama'],
            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky@gmail.com',
                'role' => 'warga',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
    }
}
