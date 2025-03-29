<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\FirebaseAuthController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;



// ✅ Firebase Authentication
Route::post('/auth/firebase', [FirebaseAuthController::class, 'loginWithFirebase']);
Route::post('/logout', [FirebaseAuthController::class, 'logout']);


Route::middleware(['auth:platform', 'firebase.auth'])->group(function () {
    Route::get('/user/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::post('/user/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/user/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
});

