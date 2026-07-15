<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Table extends Model
{
    protected $fillable = ['code', 'capacity'];

    public function seatings(): HasMany
    {
        return $this->hasMany(Seating::class);
    }

    public function currentSeating(): HasOne
    {
        return $this->hasOne(Seating::class)->whereNull('completed_at')->latestOfMany();
    }
}
