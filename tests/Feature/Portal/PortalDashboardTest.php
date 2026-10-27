<?php

namespace Tests\Feature\Portal;

use App\Models\User;
use App\Models\Warga;
use App\Support\Roles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortalDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_warga_can_access_portal_dashboard_with_matching_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'Dian Setiawan',
            'username' => '3276020101950001',
            'role' => Roles::WARGA,
            'is_active' => true,
        ]);

        $warga = Warga::create([
            'user_id' => $user->id,
            'nik' => '3276020101950001',
            'no_kk' => '3276020101950002',
            'nama' => 'Dian Setiawan',
            'nama_lengkap' => 'Dian Setiawan',
            'gender' => 'L',
            'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
            'status_administrasi' => 'Aktif',
        ]);

        $response = $this->actingAs($user)->get(route('portal.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Portal/Dashboard')
            ->has('warga')
            ->where('warga.nama_lengkap', 'Dian Setiawan')
            ->has('recentLetters')
            ->has('notifications')
        );
    }

    public function test_warga_can_view_and_edit_their_warga_data(): void
    {
        $user = User::factory()->create([
            'name' => 'Dian Setiawan',
            'username' => '3276020101950001',
            'role' => Roles::WARGA,
            'is_active' => true,
        ]);

        $warga = Warga::create([
            'user_id' => $user->id,
            'nik' => '3276020101950001',
            'no_kk' => '3276020101950002',
            'nama' => 'Dian Setiawan',
            'nama_lengkap' => 'Dian Setiawan',
            'gender' => 'L',
            'no_wa' => '08123456789',
            'pekerjaan' => 'Karyawan Swasta',
            'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
            'status_administrasi' => 'Aktif',
        ]);

        // 1. View detail
        $responseView = $this->actingAs($user)->get(route('portal.warga.index'));
        $responseView->assertStatus(200);
        $responseView->assertInertia(fn ($page) => $page
            ->component('Portal/Warga/Index')
            ->where('warga.nama_lengkap', 'Dian Setiawan')
        );

        // 2. Edit / Update
        $responseUpdate = $this->actingAs($user)->put(route('portal.warga.update'), [
            'no_wa' => '089988776655',
            'pekerjaan' => 'Graphic Designer',
            'detail_alamat' => 'Blok B No. 12 Dekat Musholla',
            'agama' => 'Islam',
            'goldar' => 'B',
        ]);

        $responseUpdate->assertRedirect();
        $responseUpdate->assertSessionHas('success');

        $this->assertDatabaseHas('warga', [
            'id' => $warga->id,
            'no_wa' => '089988776655',
            'pekerjaan' => 'Graphic Designer',
            'detail_alamat' => 'Blok B No. 12 Dekat Musholla',
        ]);
    }
}
