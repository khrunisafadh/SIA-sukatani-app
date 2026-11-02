<?php

namespace Tests\Feature\Bendahara;

use App\Models\TransaksiKas;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BendaharaKasTest extends TestCase
{
    use RefreshDatabase;

    protected User $bendaharaUser;
    protected User $wargaUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bendaharaUser = User::factory()->create([
            'username' => 'bendahara.rt01',
            'name' => 'Ahmad Fauzi',
            'email' => 'bendahara@sukatani.id',
            'role' => 'bendahara',
            'password' => bcrypt('password123'),
        ]);

        $this->wargaUser = User::factory()->create([
            'username' => 'warga.test',
            'name' => 'Warga Test',
            'email' => 'warga@sukatani.id',
            'role' => 'warga',
        ]);
    }

    public function test_landing_page_renders_with_kas_data(): void
    {
        TransaksiKas::create([
            'periode' => 'Januari–Juni 2025',
            'tanggal' => '2025-06-10',
            'keterangan' => 'Iuran warga test',
            'kategori' => 'Iuran Warga',
            'jenis' => 'pemasukan',
            'nominal' => 2000000,
        ]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('Welcome')
                ->has('kasData')
                ->where('kasData.summary.totalPemasukan', 2000000)
                ->where('kasData.summary.saldoAkhir', 2000000)
        );
    }

    public function test_bendahara_can_login_and_redirects_to_bendahara_dashboard(): void
    {
        $response = $this->post(route('login'), [
            'login' => 'bendahara.rt01',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('bendahara.dashboard'));
        $this->assertAuthenticatedAs($this->bendaharaUser);
    }

    public function test_bendahara_can_view_dashboard(): void
    {
        TransaksiKas::create([
            'periode' => 'Januari–Juni 2025',
            'tanggal' => '2025-03-15',
            'keterangan' => 'Iuran Maret',
            'kategori' => 'Iuran Warga',
            'jenis' => 'pemasukan',
            'nominal' => 1500000,
        ]);

        $response = $this->actingAs($this->bendaharaUser)->get(route('bendahara.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('Bendahara/Dashboard')
                ->has('summary')
                ->has('monthlyFlow')
                ->has('transactions', 1)
        );
    }

    public function test_bendahara_can_store_new_transaction_and_it_syncs_to_kas(): void
    {
        $response = $this->actingAs($this->bendaharaUser)->post(route('bendahara.transaksi.store'), [
            'periode' => 'Januari–Juni 2025',
            'tanggal' => '2025-06-20',
            'keterangan' => 'Pengadaan cermin cembung tikungan',
            'kategori' => 'Perawatan Fasilitas',
            'jenis' => 'pengeluaran',
            'nominal' => 450000,
            'catatan' => 'Kuitansi toko material No. 892',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('transaksi_kas', [
            'keterangan' => 'Pengadaan cermin cembung tikungan',
            'nominal' => 450000,
            'jenis' => 'pengeluaran',
            'created_by' => $this->bendaharaUser->id,
        ]);

        // Verifikasi langsung terhubung ke landing page
        $landingResponse = $this->get('/');
        $landingResponse->assertInertia(fn ($page) =>
            $page->component('Welcome')
                ->where('kasData.summary.totalPengeluaran', 450000)
        );
    }

    public function test_bendahara_can_delete_transaction(): void
    {
        $tx = TransaksiKas::create([
            'periode' => 'Januari–Juni 2025',
            'tanggal' => '2025-06-12',
            'keterangan' => 'Transaksi salah catat',
            'kategori' => 'Lainnya',
            'jenis' => 'pengeluaran',
            'nominal' => 100000,
            'created_by' => $this->bendaharaUser->id,
        ]);

        $response = $this->actingAs($this->bendaharaUser)->delete(route('bendahara.transaksi.destroy', $tx->id));

        $response->assertRedirect();
        $this->assertDatabaseMissing('transaksi_kas', [
            'id' => $tx->id,
        ]);
    }

    public function test_warga_cannot_access_bendahara_dashboard(): void
    {
        $response = $this->actingAs($this->wargaUser)->get(route('bendahara.dashboard'));

        $response->assertForbidden();
    }
}
