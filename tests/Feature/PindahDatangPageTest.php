<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PindahDatangPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_warga_can_open_pindah_datang_form(): void
    {
        $warga = User::factory()->create([
            'username' => 'rizky.pratama',
            'role' => 'warga',
        ]);

        $this->actingAs($warga)
            ->get(route('portal.pindah-datang.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Portal/PindahDatang/Create'));
    }

    public function test_warga_can_open_pindah_datang_tracking(): void
    {
        $warga = User::factory()->create([
            'username' => 'rizky.pratama',
            'role' => 'warga',
        ]);

        $this->actingAs($warga)
            ->get(route('portal.pindah-datang.tracking'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Portal/PindahDatang/Tracking'));
    }

    public function test_pengurus_cannot_open_pindah_datang_form(): void
    {
        $ketua = User::factory()->create([
            'username' => 'ketua.rt01',
            'role' => 'ketua_rt',
        ]);

        $this->actingAs($ketua)
            ->get(route('portal.pindah-datang.create'))
            ->assertForbidden();
    }
}
