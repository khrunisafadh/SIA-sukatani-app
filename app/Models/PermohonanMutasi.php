<?php

namespace App\Models;

use App\Support\MutasiStatus;
use App\Support\MutasiType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class PermohonanMutasi extends Model
{
    protected $table = 'permohonan_mutasi';

    protected $fillable = [
        'nomor_tiket',
        'user_id',
        'warga_id',
        'jenis_mutasi',
        'nama_pemohon',
        'nik_pemohon',
        'no_kk',
        'telepon',
        'tanggal_rencana',
        'alamat_asal',
        'alamat_tujuan',
        'unit_rumah_id',
        'unit_rumah_custom',
        'status_tinggal',
        'nama_pemilik_rumah',
        'rincian_pengikut',
        'status',
        'checklist_alamat',
        'checklist_nik',
        'checklist_dokumen',
        'catatan_pemeriksaan',
        'alasan_revisi',
        'diverifikasi_oleh',
        'diverifikasi_pada',
        'last_activity_at',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_rencana' => 'date',
            'rincian_pengikut' => 'array',
            'checklist_alamat' => 'boolean',
            'checklist_nik' => 'boolean',
            'checklist_dokumen' => 'boolean',
            'diverifikasi_pada' => 'datetime',
            'last_activity_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function warga(): BelongsTo
    {
        return $this->belongsTo(Warga::class);
    }

    public function unitRumah(): BelongsTo
    {
        return $this->belongsTo(UnitRumah::class, 'unit_rumah_id');
    }

    public function dokumen(): HasMany
    {
        return $this->hasMany(DokumenMutasi::class, 'permohonan_mutasi_id');
    }

    public function diverifikasiOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }

    public function statusLabel(): string
    {
        return MutasiStatus::label($this->status);
    }

    public function jenisLabel(): string
    {
        return MutasiType::label($this->jenis_mutasi);
    }

    public function maskedNik(): string
    {
        if (strlen((string) $this->nik_pemohon) !== 16) {
            return (string) $this->nik_pemohon;
        }

        return substr($this->nik_pemohon, 0, 8).'****'.substr($this->nik_pemohon, -4);
    }

    public function checklistPassedCount(): int
    {
        $count = 0;
        if ($this->checklist_alamat) $count++;
        if ($this->checklist_nik) $count++;
        if ($this->checklist_dokumen) $count++;

        return $count;
    }

    public function allChecklistsPassed(): bool
    {
        return $this->checklist_alamat && $this->checklist_nik && $this->checklist_dokumen;
    }

    public static function generateNomorTiket(?\DateTimeInterface $date = null): string
    {
        $date = $date ? Carbon::instance($date) : Carbon::now();
        $prefix = 'PD-'.$date->format('Y-md').'-';

        $latest = static::query()
            ->where('nomor_tiket', 'like', "{$prefix}%")
            ->orderByDesc('nomor_tiket')
            ->first();

        $seq = 1;
        if ($latest) {
            $parts = explode('-', (string) $latest->nomor_tiket);
            $lastNum = (int) end($parts);
            $seq = $lastNum + 1;
        }

        do {
            $ticket = sprintf('%s%02d', $prefix, $seq);
            if (! static::query()->where('nomor_tiket', $ticket)->exists()) {
                return $ticket;
            }
            $seq++;
        } while (true);
    }
}
