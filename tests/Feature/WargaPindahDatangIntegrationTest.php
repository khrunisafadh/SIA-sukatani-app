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
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WargaPindahDatangIntegrationTest extends TestCase
{
    use RefreshDatabase;

    private User $wargaUser;
    private User $adminUser;
    private UnitRumah $unitRumah;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');

        $this->unitRumah = UnitRumah::create([
            'blok' => 'Blok B3',
            'nomor' => 'No. 12',
            'nama_unit' => 'Blok B3 No. 12',
            'status_hunian' => 'kontrak',
            'nama_pemilik' => 'Bpk. Hendro Sujarwo',
            'telepon_pemilik' => '081298765432',
            'kapasitas_kk' => 1,
        ]);

        $this->wargaUser = User::factory()->create([
            'name' => 'Budi Santoso',
            'username' => 'budi.warga',
            'email' => 'budi@sukatani.test',
            'role' => Roles::WARGA,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Warga::create([
            'user_id' => $this->wargaUser->id,
            'nik' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'nama' => 'Budi Santoso',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1991-04-12',
            'agama' => 'Islam',
            'pekerjaan' => 'Karyawan Swasta',
            'status_perkawinan' => 'kawin',
            'telepon' => '081298765432',
            'status_warga' => 'tetap',
            'unit_rumah_id' => $this->unitRumah->id,
            'alamat_ktp' => 'Jl. Margonda Raya No. 10 Depok',
            'is_kepala_keluarga' => true,
            'hubungan_keluarga' => 'Kepala Keluarga',
        ]);

        $this->adminUser = User::factory()->create([
            'name' => 'Pak Ketua RT',
            'username' => 'ketua.rt01',
            'email' => 'ketua@sukatani.test',
            'role' => Roles::KETUA_RT,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }

    public function test_guest_cannot_access_warga_pindah_datang_pages(): void
    {
        $this->get(route('portal.pindah-datang.create'))->assertRedirect('/login');
        $this->get(route('portal.pindah-datang.tracking'))->assertRedirect('/login');
        $this->post(route('portal.pindah-datang.store'), [])->assertRedirect('/login');
    }

    public function test_warga_can_render_pindah_datang_create_page(): void
    {
        $response = $this->actingAs($this->wargaUser)->get(route('portal.pindah-datang.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Portal/PindahDatang/Create')
            ->has('units')
            ->has('defaultWarga')
            ->where('defaultWarga.nama', 'Budi Santoso')
            ->where('defaultWarga.nik', '3275081204910003')
        );
    }

    public function test_warga_submits_datang_report_successfully_and_records_are_created(): void
    {
        $fileKtp = UploadedFile::fake()->create('ktp_pemohon.jpg', 600, 'image/jpeg');
        $fileKk = UploadedFile::fake()->create('kartu_keluarga.pdf', 1200, 'application/pdf');

        $payload = [
            'jenis' => MutasiType::DATANG,
            'nama' => 'Budi Santoso',
            'nik' => '3275081204910003',
            'kk' => '3275080102140005',
            'tanggal' => '2025-06-16',
            'alamatAsal' => 'Jl. Kebon Jeruk No. 22, Jakarta Barat',
            'unit' => 'Blok B3 No. 12',
            'statusTinggal' => 'Kontrak / Sewa Tahunan',
            'files' => [$fileKtp, $fileKk],
        ];

        $response = $this->actingAs($this->wargaUser)->post(route('portal.pindah-datang.store'), $payload);

        $this->assertDatabaseHas('permohonan_mutasi', [
            'jenis_mutasi' => MutasiType::DATANG,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3275081204910003',
            'no_kk' => '3275080102140005',
            'unit_rumah_id' => $this->unitRumah->id,
            'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
        ]);

        $mutasi = PermohonanMutasi::where('nik_pemohon', '3275081204910003')->first();
        $this->assertNotNull($mutasi);
        $this->assertStringStartsWith('PD-', $mutasi->nomor_tiket);

        // Dokumen mutasi tersimpan dan terelasi
        $this->assertCount(2, $mutasi->dokumen);
        foreach ($mutasi->dokumen as $dokumen) {
            Storage::disk('local')->assertExists($dokumen->file_path);
        }

        $response->assertRedirect(route('portal.pindah-datang.tracking', ['ticket' => $mutasi->nomor_tiket]));
    }

    public function test_warga_submits_pindah_report_successfully(): void
    {
        $fileKtp = UploadedFile::fake()->create('ktp_warga.png', 400, 'image/png');
        $fileKk = UploadedFile::fake()->create('kk_terbaru.pdf', 800, 'application/pdf');

        $payload = [
            'jenis' => MutasiType::PINDAH,
            'nama' => 'Budi Santoso',
            'nik' => '3275081204910003',
            'kk' => '3275080102140005',
            'tanggal' => '2025-07-01',
            'alamatAsal' => 'Komplek Permata Hijau Kav. 4 Bandung',
            'unit' => 'Blok B3 No. 12',
            'statusTinggal' => 'Milik Sendiri',
            'files' => [$fileKtp, $fileKk],
        ];

        $response = $this->actingAs($this->wargaUser)->post(route('portal.pindah-datang.store'), $payload);

        $this->assertDatabaseHas('permohonan_mutasi', [
            'jenis_mutasi' => MutasiType::PINDAH,
            'nama_pemohon' => 'Budi Santoso',
            'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
        ]);

        $mutasi = PermohonanMutasi::where('jenis_mutasi', MutasiType::PINDAH)->first();
        $response->assertRedirect(route('portal.pindah-datang.tracking', ['ticket' => $mutasi->nomor_tiket]));
    }

    public function test_validation_fails_when_fields_or_files_are_invalid(): void
    {
        $response = $this->actingAs($this->wargaUser)->post(route('portal.pindah-datang.store'), [
            'jenis' => 'tidak_valid',
            'nama' => '',
            'nik' => '123', // kurang dari 16 digit
            'kk' => '456',
            'tanggal' => 'bukan-tanggal',
            'alamatAsal' => '',
            'unit' => '',
            'statusTinggal' => '',
            'files' => [],
        ]);

        $response->assertSessionHasErrors([
            'jenis',
            'nama',
            'nik',
            'kk',
            'tanggal',
            'alamatAsal',
            'unit',
            'statusTinggal',
            'files',
        ]);
    }

    public function test_submitted_warga_report_immediately_appears_in_admin_verification_queue(): void
    {
        $fileKtp = UploadedFile::fake()->create('ktp_pemohon.jpg', 600, 'image/jpeg');
        $fileKk = UploadedFile::fake()->create('kartu_keluarga.pdf', 1200, 'application/pdf');

        $this->actingAs($this->wargaUser)->post(route('portal.pindah-datang.store'), [
            'jenis' => MutasiType::DATANG,
            'nama' => 'Ahmad Fauzi',
            'nik' => '3275082103880004',
            'kk' => '3275081105150007',
            'tanggal' => '2025-06-16',
            'alamatAsal' => 'Jl. Kaliurang KM 5 Yogyakarta',
            'unit' => 'Blok B3 No. 12',
            'statusTinggal' => 'Kontrak / Sewa Tahunan',
            'files' => [$fileKtp, $fileKk],
        ])->assertSessionHasNoErrors();

        $mutasi = PermohonanMutasi::where('nik_pemohon', '3275082103880004')->first();
        $this->assertNotNull($mutasi);

        // Buka dashboard antrean verifikasi admin
        $adminResponse = $this->actingAs($this->adminUser)->get(route('admin.mutasi.index'));

        $adminResponse->assertOk();
        $adminResponse->assertInertia(fn ($page) => $page
            ->component('Admin/Mutasi/Index')
            ->where('summary.menunggu', 1)
            ->has('mutations.data', 1)
            ->where('mutations.data.0.nomor_tiket', $mutasi->nomor_tiket)
            ->where('mutations.data.0.pemohon.nama', 'Ahmad Fauzi')
            ->where('mutations.data.0.jenis', MutasiType::DATANG)
            ->where('mutations.data.0.status', MutasiStatus::MENUNGGU_PEMERIKSAAN)
        );
    }

    public function test_admin_can_view_detail_and_preview_download_documents(): void
    {
        $fileKtp = UploadedFile::fake()->create('ktp_asli.jpg', 500, 'image/jpeg');
        $fileKk = UploadedFile::fake()->create('kk_terverifikasi.pdf', 1000, 'application/pdf');

        $this->actingAs($this->wargaUser)->post(route('portal.pindah-datang.store'), [
            'jenis' => MutasiType::DATANG,
            'nama' => 'Bambang Sudirjo',
            'nik' => '3275081907850002',
            'kk' => '3275080902120006',
            'tanggal' => '2025-06-16',
            'alamatAsal' => 'Jl. Veteran No. 4 Bandung',
            'unit' => 'Blok B3 No. 12',
            'statusTinggal' => 'Kontrak / Sewa Tahunan',
            'files' => [$fileKtp, $fileKk],
        ]);

        $mutasi = PermohonanMutasi::where('nik_pemohon', '3275081907850002')->first();

        // 1. Admin buka detail verifikasi
        $detailResponse = $this->actingAs($this->adminUser)->get(route('admin.mutasi.show', $mutasi->id));
        $detailResponse->assertOk();
        $detailResponse->assertInertia(fn ($page) => $page
            ->component('Admin/Mutasi/Show')
            ->where('mutation.nomor_tiket', $mutasi->nomor_tiket)
            ->where('mutation.pemohon.nama', 'Bambang Sudirjo')
            ->where('mutation.pemohon.nik', '3275081907850002')
            ->has('mutation.dokumen', 2)
        );

        $dokumenKtp = $mutasi->dokumen()->where('jenis_dokumen', 'ktp')->first();
        $this->assertNotNull($dokumenKtp);

        // 2. Admin pratinjau dokumen
        $previewResponse = $this->actingAs($this->adminUser)->get(
            route('admin.mutasi.document.preview', [$mutasi->id, $dokumenKtp->id])
        );
        $previewResponse->assertOk();

        // 3. Admin unduh dokumen
        $downloadResponse = $this->actingAs($this->adminUser)->get(
            route('admin.mutasi.document.download', [$mutasi->id, $dokumenKtp->id])
        );
        $downloadResponse->assertOk();
    }

    public function test_full_lifecycle_warga_submission_to_admin_approval(): void
    {
        $fileKtp = UploadedFile::fake()->create('ktp_pemohon.jpg', 600, 'image/jpeg');
        $fileKk = UploadedFile::fake()->create('kartu_keluarga.pdf', 1200, 'application/pdf');

        // Warga mengajukan
        $this->actingAs($this->wargaUser)->post(route('portal.pindah-datang.store'), [
            'jenis' => MutasiType::DATANG,
            'nama' => 'Budi Santoso',
            'nik' => '3275081204910003',
            'kk' => '3275080102140005',
            'tanggal' => '2025-06-16',
            'alamatAsal' => 'Jl. Kebon Jeruk No. 22 Jakarta Barat',
            'unit' => 'Blok B3 No. 12',
            'statusTinggal' => 'Kontrak / Sewa Tahunan',
            'files' => [$fileKtp, $fileKk],
        ]);

        $mutasi = PermohonanMutasi::where('nik_pemohon', '3275081204910003')->first();

        // Admin meminta revisi dokumen
        $this->actingAs($this->adminUser)->post(route('admin.mutasi.request-revision', $mutasi->id), [
            'alasan_revisi' => 'Foto KTP terpotong pada bagian NIK, mohon unggah ulang.',
            'catatan' => 'Periksa kembali e-KTP fisik.',
        ])->assertSessionHasNoErrors();

        $mutasi->refresh();
        $this->assertEquals(MutasiStatus::PERLU_REVISI, $mutasi->status);
        $this->assertEquals('Foto KTP terpotong pada bagian NIK, mohon unggah ulang.', $mutasi->alasan_revisi);

        // Warga memeriksa tracking dan melihat status perlu revisi
        $trackingResponse = $this->actingAs($this->wargaUser)->get(
            route('portal.pindah-datang.tracking', ['ticket' => $mutasi->nomor_tiket])
        );
        $trackingResponse->assertOk();
        $trackingResponse->assertInertia(fn ($page) => $page
            ->component('Portal/PindahDatang/Tracking')
            ->where('permohonan.status', MutasiStatus::PERLU_REVISI)
            ->where('permohonan.alasanRevisi', 'Foto KTP terpotong pada bagian NIK, mohon unggah ulang.')
        );

        // Admin memeriksa dan mencentang checklist
        $this->actingAs($this->adminUser)->post(route('admin.mutasi.save-draft', $mutasi->id), [
            'checklist_alamat' => true,
            'checklist_nik' => true,
            'checklist_dokumen' => true,
            'catatan' => 'Semua berkas fisik dan digital telah diverifikasi.',
        ])->assertSessionHasNoErrors();

        // Admin menyetujui mutasi
        $this->actingAs($this->adminUser)->post(route('admin.mutasi.approve', $mutasi->id), [
            'catatan' => 'Berkas telah diverifikasi dan dicocokkan.',
        ])->assertSessionHasNoErrors();

        $mutasi->refresh();
        $this->assertEquals(MutasiStatus::SELESAI, $mutasi->status);
        $this->assertNotNull($mutasi->diverifikasi_pada);

        // Warga melihat status selesai pada tracking
        $trackingResponse2 = $this->actingAs($this->wargaUser)->get(
            route('portal.pindah-datang.tracking', ['ticket' => $mutasi->nomor_tiket])
        );
        $trackingResponse2->assertOk();
        $trackingResponse2->assertInertia(fn ($page) => $page
            ->component('Portal/PindahDatang/Tracking')
            ->where('permohonan.status', MutasiStatus::SELESAI)
        );
    }
}
