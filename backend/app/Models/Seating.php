<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Seating extends Model
{
    protected $fillable = [
        'party_id', 'table_id', 'seated_at',
        'duration_minutes', 'estimated_end_at', 'completed_at',
    ];

    protected $casts = [
        'seated_at' => 'datetime',
        'estimated_end_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }
}
