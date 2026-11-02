<?php

namespace App\Http\Requests\Portal;

use App\Support\LetterType;
use App\Support\Roles;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePengajuanSuratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === Roles::WARGA;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [
            'jenis_surat' => ['required', 'string', Rule::in(LetterType::wargaTypes())],
            'nama' => ['required', 'string', 'max:255'],
            'tempat_lahir' => ['required', 'string', 'max:100'],
            'tanggal_lahir' => ['required', 'string', 'max:50'],
            'pekerjaan' => ['required', 'string', 'max:100'],
            'alamat' => ['required', 'string', 'max:1000'],
        ];

        $type = (string) $this->input('jenis_surat');

        if ($type === LetterType::KEMATIAN) {
            $rules['nomor_kk_ktp'] = ['required', 'string', 'max:50'];
            $rules['jenis_kelamin'] = ['required', 'string', Rule::in(['Laki-laki', 'Laki-Laki', 'Perempuan'])];
            $rules['agama'] = ['required', 'string', 'max:50'];
            $rules['kewarganegaraan'] = ['required', 'string', 'max:50'];
            $rules['hari_meninggal'] = ['nullable', 'string', 'max:50'];
            $rules['tanggal_meninggal'] = ['required', 'string', 'max:50'];
            $rules['jam_meninggal'] = ['required', 'string', 'max:50'];
        } elseif ($type === LetterType::TIDAK_BEKERJA) {
            $rules['nik'] = ['required', 'string', 'regex:/^[0-9]{16}$/'];
            $rules['alasan_tidak_bekerja'] = ['required', 'string', 'max:1000'];
            $rules['alasan_keperluan'] = ['required', 'string', 'max:1000'];
        } elseif ($type === LetterType::BELUM_MENIKAH) {
            $rules['nik'] = ['required', 'string', 'regex:/^[0-9]{16}$/'];
            $rules['jenis_kelamin'] = ['required', 'string', Rule::in(['Laki-laki', 'Laki-Laki', 'Perempuan'])];
            $rules['status_perkawinan'] = ['required', 'string', 'max:50'];
            $rules['agama'] = ['required', 'string', 'max:50'];
        } elseif ($type === LetterType::TIDAK_MAMPU) {
            $rules['nik'] = ['required', 'string', 'regex:/^[0-9]{16}$/'];
            $rules['jenis_kelamin'] = ['required', 'string', Rule::in(['Laki-laki', 'Laki-Laki', 'Perempuan'])];
            $rules['status_perkawinan'] = ['required', 'string', 'max:50'];
            $rules['agama'] = ['required', 'string', 'max:50'];
            $rules['nomor_hp'] = ['required', 'string', 'min:10', 'max:20'];
            $rules['alasan_keperluan'] = ['required', 'string', 'max:1000'];
        } elseif ($type === LetterType::KETERANGAN) {
            $rules['nik'] = ['required', 'string', 'regex:/^[0-9]{16}$/'];
            $rules['jenis_kelamin'] = ['required', 'string', Rule::in(['Laki-laki', 'Laki-Laki', 'Perempuan'])];
            $rules['status_perkawinan'] = ['required', 'string', 'max:50'];
            $rules['agama'] = ['required', 'string', 'max:50'];
            $rules['jenis_surat_keterangan'] = ['required', 'string', 'max:255'];
            $rules['alasan_keperluan'] = ['required', 'string', 'max:1000'];
        } elseif ($type === LetterType::TEMPAT_TINGGAL) {
            $rules['nik'] = ['required', 'string', 'regex:/^[0-9]{16}$/'];
            $rules['jenis_kelamin'] = ['required', 'string', Rule::in(['Laki-laki', 'Laki-Laki', 'Perempuan'])];
            $rules['status_perkawinan'] = ['required', 'string', 'max:50'];
            $rules['agama'] = ['required', 'string', 'max:50'];
            $rules['alasan_keperluan'] = ['required', 'string', 'max:1000'];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nik.regex' => 'Nomor NIK harus berupa 16 digit angka.',
            'jenis_surat.required' => 'Pilih jenis surat permohonan.',
            'alasan_tidak_bekerja.required' => 'Alasan tidak bekerja wajib diisi.',
            'alasan_keperluan.required' => 'Alasan atau keperluan pengurusan surat wajib diisi.',
            'jenis_surat_keterangan.required' => 'Jenis surat keterangan spesifik wajib diisi.',
            'nomor_hp.required' => 'Nomor HP aktif wajib diisi.',
        ];
    }
}
