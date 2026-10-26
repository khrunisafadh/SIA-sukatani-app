<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Warga;
use App\Models\PengajuanSurat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_renders_with_real_database_queries(): void
    {
        $admin = User::where('role', 'ketua_rt')->first() ?? User::factory()->create(['role' => 'ketua_rt']);
        $wargaUser = User::factory()->create(['role' => 'warga']);

        $letter = PengajuanSurat::create([
            'nomor' => 'SRT-2026-TEST',
            'pemohon_id' => $wargaUser->id,
            'created_by' => $admin->id,
            'jenis_surat' => 'pengantar',
            'keperluan' => 'Uji Coba Dashboard',
            'status' => 'diajukan',
        ]);

        $letter->recordHistory('diajukan', $admin, 'Pengajuan dicatat');

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
            ->has('stats')
            ->has('recentLetters')
            ->has('recentHistories', 1)
        );
    }
}
