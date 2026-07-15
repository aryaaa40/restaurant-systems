<?php

use App\Http\Controllers\Api\SeatingController;
use Illuminate\Support\Facades\Route;

Route::post('/arrive', [SeatingController::class, 'arrive']);
Route::get('/status', [SeatingController::class, 'status']);
Route::post('/serve', [SeatingController::class, 'serve']);
Route::get('/history', [SeatingController::class, 'history']);
