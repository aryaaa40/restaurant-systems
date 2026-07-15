<?php

use App\Models\Table;
use Database\Seeders\TableSeeder;

beforeEach(function () {
    $this->seed(TableSeeder::class);
});

it('rejects arrive request with a party size larger than the biggest table', function () {
    $response = $this->postJson('/api/arrive', [
        'name' => 'Too Big',
        'size' => 9,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('size');
});

it('rejects arrive request with missing name', function () {
    $response = $this->postJson('/api/arrive', [
        'size' => 2,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('name');
});

it('returns table status and queue via GET /api/status', function () {
    $this->postJson('/api/arrive', ['name' => 'Guest', 'size' => 2]);

    $response = $this->getJson('/api/status');

    $response->assertOk()
        ->assertJsonStructure([
            'tables' => [['id', 'code', 'capacity', 'status', 'seating']],
            'queue',
        ]);
});

it('force completes via POST /api/serve and reflects it in history', function () {
    $this->postJson('/api/arrive', ['name' => 'Guest', 'size' => 2]);
    $table = Table::where('code', 'A')->first();

    $this->postJson('/api/serve', ['table_id' => $table->id])
        ->assertOk();

    $this->getJson('/api/history')
        ->assertOk()
        ->assertJsonCount(1, 'history');
});
