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
        // Akun Ketua RT (sesuai profil Figma Budi Santoso)
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

        // Akun Warga Contoh
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
