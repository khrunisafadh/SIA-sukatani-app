<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_admin_or_portal(): void
    {
        $responseAdmin = $this->get('/admin/dashboard');
        $responseAdmin->assertRedirect('/login');

        $responsePortal = $this->get('/portal');
        $responsePortal->assertRedirect('/login');
    }

    public function test_ketua_rt_can_access_admin_dashboard_and_is_redirected_after_login(): void
    {
        $admin = User::factory()->create([
            'username' => 'ketua.rt01',
            'role' => 'ketua_rt',
        ]);

        $responseLogin = $this->post('/login', [
            'login' => 'ketua.rt01',
            'password' => 'password',
        ]);

        $responseLogin->assertRedirect(route('admin.dashboard', absolute: false));

        $responsePage = $this->actingAs($admin)->get('/admin/dashboard');
        $responsePage->assertStatus(200);
    }

    public function test_warga_cannot_access_admin_dashboard(): void
    {
        $warga = User::factory()->create([
            'username' => 'warga.andi',
            'role' => 'warga',
        ]);

        $response = $this->actingAs($warga)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_warga_can_access_portal_dashboard_and_is_redirected_after_login(): void
    {
        $warga = User::factory()->create([
            'username' => 'warga.budi',
            'role' => 'warga',
        ]);

        $responseLogin = $this->post('/login', [
            'login' => 'warga.budi',
            'password' => 'password',
        ]);

        $responseLogin->assertRedirect(route('portal.dashboard', absolute: false));

        $responsePage = $this->actingAs($warga)->get('/portal');
        $responsePage->assertStatus(200);
    }

    public function test_admin_cannot_access_portal_dashboard(): void
    {
        $admin = User::factory()->create([
            'username' => 'ketua.rt02',
            'role' => 'ketua_rt',
        ]);

        $response = $this->actingAs($admin)->get('/portal');
        $response->assertStatus(403);
    }
}
