<?php

namespace App\Services;

use App\Models\Party;
use App\Models\Seating;
use App\Models\Table;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class SeatingService
{
    
    public const STATUS_CACHE_KEY = 'restaurant:status';
    public const STATUS_CACHE_TTL = 10;

    public function findBestTable(int $partySize): ?Table
    {
        return Table::query()
            ->where('capacity', '>=', $partySize)
            ->whereDoesntHave('seatings', fn ($q) => $q->whereNull('completed_at'))
            ->orderBy('capacity', 'asc')
            ->first();
    }

    public function seatPartyAtTable(Party $party, Table $table): Seating
    {
        $durationMinutes = ($party->size * 15) + random_int(5, 15);
        $seatedAt = now();

        $seating = Seating::create([
            'party_id' => $party->id,
            'table_id' => $table->id,
            'seated_at' => $seatedAt,
            'duration_minutes' => $durationMinutes,
            'estimated_end_at' => $seatedAt->copy()->addMinutes($durationMinutes),
        ]);

        $party->update(['status' => 'seated']);

        Cache::forget(self::STATUS_CACHE_KEY);

        return $seating;
    }

    public function assignPartyToTable(Party $party, Table $table): void
    {
        if ($party->status !== 'waiting') {
            throw new \RuntimeException('Party is not waiting.');
        }

        if ($table->currentSeating) {
            throw new \RuntimeException('Table is not available.');
        }

        if ($party->size > $table->capacity) {
            throw new \RuntimeException('Party size exceeds table capacity.');
        }

        $this->seatPartyAtTable($party, $table);
    }

    public function priorityQueue()
    {
        return Party::query()
            ->where('status', 'waiting')
            ->orderBy('size', 'desc')
            ->orderBy('arrived_at', 'asc')
            ->get();
    }


    public function arrivePartyOrQueue(string $name, int $size): Party
    {
        $party = Party::create([
            'name' => $name,
            'size' => $size,
            'status' => 'waiting',
            'arrived_at' => now(),
        ]);

        Cache::forget(self::STATUS_CACHE_KEY);

        $table = $this->findBestTable($size);

        if ($table) {
            $this->seatPartyAtTable($party, $table);
        }

        return $party->fresh();
    }


    public function forceComplete(Table $table): void
    {
        $seating = $table->currentSeating;

        if (! $seating) {
            return;
        }

        $seating->update(['completed_at' => now()]);
        $seating->party->update(['status' => 'completed']);

        Cache::forget(self::STATUS_CACHE_KEY);

    }
}
