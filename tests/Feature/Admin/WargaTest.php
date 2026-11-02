<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Warga;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WargaTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $wargaUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'ketua_rt',
            'username' => 'ketua.rt',
        ]);

        $this->wargaUser = User::factory()->create([
            'role' => 'warga',
            'username' => 'warga.biasa',
        ]);
    }

    public function test_admin_can_view_warga_index_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.warga.index'));
        $response->assertStatus(200);
    }

    public function test_warga_user_cannot_access_warga_index_page(): void
    {
        $response = $this->actingAs($this->wargaUser)->get(route('admin.warga.index'));
        $response->assertStatus(403);
    }

    public function test_admin_can_view_tambah_warga_create_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.warga.create'));
        $response->assertStatus(200);
    }

    public function test_check_nik_ajax_endpoint(): void
    {
        // 1. Invalid length
        $resInvalid = $this->actingAs($this->admin)->get(route('admin.warga.check-nik', ['nik' => '123']));
        $resInvalid->assertJson(['valid' => false]);

        // 2. Valid and not exists
        $resValid = $this->actingAs($this->admin)->get(route('admin.warga.check-nik', ['nik' => '3276021804930005']));
        $resValid->assertJson(['valid' => true]);

        // 3. Existing citizen
        Warga::create([
            'nik' => '3276021804930005',
            'no_kk' => '3276020501190012',
            'nama_lengkap' => 'Muhammad Reza Pratama',
            'gender' => 'L',
            'tempat_lahir' => 'Depok',
            'tgl_lahir' => '1993-04-18',
            'agama' => 'Islam',
            'goldar' => 'A',
            'shdk' => 'Kepala Keluarga',
            'blok_rumah' => 'Blok B (Mawar)',
            'nomor_rumah' => 'No. 12',
            'alamat_lengkap' => 'Blok B (Mawar) No. 12, RT 01 / RW 08',
            'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
            'status_administrasi' => 'Aktif',
        ]);

        $resExists = $this->actingAs($this->admin)->get(route('admin.warga.check-nik', ['nik' => '3276021804930005']));
        $resExists->assertJson(['valid' => false]);
    }

    public function test_admin_can_store_new_warga(): void
    {
        Storage::fake('public');

        $payload = [
            'nik' => '3276021908950009',
            'no_kk' => '3276020501190012',
            'nama_lengkap' => 'Farhan Alamsyah',
            'gender' => 'L',
            'tempat_lahir' => 'Depok',
            'tgl_lahir' => '1995-08-19',
            'agama' => 'Islam',
            'goldar' => 'B',
            'shdk' => 'Kepala Keluarga',
            'nama_jalan' => 'Jl. Mawar',
            'nomor_rumah' => 'No. 15A',
            'detail_alamat' => 'Dekat Pos Ronda RT 01',
            'status_domisili' => 'Warga Tetap (Pemilik Rumah)',
            'no_wa' => '081299988811',
            'pekerjaan' => 'Software Engineer',
            'foto_ktp' => UploadedFile::fake()->image('ktp.jpg'),
            'foto_kk' => UploadedFile::fake()->image('kk.jpg'),
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.warga.store'), $payload);

        $response->assertRedirect(route('admin.warga.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('wargas', [
            'nik' => '3276021908950009',
            'nama_lengkap' => 'Farhan Alamsyah',
            'status_administrasi' => 'Aktif',
        ]);
    }
}
