<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            ['code' => 'A', 'capacity' => 2],
            ['code' => 'B', 'capacity' => 4],
            ['code' => 'C', 'capacity' => 6],
            ['code' => 'D', 'capacity' => 8],
        ];

        foreach ($tables as $table) {
            Table::updateOrCreate(['code' => $table['code']], $table);
        }
    }
}
