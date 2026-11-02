<?php

namespace App\Services;

use App\Models\PengajuanSurat;
use App\Support\LetterStatus;
use App\Support\LetterType;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class LetterPdfService
{
    private const PAGE_WIDTH = 595;
    private const PAGE_HEIGHT = 842;
    private const MARGIN_LEFT = 50;
    private const MARGIN_RIGHT = 545;
    private const CONTENT_WIDTH = 495;

    public function generate(PengajuanSurat $letter): string
    {
        $letter->loadMissing(['pemohon', 'creator']);

        $pdfBinary = $this->renderDocument($letter);

        $relativePath = 'surat/'.$letter->nomor.'.pdf';
        $written = Storage::disk('local')->put($relativePath, $pdfBinary);

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

    private function renderDocument(PengajuanSurat $letter): string
    {
        $type = $letter->jenis_surat;
        $hasKop = LetterType::hasKop($type);
        $needsOfficialNumber = LetterType::needsOfficialNumber($type);

        $data = $letter->data_surat ?? [];
        $issuedYear = ($letter->issued_at ? Carbon::parse($letter->issued_at) : now())->year;
        $nomorSurat = $letter->nomor_surat ?? '..............................';

        $rwName = config('surat.pejabat_rw', 'NAMIN');
        $rtName = config('surat.pejabat_rt', 'JAYADI');

        $commands = [];
        $y = self::PAGE_HEIGHT;

        // 1. KOP SURAT (Hanya 3 Surat Keterangan)
        $jpegKopData = null;
        if ($hasKop) {
            $jpegKopData = $this->getKopJpegData();
            if ($jpegKopData !== null) {
                // Dimensi kop: 495 pt x 95 pt
                $kopHeight = 95;
                $kopY = $y - 35 - $kopHeight;
                $commands[] = sprintf("q 495 0 0 %d %d %d cm /Im1 Do Q\n", $kopHeight, self::MARGIN_LEFT, $kopY);
                $y = $kopY - 25; // Beri jarak setelah kop
            } else {
                $y -= 50;
            }
        } else {
            // Surat Pernyataan: Beri margin atas yang rapi tanpa kop
            $y -= 65;
        }

        // 2. JUDUL SURAT & NOMOR
        switch ($type) {
            case LetterType::KEMATIAN:
                $title = 'SURAT KETERANGAN MENINGGAL DUNIA';
                break;
            case LetterType::TEMPAT_TINGGAL:
                $title = 'SURAT KETERANGAN TEMPAT TINGGAL';
                break;
            case LetterType::KETERANGAN:
            case LetterType::DOMISILI:
            case LetterType::PENGANTAR:
                $title = 'SURAT KETERANGAN';
                break;
            case LetterType::BELUM_MENIKAH:
                $title = 'SURAT PERNYATAAN BELUM MENIKAH';
                break;
            case LetterType::TIDAK_BEKERJA:
                $title = 'SURAT PERNYATAAN TIDAK BEKERJA';
                break;
            case LetterType::TIDAK_MAMPU:
                $title = 'SURAT PERNYATAAN TIDAK MAMPU';
                break;
            default:
                $title = strtoupper($letter->jenisLabel());
                break;
        }

        // Judul: 14 pt bold, centered
        $commands[] = $this->buildCenteredText($title, $y, 14, true, true);
        $y -= 18;

        // Nomor Surat Resmi (HANYA 3 Surat Keterangan, 14 pt regular, centered)
        if ($needsOfficialNumber) {
            $nomorLine = "NOMOR : {$nomorSurat}";
            $commands[] = $this->buildCenteredText($nomorLine, $y, 14, false, false);
            $y -= 25;
        } else {
            $y -= 10;
        }

        // 3. KALIMAT PEMBUKA
        $y -= 5;
        if ($hasKop) {
            $opening = 'Yang bertanda tangan di bawah ini, Ketua RT 001/08 Kampung Babakan, Kelurahan Sukatani, Kecamatan Tapos, Kota Depok, dengan ini menerangkan dengan sebenar-benarnya bahwa :';
        } else {
            $opening = 'Yang bertanda tangan dibawah ini :';
        }

        $wrappedOpening = $this->wrapText($opening, self::CONTENT_WIDTH, 12);
        foreach ($wrappedOpening as $line) {
            $commands[] = $this->buildLeftText($line, self::MARGIN_LEFT, $y, 12, false);
            $y -= 16;
        }
        $y -= 6;

        // 4. DAFTAR FIELD IDENTITAS
        $fieldItems = $this->resolveIdentityFields($letter);
        $labelX = self::MARGIN_LEFT;
        $colonX = self::MARGIN_LEFT + 155;
        $valX = self::MARGIN_LEFT + 165;

        foreach ($fieldItems as $item) {
            $label = $item['label'];
            $val = $item['value'];

            $commands[] = $this->buildLeftText($label, $labelX, $y, 12, false);
            $commands[] = $this->buildLeftText(':', $colonX, $y, 12, false);

            $wrappedVal = $this->wrapText($val, self::MARGIN_RIGHT - $valX, 12);
            foreach ($wrappedVal as $idx => $vLine) {
                if ($idx > 0) {
                    $y -= 16;
                }
                $commands[] = $this->buildLeftText($vLine, $valX, $y, 12, false);
            }
            $y -= 17;
        }

        $y -= 6;

        // 5. PARAGRAF TENGAH & PENUTUP SESUAI TEMPLATE RESMI
        $bodyParagraphs = $this->resolveBodyParagraphs($letter);
        foreach ($bodyParagraphs as $para) {
            if (isset($para['is_field']) && $para['is_field']) {
                $commands[] = $this->buildLeftText($para['label'], self::MARGIN_LEFT, $y, 12, false);
                $commands[] = $this->buildLeftText(':', $colonX, $y, 12, false);
                $commands[] = $this->buildLeftText($para['value'], $valX, $y, 12, false);
                $y -= 17;
            } else {
                $wrapped = $this->wrapText($para['text'], self::CONTENT_WIDTH, 12);
                foreach ($wrapped as $line) {
                    $commands[] = $this->buildLeftText($line, self::MARGIN_LEFT, $y, 12, false);
                    $y -= 16;
                }
                $y -= 6;
            }
        }

        // 6. TANGGAL PENUTUP: Depok,                     {issuedYear}
        $y -= 10;
        $dateText = "Depok,                     {$issuedYear}";
        $commands[] = $this->buildLeftText($dateText, 380, $y, 12, false);
        $y -= 20;

        // 7. AREA TANDA TANGAN (Saksi & Pembuat Pernyataan untuk Surat Pernyataan)
        $applicantName = $data['nama'] ?? $letter->pemohon?->name ?? 'Pemohon';

        if ($type === LetterType::BELUM_MENIKAH) {
            // Saksi di kiri, Yang membuat pernyataan di kanan
            $commands[] = $this->buildLeftText('Saksi-saksi', self::MARGIN_LEFT + 20, $y, 12, false);
            $commands[] = $this->buildLeftText('Yang membuat pernyataan', 380, $y, 12, false);
            $y -= 16;

            $commands[] = $this->buildLeftText('1. ........................................', self::MARGIN_LEFT + 20, $y, 12, false);
            $y -= 16;

            $commands[] = $this->buildLeftText('2. ........................................', self::MARGIN_LEFT + 20, $y, 12, false);
            $commands[] = $this->buildLeftText('Materai 10.000', 390, $y, 10, true);
            $y -= 38;

            $commands[] = $this->buildLeftText("({$applicantName})", 380, $y, 12, false);
            $y -= 25;
        } elseif (LetterType::isPernyataan($type)) {
            // Pembuat Pernyataan di kanan
            $commands[] = $this->buildLeftText('Pembuat Pernyataan', 380, $y, 12, false);
            $y -= 20;
            $commands[] = $this->buildLeftText('Materai 10.000', 390, $y, 10, true);
            $y -= 38;
            $commands[] = $this->buildLeftText("({$applicantName})", 380, $y, 12, false);
            $y -= 25;
        } else {
            $y -= 10;
        }

        // 8. AREA PENGESAHAN: Mengetahui (Tengah), Ketua RW 08 (Kiri), Ketua RT 01 (Kanan)
        $commands[] = $this->buildCenteredText('Mengetahui', $y, 12, false, false);
        $y -= 20;

        $rwLeft = self::MARGIN_LEFT + 30;
        $rtRight = 380;

        $commands[] = $this->buildLeftText('KETUA RW 08', $rwLeft, $y, 12, true);
        $commands[] = $this->buildLeftText('KETUA RT 01', $rtRight, $y, 12, true);
        $y -= 52; // Ruang tanda tangan basah & stempel

        $commands[] = $this->buildLeftText("({$rwName})", $rwLeft, $y, 12, true);
        $commands[] = $this->buildLeftText("({$rtName})", $rtRight, $y, 12, true);

        return $this->assemblePdfBinary($commands, $jpegKopData);
    }

    /**
     * @return array<int, array{label: string, value: string}>
     */
    private function resolveIdentityFields(PengajuanSurat $letter): array
    {
        $d = $letter->data_surat ?? [];
        $type = $letter->jenis_surat;
        $user = $letter->pemohon;

        $nama = $d['nama'] ?? $user?->name ?? '-';
        $nik = $d['nik'] ?? $d['nomor_kk_ktp'] ?? '-';
        $ttl = trim(($d['tempat_lahir'] ?? '').', '.($d['tanggal_lahir'] ?? ''), ', ');
        $jk = $d['jenis_kelamin'] ?? '-';
        $pekerjaan = $d['pekerjaan'] ?? '-';
        $statusPerkawinan = $d['status_perkawinan'] ?? '-';
        $agama = $d['agama'] ?? '-';
        $alamat = $d['alamat'] ?? '-';

        if ($type === LetterType::KEMATIAN) {
            return [
                ['label' => 'Nama', 'value' => $nama],
                ['label' => 'Jenis Kelamin', 'value' => $jk],
                ['label' => 'Tempat/Tanggal Lahir', 'value' => $ttl ?: '-'],
                ['label' => 'No KK / KTP', 'value' => $nik],
                ['label' => 'Pekerjaan', 'value' => $pekerjaan],
                ['label' => 'Agama', 'value' => $agama],
                ['label' => 'Kewarga Negaraan', 'value' => $d['kewarganegaraan'] ?? 'WNI'],
                ['label' => 'Alamat', 'value' => $alamat],
            ];
        }

        if ($type === LetterType::TIDAK_BEKERJA) {
            return [
                ['label' => 'Nama', 'value' => $nama],
                ['label' => 'NIK', 'value' => $nik],
                ['label' => 'Tempat/Tanggal Lahir', 'value' => $ttl ?: '-'],
                ['label' => 'Pekerjaan', 'value' => $pekerjaan ?: 'Belum / Tidak Bekerja'],
                ['label' => 'Alamat', 'value' => $alamat],
            ];
        }

        $base = [
            ['label' => 'Nama', 'value' => $nama],
            ['label' => 'NIK', 'value' => $nik],
            ['label' => 'Tempat/Tanggal Lahir', 'value' => $ttl ?: '-'],
            ['label' => 'Jenis Kelamin', 'value' => $jk],
            ['label' => 'Pekerjaan', 'value' => $pekerjaan],
            ['label' => 'Status Perkawinan', 'value' => $statusPerkawinan],
            ['label' => 'Agama', 'value' => $agama],
            ['label' => 'Alamat', 'value' => $alamat],
        ];

        if ($type === LetterType::TIDAK_MAMPU) {
            $base[] = ['label' => 'No Hp', 'value' => $d['nomor_hp'] ?? '-'];
        }

        return $base;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function resolveBodyParagraphs(PengajuanSurat $letter): array
    {
        $d = $letter->data_surat ?? [];
        $type = $letter->jenis_surat;
        $keperluan = $d['alasan_keperluan'] ?? $letter->keperluan ?? 'Administrasi';

        switch ($type) {
            case LetterType::KEMATIAN:
                $hariTgl = trim(($d['hari_meninggal'] ?? '').', '.($d['tanggal_meninggal'] ?? ''), ', ');
                $jam = ($d['jam_meninggal'] ?? '-');
                if ($jam !== '-' && ! str_contains(strtolower($jam), 'wib')) {
                    $jam .= ' WIB';
                }

                return [
                    ['text' => 'Adalah benar warga kami dilingkungan RT 01 RW 08 Kampung Babakan, Kelurahan Sukatani, Kecamatan Tapos, Kota Depok. Yang telah meninggal dunia pada :'],
                    ['is_field' => true, 'label' => 'Hari/ Tanggal', 'value' => $hariTgl ?: '-'],
                    ['is_field' => true, 'label' => 'Jam', 'value' => $jam],
                    ['text' => 'Demikian surat keterangan ini kami buat dengan sebenar-benarnya untuk dipergunakan sebagai mana mestinya. Atas perhatian dan bantuan nya kami ucapkan terimakasih.'],
                ];

            case LetterType::TEMPAT_TINGGAL:
                return [
                    ['text' => "Bahwa nama tersebut di atas benar merupakan warga kami dan surat keterangan ini dibuat untuk keperluan {$keperluan}."],
                    ['text' => 'Demikian surat keterangan ini kami buat dengan sebenar-benarnya. Atas perhatian dan bantuan nya kami ucapkan terimakasih.'],
                ];

            case LetterType::KETERANGAN:
            case LetterType::DOMISILI:
            case LetterType::PENGANTAR:
                $jenisKet = $d['jenis_surat_keterangan'] ?? $letter->jenisLabel();

                return [
                    ['text' => "Bahwa nama tersebut di atas adalah benar warga kami dan mohon untuk dibuatkan surat keterangan {$jenisKet} untuk keperluan {$keperluan}."],
                    ['text' => 'Demikian surat keterangan ini kami buat dengan sebenar-benarnya. Atas perhatian dan bantuan nya kami ucapkan terimakasih.'],
                ];

            case LetterType::BELUM_MENIKAH:
                return [
                    ['text' => 'Dengan ini menyatakan dengan sebenar-benarnya dan sejujurnya serta berani diangkat sumpah hukum, bahwa semasa hidupnya belum pernah menikah dengan siapapun.'],
                    ['text' => 'Demikian surat pernyataan ini saya buat dan saya tanda tangani tanpa adanya paksaan dari pihak manapun. Apabila di kemudian hari pernyataan ini terbukti tidak benar, maka saya bersedia dituntut sesuai dengan hukum yang berlaku tanpa melibatkan pejabat maupun anggota Kelurahan Sukatani.'],
                ];

            case LetterType::TIDAK_BEKERJA:
                $alasanTidakBekerja = $d['alasan_tidak_bekerja'] ?? '-';

                return [
                    ['text' => "Dengan ini saya menyatakan dengan sebenar-benarnya bahwa saat ini saya tidak bekerja karena {$alasanTidakBekerja}."],
                    ['text' => "Demikian surat pernyataan ini saya buat dan saya tanda tangani tanpa adanya paksaan dari pihak mana pun untuk keperluan {$keperluan} dan apabila di kemudian hari pernyataan ini terbukti tidak benar, maka saya bersedia dituntut sesuai dengan hukum yang berlaku tanpa melibatkan pejabat maupun anggota Kelurahan Sukatani."],
                ];

            case LetterType::TIDAK_MAMPU:
                return [
                    ['text' => 'Data tersebut di atas adalah benar dan sesuai dengan kondisi yang sebenarnya serta memenuhi kriteria sebagai masyarakat miskin atau tidak mampu. Apabila di kemudian hari diketahui bahwa surat pernyataan ini tidak sesuai dengan kenyataan, maka saya bersedia dan akan bertanggung jawab atas segala konsekuensi yang timbul, baik secara perdata maupun pidana.'],
                    ['text' => "Demikian surat pernyataan ini saya buat dengan penuh kesadaran, tanggung jawab, serta tanpa adanya paksaan dari pihak manapun untuk keperluan {$keperluan}."],
                ];

            default:
                return [
                    ['text' => 'Demikian surat ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.'],
                ];
        }
    }

    private function getKopJpegData(): ?string
    {
        $path = config('surat.kop_path');
        if (! file_exists($path)) {
            $fallback = base_path('docs/pengajuan-surat/kop-surat/kop-surat-rt01.png');
            if (file_exists($fallback)) {
                $path = $fallback;
            } else {
                return null;
            }
        }

        if (! function_exists('imagecreatefrompng')) {
            return null;
        }

        try {
            $png = @imagecreatefrompng($path);
            if (! $png) {
                return null;
            }

            $w = imagesx($png);
            $h = imagesy($png);
            $canvas = imagecreatetruecolor($w, $h);
            $white = imagecolorallocate($canvas, 255, 255, 255);
            imagefill($canvas, 0, 0, $white);
            imagecopy($canvas, $png, 0, 0, 0, 0, $w, $h);

            ob_start();
            imagejpeg($canvas, null, 95);
            $jpg = ob_get_clean();

            imagedestroy($png);
            imagedestroy($canvas);

            return $jpg ?: null;
        } catch (\Throwable) {
            return null;
        }
    }

    private function buildCenteredText(string $text, float $y, int $fontSize = 12, bool $bold = false, bool $underline = false): string
    {
        $fontTag = $bold ? '/F2' : '/F1';
        $escaped = $this->escape($this->toWinAnsi($text));

        // Perkiraan lebar Times New Roman
        $approxWidth = strlen($text) * ($fontSize * ($bold ? 0.52 : 0.47));
        $x = max(self::MARGIN_LEFT, (self::PAGE_WIDTH - $approxWidth) / 2);

        $out = "BT\n{$fontTag} {$fontSize} Tf\n".sprintf('%.2f %.2f Td', $x, $y)."\n({$escaped}) Tj\nET\n";

        if ($underline) {
            $lineY = $y - 2;
            $out .= sprintf("%.2f %.2f m %.2f %.2f l 0.7 w S\n", $x, $lineY, $x + $approxWidth, $lineY);
        }

        return $out;
    }

    private function buildLeftText(string $text, float $x, float $y, int $fontSize = 12, bool $bold = false): string
    {
        $fontTag = $bold ? '/F2' : '/F1';
        $escaped = $this->escape($this->toWinAnsi($text));

        return "BT\n{$fontTag} {$fontSize} Tf\n".sprintf('%.2f %.2f Td', $x, $y)."\n({$escaped}) Tj\nET\n";
    }

    /**
     * @return array<int, string>
     */
    private function wrapText(string $text, float $maxWidth, int $fontSize): array
    {
        $words = explode(' ', $text);
        $lines = [];
        $current = '';
        $charLimit = (int) floor($maxWidth / ($fontSize * 0.47));

        foreach ($words as $word) {
            if ($current === '') {
                $current = $word;
            } elseif (strlen($current.' '.$word) <= $charLimit) {
                $current .= ' '.$word;
            } else {
                $lines[] = $current;
                $current = $word;
            }
        }

        if ($current !== '') {
            $lines[] = $current;
        }

        return $lines;
    }

    /**
     * @param  array<int, string>  $commands
     */
    private function assemblePdfBinary(array $commands, ?string $jpegData): string
    {
        $contentStream = implode('', $commands);
        $contentLength = strlen($contentStream);

        $objects = [];
        $objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
        $objects[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';

        if ($jpegData !== null) {
            $imgLength = strlen($jpegData);
            $objects[6] = "<< /Type /XObject /Subtype /Image /Width 1136 /Height 218 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {$imgLength} >> stream\n{$jpegData}\nendstream";

            $objects[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '.self::PAGE_WIDTH.' '.self::PAGE_HEIGHT.'] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 7 0 R >> /XObject << /Im1 6 0 R >> >> >>';
        } else {
            $objects[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '.self::PAGE_WIDTH.' '.self::PAGE_HEIGHT.'] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 7 0 R >> >> >>';
        }

        $objects[4] = "<< /Length {$contentLength} >> stream\n{$contentStream}endstream";
        $objects[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>';
        $objects[7] = '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>';

        ksort($objects);

        $pdf = "%PDF-1.4\n";
        $offsets = [];

        foreach ($objects as $id => $body) {
            $offsets[$id] = strlen($pdf);
            $pdf .= "{$id} 0 obj\n{$body}\nendobj\n";
        }

        $xrefPosition = strlen($pdf);
        $maxId = max(array_keys($objects));
        $count = $maxId + 1;

        $pdf .= "xref\n0 {$count}\n";
        $pdf .= "0000000000 65535 f \n";

        for ($i = 1; $i <= $maxId; $i++) {
            if (isset($offsets[$i])) {
                $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
            } else {
                $pdf .= "0000000000 65535 f \n";
            }
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
