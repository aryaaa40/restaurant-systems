<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Party extends Model
{
    protected $fillable = ['name', 'size', 'status', 'arrived_at'];

    protected $casts = [
        'arrived_at' => 'datetime',
    ];

    public function seatings(): HasMany
    {
        return $this->hasMany(Seating::class);
    }
}
