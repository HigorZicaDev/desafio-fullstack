<?php

use App\Http\Controllers\PlanController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/', function () {
    return response()->json(['message' => 'ok']);
});

Route::apiResource('plans', PlanController::class, ['only' => 'index']);

Route::apiSingleton('user', UserController::class, ['only' => 'show']);

Route::prefix('contracts')->group(function () {
    Route::get('active', [ContractController::class, 'getActiveContract']);
    Route::post('subscribe', [ContractController::class, 'subscribe']);
    Route::post('change-plan', [ContractController::class, 'changePlan']);
});

Route::prefix('payments')->group(function () {
    Route::get('pending', [PaymentController::class, 'getAllPendingPayment']);
    Route::post('{payment}/generate-pix', [PaymentController::class, 'generatePix']);
    Route::post('{payment}/confirm', [PaymentController::class, 'confirmPayment']);
});