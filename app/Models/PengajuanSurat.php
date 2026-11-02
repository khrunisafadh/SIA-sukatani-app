<?php

namespace App\Models;

use App\Support\LetterStatus;
use App\Support\LetterType;
use Carbon\CarbonInterface;
use Database\Factories\PengajuanSuratFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PengajuanSurat extends Model
{
    /** @use HasFactory<PengajuanSuratFactory> */
    use HasFactory;

    protected $table = 'pengajuan_surat';

    protected $fillable = [
        'nomor',
        'nomor_surat',
        'pemohon_id',
        'created_by',
        'jenis_surat',
        'keperluan',
        'keterangan',
        'data_surat',
        'status',
        'pdf_path',
        'verified_by',
        'verified_at',
        'issued_at',
        'rt_confirmed_by',
        'rt_confirmed_at',
        'rw_confirmed_by',
        'rw_confirmed_at',
        'completed_at',
        'completed_by',
        'last_activity_at',
    ];

    protected function casts(): array
    {
        return [
            'data_surat' => 'array',
            'verified_at' => 'datetime',
            'issued_at' => 'datetime',
            'rt_confirmed_at' => 'datetime',
            'rw_confirmed_at' => 'datetime',
            'completed_at' => 'datetime',
            'last_activity_at' => 'datetime',
        ];
    }

    public function pemohon(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pemohon_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function rtConfirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rt_confirmed_by');
    }

    public function rwConfirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rw_confirmed_by');
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(PengajuanSuratHistory::class, 'pengajuan_surat_id')->orderBy('created_at');
    }

    public function isDiajukan(): bool
    {
        return $this->status === LetterStatus::DIAJUKAN;
    }

    public function isIssued(): bool
    {
        return $this->status === LetterStatus::TERBIT && filled($this->pdf_path);
    }

    public function isSelesaiRt(): bool
    {
        return $this->status === LetterStatus::SELESAI_RT;
    }

    public function isCompleted(): bool
    {
        return $this->status === LetterStatus::SELESAI;
    }

    public function draftPdfAccessible(): bool
    {
        return $this->status === LetterStatus::TERBIT && filled($this->pdf_path);
    }

    public function jenisLabel(): string
    {
        return LetterType::label($this->jenis_surat);
    }

    public function statusLabel(): string
    {
        return LetterStatus::label($this->status);
    }

    public function needsOfficialNumber(): bool
    {
        return LetterType::needsOfficialNumber($this->jenis_surat);
    }

    public function hasKop(): bool
    {
        return LetterType::hasKop($this->jenis_surat);
    }

    public function downloadFilename(): string
    {
        $prefix = LetterType::filenamePrefix($this->jenis_surat);
        $cleanNomor = str_replace(['/', '\\'], '-', (string) ($this->nomor_surat ?: $this->nomor));

        return "{$prefix}_{$cleanNomor}.pdf";
    }

    public function recordHistory(string $status, ?User $actor, ?string $keterangan = null): PengajuanSuratHistory
    {
        return $this->histories()->create([
            'status' => $status,
            'actor_id' => $actor?->id,
            'keterangan' => $keterangan,
        ]);
    }

    public function touchActivity(): void
    {
        $this->forceFill(['last_activity_at' => now()])->save();
    }

    /**
     * Alokasikan nomor registrasi / tracking internal per tahun (misal SRT-2026-001).
     */
    public static function allocateNextTrackingNumber(int $year): string
    {
        $latest = static::query()
            ->whereYear('created_at', $year)
            ->lockForUpdate()
            ->orderByDesc('id')
            ->first();

        $sequence = 1;
        if ($latest && preg_match('/SRT-\d{4}-(\d+)/', (string) $latest->nomor, $matches)) {
            $sequence = ((int) $matches[1]) + 1;
        } else {
            $sequence = static::query()->whereYear('created_at', $year)->count() + 1;
        }

        return sprintf('SRT-%d-%03d', $year, $sequence);
    }

    /**
     * Alokasikan nomor surat resmi saat Terbit khusus 3 Surat Keterangan.
     * Format: {urutan}/RT01/{dd}/{mm}/{yy}
     * Urutan akumulatif RT 01 tanpa reset tahunan dan tidak dihabiskan oleh Surat Pernyataan.
     */
    public static function allocateNextOfficialNomorSurat(CarbonInterface $issuedAt): string
    {
        $existing = static::query()
            ->whereNotNull('nomor_surat')
            ->lockForUpdate()
            ->pluck('nomor_surat');

        $maxSequence = 0;
        foreach ($existing as $item) {
            if (preg_match('/^(\d+)\/RT01\//', (string) $item, $matches)) {
                $seq = (int) $matches[1];
                if ($seq > $maxSequence) {
                    $maxSequence = $seq;
                }
            }
        }

        $nextSequence = $maxSequence + 1;

        return sprintf('%d/RT01/%s', $nextSequence, $issuedAt->format('d/m/y'));
    }
}
