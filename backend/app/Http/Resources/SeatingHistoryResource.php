<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeatingHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'table_code' => $this->table->code,
            'party_name' => $this->party->name,
            'party_size' => $this->party->size,
            'seated_at' => $this->seated_at->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'duration_minutes' => $this->duration_minutes,
        ];
    }
}
