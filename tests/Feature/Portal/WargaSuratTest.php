<?php

namespace Tests\Feature\Portal;

use App\Models\PengajuanSurat;
use App\Models\User;
use App\Services\LetterPdfService;
use App\Support\LetterStatus;
use App\Support\LetterType;
use App\Support\Roles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WargaSuratTest extends TestCase
{
    use RefreshDatabase;

    private User $warga1;
    private User $warga2;
    private User $adminRt;
    private User $sekretaris;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');

        $this->adminRt = User::factory()->create([
            'name' => 'Budi Santoso',
            'username' => 'ketua.rt01',
            'role' => Roles::KETUA_RT,
            'is_active' => true,
        ]);

        $this->sekretaris = User::factory()->create([
            'name' => 'Siti Aminah',
            'username' => 'sekretaris01',
            'role' => Roles::SEKRETARIS,
            'is_active' => true,
        ]);

        $this->warga1 = User::factory()->create([
            'name' => 'Kiming Yuliadi',
            'username' => 'kiming.warga',
            'role' => Roles::WARGA,
            'is_active' => true,
        ]);

        $this->warga2 = User::factory()->create([
            'name' => 'Dewi Lestari',
            'username' => 'dewi.warga',
            'role' => Roles::WARGA,
            'is_active' => true,
        ]);
    }

    public function test_w_01_warga_can_access_history_from_portal(): void
    {
        $response = $this->actingAs($this->warga1)->get(route('portal.surat.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Portal/Surat/Index'));
    }

    public function test_w_02_warga_can_access_create_form_with_six_types(): void
    {
        $response = $this->actingAs($this->warga1)->get(route('portal.surat.create'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Portal/Surat/Create')
            ->has('jenisOptions', 6)
        );
    }

    public function test_w_03_validation_fails_for_invalid_nik_or_missing_fields(): void
    {
        $response = $this->actingAs($this->warga1)->post(route('portal.surat.store'), [
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'nama' => 'Kiming Yuliadi',
            'nik' => '12345', // invalid, must be 16 digits
            'tempat_lahir' => '',
            'tanggal_lahir' => '',
            'pekerjaan' => '',
            'alamat' => '',
            'alasan_keperluan' => '',
        ]);

        $response->assertSessionHasErrors(['nik', 'tempat_lahir', 'tanggal_lahir', 'pekerjaan', 'alamat', 'alasan_keperluan']);
        $this->assertDatabaseCount('pengajuan_surat', 0);
    }

    public function test_w_04_and_w_05_warga_submits_application_generates_tracking_number_and_status_diajukan(): void
    {
        $payload = [
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'nama' => 'Kiming Yuliadi',
            'nik' => '3276012408890003',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1989-04-24',
            'jenis_kelamin' => 'Laki-laki',
            'pekerjaan' => 'Karyawan Swasta',
            'status_perkawinan' => 'Kawin',
            'agama' => 'Islam',
            'alamat' => 'Jl. Dahlia Raya Blok C4 No. 12, RT 01 / RW 08',
            'alasan_keperluan' => 'Pembukaan rekening payroll bank',
        ];

        $response = $this->actingAs($this->warga1)->post(route('portal.surat.store'), $payload);
        $response->assertRedirect(route('portal.surat.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('pengajuan_surat', [
            'pemohon_id' => $this->warga1->id,
            'created_by' => $this->warga1->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'status' => LetterStatus::DIAJUKAN,
        ]);

        $letter = PengajuanSurat::first();
        $this->assertNotNull($letter);
        $this->assertMatchesRegularExpression('/^SRT-\d{4}-\d{3}$/', $letter->nomor);
        $this->assertNull($letter->nomor_surat); // Belum ada nomor resmi sebelum Terbit
        $this->assertNull($letter->pdf_path); // Belum ada PDF sebelum Terbit

        $this->assertDatabaseHas('pengajuan_surat_histories', [
            'pengajuan_surat_id' => $letter->id,
            'status' => LetterStatus::DIAJUKAN,
            'actor_id' => $this->warga1->id,
        ]);
    }

    public function test_w_06_warga_cannot_view_or_download_another_wargas_letter(): void
    {
        $letterWarga1 = PengajuanSurat::create([
            'nomor' => 'SRT-2026-001',
            'pemohon_id' => $this->warga1->id,
            'created_by' => $this->warga1->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'keperluan' => 'Pribadi',
            'status' => LetterStatus::DIAJUKAN,
        ]);

        // Warga 2 tries to view Warga 1's detail
        $responseShow = $this->actingAs($this->warga2)->get(route('portal.surat.show', $letterWarga1));
        $responseShow->assertForbidden();

        // Warga 2 tries to access PDF
        $responsePdf = $this->actingAs($this->warga2)->get(route('portal.surat.pdf.preview', $letterWarga1));
        $responsePdf->assertForbidden();

        $responseDownload = $this->actingAs($this->warga2)->get(route('portal.surat.pdf.download', $letterWarga1));
        $responseDownload->assertForbidden();
    }

    public function test_p_02_pdf_access_is_forbidden_while_diajukan(): void
    {
        $letter = PengajuanSurat::create([
            'nomor' => 'SRT-2026-001',
            'pemohon_id' => $this->warga1->id,
            'created_by' => $this->warga1->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'keperluan' => 'Pribadi',
            'status' => LetterStatus::DIAJUKAN,
        ]);

        $responsePreview = $this->actingAs($this->warga1)->get(route('portal.surat.pdf.preview', $letter));
        $responsePreview->assertForbidden();

        $responseDownload = $this->actingAs($this->warga1)->get(route('portal.surat.pdf.download', $letter));
        $responseDownload->assertForbidden();
    }

    public function test_a_02_ketua_rt_verifies_surat_keterangan_issues_official_number_and_generates_pdf(): void
    {
        $letter = PengajuanSurat::create([
            'nomor' => 'SRT-2026-001',
            'pemohon_id' => $this->warga1->id,
            'created_by' => $this->warga1->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'keperluan' => 'Pembukaan rekening bank',
            'data_surat' => [
                'nama' => 'Kiming Yuliadi',
                'nik' => '3276012408890003',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '1989-04-24',
                'jenis_kelamin' => 'Laki-laki',
                'pekerjaan' => 'Karyawan Swasta',
                'status_perkawinan' => 'Kawin',
                'agama' => 'Islam',
                'alamat' => 'Jl. Dahlia Raya',
                'alasan_keperluan' => 'Pembukaan rekening bank',
            ],
            'status' => LetterStatus::DIAJUKAN,
        ]);

        // Sekretaris attempts verification -> Forbidden
        $responseSekretaris = $this->actingAs($this->sekretaris)->post(route('admin.surat.verify', $letter));
        $responseSekretaris->assertForbidden();

        // Ketua RT verifies -> Success, status becomes Terbit, official number created
        $responseRt = $this->actingAs($this->adminRt)->post(route('admin.surat.verify', $letter));
        $responseRt->assertRedirect(route('admin.surat.show', $letter));

        $letter->refresh();
        $this->assertEquals(LetterStatus::TERBIT, $letter->status);
        $this->assertNotNull($letter->nomor_surat);
        $this->assertMatchesRegularExpression('/^\d+\/RT01\/\d{2}\/\d{2}\/\d{2}$/', $letter->nomor_surat);
        $this->assertNotNull($letter->pdf_path);
        Storage::disk('local')->assertExists($letter->pdf_path);
        $this->assertEquals($this->adminRt->id, $letter->verified_by);
        $this->assertNotNull($letter->issued_at);
    }

    public function test_surat_pernyataan_does_not_consume_official_number_sequence(): void
    {
        // 1. First letter: Surat Keterangan (should get seq 1)
        $ket1 = PengajuanSurat::create([
            'nomor' => 'SRT-2026-001',
            'pemohon_id' => $this->warga1->id,
            'created_by' => $this->warga1->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'keperluan' => 'Domisili',
            'data_surat' => ['nama' => 'Kiming Yuliadi'],
            'status' => LetterStatus::DIAJUKAN,
        ]);
        $this->actingAs($this->adminRt)->post(route('admin.surat.verify', $ket1));
        $ket1->refresh();
        $this->assertStringStartsWith('1/RT01/', $ket1->nomor_surat);

        // 2. Second letter: Surat Pernyataan Belum Menikah (MUST NOT have official number!)
        $pernyataan = PengajuanSurat::create([
            'nomor' => 'SRT-2026-002',
            'pemohon_id' => $this->warga1->id,
            'created_by' => $this->warga1->id,
            'jenis_surat' => LetterType::BELUM_MENIKAH,
            'keperluan' => 'Pernyataan Belum Menikah',
            'data_surat' => ['nama' => 'Kiming Yuliadi', 'status_perkawinan' => 'Belum Kawin'],
            'status' => LetterStatus::DIAJUKAN,
        ]);
        $this->actingAs($this->adminRt)->post(route('admin.surat.verify', $pernyataan));
        $pernyataan->refresh();
        $this->assertEquals(LetterStatus::TERBIT, $pernyataan->status);
        $this->assertNull($pernyataan->nomor_surat); // Must be NULL!
        $this->assertNotNull($pernyataan->pdf_path); // But PDF is generated!

        // 3. Third letter: Surat Keterangan Kematian (should get seq 2, not 3!)
        $ket2 = PengajuanSurat::create([
            'nomor' => 'SRT-2026-003',
            'pemohon_id' => $this->warga2->id,
            'created_by' => $this->warga2->id,
            'jenis_surat' => LetterType::KEMATIAN,
            'keperluan' => 'Kematian',
            'data_surat' => ['nama' => 'Almarhum Budi'],
            'status' => LetterStatus::DIAJUKAN,
        ]);
        $this->actingAs($this->adminRt)->post(route('admin.surat.verify', $ket2));
        $ket2->refresh();
        $this->assertStringStartsWith('2/RT01/', $ket2->nomor_surat);
    }

    public function test_p_01_warga_can_preview_and_download_when_terbit(): void
    {
        $letter = PengajuanSurat::create([
            'nomor' => 'SRT-2026-001',
            'nomor_surat' => '1/RT01/27/10/26',
            'pemohon_id' => $this->warga1->id,
            'created_by' => $this->warga1->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'keperluan' => 'Administrasi',
            'status' => LetterStatus::DIAJUKAN,
        ]);

        $pdfService = app(LetterPdfService::class);
        $path = $pdfService->generate($letter);
        $letter->update([
            'pdf_path' => $path,
            'status' => LetterStatus::TERBIT,
            'issued_at' => now(),
        ]);

        $resPreview = $this->actingAs($this->warga1)->get(route('portal.surat.pdf.preview', $letter));
        $resPreview->assertOk();
        $this->assertStringContainsString('application/pdf', $resPreview->headers->get('Content-Type'));

        $resDownload = $this->actingAs($this->warga1)->get(route('portal.surat.pdf.download', $letter));
        $resDownload->assertOk();
        $this->assertStringContainsString('attachment', $resDownload->headers->get('Content-Disposition'));
    }

    public function test_s_01_to_s_05_endorsement_workflow_and_pdf_lockout(): void
    {
        $letter = PengajuanSurat::create([
            'nomor' => 'SRT-2026-001',
            'nomor_surat' => '1/RT01/27/10/26',
            'pemohon_id' => $this->warga1->id,
            'created_by' => $this->warga1->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'keperluan' => 'Administrasi',
            'status' => LetterStatus::TERBIT,
            'issued_at' => now(),
        ]);
        $pdfService = app(LetterPdfService::class);
        $letter->update(['pdf_path' => $pdfService->generate($letter)]);

        // 1. RT endorses first -> status becomes selesai_rt
        $resRt = $this->actingAs($this->adminRt)->post(route('admin.surat.confirm-rt', $letter));
        $resRt->assertRedirect(route('admin.surat.show', $letter));
        $letter->refresh();
        $this->assertEquals(LetterStatus::SELESAI_RT, $letter->status);
        $this->assertNotNull($letter->rt_confirmed_at);

        // PDF is now LOCKED (403)
        $resPdfLocked = $this->actingAs($this->warga1)->get(route('portal.surat.pdf.preview', $letter));
        $resPdfLocked->assertForbidden();

        // 2. RW endorses via Sekretaris -> status becomes selesai
        $resRw = $this->actingAs($this->sekretaris)->post(route('admin.surat.confirm-rw', $letter));
        $resRw->assertRedirect(route('admin.surat.show', $letter));
        $letter->refresh();
        $this->assertEquals(LetterStatus::SELESAI, $letter->status);
        $this->assertNotNull($letter->rw_confirmed_at);
        $this->assertNotNull($letter->completed_at);

        // 3. Duplicate confirmation is rejected
        $this->actingAs($this->sekretaris)->post(route('admin.surat.confirm-rw', $letter))
            ->assertSessionHasErrors(['status']);
    }
}
