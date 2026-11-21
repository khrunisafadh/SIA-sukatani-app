<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditTrailTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $sekretaris;
    protected User $bendahara;
    protected User $warga;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'ketua_rt',
            'username' => 'ketua_test',
        ]);

        $this->sekretaris = User::factory()->create([
            'role' => 'sekretaris',
            'username' => 'sekretaris_test',
        ]);

        $this->bendahara = User::factory()->create([
            'role' => 'bendahara',
            'username' => 'bendahara_test',
        ]);

        $this->warga = User::factory()->create([
            'role' => 'warga',
            'username' => 'warga_test',
        ]);
    }

    public function test_audit_trail_index_accessible_by_ketua_rt(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.audit-trail.index'));

        $response->assertOk();
    }

    public function test_audit_trail_forbidden_for_other_roles(): void
    {
        // Sekretaris forbidden
        $this->actingAs($this->sekretaris)
            ->get(route('admin.audit-trail.index'))
            ->assertForbidden();

        // Bendahara forbidden
        $this->actingAs($this->bendahara)
            ->get(route('admin.audit-trail.index'))
            ->assertForbidden();

        // Warga forbidden
        $this->actingAs($this->warga)
            ->get(route('admin.audit-trail.index'))
            ->assertForbidden();

        // Guest redirected to login
        auth()->logout();
        $this->get(route('admin.audit-trail.index'))
            ->assertRedirect(route('login'));
    }

    public function test_audit_trail_show_detail_json(): void
    {
        $log = AuditLog::create([
            'user_id' => $this->admin->id,
            'action' => 'warga.create',
            'subject_type' => 'App\Models\Warga',
            'subject_id' => '1',
            'ip_address' => '192.168.1.1',
            'meta' => [
                'nama' => 'Budi Pratama',
                'description' => 'Test tambah warga',
            ],
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.audit-trail.show', $log->id));

        $response->assertOk();
        $response->assertJsonStructure([
            'log' => [
                'id',
                'user',
                'action_label',
                'module_label',
                'object_name',
                'network',
                'security',
                'payload',
            ],
        ]);
    }

    public function test_audit_trail_export_csv(): void
    {
        AuditLog::create([
            'user_id' => $this->admin->id,
            'action' => 'warga.update',
            'subject_type' => 'App\Models\Warga',
            'subject_id' => '2',
            'ip_address' => '192.168.1.1',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.audit-trail.export.csv'));

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }

    public function test_audit_trail_export_pdf(): void
    {
        AuditLog::create([
            'user_id' => $this->admin->id,
            'action' => 'warga.delete',
            'subject_type' => 'App\Models\Warga',
            'subject_id' => '3',
            'ip_address' => '192.168.1.1',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.audit-trail.export.pdf'));

        $response->assertOk();
    }
}
