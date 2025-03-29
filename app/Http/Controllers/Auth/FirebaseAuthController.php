<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PlatformUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class FirebaseAuthController extends Controller
{

    public function loginWithFirebase(Request $request)
{
    $firebaseUser = $request->input('firebase_user');

    if (!$firebaseUser || !isset($firebaseUser['uid'])) {
        return response()->json(['status' => 'error', 'message' => 'Invalid Firebase user data'], 400);
    }

    // ✅ Store full name instead of first/last names separately
    $user = PlatformUser::updateOrCreate(
        ['firebase_uid' => $firebaseUser['uid']],
        [
            'email' => $firebaseUser['email'] ?? null,
            'fullname' => $firebaseUser['displayName'] ?? 'User',
            'password' => bcrypt(str()->random(16)), // ✅ Secure random password
            'profile_display' => $firebaseUser['photoURL'] ?? null,
            'remember_token' => \Illuminate\Support\Str::random(60) // ✅ Store remember token
        ]
    );

    Auth::guard('platform')->login($user, true);

    $user->update(['last_login_at' => now()]);

    return response()->json([
        'status' => 'success',
        'user' => [
            'id' => $user->id,
            'email' => $user->email,
            'fullname' => $user->fullname,
            'profile_display' => $user->profile_display,
            'remaining_free_articles' => $user->remaining_free_articles ?? 0,
            'subscription_active' => $user->subscription_active ?? false,
        ]
    ]);
}

public function logout(Request $request)
    {
        Auth::guard('web')->logout(); // ✅ Log out Laravel user
        $request->session()->invalidate(); // ✅ Invalidate session
        $request->session()->regenerateToken(); // ✅ Regenerate CSRF token

        return response()->json(['status' => 'success', 'message' => 'User logged out successfully']);
    }
}