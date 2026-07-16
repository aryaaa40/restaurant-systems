<?php

use App\Models\Party;
use App\Models\Table;
use App\Services\SeatingService;
use Database\Seeders\TableSeeder;

beforeEach(function () {
    $this->seed(TableSeeder::class);
    $this->service = new SeatingService();
});

it('assigns the smallest table that still fits the party (best-fit, no oversize)', function () {
    $party = $this->service->arrivePartyOrQueue('Test Party', 3);

    expect($party->status)->toBe('seated');
    expect($party->seatings()->first()->table->code)->toBe('B'); // capacity 4, bukan C(6)/D(8)
});

it('returns null when no table can fit the party', function () {
    $table = $this->service->findBestTable(10);

    expect($table)->toBeNull();
});

it('queues a party when no table is available', function () {
    $this->service->arrivePartyOrQueue('A', 2);
    $this->service->arrivePartyOrQueue('B', 4);
    $this->service->arrivePartyOrQueue('C', 6);
    $this->service->arrivePartyOrQueue('D', 8);

    $party = $this->service->arrivePartyOrQueue('Waiting Guy', 2);

    expect($party->status)->toBe('waiting');
});

it('orders the waiting queue by party size descending, not FIFO', function () {
    $this->service->arrivePartyOrQueue('A', 2);
    $this->service->arrivePartyOrQueue('B', 4);
    $this->service->arrivePartyOrQueue('C', 6);
    $this->service->arrivePartyOrQueue('D', 8);

    $this->service->arrivePartyOrQueue('Small', 2);
    $this->service->arrivePartyOrQueue('Big', 5);

    $queue = $this->service->priorityQueue();

    expect($queue->first()->name)->toBe('Big')
        ->and($queue->last()->name)->toBe('Small');
});

it('breaks ties in the queue by arrival time (FIFO among equal sizes)', function () {
    $this->service->arrivePartyOrQueue('A', 2);
    $this->service->arrivePartyOrQueue('B', 4);
    $this->service->arrivePartyOrQueue('C', 6);
    $this->service->arrivePartyOrQueue('D', 8);

    $this->service->arrivePartyOrQueue('First', 3);
    $this->service->arrivePartyOrQueue('Second', 3);

    $queue = $this->service->priorityQueue();

    expect($queue->first()->name)->toBe('First')
        ->and($queue->get(1)->name)->toBe('Second');
});

it('computes meal duration within the (size*15)+random(5,15) range', function () {
    $party = $this->service->arrivePartyOrQueue('Test', 4);
    $duration = $party->seatings()->first()->duration_minutes;

    expect($duration)->toBeGreaterThanOrEqual(4 * 15 + 5)
        ->and($duration)->toBeLessThanOrEqual(4 * 15 + 15);
});

it('force completes a table and frees it', function () {
    $party = $this->service->arrivePartyOrQueue('Test', 2);
    $table = Table::where('code', 'A')->first();

    $this->service->forceComplete($table);

    expect($table->refresh()->currentSeating)->toBeNull()
        ->and($party->fresh()->status)->toBe('completed');
});

it('does not auto-reassign a waiting party when a table is freed', function () {
    $this->service->arrivePartyOrQueue('A', 2);
    $this->service->arrivePartyOrQueue('B', 4);
    $this->service->arrivePartyOrQueue('C', 6);
    $this->service->arrivePartyOrQueue('D', 8);

    $this->service->arrivePartyOrQueue('Waiting Guy', 2);

    $tableA = Table::where('code', 'A')->first();
    $this->service->forceComplete($tableA);

    $waitingGuy = Party::where('name', 'Waiting Guy')->first();

    expect($tableA->refresh()->currentSeating)->toBeNull()
        ->and($waitingGuy->fresh()->status)->toBe('waiting');
});

it('manually assigns a waiting party to an available table', function () {
    $this->service->arrivePartyOrQueue('A', 2);
    $this->service->arrivePartyOrQueue('B', 4);
    $this->service->arrivePartyOrQueue('C', 6);
    $this->service->arrivePartyOrQueue('D', 8);

    $this->service->arrivePartyOrQueue('Waiting Guy', 2);

    $tableA = Table::where('code', 'A')->first();
    $this->service->forceComplete($tableA);

    $waitingGuy = Party::where('name', 'Waiting Guy')->first();
    $this->service->assignPartyToTable($waitingGuy, $tableA->refresh());

    expect($waitingGuy->fresh()->status)->toBe('seated')
        ->and($tableA->refresh()->currentSeating->party->name)->toBe('Waiting Guy');
});

it('rejects manual assignment when the party is not waiting', function () {
    $party = $this->service->arrivePartyOrQueue('Already Seated', 2);
    $tableB = Table::where('code', 'B')->first();

    expect(fn () => $this->service->assignPartyToTable($party, $tableB))
        ->toThrow(\RuntimeException::class, 'Party is not waiting.');
});

it('rejects manual assignment when the table is already occupied', function () {
    $this->service->arrivePartyOrQueue('A', 2);
    $this->service->arrivePartyOrQueue('B', 4);
    $this->service->arrivePartyOrQueue('C', 6);
    $this->service->arrivePartyOrQueue('D', 8);

    $waitingParty = $this->service->arrivePartyOrQueue('Waiting Guy', 2);
    $tableA = Table::where('code', 'A')->first();

    expect(fn () => $this->service->assignPartyToTable($waitingParty, $tableA))
        ->toThrow(\RuntimeException::class, 'Table is not available.');
});

it('rejects manual assignment when the party is larger than the table capacity', function () {
    $this->service->arrivePartyOrQueue('A', 2);
    $this->service->arrivePartyOrQueue('B', 4);
    $this->service->arrivePartyOrQueue('C', 6);
    $this->service->arrivePartyOrQueue('D', 8);

    $bigParty = $this->service->arrivePartyOrQueue('Big Guy', 6);
    $tableA = Table::where('code', 'A')->first();
    $this->service->forceComplete($tableA);

    expect(fn () => $this->service->assignPartyToTable($bigParty->fresh(), $tableA->refresh()))
        ->toThrow(\RuntimeException::class, 'Party size exceeds table capacity.');
});

