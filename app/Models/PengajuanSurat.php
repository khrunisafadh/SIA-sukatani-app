<?php

namespace App\Models;

use App\Support\LetterStatus;
use App\Support\LetterType;
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
        'pemohon_id',
        'created_by',
        'jenis_surat',
        'keperluan',
        'keterangan',
        'status',
        'pdf_path',
        'issued_at',
        'completed_at',
        'completed_by',
        'last_activity_at',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
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

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(PengajuanSuratHistory::class, 'pengajuan_surat_id')->orderBy('created_at');
    }

    public function isIssued(): bool
    {
        return $this->status === LetterStatus::TERBIT && filled($this->pdf_path);
    }

    public function isCompleted(): bool
    {
        return $this->status === LetterStatus::SELESAI;
    }

    public function draftPdfAccessible(): bool
    {
        return $this->isIssued();
    }

    public function jenisLabel(): string
    {
        return LetterType::label($this->jenis_surat);
    }

    public function statusLabel(): string
    {
        return LetterStatus::label($this->status);
    }

    public function downloadFilename(): string
    {
        return LetterType::filenamePrefix($this->jenis_surat).'_'.$this->nomor.'.pdf';
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
}
