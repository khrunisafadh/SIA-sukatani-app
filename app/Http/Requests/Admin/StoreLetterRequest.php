<?php

namespace App\Http\Requests\Admin;

use App\Support\LetterType;
use App\Support\Roles;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLetterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isKetuaRt() === true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'pemohon_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role', Roles::WARGA)),
            ],
            'jenis_surat' => ['required', 'string', Rule::in(LetterType::all())],
            'keperluan' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'pemohon_id.required' => 'Pilih warga pemohon yang terdaftar.',
            'pemohon_id.exists' => 'Pemohon harus warga terdaftar.',
            'jenis_surat.required' => 'Pilih jenis surat.',
            'jenis_surat.in' => 'Jenis surat tidak valid.',
            'keperluan.required' => 'Keperluan wajib diisi.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'pemohon_id' => 'pemohon',
            'jenis_surat' => 'jenis surat',
            'keperluan' => 'keperluan',
            'keterangan' => 'keterangan',
        ];
    }
}
