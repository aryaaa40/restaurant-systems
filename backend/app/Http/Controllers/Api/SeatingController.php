<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArriveRequest;
use App\Http\Requests\ServeRequest;
use App\Http\Resources\PartyQueueResource;
use App\Http\Resources\SeatingHistoryResource;
use App\Http\Resources\TableStatusResource;
use App\Models\Seating;
use App\Models\Table;
use App\Services\SeatingService;
use Illuminate\Http\JsonResponse;

class SeatingController extends Controller
{
    public function __construct(private SeatingService $seatingService)
    {
    }

    public function arrive(ArriveRequest $request): JsonResponse
    {
        $party = $this->seatingService->arrivePartyOrQueue(
            $request->string('name'),
            $request->integer('size'),
        );

        return response()->json([
            'party' => [
                'id' => $party->id,
                'name' => $party->name,
                'size' => $party->size,
                'status' => $party->status,
            ],
        ], 201);
    }

    public function status(): JsonResponse
    {
        return response()->json($this->statusSnapshot());
    }

    public function serve(ServeRequest $request): JsonResponse
    {
        $table = Table::findOrFail($request->integer('table_id'));

        $this->seatingService->forceComplete($table);

        return response()->json($this->statusSnapshot());
    }

    public function history(): JsonResponse
    {
        $seatings = Seating::query()
            ->whereNotNull('completed_at')
            ->with(['party', 'table'])
            ->orderByDesc('completed_at')
            ->get();

        return response()->json([
            'history' => SeatingHistoryResource::collection($seatings),
        ]);
    }

    private function statusSnapshot(): array
    {
        $tables = Table::with('currentSeating.party')->orderBy('code')->get();

        return [
            'tables' => TableStatusResource::collection($tables),
            'queue' => PartyQueueResource::collection($this->seatingService->priorityQueue()),
        ];
    }
}
