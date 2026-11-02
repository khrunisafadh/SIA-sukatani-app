<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PengajuanSurat;
use App\Services\LetterPdfService;
use App\Support\AuditLogger;
use App\Support\LetterStatus;
use App\Support\LetterType;
use App\Support\Roles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Throwable;

class SuratAdminController extends Controller
{
    public function __construct(private readonly LetterPdfService $pdfs) {}

    public function index(Request $request): Response
    {
        $this->assertCanManageLetters($request);

        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'jenis' => (string) $request->query('jenis', ''),
            'status' => (string) $request->query('status', ''),
        ];

        $query = PengajuanSurat::query()
            ->with(['pemohon:id,name,username'])
            ->orderByDesc('last_activity_at')
            ->orderByDesc('id');

        if ($filters['q'] !== '') {
            $search = $filters['q'];
            $query->where(function ($builder) use ($search) {
                $builder->where('nomor', 'like', "%{$search}%")
                    ->orWhere('nomor_surat', 'like', "%{$search}%")
                    ->orWhereHas('pemohon', function ($pemohon) use ($search) {
                        $pemohon->where('name', 'like', "%{$search}%")
                            ->orWhere('username', 'like', "%{$search}%");
                    });
            });
        }

        if (in_array($filters['jenis'], LetterType::all(), true)) {
            $query->where('jenis_surat', $filters['jenis']);
        }

        if (in_array($filters['status'], LetterStatus::all(), true)) {
            $query->where('status', $filters['status']);
        }

        $letters = $query->paginate(10)->withQueryString();

        $summaryQuery = PengajuanSurat::query();
        $summary = [
            'total' => (clone $summaryQuery)->count(),
            'diajukan' => (clone $summaryQuery)->where('status', LetterStatus::DIAJUKAN)->count(),
            'terbit' => (clone $summaryQuery)->where('status', LetterStatus::TERBIT)->count(),
            'selesai_rt' => (clone $summaryQuery)->where('status', LetterStatus::SELESAI_RT)->count(),
            'selesai' => (clone $summaryQuery)->where('status', LetterStatus::SELESAI)->count(),
        ];

        return Inertia::render('Admin/Surat/Index', [
            'letters' => $letters->through(fn (PengajuanSurat $letter) => $this->listPayload($letter)),
            'filters' => $filters,
            'summary' => $summary,
            'jenisOptions' => LetterType::labels(),
            'statusOptions' => LetterStatus::labels(),
            'canCreate' => false, // Per PRD: Admin tidak lagi membuat pengajuan atas nama warga
        ]);
    }

    /**
     * Nonaktifkan route create untuk admin.
     */
    public function create(Request $request): Response
    {
        abort(HttpResponse::HTTP_FORBIDDEN, 'Pembuatan permohonan surat hanya dapat dilakukan oleh Warga.');
    }

    /**
     * Nonaktifkan route store untuk admin.
     */
    public function store(Request $request): RedirectResponse
    {
        abort(HttpResponse::HTTP_FORBIDDEN, 'Pembuatan permohonan surat hanya dapat dilakukan oleh Warga.');
    }

    public function show(Request $request, PengajuanSurat $pengajuanSurat): Response
    {
        $this->assertCanManageLetters($request);

        $pengajuanSurat->load([
            'pemohon:id,name,username,email',
            'creator:id,name,username,role',
            'verifiedBy:id,name,username,role',
            'rtConfirmedBy:id,name,username,role',
            'rwConfirmedBy:id,name,username,role',
            'completedBy:id,name,username,role',
            'histories.actor:id,name,role',
        ]);

        $user = $request->user();
        $isKetuaRt = $user?->isKetuaRt() === true;
        $isSekretaris = $user?->role === Roles::SEKRETARIS;

        $canVerify = $isKetuaRt && $pengajuanSurat->status === LetterStatus::DIAJUKAN;
        $canConfirmRt = in_array($pengajuanSurat->status, [LetterStatus::TERBIT], true)
            && $pengajuanSurat->rt_confirmed_at === null
            && ($isKetuaRt || $isSekretaris);
        $canConfirmRw = in_array($pengajuanSurat->status, [LetterStatus::TERBIT, LetterStatus::SELESAI_RT], true)
            && $pengajuanSurat->rw_confirmed_at === null
            && $isSekretaris;

        return Inertia::render('Admin/Surat/Show', [
            'letter' => $this->detailPayload($pengajuanSurat, $request),
            'canVerify' => $canVerify,
            'canConfirmRt' => $canConfirmRt,
            'canConfirmRw' => $canConfirmRw,
            'canConfirm' => $canConfirmRt || $canConfirmRw,
        ]);
    }

    /**
     * Verifikasi oleh Ketua RT: menerbitkan surat dan menghasilkan PDF draf resmi.
     */
    public function verify(Request $request, PengajuanSurat $pengajuanSurat): RedirectResponse
    {
        abort_unless($request->user()?->isKetuaRt(), HttpResponse::HTTP_FORBIDDEN, 'Hanya Ketua RT yang berwenang memverifikasi permohonan.');

        if ($pengajuanSurat->status !== LetterStatus::DIAJUKAN) {
            throw ValidationException::withMessages([
                'status' => 'Hanya permohonan berstatus Diajukan yang dapat diverifikasi.',
            ]);
        }

        $actor = $request->user();

        DB::transaction(function () use ($pengajuanSurat, $actor) {
            $issuedAt = now()->timezone('Asia/Jakarta');
            $nomorSuratResmi = null;

            if (LetterType::needsOfficialNumber($pengajuanSurat->jenis_surat)) {
                $nomorSuratResmi = PengajuanSurat::allocateNextOfficialNomorSurat($issuedAt);
            }

            $pengajuanSurat->nomor_surat = $nomorSuratResmi;
            $pengajuanSurat->issued_at = $issuedAt;

            // Generate dokumen PDF resmi
            $pdfPath = $this->pdfs->generate($pengajuanSurat);

            $pengajuanSurat->forceFill([
                'nomor_surat' => $nomorSuratResmi,
                'pdf_path' => $pdfPath,
                'status' => LetterStatus::TERBIT,
                'verified_by' => $actor->id,
                'verified_at' => $issuedAt,
                'issued_at' => $issuedAt,
                'last_activity_at' => $issuedAt,
            ])->save();

            $keteranganHistory = $nomorSuratResmi
                ? "Permohonan diverifikasi oleh Ketua RT. Nomor surat resmi: {$nomorSuratResmi}."
                : 'Permohonan diverifikasi oleh Ketua RT dan draf pernyataan siap diunduh.';

            $pengajuanSurat->recordHistory(LetterStatus::TERBIT, $actor, $keteranganHistory);
        });

        AuditLogger::record($actor, 'letter.verified_and_issued', PengajuanSurat::class, $pengajuanSurat->id, [
            'nomor' => $pengajuanSurat->nomor,
            'nomor_surat' => $pengajuanSurat->nomor_surat,
        ]);

        return redirect()
            ->route('admin.surat.show', $pengajuanSurat)
            ->with('success', 'Permohonan berhasil diverifikasi dan surat telah diterbitkan.');
    }

    /**
     * Konfirmasi Pengesahan Fisik Tingkat RT (Ketua RT atau Sekretaris atas nama RT).
     */
    public function confirmRt(Request $request, PengajuanSurat $pengajuanSurat): RedirectResponse
    {
        $this->assertCanManageLetters($request);

        if (! in_array($pengajuanSurat->status, [LetterStatus::TERBIT], true) || $pengajuanSurat->rt_confirmed_at !== null) {
            throw ValidationException::withMessages([
                'status' => 'Pengesahan Ketua RT tidak dapat dilakukan pada status saat ini atau sudah pernah dikonfirmasi.',
            ]);
        }

        $actor = $request->user();
        $now = now()->timezone('Asia/Jakarta');

        DB::transaction(function () use ($pengajuanSurat, $actor, $now) {
            $rwAlreadyConfirmed = $pengajuanSurat->rw_confirmed_at !== null;
            $nextStatus = $rwAlreadyConfirmed ? LetterStatus::SELESAI : LetterStatus::SELESAI_RT;

            $pengajuanSurat->forceFill([
                'rt_confirmed_by' => $actor->id,
                'rt_confirmed_at' => $now,
                'status' => $nextStatus,
                'completed_at' => $rwAlreadyConfirmed ? $now : $pengajuanSurat->completed_at,
                'completed_by' => $rwAlreadyConfirmed ? $actor->id : $pengajuanSurat->completed_by,
                'last_activity_at' => $now,
            ])->save();

            $keterangan = "Pengesahan fisik (tanda tangan dan stempel) oleh Ketua RT telah dikonfirmasi oleh {$actor->name}.";
            $pengajuanSurat->recordHistory($nextStatus, $actor, $keterangan);
        });

        AuditLogger::record($actor, 'letter.rt_endorsed', PengajuanSurat::class, $pengajuanSurat->id);

        return redirect()
            ->route('admin.surat.show', $pengajuanSurat)
            ->with('success', 'Pengesahan Ketua RT berhasil dicatat.');
    }

    /**
     * Konfirmasi Pengesahan Fisik Tingkat RW (Sekretaris atas nama RW).
     */
    public function confirmRw(Request $request, PengajuanSurat $pengajuanSurat): RedirectResponse
    {
        abort_unless($request->user()?->role === Roles::SEKRETARIS, HttpResponse::HTTP_FORBIDDEN, 'Hanya Sekretaris yang berwenang mencatat pengesahan Ketua RW.');

        if (! in_array($pengajuanSurat->status, [LetterStatus::TERBIT, LetterStatus::SELESAI_RT], true) || $pengajuanSurat->rw_confirmed_at !== null) {
            throw ValidationException::withMessages([
                'status' => 'Pengesahan Ketua RW tidak dapat dilakukan pada status saat ini atau sudah pernah dikonfirmasi.',
            ]);
        }

        $actor = $request->user();
        $now = now()->timezone('Asia/Jakarta');

        DB::transaction(function () use ($pengajuanSurat, $actor, $now) {
            $rtAlreadyConfirmed = $pengajuanSurat->rt_confirmed_at !== null;
            $nextStatus = $rtAlreadyConfirmed ? LetterStatus::SELESAI : $pengajuanSurat->status;

            $pengajuanSurat->forceFill([
                'rw_confirmed_by' => $actor->id,
                'rw_confirmed_at' => $now,
                'status' => $nextStatus,
                'completed_at' => $rtAlreadyConfirmed ? $now : $pengajuanSurat->completed_at,
                'completed_by' => $rtAlreadyConfirmed ? $actor->id : $pengajuanSurat->completed_by,
                'last_activity_at' => $now,
            ])->save();

            $keterangan = "Pengesahan fisik (tanda tangan dan stempel) oleh Ketua RW telah dikonfirmasi oleh {$actor->name}.";
            $pengajuanSurat->recordHistory($nextStatus, $actor, $keterangan);
        });

        AuditLogger::record($actor, 'letter.rw_endorsed', PengajuanSurat::class, $pengajuanSurat->id);

        return redirect()
            ->route('admin.surat.show', $pengajuanSurat)
            ->with('success', 'Pengesahan Ketua RW berhasil dicatat.');
    }

    /**
     * Backward-compatibility wrapper untuk confirmEndorsement.
     */
    public function confirmEndorsement(Request $request, PengajuanSurat $pengajuanSurat): RedirectResponse
    {
        return $this->confirmRt($request, $pengajuanSurat);
    }

    public function preview(Request $request, PengajuanSurat $pengajuanSurat): HttpResponse
    {
        return $this->pdfResponse($request, $pengajuanSurat, false);
    }

    public function download(Request $request, PengajuanSurat $pengajuanSurat): HttpResponse
    {
        return $this->pdfResponse($request, $pengajuanSurat, true);
    }

    private function pdfResponse(Request $request, PengajuanSurat $pengajuanSurat, bool $download): HttpResponse
    {
        $this->assertCanManageLetters($request);

        if (in_array($pengajuanSurat->status, [LetterStatus::SELESAI, LetterStatus::SELESAI_RT], true)) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'Draf elektronik tidak dapat diakses setelah pengesahan fisik.');
        }

        if ($pengajuanSurat->status !== LetterStatus::TERBIT) {
            abort(HttpResponse::HTTP_NOT_FOUND, 'Dokumen PDF belum tersedia.');
        }

        $path = $this->pdfs->absolutePath($pengajuanSurat);
        if ($path === null) {
            abort(HttpResponse::HTTP_NOT_FOUND, 'Dokumen PDF belum tersedia.');
        }

        $filename = $pengajuanSurat->downloadFilename();
        $disposition = ($download ? 'attachment' : 'inline').'; filename="'.$filename.'"';
        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => $disposition,
        ];

        return response()->stream(function () use ($path) {
            $stream = fopen($path, 'rb');
            if ($stream) {
                fpassthru($stream);
                fclose($stream);
            }
        }, HttpResponse::HTTP_OK, $headers);
    }

    /**
     * @return array<string, mixed>
     */
    private function listPayload(PengajuanSurat $letter): array
    {
        return [
            'id' => $letter->id,
            'nomor' => $letter->nomor,
            'nomor_surat' => $letter->nomor_surat,
            'pemohon' => $letter->pemohon?->name,
            'jenis' => $letter->jenis_surat,
            'jenis_label' => $letter->jenisLabel(),
            'tanggal' => $letter->created_at?->timezone('Asia/Jakarta')->format('d/m/Y'),
            'status' => $letter->status,
            'status_label' => $letter->statusLabel(),
            'can_download' => $letter->draftPdfAccessible(),
            'last_activity_at' => $letter->last_activity_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detailPayload(PengajuanSurat $letter, Request $request): array
    {
        $canAccessPdf = $letter->draftPdfAccessible();

        return [
            'id' => $letter->id,
            'nomor' => $letter->nomor,
            'nomor_surat' => $letter->nomor_surat,
            'jenis' => $letter->jenis_surat,
            'jenis_label' => $letter->jenisLabel(),
            'keperluan' => $letter->keperluan,
            'keterangan' => $letter->keterangan,
            'data_surat' => $letter->data_surat ?? [],
            'status' => $letter->status,
            'status_label' => $letter->statusLabel(),
            'tanggal' => $letter->created_at?->timezone('Asia/Jakarta')->format('d/m/Y H:i'),
            'issued_at' => $letter->issued_at?->timezone('Asia/Jakarta')->format('d/m/Y H:i'),
            'rt_confirmed_at' => $letter->rt_confirmed_at?->timezone('Asia/Jakarta')->format('d/m/Y H:i'),
            'rw_confirmed_at' => $letter->rw_confirmed_at?->timezone('Asia/Jakarta')->format('d/m/Y H:i'),
            'completed_at' => $letter->completed_at?->timezone('Asia/Jakarta')->format('d/m/Y H:i'),
            'pemohon' => [
                'id' => $letter->pemohon?->id,
                'name' => $letter->pemohon?->name,
                'username' => $letter->pemohon?->username,
            ],
            'creator' => [
                'id' => $letter->creator?->id,
                'name' => $letter->creator?->name,
                'role_label' => $letter->creator?->roleLabel(),
            ],
            'verified_by' => $letter->verifiedBy ? [
                'id' => $letter->verifiedBy->id,
                'name' => $letter->verifiedBy->name,
                'role_label' => $letter->verifiedBy->roleLabel(),
            ] : null,
            'rt_confirmed_by' => $letter->rtConfirmedBy ? [
                'id' => $letter->rtConfirmedBy->id,
                'name' => $letter->rtConfirmedBy->name,
                'role_label' => $letter->rtConfirmedBy->roleLabel(),
            ] : null,
            'rw_confirmed_by' => $letter->rwConfirmedBy ? [
                'id' => $letter->rwConfirmedBy->id,
                'name' => $letter->rwConfirmedBy->name,
                'role_label' => $letter->rwConfirmedBy->roleLabel(),
            ] : null,
            'completed_by' => $letter->completedBy ? [
                'id' => $letter->completedBy->id,
                'name' => $letter->completedBy->name,
                'role_label' => $letter->completedBy->roleLabel(),
            ] : null,
            'can_preview' => $canAccessPdf,
            'can_download' => $canAccessPdf,
            'pdf_unavailable' => $letter->status === LetterStatus::DIAJUKAN,
            'pdf_locked' => in_array($letter->status, [LetterStatus::SELESAI, LetterStatus::SELESAI_RT], true),
            'preview_url' => $canAccessPdf ? route('admin.surat.pdf.preview', $letter) : null,
            'download_url' => $canAccessPdf ? route('admin.surat.pdf.download', $letter) : null,
            'histories' => $letter->histories->map(fn ($history) => [
                'id' => $history->id,
                'status' => $history->status,
                'status_label' => LetterStatus::label($history->status),
                'keterangan' => $history->keterangan,
                'actor' => $history->actor?->name,
                'at' => $history->created_at?->timezone('Asia/Jakarta')->format('d/m/Y H:i'),
            ]),
        ];
    }

    private function assertCanManageLetters(Request $request): void
    {
        abort_unless($request->user()?->canManageLetters(), HttpResponse::HTTP_FORBIDDEN);
    }
}
