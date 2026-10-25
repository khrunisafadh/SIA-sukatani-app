<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLetterRequest;
use App\Models\PengajuanSurat;
use App\Models\User;
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
use Symfony\Component\HttpFoundation\BinaryFileResponse;
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
            'selesai' => (clone $summaryQuery)->where('status', LetterStatus::SELESAI)->count(),
        ];

        return Inertia::render('Admin/Surat/Index', [
            'letters' => $letters->through(fn (PengajuanSurat $letter) => $this->listPayload($letter)),
            'filters' => $filters,
            'summary' => $summary,
            'jenisOptions' => LetterType::labels(),
            'statusOptions' => LetterStatus::labels(),
            'canCreate' => $request->user()?->isKetuaRt() === true,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->isKetuaRt(), 403);

        return Inertia::render('Admin/Surat/Create', [
            'wargaOptions' => User::query()
                ->where('role', Roles::WARGA)
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'username'])
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                ]),
            'jenisOptions' => LetterType::labels(),
        ]);
    }

    public function store(StoreLetterRequest $request): RedirectResponse
    {
        $actor = $request->user();

        $letter = DB::transaction(function () use ($request, $actor) {
            $year = now()->year;
            $latest = PengajuanSurat::query()
                ->whereYear('created_at', $year)
                ->lockForUpdate()
                ->orderByDesc('id')
                ->first();

            $sequence = 1;
            if ($latest && preg_match('/SRT-\d{4}-(\d+)/', (string) $latest->nomor, $matches)) {
                $sequence = ((int) $matches[1]) + 1;
            } else {
                $sequence = PengajuanSurat::query()->whereYear('created_at', $year)->count() + 1;
            }

            $letter = PengajuanSurat::query()->create([
                'nomor' => sprintf('SRT-%d-%03d', $year, $sequence),
                'pemohon_id' => $request->integer('pemohon_id'),
                'created_by' => $actor->id,
                'jenis_surat' => $request->string('jenis_surat'),
                'keperluan' => $request->string('keperluan'),
                'keterangan' => $request->input('keterangan'),
                'status' => LetterStatus::DIAJUKAN,
                'last_activity_at' => now(),
            ]);

            $letter->recordHistory(LetterStatus::DIAJUKAN, $actor, 'Pengajuan disimpan atas nama warga terdaftar.');

            return $letter;
        });

        try {
            $path = $this->pdfs->generate($letter);

            $letter->forceFill([
                'pdf_path' => $path,
                'status' => LetterStatus::TERBIT,
                'issued_at' => now(),
                'last_activity_at' => now(),
            ])->save();

            $letter->recordHistory(LetterStatus::TERBIT, $actor, 'Dokumen PDF draf berhasil diterbitkan.');
        } catch (Throwable) {
            AuditLogger::record($actor, 'letter.created_without_pdf', PengajuanSurat::class, $letter->id);

            return redirect()
                ->route('admin.surat.show', $letter)
                ->with('error', 'Pengajuan tersimpan, tetapi dokumen PDF gagal diterbitkan. Status tetap Diajukan.');
        }

        AuditLogger::record($actor, 'letter.issued', PengajuanSurat::class, $letter->id, [
            'pemohon_id' => $letter->pemohon_id,
            'created_by' => $letter->created_by,
        ]);

        return redirect()
            ->route('admin.surat.show', $letter)
            ->with('success', 'Pengajuan berhasil disimpan dan PDF telah diterbitkan.');
    }

    public function show(Request $request, PengajuanSurat $pengajuanSurat): Response
    {
        $this->assertCanManageLetters($request);

        $pengajuanSurat->load([
            'pemohon:id,name,username,email',
            'creator:id,name,username,role',
            'completedBy:id,name,username,role',
            'histories.actor:id,name,role',
        ]);

        return Inertia::render('Admin/Surat/Show', [
            'letter' => $this->detailPayload($pengajuanSurat, $request),
            'canConfirm' => $pengajuanSurat->isIssued() && $request->user()?->canManageLetters(),
        ]);
    }

    public function confirmEndorsement(Request $request, PengajuanSurat $pengajuanSurat): RedirectResponse
    {
        $this->assertCanManageLetters($request);

        if ($pengajuanSurat->status !== LetterStatus::TERBIT || ! $pengajuanSurat->pdf_path) {
            throw ValidationException::withMessages([
                'status' => 'Pengesahan fisik hanya dapat dicatat pada surat berstatus Terbit.',
            ]);
        }

        $actor = $request->user();

        $pengajuanSurat->forceFill([
            'status' => LetterStatus::SELESAI,
            'completed_at' => now(),
            'completed_by' => $actor->id,
            'last_activity_at' => now(),
        ])->save();

        $pengajuanSurat->recordHistory(
            LetterStatus::SELESAI,
            $actor,
            'Pengesahan fisik (tanda tangan dan cap) telah dikonfirmasi.',
        );

        AuditLogger::record($actor, 'letter.completed', PengajuanSurat::class, $pengajuanSurat->id);

        return redirect()
            ->route('admin.surat.show', $pengajuanSurat)
            ->with('success', 'Pengesahan fisik berhasil dicatat.');
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

        if ($pengajuanSurat->status === LetterStatus::SELESAI) {
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
            'pemohon' => $letter->pemohon?->name,
            'jenis' => $letter->jenis_surat,
            'jenis_label' => $letter->jenisLabel(),
            'tanggal' => $letter->created_at?->timezone(config('app.timezone'))->format('d/m/Y'),
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
            'jenis' => $letter->jenis_surat,
            'jenis_label' => $letter->jenisLabel(),
            'keperluan' => $letter->keperluan,
            'keterangan' => $letter->keterangan,
            'status' => $letter->status,
            'status_label' => $letter->statusLabel(),
            'tanggal' => $letter->created_at?->timezone(config('app.timezone'))->format('d/m/Y H:i'),
            'issued_at' => $letter->issued_at?->timezone(config('app.timezone'))->format('d/m/Y H:i'),
            'completed_at' => $letter->completed_at?->timezone(config('app.timezone'))->format('d/m/Y H:i'),
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
            'completed_by' => $letter->completedBy ? [
                'id' => $letter->completedBy->id,
                'name' => $letter->completedBy->name,
                'role_label' => $letter->completedBy->roleLabel(),
            ] : null,
            'can_preview' => $canAccessPdf,
            'can_download' => $canAccessPdf,
            'pdf_unavailable' => $letter->status === LetterStatus::DIAJUKAN,
            'pdf_locked' => $letter->status === LetterStatus::SELESAI,
            'preview_url' => $canAccessPdf ? route('admin.surat.pdf.preview', $letter) : null,
            'download_url' => $canAccessPdf ? route('admin.surat.pdf.download', $letter) : null,
            'histories' => $letter->histories->map(fn ($history) => [
                'id' => $history->id,
                'status' => $history->status,
                'status_label' => LetterStatus::label($history->status),
                'keterangan' => $history->keterangan,
                'actor' => $history->actor?->name,
                'at' => $history->created_at?->timezone(config('app.timezone'))->format('d/m/Y H:i'),
            ]),
        ];
    }

    private function assertCanManageLetters(Request $request): void
    {
        abort_unless($request->user()?->canManageLetters(), 403);
    }
}
