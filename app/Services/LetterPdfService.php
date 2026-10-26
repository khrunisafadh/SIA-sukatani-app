<?php

namespace App\Services;

use App\Models\PengajuanSurat;
use App\Support\LetterStatus;
use App\Support\LetterType;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class LetterPdfService
{
    public function generate(PengajuanSurat $letter): string
    {
        $letter->loadMissing(['pemohon', 'creator']);

        $lines = [
            'RT 01 / RW 08 SUKATANI',
            'Kelurahan Sukatani, Kecamatan Tapos, Kota Depok',
            '',
            LetterType::label($letter->jenis_surat),
            'Nomor: '.$letter->nomor,
            '',
            'Pemohon: '.$letter->pemohon?->name,
            'Username pemohon: '.$letter->pemohon?->username,
            'Dibuat oleh petugas: '.$letter->creator?->name,
            'Tanggal pengajuan: '.$letter->created_at?->timezone(config('app.timezone'))->format('d/m/Y H:i'),
            'Keperluan: '.$letter->keperluan,
        ];

        if (filled($letter->keterangan)) {
            $lines[] = 'Keterangan: '.$letter->keterangan;
        }

        $lines[] = '';
        $lines[] = 'Dokumen ini adalah draf elektronik yang diterbitkan sistem.';
        $lines[] = 'Pengesahan tetap dilakukan secara fisik (tanda tangan dan cap basah).';

        $relativePath = 'surat/'.$letter->nomor.'.pdf';
        $written = Storage::disk('local')->put($relativePath, $this->buildPdf($lines));

        if (! $written) {
            throw new RuntimeException('Gagal menyimpan berkas PDF.');
        }

        return $relativePath;
    }

    public function absolutePath(PengajuanSurat $letter): ?string
    {
        if (! $letter->pdf_path || ! Storage::disk('local')->exists($letter->pdf_path)) {
            return null;
        }

        return Storage::disk('local')->path($letter->pdf_path);
    }

    public function canAccessDraft(PengajuanSurat $letter): bool
    {
        return $letter->status === LetterStatus::TERBIT && $this->absolutePath($letter) !== null;
    }

    /**
     * @param  array<int, string>  $lines
     */
    private function buildPdf(array $lines): string
    {
        $content = "BT\n/F1 12 Tf\n50 790 Td\n14 TL\n";

        foreach ($lines as $line) {
            $content .= '('.$this->escape($this->toWinAnsi($line)).") '\n";
        }

        $content .= "ET\n";
        $length = strlen($content);

        $objects = [];
        $objects[] = '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj';
        $objects[] = '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj';
        $objects[] = '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj';
        $objects[] = "4 0 obj << /Length {$length} >> stream\n{$content}endstream endobj";
        $objects[] = '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj';

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $object) {
            $offsets[] = strlen($pdf);
            $pdf .= $object."\n";
        }

        $xrefPosition = strlen($pdf);
        $count = count($offsets);
        $pdf .= "xref\n0 {$count}\n";
        $pdf .= "0000000000 65535 f \n";

        for ($i = 1; $i < $count; $i++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }

        $pdf .= "trailer << /Size {$count} /Root 1 0 R >>\n";
        $pdf .= "startxref\n{$xrefPosition}\n%%EOF\n";

        return $pdf;
    }

    private function escape(string $text): string
    {
        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);
    }

    private function toWinAnsi(string $text): string
    {
        $map = [
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ä' => 'a',
            'è' => 'e', 'é' => 'e', 'ê' => 'e',
            'ì' => 'i', 'í' => 'i', 'î' => 'i',
            'ò' => 'o', 'ó' => 'o', 'ô' => 'o',
            'ù' => 'u', 'ú' => 'u', 'û' => 'u',
            'ñ' => 'n', 'ç' => 'c',
            'À' => 'A', 'Á' => 'A', 'Â' => 'A',
            'È' => 'E', 'É' => 'E',
            '—' => '-', '–' => '-', '“' => '"', '”' => '"', '’' => "'",
        ];

        return strtr($text, $map);
    }
}
