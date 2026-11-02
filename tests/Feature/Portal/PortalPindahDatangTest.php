<?php

namespace Tests\Feature\Portal;

use App\Models\PermohonanMutasi;
use App\Models\UnitRumah;
use App\Models\User;
use App\Models\Warga;
use App\Support\MutasiStatus;
use App\Support\MutasiType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PortalPindahDatangTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_can_view_pindah_datang_create_form_with_units(): void
    {
        $wargaUser = User::factory()->create([
            'role' => 'warga',
            'username' => '3276011402940142',
            'name' => 'Rizky Pratama',
        ]);

        $unit = UnitRumah::create([
            'nama_unit' => 'Blok B3 No. 12',
            'blok' => 'Blok B3',
            'nomor' => 'No. 12',
            'status_hunian' => 'kontrak',
            'nama_pemilik' => 'Bpk. Hendro Sujarwo',
        ]);

        $response = $this->actingAs($wargaUser)->get(route('portal.pindah-datang.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Portal/PindahDatang/Create')
            ->has('units', 1)
            ->where('units.0.nama_unit', 'Blok B3 No. 12')
        );
    }

    public function test_citizen_submission_connects_to_database_and_admin_mutasi(): void
    {
        Storage::fake('local');

        $wargaUser = User::factory()->create([
            'role' => 'warga',
            'username' => '3276011402940142',
            'name' => 'Rizky Pratama',
        ]);

        $unit = UnitRumah::create([
            'nama_unit' => 'Blok B3 No. 12',
            'blok' => 'Blok B3',
            'nomor' => 'No. 12',
            'status_hunian' => 'kontrak',
        ]);

        $payload = [
            'jenis' => MutasiType::DATANG,
            'nama' => 'Rizky Pratama',
            'nik' => '3276011402940142',
            'kk' => '3276010508120008',
            'tanggal' => '2026-11-01',
            'alamatAsal' => 'Jl. Margonda No. 10, Depok',
            'unit' => 'Blok B3 No. 12',
            'statusTinggal' => 'Kontrak / Sewa Tahunan',
            'files' => [
                UploadedFile::fake()->create('ktp_rizky.pdf', 200, 'application/pdf'),
                UploadedFile::fake()->create('kk_rizky.jpg', 300, 'image/jpeg'),
            ],
        ];

        $response = $this->actingAs($wargaUser)->post(route('portal.pindah-datang.store'), $payload);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('permohonan_mutasi', [
            'nama_pemohon' => 'Rizky Pratama',
            'nik_pemohon' => '3276011402940142',
            'jenis_mutasi' => MutasiType::DATANG,
            'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
            'user_id' => $wargaUser->id,
        ]);

        $mutasi = PermohonanMutasi::where('nik_pemohon', '3276011402940142')->first();
        $this->assertNotNull($mutasi);
        $this->assertCount(2, $mutasi->dokumen);

        // Akses tracking oleh warga
        $trackingResponse = $this->actingAs($wargaUser)->get(route('portal.pindah-datang.tracking', ['ticket' => $mutasi->nomor_tiket]));
        $trackingResponse->assertStatus(200);
        $trackingResponse->assertInertia(fn ($page) => $page
            ->component('Portal/PindahDatang/Tracking')
            ->where('permohonan.ticket', $mutasi->nomor_tiket)
            ->where('permohonan.status', MutasiStatus::MENUNGGU_PEMERIKSAAN)
        );

        // Admin melihat laporan tersebut di admin mutasi
        $admin = User::factory()->create(['role' => 'ketua_rt']);
        $adminResponse = $this->actingAs($admin)->get(route('admin.mutasi.index'));
        $adminResponse->assertStatus(200);
        $adminResponse->assertInertia(fn ($page) => $page
            ->component('Admin/Mutasi/Index')
            ->has('mutations.data', 1)
            ->where('mutations.data.0.pemohon.nama', 'Rizky Pratama')
        );
    }
}
