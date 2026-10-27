<?php

namespace Tests\Feature;

use App\Models\PengajuanSurat;
use App\Models\User;
use App\Services\LetterPdfService;
use App\Support\LetterStatus;
use App\Support\LetterType;
use App\Support\Roles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminLetterAndRoleTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $sekretaris;
    private User $bendahara;
    private User $warga;

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
            'last_activity_at' => now(),
        ]);

        $this->sekretaris = User::factory()->create([
            'name' => 'Siti Aminah',
            'username' => 'sekretaris01',
            'email' => 'sekretaris@sukatani.test',
            'role' => Roles::SEKRETARIS,
            'is_active' => true,
            'email_verified_at' => now(),
            'last_activity_at' => now(),
        ]);

        $this->bendahara = User::factory()->create([
            'name' => 'Ahmad Dahlan',
            'username' => 'bendahara01',
            'email' => 'bendahara@sukatani.test',
            'role' => Roles::BENDAHARA,
            'is_active' => true,
            'email_verified_at' => now(),
            'last_activity_at' => now(),
        ]);

        $this->warga = User::factory()->create([
            'name' => 'Rudi Hermawan',
            'username' => 'rudi.warga',
            'email' => 'rudi@sukatani.test',
            'role' => Roles::WARGA,
            'is_active' => true,
            'email_verified_at' => now(),
            'last_activity_at' => now(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MODULE 3: PENGAJUAN SURAT TESTS
    |--------------------------------------------------------------------------
    */

    public function test_admin_and_sekretaris_can_view_letter_list_while_others_are_forbidden(): void
    {
        PengajuanSurat::factory()->create([
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'jenis_surat' => LetterType::PENGANTAR,
            'status' => LetterStatus::TERBIT,
        ]);

        $responseAdmin = $this->actingAs($this->admin)->get(route('admin.surat.index'));
        $responseAdmin->assertOk();
        $responseAdmin->assertInertia(fn ($page) => $page->component('Admin/Surat/Index'));

        $responseSekretaris = $this->actingAs($this->sekretaris)->get(route('admin.surat.index'));
        $responseSekretaris->assertOk();

        $responseBendahara = $this->actingAs($this->bendahara)->get(route('admin.surat.index'));
        $responseBendahara->assertForbidden();

        $responseWarga = $this->actingAs($this->warga)->get(route('admin.surat.index'));
        $responseWarga->assertForbidden();
    }

    public function test_letter_list_can_be_filtered_by_query_search_and_letter_type_and_status(): void
    {
        $letter1 = PengajuanSurat::factory()->create([
            'nomor' => 'SRT-2026-001',
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'jenis_surat' => LetterType::PENGANTAR,
            'status' => LetterStatus::TERBIT,
        ]);

        $warga2 = User::factory()->create([
            'name' => 'Dewi Lestari',
            'username' => 'dewi.lestari',
            'role' => Roles::WARGA,
        ]);

        $letter2 = PengajuanSurat::factory()->create([
            'nomor' => 'SRT-2026-002',
            'pemohon_id' => $warga2->id,
            'created_by' => $this->admin->id,
            'jenis_surat' => LetterType::DOMISILI,
            'status' => LetterStatus::SELESAI,
        ]);

        // Search by nomor
        $resNomor = $this->actingAs($this->admin)->get(route('admin.surat.index', ['q' => 'SRT-2026-001']));
        $resNomor->assertOk();
        $resNomor->assertInertia(fn ($page) => $page
            ->has('letters.data', 1)
            ->where('letters.data.0.nomor', 'SRT-2026-001')
        );

        // Search by applicant name
        $resName = $this->actingAs($this->admin)->get(route('admin.surat.index', ['q' => 'Dewi']));
        $resName->assertOk();
        $resName->assertInertia(fn ($page) => $page
            ->has('letters.data', 1)
            ->where('letters.data.0.nomor', 'SRT-2026-002')
        );

        // Filter by jenis
        $resJenis = $this->actingAs($this->admin)->get(route('admin.surat.index', ['jenis' => LetterType::DOMISILI]));
        $resJenis->assertOk();
        $resJenis->assertInertia(fn ($page) => $page
            ->has('letters.data', 1)
            ->where('letters.data.0.jenis', LetterType::DOMISILI)
        );

        // Filter by status
        $resStatus = $this->actingAs($this->admin)->get(route('admin.surat.index', ['status' => LetterStatus::SELESAI]));
        $resStatus->assertOk();
        $resStatus->assertInertia(fn ($page) => $page
            ->has('letters.data', 1)
            ->where('letters.data.0.status', LetterStatus::SELESAI)
        );
    }

    public function test_admin_cannot_access_create_letter_form_as_it_is_warga_only(): void
    {
        $responseAdmin = $this->actingAs($this->admin)->get('/admin/pengajuan-surat/buat');
        $this->assertTrue(in_array($responseAdmin->status(), [403, 404], true));

        $responseSekretaris = $this->actingAs($this->sekretaris)->get('/admin/pengajuan-surat/buat');
        $this->assertTrue(in_array($responseSekretaris->status(), [403, 404], true));
    }

    public function test_admin_cannot_create_letter_via_old_endpoint_and_ketua_rt_verifies_warga_submission(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/pengajuan-surat', [
            'pemohon_id' => $this->warga->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'keperluan' => 'Pengurusan Surat',
        ]);
        $this->assertTrue(in_array($response->status(), [403, 404, 405], true));

        // Pengajuan oleh Warga, verifikasi oleh Ketua RT
        $letter = PengajuanSurat::create([
            'nomor' => 'SRT-2026-001',
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->warga->id,
            'jenis_surat' => LetterType::TEMPAT_TINGGAL,
            'keperluan' => 'Pengurusan Surat Nikah di KUA',
            'data_surat' => [
                'nama' => 'Rudi Hermawan',
                'nik' => '3276010000000001',
                'alamat' => 'RT 01',
                'alasan_keperluan' => 'Pengurusan Surat Nikah di KUA',
            ],
            'status' => LetterStatus::DIAJUKAN,
        ]);

        $resVerify = $this->actingAs($this->admin)->post(route('admin.surat.verify', $letter));
        $resVerify->assertRedirect(route('admin.surat.show', $letter));

        $letter->refresh();
        $this->assertEquals(LetterStatus::TERBIT, $letter->status);
        $this->assertNotNull($letter->nomor_surat);
        $this->assertNotNull($letter->pdf_path);
        Storage::disk('local')->assertExists($letter->pdf_path);

        $this->assertDatabaseHas('pengajuan_surat_histories', [
            'pengajuan_surat_id' => $letter->id,
            'status' => LetterStatus::TERBIT,
            'actor_id' => $this->admin->id,
        ]);
    }

    public function test_create_letter_validation_fails_for_missing_fields_or_non_warga_applicant(): void
    {
        $response = $this->actingAs($this->warga)->post(route('portal.surat.store'), [
            'jenis_surat' => '',
            'nama' => '',
        ]);

        $response->assertSessionHasErrors(['jenis_surat', 'nama']);
    }

    public function test_pdf_preview_and_download_return_binary_pdf_response_when_terbit(): void
    {
        $letter = PengajuanSurat::factory()->create([
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'jenis_surat' => LetterType::PENGANTAR,
            'status' => LetterStatus::DIAJUKAN,
        ]);

        $pdfService = app(LetterPdfService::class);
        $path = $pdfService->generate($letter);
        $letter->update([
            'pdf_path' => $path,
            'status' => LetterStatus::TERBIT,
            'issued_at' => now(),
        ]);

        // Preview (inline)
        $previewResponse = $this->actingAs($this->admin)->get(route('admin.surat.pdf.preview', $letter));
        $previewResponse->assertOk();
        $this->assertStringContainsString('application/pdf', $previewResponse->headers->get('Content-Type'));
        $this->assertStringContainsString('inline', $previewResponse->headers->get('Content-Disposition'));

        // Download (attachment)
        $downloadResponse = $this->actingAs($this->admin)->get(route('admin.surat.pdf.download', $letter));
        $downloadResponse->assertOk();
        $this->assertStringContainsString('application/pdf', $downloadResponse->headers->get('Content-Type'));
        $this->assertStringContainsString('attachment', $downloadResponse->headers->get('Content-Disposition'));
        $this->assertStringContainsString($letter->downloadFilename(), $downloadResponse->headers->get('Content-Disposition'));
    }

    public function test_pdf_preview_and_download_return_404_when_pdf_is_not_available(): void
    {
        $letter = PengajuanSurat::factory()->create([
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'status' => LetterStatus::DIAJUKAN,
            'pdf_path' => null,
        ]);

        $responsePreview = $this->actingAs($this->admin)->get(route('admin.surat.pdf.preview', $letter));
        $responsePreview->assertNotFound();

        $responseDownload = $this->actingAs($this->admin)->get(route('admin.surat.pdf.download', $letter));
        $responseDownload->assertNotFound();
    }

    public function test_physical_endorsement_confirmation_transitions_status_to_selesai(): void
    {
        $letter = PengajuanSurat::factory()->create([
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'jenis_surat' => LetterType::PENGANTAR,
            'status' => LetterStatus::DIAJUKAN,
            'last_activity_at' => now()->subDay(),
        ]);

        $path = app(LetterPdfService::class)->generate($letter);
        $letter->update([
            'pdf_path' => $path,
            'status' => LetterStatus::TERBIT,
            'issued_at' => now(),
        ]);

        // RT confirms -> status becomes selesai_rt
        $response = $this->actingAs($this->sekretaris)->post(route('admin.surat.confirm', $letter));
        $response->assertRedirect(route('admin.surat.show', $letter));
        $response->assertSessionHas('success');

        $letter->refresh();
        $this->assertEquals(LetterStatus::SELESAI_RT, $letter->status);
        $this->assertNotNull($letter->rt_confirmed_at);

        // RW confirms -> status becomes selesai
        $resRw = $this->actingAs($this->sekretaris)->post(route('admin.surat.confirm-rw', $letter));
        $resRw->assertRedirect(route('admin.surat.show', $letter));

        $letter->refresh();
        $this->assertEquals(LetterStatus::SELESAI, $letter->status);
        $this->assertEquals($this->sekretaris->id, $letter->completed_by);
        $this->assertNotNull($letter->completed_at);

        $this->assertDatabaseHas('pengajuan_surat_histories', [
            'pengajuan_surat_id' => $letter->id,
            'status' => LetterStatus::SELESAI,
            'actor_id' => $this->sekretaris->id,
        ]);
    }

    public function test_cannot_confirm_endorsement_if_status_is_not_terbit(): void
    {
        $letter = PengajuanSurat::factory()->create([
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'status' => LetterStatus::DIAJUKAN,
            'pdf_path' => null,
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.surat.confirm', $letter));
        $response->assertSessionHasErrors(['status']);

        $letter->refresh();
        $this->assertEquals(LetterStatus::DIAJUKAN, $letter->status);
    }

    public function test_after_physical_endorsement_draft_pdf_access_is_forbidden_both_preview_and_download(): void
    {
        $letter = PengajuanSurat::factory()->create([
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'jenis_surat' => LetterType::PENGANTAR,
            'status' => LetterStatus::DIAJUKAN,
        ]);

        $path = app(LetterPdfService::class)->generate($letter);
        $letter->update([
            'pdf_path' => $path,
            'status' => LetterStatus::SELESAI,
            'completed_at' => now(),
            'completed_by' => $this->admin->id,
        ]);

        $previewResponse = $this->actingAs($this->admin)->get(route('admin.surat.pdf.preview', $letter));
        $previewResponse->assertForbidden();

        $downloadResponse = $this->actingAs($this->admin)->get(route('admin.surat.pdf.download', $letter));
        $downloadResponse->assertForbidden();

        // Details page still accessible
        $showResponse = $this->actingAs($this->admin)->get(route('admin.surat.show', $letter));
        $showResponse->assertOk();
        $showResponse->assertInertia(fn ($page) => $page
            ->where('letter.pdf_locked', true)
            ->where('letter.can_preview', false)
            ->where('letter.can_download', false)
        );
    }

    public function test_updated_letter_moves_to_the_top_of_list_based_on_latest_activity(): void
    {
        $olderLetter = PengajuanSurat::factory()->create([
            'nomor' => 'SRT-2026-001',
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'status' => LetterStatus::TERBIT,
            'last_activity_at' => now()->subHours(2),
        ]);

        $newerLetter = PengajuanSurat::factory()->create([
            'nomor' => 'SRT-2026-002',
            'pemohon_id' => $this->warga->id,
            'created_by' => $this->admin->id,
            'status' => LetterStatus::TERBIT,
            'last_activity_at' => now()->subHour(),
        ]);

        $path = app(LetterPdfService::class)->generate($olderLetter);
        $olderLetter->update(['pdf_path' => $path]);

        // Older letter is confirmed now -> last_activity_at updated to now()
        $this->actingAs($this->admin)->post(route('admin.surat.confirm', $olderLetter));

        $response = $this->actingAs($this->admin)->get(route('admin.surat.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('letters.data.0.nomor', 'SRT-2026-001')
            ->where('letters.data.1.nomor', 'SRT-2026-002')
        );
    }

    /*
    |--------------------------------------------------------------------------
    | MODULE 4: PENGGUNA & ROLE TESTS
    |--------------------------------------------------------------------------
    */

    public function test_only_admin_can_view_user_list(): void
    {
        $responseAdmin = $this->actingAs($this->admin)->get(route('admin.users.index'));
        $responseAdmin->assertOk();
        $responseAdmin->assertInertia(fn ($page) => $page->component('Admin/Users/Index'));

        $responseSekretaris = $this->actingAs($this->sekretaris)->get(route('admin.users.index'));
        $responseSekretaris->assertForbidden();

        $responseBendahara = $this->actingAs($this->bendahara)->get(route('admin.users.index'));
        $responseBendahara->assertForbidden();

        $responseWarga = $this->actingAs($this->warga)->get(route('admin.users.index'));
        $responseWarga->assertForbidden();
    }

    public function test_admin_can_create_new_user_with_temporary_password_and_mandatory_first_login_change(): void
    {
        $payload = [
            'name' => 'Bambang Supriyanto',
            'username' => 'bambang.s',
            'email' => 'bambang@sukatani.test',
            'role' => Roles::WARGA,
            'password' => 'TempPass123!',
            'password_confirmation' => 'TempPass123!',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.users.store'), $payload);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'name' => 'Bambang Supriyanto',
            'username' => 'bambang.s',
            'email' => 'bambang@sukatani.test',
            'role' => Roles::WARGA,
            'is_active' => true,
            'must_change_password' => true,
        ]);

        $created = User::query()->where('username', 'bambang.s')->first();
        $this->assertNotNull($created);
        $this->assertTrue(Hash::check('TempPass123!', $created->password));
        $this->assertNotEquals('TempPass123!', $created->password);
        $this->assertEquals('Perlu ganti password', $created->statusLabel());
        $this->assertNotNull($created->last_activity_at);

        // Verify newly created user appears at the top of the list
        $listResponse = $this->actingAs($this->admin)->get(route('admin.users.index'));
        $listResponse->assertOk();
        $listResponse->assertInertia(fn ($page) => $page
            ->where('users.data.0.id', $created->id)
            ->where('users.data.0.must_change_password', true)
        );
    }

    public function test_create_user_fails_on_duplicate_username_invalid_role_or_mismatched_password(): void
    {
        // 1. Duplicate username
        $response = $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name' => 'Budi Duplikat',
            'username' => $this->warga->username, // existing username
            'email' => 'budi_unique@sukatani.test',
            'role' => Roles::WARGA,
            'password' => 'TempPass123!',
            'password_confirmation' => 'TempPass123!',
        ]);
        $response->assertSessionHasErrors(['username']);

        // 2. Invalid role
        $responseRole = $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name' => 'Role Tidak Sah',
            'username' => 'role.invalid',
            'email' => 'invalid_role@sukatani.test',
            'role' => 'superadmin', // not one of 4 official roles
            'password' => 'TempPass123!',
            'password_confirmation' => 'TempPass123!',
        ]);
        $responseRole->assertSessionHasErrors(['role']);

        // 3. Password confirmation mismatch
        $responseMismatch = $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name' => 'Mismatch Pass',
            'username' => 'mismatch.pass',
            'email' => 'mismatch@sukatani.test',
            'role' => Roles::WARGA,
            'password' => 'TempPass123!',
            'password_confirmation' => 'DifferentPass123!',
        ]);
        $responseMismatch->assertSessionHasErrors(['password']);

        // 4. Short / weak password
        $responseShort = $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name' => 'Short Pass',
            'username' => 'short.pass',
            'email' => 'short@sukatani.test',
            'role' => Roles::WARGA,
            'password' => '123',
            'password_confirmation' => '123',
        ]);
        $responseShort->assertSessionHasErrors(['password']);
    }

    public function test_non_admin_cannot_create_user(): void
    {
        $payload = [
            'name' => 'Unauthorized User',
            'username' => 'unauthorized.u',
            'email' => 'unauthorized@sukatani.test',
            'role' => Roles::WARGA,
            'password' => 'TempPass123!',
            'password_confirmation' => 'TempPass123!',
        ];

        $responseSekretaris = $this->actingAs($this->sekretaris)->post(route('admin.users.store'), $payload);
        $responseSekretaris->assertForbidden();

        $responseBendahara = $this->actingAs($this->bendahara)->post(route('admin.users.store'), $payload);
        $responseBendahara->assertForbidden();

        $responseWarga = $this->actingAs($this->warga)->post(route('admin.users.store'), $payload);
        $responseWarga->assertForbidden();
    }

    public function test_user_with_temporary_password_authenticates_and_redirects_to_first_login_screen(): void
    {
        $temporaryUser = User::factory()->create([
            'username' => 'temp.citizen',
            'email' => 'temp.citizen@sukatani.test',
            'password' => Hash::make('InitialTempPass123!'),
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $response = $this->post('/login', [
            'login' => 'temp.citizen',
            'password' => 'InitialTempPass123!',
        ]);

        $this->assertAuthenticatedAs($temporaryUser);
        $response->assertRedirect(route('password.first-login'));
    }

    public function test_middleware_blocks_access_to_protected_modules_until_password_is_changed(): void
    {
        $temporaryUser = User::factory()->create([
            'username' => 'temp.pengurus',
            'role' => Roles::SEKRETARIS,
            'must_change_password' => true,
            'is_active' => true,
        ]);

        // Direct web route visits redirect to first-login
        $responseSurat = $this->actingAs($temporaryUser)->get(route('admin.surat.index'));
        $responseSurat->assertRedirect(route('password.first-login'));

        $responseUsers = $this->actingAs($temporaryUser)->get(route('admin.users.index'));
        $responseUsers->assertRedirect(route('password.first-login'));

        $responseDashboard = $this->actingAs($temporaryUser)->get(route('admin.dashboard'));
        $responseDashboard->assertRedirect(route('password.first-login'));

        // Direct JSON requests return 403 JSON
        $responseJson = $this->actingAs($temporaryUser)->getJson(route('admin.surat.index'));
        $responseJson->assertStatus(403);
        $responseJson->assertJsonFragment([
            'message' => 'Anda wajib mengganti password sementara sebelum mengakses sistem.',
        ]);

        // First login password screen is accessible
        $responseFirstLogin = $this->actingAs($temporaryUser)->get(route('password.first-login'));
        $responseFirstLogin->assertOk();
        $responseFirstLogin->assertInertia(fn ($page) => $page->component('Auth/FirstLoginPassword'));

        // Logout is accessible
        $responseLogout = $this->actingAs($temporaryUser)->post(route('logout'));
        $this->assertGuest();
        $responseLogout->assertRedirect('/');
    }

    public function test_first_login_password_change_requires_correct_current_password_and_validation(): void
    {
        $temporaryUser = User::factory()->create([
            'username' => 'change.pw.test',
            'password' => Hash::make('CurrentTemp123!'),
            'must_change_password' => true,
            'is_active' => true,
        ]);

        // 1. Wrong current password
        $responseWrongCurrent = $this->actingAs($temporaryUser)->post(route('password.first-login.update'), [
            'current_password' => 'WrongPassword!',
            'password' => 'NewValidPass123!',
            'password_confirmation' => 'NewValidPass123!',
        ]);
        $responseWrongCurrent->assertSessionHasErrors(['current_password']);

        // 2. Same as current password (different:current_password)
        $responseSame = $this->actingAs($temporaryUser)->post(route('password.first-login.update'), [
            'current_password' => 'CurrentTemp123!',
            'password' => 'CurrentTemp123!',
            'password_confirmation' => 'CurrentTemp123!',
        ]);
        $responseSame->assertSessionHasErrors(['password']);

        // 3. Mismatched confirmation
        $responseMismatch = $this->actingAs($temporaryUser)->post(route('password.first-login.update'), [
            'current_password' => 'CurrentTemp123!',
            'password' => 'NewValidPass123!',
            'password_confirmation' => 'Mismatch123!',
        ]);
        $responseMismatch->assertSessionHasErrors(['password']);
    }

    public function test_user_can_successfully_change_password_on_first_login_and_is_redirected(): void
    {
        // Case A: Pengurus (Sekretaris) redirects to admin.dashboard
        $sekretarisUser = User::factory()->create([
            'username' => 'sekretaris.first',
            'role' => Roles::SEKRETARIS,
            'password' => Hash::make('OldTempPass123!'),
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $responseSekretaris = $this->actingAs($sekretarisUser)->post(route('password.first-login.update'), [
            'current_password' => 'OldTempPass123!',
            'password' => 'BrandNewPass2026!',
            'password_confirmation' => 'BrandNewPass2026!',
        ]);

        $responseSekretaris->assertRedirect(route('admin.dashboard'));
        $responseSekretaris->assertSessionHas('success');

        $sekretarisUser->refresh();
        $this->assertFalse($sekretarisUser->must_change_password);
        $this->assertTrue(Hash::check('BrandNewPass2026!', $sekretarisUser->password));
        $this->assertEquals('Aktif', $sekretarisUser->statusLabel());

        // Now they can access admin.surat.index without redirection
        $responseAllowed = $this->actingAs($sekretarisUser)->get(route('admin.surat.index'));
        $responseAllowed->assertOk();

        // Case B: Warga redirects to portal.dashboard
        $wargaUser = User::factory()->create([
            'username' => 'warga.first',
            'role' => Roles::WARGA,
            'password' => Hash::make('WargaTempPass123!'),
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $responseWarga = $this->actingAs($wargaUser)->post(route('password.first-login.update'), [
            'current_password' => 'WargaTempPass123!',
            'password' => 'WargaNewPass2026!',
            'password_confirmation' => 'WargaNewPass2026!',
        ]);

        $responseWarga->assertRedirect(route('portal.dashboard'));
        $responseWarga->assertSessionHas('success');

        $wargaUser->refresh();
        $this->assertFalse($wargaUser->must_change_password);
        $this->assertTrue(Hash::check('WargaNewPass2026!', $wargaUser->password));
    }

    public function test_user_without_must_change_password_is_redirected_away_from_first_login_screen(): void
    {
        $normalUser = User::factory()->create([
            'role' => Roles::WARGA,
            'must_change_password' => false,
            'is_active' => true,
        ]);

        $response = $this->actingAs($normalUser)->get(route('password.first-login'));
        $response->assertRedirect(route('portal.dashboard'));
    }

    public function test_admin_can_update_user_role(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'Candra Wijaya',
            'username' => 'candra.w',
            'email' => 'candra@sukatani.test',
            'role' => Roles::WARGA,
            'is_active' => true,
            'last_activity_at' => now()->subDays(2),
        ]);

        $response = $this->actingAs($this->admin)->patch(route('admin.users.update-role', $targetUser), [
            'role' => Roles::BENDAHARA,
        ]);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success');

        $targetUser->refresh();
        $this->assertEquals(Roles::BENDAHARA, $targetUser->role);

        // Updated user moves to the top of list
        $listResponse = $this->actingAs($this->admin)->get(route('admin.users.index'));
        $listResponse->assertOk();
        $listResponse->assertInertia(fn ($page) => $page
            ->where('users.data.0.id', $targetUser->id)
        );
    }

    public function test_cannot_demote_or_change_role_of_the_only_active_admin(): void
    {
        // $this->admin is the only Ketua RT created in setUp
        $this->assertEquals(1, User::query()->where('role', Roles::KETUA_RT)->count());

        $response = $this->actingAs($this->admin)->patch(route('admin.users.update-role', $this->admin), [
            'role' => Roles::WARGA,
        ]);

        $response->assertSessionHasErrors(['role']);

        $this->admin->refresh();
        $this->assertEquals(Roles::KETUA_RT, $this->admin->role);
    }

    public function test_admin_can_reset_access_with_new_temporary_password(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'Eko Prasetyo',
            'username' => 'eko.p',
            'email' => 'eko@sukatani.test',
            'role' => Roles::WARGA,
            'password' => Hash::make('OldPassword123!'),
            'must_change_password' => false,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.users.reset-access', $targetUser), [
            'password' => 'NewResetTemp123!',
            'password_confirmation' => 'NewResetTemp123!',
        ]);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success');

        $targetUser->refresh();
        $this->assertTrue($targetUser->must_change_password);
        $this->assertTrue(Hash::check('NewResetTemp123!', $targetUser->password));
        $this->assertEquals('Perlu ganti password', $targetUser->statusLabel());

        // Target user must change password upon next login
        auth()->logout();
        $loginResponse = $this->post('/login', [
            'login' => 'eko.p',
            'password' => 'NewResetTemp123!',
        ]);
        $loginResponse->assertRedirect(route('password.first-login'));
    }

    public function test_reset_access_validates_password_confirmation_and_minimum_length(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'Fajar Nugraha',
            'username' => 'fajar.n',
            'email' => 'fajar@sukatani.test',
            'role' => Roles::WARGA,
            'is_active' => true,
        ]);

        // Mismatched confirmation
        $responseMismatch = $this->actingAs($this->admin)->post(route('admin.users.reset-access', $targetUser), [
            'password' => 'ValidPassword123!',
            'password_confirmation' => 'Different123!',
        ]);
        $responseMismatch->assertSessionHasErrors(['password']);

        // Empty password
        $responseEmpty = $this->actingAs($this->admin)->post(route('admin.users.reset-access', $targetUser), [
            'password' => '',
            'password_confirmation' => '',
        ]);
        $responseEmpty->assertSessionHasErrors(['password']);
    }

    public function test_non_admin_cannot_reset_user_access(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'Gilang Pratama',
            'username' => 'gilang.p',
            'email' => 'gilang@sukatani.test',
            'role' => Roles::WARGA,
            'is_active' => true,
        ]);

        $payload = [
            'password' => 'ResetPass123!',
            'password_confirmation' => 'ResetPass123!',
        ];

        $responseSekretaris = $this->actingAs($this->sekretaris)->post(route('admin.users.reset-access', $targetUser), $payload);
        $responseSekretaris->assertForbidden();

        $responseBendahara = $this->actingAs($this->bendahara)->post(route('admin.users.reset-access', $targetUser), $payload);
        $responseBendahara->assertForbidden();

        $responseWarga = $this->actingAs($this->warga)->post(route('admin.users.reset-access', $targetUser), $payload);
        $responseWarga->assertForbidden();
    }

    /*
    |--------------------------------------------------------------------------
    | AUDIT LOGGER INTEGRATION TESTS
    |--------------------------------------------------------------------------
    */

    public function test_audit_logger_gracefully_handles_absence_and_presence_of_audit_logs_table(): void
    {
        // 1. Table does not exist (default in this branch)
        $this->assertFalse(Schema::hasTable('audit_logs'));

        \App\Support\AuditLogger::record($this->admin, 'test.action', User::class, $this->admin->id, [
            'note' => 'no crash test',
        ]);

        // 2. Simulate table existing (when Ghita's module is merged)
        Schema::create('audit_logs', function ($table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->string('action');
            $table->string('subject_type');
            $table->string('subject_id')->nullable();
            $table->text('meta')->nullable();
            $table->timestamps();
        });

        $this->assertTrue(Schema::hasTable('audit_logs'));

        \App\Support\AuditLogger::record($this->admin, 'letter.issued', PengajuanSurat::class, 999, [
            'pemohon_id' => 1,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'letter.issued',
            'subject_type' => PengajuanSurat::class,
            'subject_id' => 999,
        ]);

        Schema::dropIfExists('audit_logs');
    }
}
