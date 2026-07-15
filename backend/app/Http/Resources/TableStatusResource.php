<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TableStatusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $seating = $this->currentSeating;

        return [
            'id' => $this->id,
            'code' => $this->code,
            'capacity' => $this->capacity,
            'status' => $seating ? 'occupied' : 'available',
            'seating' => $seating ? [
                'party' => [
                    'id' => $seating->party->id,
                    'name' => $seating->party->name,
                    'size' => $seating->party->size,
                ],
                'seated_at' => $seating->seated_at->toISOString(),
                'estimated_end_at' => $seating->estimated_end_at->toISOString(),
                'duration_minutes' => $seating->duration_minutes,
            ] : null,
        ];
    }
}
