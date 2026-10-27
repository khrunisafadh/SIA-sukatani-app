<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\StorePengajuanSuratRequest;
use App\Models\PengajuanSurat;
use App\Services\LetterPdfService;
use App\Support\AuditLogger;
use App\Support\LetterStatus;
use App\Support\LetterType;
use App\Support\Roles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class SuratPortalController extends Controller
{
    public function __construct(private readonly LetterPdfService $pdfs) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $letters = PengajuanSurat::query()
            ->where('pemohon_id', $user->id)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->through(fn (PengajuanSurat $letter) => [
                'id' => $letter->id,
                'nomor' => $letter->nomor,
                'jenis_surat' => $letter->jenis_surat,
                'jenis_label' => $letter->jenisLabel(),
                'tanggal' => $letter->created_at?->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i').' WIB',
                'status' => $letter->status,
                'status_label' => $letter->statusLabel(),
                'can_download' => $letter->draftPdfAccessible(),
            ]);

        return Inertia::render('Portal/Surat/Index', [
            'letters' => $letters,
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Portal/Surat/Create', [
            'jenisOptions' => LetterType::wargaLabels(),
            'defaultUserData' => [
                'nama' => $user->name,
                'username' => $user->username,
            ],
            'helpCard' => [
                'rt_lead_name' => config('surat.rt_lead_name'),
                'whatsapp_help' => config('surat.whatsapp_help'),
                'whatsapp_help_display' => config('surat.whatsapp_help_display'),
                'jam_pelayanan' => config('surat.jam_pelayanan'),
                'balai_warga' => config('surat.balai_warga'),
            ],
        ]);
    }

    public function store(StorePengajuanSuratRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $jenisSurat = $validated['jenis_surat'];

        // Siapkan keperluan untuk backward compatibility dan query
        $keperluan = $validated['alasan_keperluan']
            ?? $validated['keperluan']
            ?? ($jenisSurat === LetterType::BELUM_MENIKAH ? 'Pernyataan Belum Menikah' : 'Administrasi Kependudukan');

        $letter = DB::transaction(function () use ($user, $validated, $jenisSurat, $keperluan) {
            $year = now()->timezone('Asia/Jakarta')->year;
            $trackingNumber = PengajuanSurat::allocateNextTrackingNumber($year);

            $letter = PengajuanSurat::query()->create([
                'nomor' => $trackingNumber,
                'pemohon_id' => $user->id,
                'created_by' => $user->id,
                'jenis_surat' => $jenisSurat,
                'keperluan' => $keperluan,
                'data_surat' => $validated,
                'status' => LetterStatus::DIAJUKAN,
                'last_activity_at' => now(),
            ]);

            $letter->recordHistory(
                LetterStatus::DIAJUKAN,
                $user,
                'Pengajuan surat berhasil dikirim oleh warga dan menunggu verifikasi Ketua RT.',
            );

            return $letter;
        });

        AuditLogger::record($user, 'letter.submitted_by_warga', PengajuanSurat::class, $letter->id, [
            'nomor' => $letter->nomor,
            'jenis_surat' => $letter->jenis_surat,
        ]);

        return redirect()
            ->route('portal.surat.index')
            ->with('success', 'Permohonan surat berhasil dikirim.');
    }

    public function show(Request $request, PengajuanSurat $pengajuanSurat): Response
    {
        $this->assertOwnership($request, $pengajuanSurat);

        $pengajuanSurat->load([
            'pemohon:id,name,username',
            'verifiedBy:id,name,role',
            'rtConfirmedBy:id,name,role',
            'rwConfirmedBy:id,name,role',
            'histories.actor:id,name,role',
        ]);

        $canAccessPdf = $pengajuanSurat->draftPdfAccessible();

        $waRtNumber = config('surat.whatsapp_rt', '6281311112222');
        $waRwNumber = config('surat.whatsapp_rw', '6282133334444');

        $payload = [
            'id' => $pengajuanSurat->id,
            'nomor' => $pengajuanSurat->nomor,
            'nomor_surat' => $pengajuanSurat->nomor_surat,
            'jenis_surat' => $pengajuanSurat->jenis_surat,
            'jenis_label' => $pengajuanSurat->jenisLabel(),
            'status' => $pengajuanSurat->status,
            'status_label' => $pengajuanSurat->statusLabel(),
            'created_at_formatted' => $pengajuanSurat->created_at?->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i').' WIB',
            'issued_at_formatted' => $pengajuanSurat->issued_at?->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i').' WIB',
            'rt_confirmed_at_formatted' => $pengajuanSurat->rt_confirmed_at?->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i').' WIB',
            'rw_confirmed_at_formatted' => $pengajuanSurat->rw_confirmed_at?->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i').' WIB',
            'data_surat' => $pengajuanSurat->data_surat ?? [],
            'can_preview' => $canAccessPdf,
            'can_download' => $canAccessPdf,
            'preview_url' => $canAccessPdf ? route('portal.surat.pdf.preview', $pengajuanSurat) : null,
            'download_url' => $canAccessPdf ? route('portal.surat.pdf.download', $pengajuanSurat) : null,
            'whatsapp_rt_url' => 'https://wa.me/'.$waRtNumber,
            'whatsapp_rw_url' => 'https://wa.me/'.$waRwNumber,
            'histories' => $pengajuanSurat->histories->map(fn ($history) => [
                'id' => $history->id,
                'status' => $history->status,
                'status_label' => LetterStatus::label($history->status),
                'keterangan' => $history->keterangan,
                'actor' => $history->actor?->name,
                'at' => $history->created_at?->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i'),
            ]),
            'helpCard' => [
                'rt_lead_name' => config('surat.rt_lead_name'),
                'whatsapp_help' => config('surat.whatsapp_help'),
                'whatsapp_help_display' => config('surat.whatsapp_help_display'),
                'jam_pelayanan' => config('surat.jam_pelayanan'),
                'balai_warga' => config('surat.balai_warga'),
            ],
        ];

        return Inertia::render('Portal/Surat/Show', [
            'letter' => $payload,
        ]);
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
        $this->assertOwnership($request, $pengajuanSurat);

        if ($pengajuanSurat->status !== LetterStatus::TERBIT) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'Draf berkas digital hanya dapat diakses saat status Terbit.');
        }

        $path = $this->pdfs->absolutePath($pengajuanSurat);
        if ($path === null) {
            abort(HttpResponse::HTTP_NOT_FOUND, 'Berkas dokumen belum tersedia.');
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

    private function assertOwnership(Request $request, PengajuanSurat $pengajuanSurat): void
    {
        if ($pengajuanSurat->pemohon_id !== $request->user()?->id) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'Anda tidak memiliki hak akses untuk permohonan ini.');
        }
    }
}
