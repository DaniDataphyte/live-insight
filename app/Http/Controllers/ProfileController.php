<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // ✅ Show Profile (API + View)
    public function show(Request $request)
    {
        \Log::info('🔍 Incoming request to /profile', [
            'headers' => $request->headers->all(),
            'auth_user' => Auth::guard('platform')->user(),
            'auth_check' => Auth::guard('platform')->check(),
            'expects_json' => $request->expectsJson()
        ]);

        $user = Auth::guard('platform')->user();

        if (!$user) {
            \Log::warning("🚨 Unauthorized API request - Redirecting to login.");
            return response()->json(['status' => 'error', 'message' => 'User not authenticated'], 401); // ✅ Redirect if user is not authenticated
        }

        return response()->json([
            'status' => 'success',
            'user' => [
                'email' => $user->email,
                'firstname' => explode(' ', $user->fullname)[0] ?? '',
                'lastname' => count(explode(' ', $user->fullname)) > 1 ? explode(' ', $user->fullname)[1] : '',
                'bio' => $user->bio,
                'gender' => $user->gender,
                'dob' => $user->dob,
                'country' => $user->country,
                'profession' => $user->profession,
                'profile_display' => $user->profile_display
                    ? asset('storage/' . $user->profile_display)
                    : '/assets/default-avatar.png',
                'subscription_plan' => $user->subscription_plan ?? 'None',
                'remaining_free_articles' => $user->remaining_free_articles,
                'subscription_active' => $user->subscription_active,
            ],
        ]);


        if ($request->expectsJson()) {

            return view('profile.show', ['user' => $user]);
        }
    }


    // ✅ Update Profile Data
    public function update(Request $request)
    {
        $user = Auth::guard('platform')->user();

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'dob' => 'nullable|date',
            'country' => 'nullable|string|max:100',
            'profession' => 'nullable|string|max:100',
            'profile_display' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('profile_display')) {
            $path = $request->file('profile_display')->store('profile_pictures', 'public');
            $user->profile_display = $path;
        }

        $user->update($request->except('profile_display'));

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'profile_display' => $user->profile_display
                ? asset('storage/' . $user->profile_display)
                : '/assets/default-avatar.png'
        ]);
    }

    // ✅ Update Password
    public function updatePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);

        $user = Auth::guard('platform')->user();
        $user->update(['password' => bcrypt($request->password)]);

        return response()->json(['status' => 'success', 'message' => 'Password updated successfully']);
    }
}







