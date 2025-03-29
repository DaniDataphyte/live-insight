<?php

use App\Http\Controllers\Auth\FirebaseAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsletterController;
// use App\Gateways\PaystackGateway;
// use App\Http\Controllers\CartController;
use App\Http\Controllers\PubDownloadController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;




// ✅ Ensure Subscription Access for Platform Users
Route::get('/post/{slug}', [PostController::class, 'show'])
    ->middleware(['check.subscription'])
    ->name('post.show');


Route::get('/profile', function () {
    if (!Auth::guard('platform')->check()) {
        return redirect('/login'); // Redirect unauthenticated users
    }
    return view('user.profile'); // Load profile page
})->name('profile');



// ✅ Authentication Routes for Platform Users
Route::post('/auth/firebase', [FirebaseAuthController::class, 'loginWithFirebase'])->name('auth.firebase');
Route::post('/logout', [FirebaseAuthController::class, 'logout'])->name('logout');


// ✅ Newsletter Collection
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

// ✅ Publications Download Tracking
Route::post('/download', [PubDownloadController::class, 'download'])->name('pub.download');
Route::get('/download-file/{id}', [PubDownloadController::class, 'downloadFile'])->name('pub.download.file');

//Search route
Route::statamic('search', 'search', [
    'title' => 'Search Result'
]);

//Paystack
// Route::post('/webhook/paystack', [\App\Gateways\PaystackGateway::class, 'webhook']);

// Route cart store
// 