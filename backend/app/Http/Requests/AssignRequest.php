<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'party_id' => ['required', 'integer', 'exists:parties,id'],
            'table_id' => ['required', 'integer', 'exists:tables,id'],
        ];
    }
}
