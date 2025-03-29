<?php

namespace App\Http\Middleware;

use Closure;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\InvalidToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\PlatformUser;

class FirebaseAuthMiddleware
{
    protected FirebaseAuth $auth;

    public function __construct()
    {
        $this->auth = (new Factory())
            ->withServiceAccount(config('firebase.projects.' . config('firebase.default') . '.credentials'))
            ->createAuth();
    }

    public function handle(Request $request, Closure $next)
    {
        Log::info("🔍 FirebaseAuthMiddleware Triggered");

        $token = $request->bearerToken();
        if (!$token) {
            Log::error("❌ No Firebase Token Found in Request");
            return response()->json(['message' => 'Unauthorized: No token provided'], 401);
        }

        try {
            // ✅ Verify Firebase token
            $verifiedIdToken = $this->auth->verifyIdToken($token);
            $firebaseUid = $verifiedIdToken->claims()->get('sub');
            $email = $verifiedIdToken->claims()->get('email');

            Log::info("✅ Token Verified - UID: {$firebaseUid}, Email: {$email}");

            // ✅ Fetch PlatformUser by firebase_uid or email
            $user = PlatformUser::where('firebase_uid', $firebaseUid)->orWhere('email', $email)->first();

            if (!$user) {
                Log::error("❌ No user found with Firebase UID: {$firebaseUid} or Email: {$email}");
                return response()->json(['message' => 'Unauthorized: User not found'], 401);
            }

            // ✅ Authenticate user in 'platform' guard manually
            Auth::guard('platform')->setUser($user);
            Auth::shouldUse('platform'); // ✅ Ensure the correct guard is used

            Log::info("✅ User authenticated: {$user->email}");

            return $next($request);
        } catch (InvalidToken $e) {
            Log::error("❌ Invalid Firebase Token: " . $e->getMessage());
            return response()->json(['message' => 'Unauthorized: Invalid token'], 401);
        } catch (\Exception $e) {
            Log::error("❌ Firebase Middleware Error: " . $e->getMessage());
            return response()->json(['message' => 'Unauthorized: Middleware error'], 401);
        }
    }
}


