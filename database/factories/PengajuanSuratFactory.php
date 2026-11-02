<?php

namespace Database\Factories;

use App\Models\PengajuanSurat;
use App\Models\User;
use App\Support\LetterStatus;
use App\Support\LetterType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PengajuanSurat>
 */
class PengajuanSuratFactory extends Factory
{
    protected $model = PengajuanSurat::class;

    public function definition(): array
    {
        return [
            'nomor' => 'SRT-'.now()->year.'-'.fake()->unique()->numerify('###'),
            'pemohon_id' => User::factory()->state(['role' => 'warga']),
            'created_by' => User::factory()->state(['role' => 'ketua_rt']),
            'jenis_surat' => fake()->randomElement(LetterType::all()),
            'keperluan' => fake()->sentence(4),
            'keterangan' => fake()->optional()->sentence(),
            'status' => LetterStatus::DIAJUKAN,
            'pdf_path' => null,
            'last_activity_at' => now(),
        ];
    }

    public function terbit(): static
    {
        return $this->state(fn () => [
            'status' => LetterStatus::TERBIT,
            'issued_at' => now(),
            'pdf_path' => 'surat/dummy.pdf',
            'last_activity_at' => now(),
        ]);
    }

    public function selesai(): static
    {
        return $this->state(fn () => [
            'status' => LetterStatus::SELESAI,
            'issued_at' => now()->subHour(),
            'completed_at' => now(),
            'pdf_path' => 'surat/dummy.pdf',
            'last_activity_at' => now(),
        ]);
    }
}
