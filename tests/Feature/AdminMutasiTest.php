<?php

namespace Tests\Feature;

use App\Models\DokumenMutasi;
use App\Models\PermohonanMutasi;
use App\Models\UnitRumah;
use App\Models\User;
use App\Models\Warga;
use App\Support\MutasiStatus;
use App\Support\MutasiType;
use App\Support\Roles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminMutasiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $sekretaris;
    private User $wargaUser;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');

        $this->admin = User::factory()->create([
            'name' => 'Budi Santoso',
            'username' => 'ketua.rt01',
            'email' => 'ketua@sukatani.test',
            'role' => Roles::KETUA_RT,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->sekretaris = User::factory()->create([
            'name' => 'Siti Rahmawati',
            'username' => 'sekretaris.rt01',
            'email' => 'sekretaris@sukatani.test',
            'role' => Roles::SEKRETARIS,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->wargaUser = User::factory()->create([
            'name' => 'Rizky Pratama',
            'username' => 'rizky.warga',
            'email' => 'rizky@sukatani.test',
            'role' => Roles::WARGA,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }

    public function test_guest_cannot_access_mutasi_admin(): void
    {
        $response = $this->get(route('admin.mutasi.index'));
        $response->assertRedirect('/login');
    }

    public function test_warga_is_forbidden_from_mutasi_admin(): void
    {
        $response = $this->actingAs($this->wargaUser)->get(route('admin.mutasi.index'));
        $response->assertForbidden();
    }

    public function test_admin_and_sekretaris_can_view_mutasi_index(): void
    {
        $responseAdmin = $this->actingAs($this->admin)->get(route('admin.mutasi.index'));
        $responseAdmin->assertOk();
        $responseAdmin->assertInertia(fn ($page) => $page->component('Admin/Mutasi/Index'));

        $responseSekretaris = $this->actingAs($this->sekretaris)->get(route('admin.mutasi.index'));
        $responseSekretaris->assertOk();
    }

    public function test_search_and_tab_filter(): void
    {
        PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0616-01',
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'tanggal_rencana' => '2025-06-16',
            'alamat_asal' => 'Margonda Raya Depok',
            'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
        ]);

        PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0613-02',
            'jenis_mutasi' => MutasiType::PINDAH,
            'nama_pemohon' => 'Agus Kurniawan',
            'nik_pemohon' => '3276812408890003',
            'no_kk' => '3276810204120008',
            'tanggal_rencana' => '2025-06-20',
            'alamat_asal' => 'Sukatani Blok A1',
            'status' => MutasiStatus::SEDANG_DIPERIKSA,
        ]);

        // Search by name
        $response = $this->actingAs($this->admin)->get(route('admin.mutasi.index', ['q' => 'Budi']));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('mutations.data', 1)
            ->where('mutations.data.0.nomor_tiket', 'PD-2025-0616-01')
        );

        // Filter by tab
        $responseTab = $this->actingAs($this->admin)->get(route('admin.mutasi.index', ['tab' => 'sedang_diperiksa']));
        $responseTab->assertOk();
        $responseTab->assertInertia(fn ($page) => $page
            ->has('mutations.data', 1)
            ->where('mutations.data.0.nomor_tiket', 'PD-2025-0613-02')
        );
    }

    public function test_can_view_detail_without_auto_changing_status(): void
    {
        $m = PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0616-01',
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'tanggal_rencana' => '2025-06-16',
            'alamat_asal' => 'Margonda Raya Depok',
            'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.mutasi.show', $m->id));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Admin/Mutasi/Show'));

        $this->assertEquals(MutasiStatus::MENUNGGU_PEMERIKSAAN, $m->fresh()->status);
    }

    public function test_save_draft_saves_checklists_and_notes(): void
    {
        $m = PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0616-01',
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'tanggal_rencana' => '2025-06-16',
            'alamat_asal' => 'Margonda Raya Depok',
            'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.mutasi.save-draft', $m->id), [
            'checklist_alamat' => true,
            'checklist_nik' => true,
            'checklist_dokumen' => false,
            'catatan_pemeriksaan' => 'Catatan sementara dari admin',
        ]);

        $response->assertRedirect(route('admin.mutasi.show', $m->id));
        $fresh = $m->fresh();
        $this->assertTrue($fresh->checklist_alamat);
        $this->assertTrue($fresh->checklist_nik);
        $this->assertFalse($fresh->checklist_dokumen);
        $this->assertEquals('Catatan sementara dari admin', $fresh->catatan_pemeriksaan);
        $this->assertEquals(MutasiStatus::SEDANG_DIPERIKSA, $fresh->status);
    }

    public function test_request_revision_requires_reason_and_sets_status(): void
    {
        $m = PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0616-01',
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'tanggal_rencana' => '2025-06-16',
            'alamat_asal' => 'Margonda Raya Depok',
            'status' => MutasiStatus::SEDANG_DIPERIKSA,
        ]);

        // Attempt without reason
        $responseFail = $this->actingAs($this->admin)->post(route('admin.mutasi.request-revision', $m->id), [
            'alasan_revisi' => '',
        ]);
        $responseFail->assertSessionHasErrors('alasan_revisi');

        // With valid reason
        $response = $this->actingAs($this->admin)->post(route('admin.mutasi.request-revision', $m->id), [
            'alasan_revisi' => 'Foto Kartu Keluarga buram, mohon unggah ulang.',
        ]);

        $response->assertRedirect(route('admin.mutasi.show', $m->id));
        $fresh = $m->fresh();
        $this->assertEquals(MutasiStatus::PERLU_REVISI, $fresh->status);
        $this->assertEquals('Foto Kartu Keluarga buram, mohon unggah ulang.', $fresh->alasan_revisi);
    }

    public function test_cannot_approve_if_checklists_not_all_passed(): void
    {
        $m = PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0616-01',
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'tanggal_rencana' => '2025-06-16',
            'alamat_asal' => 'Margonda Raya Depok',
            'status' => MutasiStatus::SEDANG_DIPERIKSA,
            'checklist_alamat' => true,
            'checklist_nik' => false,
            'checklist_dokumen' => true,
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.mutasi.approve', $m->id));
        $response->assertSessionHasErrors('checklist');
        $this->assertNotEquals(MutasiStatus::SELESAI, $m->fresh()->status);
    }

    public function test_approval_creates_warga_and_updates_unit_for_warga_datang(): void
    {
        $unit = UnitRumah::create([
            'blok' => 'Blok B3',
            'nomor' => 'No. 12',
            'nama_unit' => 'Blok B3 No. 12',
            'status_hunian' => 'kosong',
        ]);

        $m = PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0616-01',
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'telepon' => '0812-9876-5432',
            'tanggal_rencana' => '2025-06-16',
            'alamat_asal' => 'Margonda Raya Depok',
            'unit_rumah_id' => $unit->id,
            'status_tinggal' => 'Kontrak / Sewa Tahunan',
            'rincian_pengikut' => [
                ['nama' => 'Siti Rahmawati', 'hubungan' => 'Istri', 'umur' => 30, 'nik' => '3275085409940002'],
                ['nama' => 'Rayhan Santoso', 'hubungan' => 'Anak', 'umur' => 4, 'nik' => '3275082103210001'],
            ],
            'status' => MutasiStatus::SEDANG_DIPERIKSA,
            'checklist_alamat' => true,
            'checklist_nik' => true,
            'checklist_dokumen' => true,
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.mutasi.approve', $m->id));
        $response->assertRedirect(route('admin.mutasi.show', $m->id));

        $fresh = $m->fresh();
        $this->assertEquals(MutasiStatus::SELESAI, $fresh->status);
        $this->assertEquals($this->admin->id, $fresh->diverifikasi_oleh);
        $this->assertNotNull($fresh->diverifikasi_pada);

        // Assert pemohon created in warga
        $this->assertDatabaseHas('warga', [
            'nik' => '3275081204910003',
            'nama' => 'Budi Santoso',
            'no_kk' => '3275080102140005',
            'status_warga' => 'kontrak',
            'unit_rumah_id' => $unit->id,
            'is_kepala_keluarga' => true,
        ]);

        // Assert pengikut created in warga
        $this->assertDatabaseHas('warga', [
            'nik' => '3275085409940002',
            'nama' => 'Siti Rahmawati',
            'no_kk' => '3275080102140005',
            'status_warga' => 'kontrak',
            'is_kepala_keluarga' => false,
        ]);

        $this->assertDatabaseHas('warga', [
            'nik' => '3275082103210001',
            'nama' => 'Rayhan Santoso',
            'no_kk' => '3275080102140005',
            'status_warga' => 'kontrak',
            'is_kepala_keluarga' => false,
        ]);

        // Assert unit updated
        $this->assertEquals('kontrak', $unit->fresh()->status_hunian);
    }

    public function test_approval_updates_status_for_warga_pindah(): void
    {
        $warga = Warga::create([
            'nik' => '3276812408890003',
            'no_kk' => '3276810204120008',
            'nama' => 'Agus Kurniawan',
            'status_warga' => 'tetap',
            'is_kepala_keluarga' => true,
        ]);

        $m = PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0613-02',
            'warga_id' => $warga->id,
            'jenis_mutasi' => MutasiType::PINDAH,
            'nama_pemohon' => 'Agus Kurniawan',
            'nik_pemohon' => '3276812408890003',
            'no_kk' => '3276810204120008',
            'tanggal_rencana' => '2025-06-20',
            'alamat_asal' => 'Sukatani Blok A1',
            'status' => MutasiStatus::SEDANG_DIPERIKSA,
            'checklist_alamat' => true,
            'checklist_nik' => true,
            'checklist_dokumen' => true,
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.mutasi.approve', $m->id));
        $response->assertRedirect(route('admin.mutasi.show', $m->id));

        $this->assertEquals(MutasiStatus::SELESAI, $m->fresh()->status);
        $this->assertEquals('pindah', $warga->fresh()->status_warga);
    }

    public function test_export_rekap_csv(): void
    {
        PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0616-01',
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'tanggal_rencana' => '2025-06-16',
            'alamat_asal' => 'Margonda Raya Depok',
            'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.mutasi.export'));
        $response->assertOk();
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type'));
    }

    public function test_dashboard_navigation_flow_to_mutasi_and_detail_and_back(): void
    {
        $m = PermohonanMutasi::create([
            'nomor_tiket' => 'PD-2025-0616-01',
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'tanggal_rencana' => '2025-06-16',
            'alamat_asal' => 'Margonda Raya Depok',
            'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
        ]);

        // 1. Dashboard Admin
        $dashboardResponse = $this->actingAs($this->admin)->get(route('admin.dashboard'));
        $dashboardResponse->assertOk();
        $dashboardResponse->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));

        // 2. Klik kartu Laporan Mutasi & Audit Log -> Halaman antrean Pindah/Datang
        $queueResponse = $this->actingAs($this->admin)->get(route('admin.mutasi.index'));
        $queueResponse->assertOk();
        $queueResponse->assertInertia(fn ($page) => $page
            ->component('Admin/Mutasi/Index')
            ->has('mutations.data', 1)
            ->where('mutations.data.0.id', $m->id)
        );

        // 3. Klik Periksa Detail -> Halaman detail verifikasi
        $detailResponse = $this->actingAs($this->admin)->get(route('admin.mutasi.show', $m->id));
        $detailResponse->assertOk();
        $detailResponse->assertInertia(fn ($page) => $page
            ->component('Admin/Mutasi/Show')
            ->where('mutation.id', $m->id)
            ->where('mutation.nomor_tiket', 'PD-2025-0616-01')
        );

        // 4. Kembali ke antrean
        $backResponse = $this->actingAs($this->admin)->get(route('admin.mutasi.index'));
        $backResponse->assertOk();
        $backResponse->assertInertia(fn ($page) => $page->component('Admin/Mutasi/Index'));
    }
}
