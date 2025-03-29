<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Statamic\Entries\Entry;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    public function show($slug, Request $request)
    {

        \Log::info('🔍 Incoming API request:', [
            'headers' => $request->headers->all(),
            'auth_user' => Auth::guard('platform')->user(),
            'auth_check' => Auth::guard('platform')->check()
        ]);


        $user = Auth::guard('platform')->user();

        // ✅ Fetch the post dynamically using slug
        $entry = Entry::query()
            ->where('slug', $slug)
            ->firstOrFail();

        if ($user) {
            // ✅ Check if user has already accessed the post this month
            $hasAccessed = DB::table('article_tracking')
                ->where('platform_user_id', $user->id)
                ->where('entry_id', $entry->id()) // ✅ Use UUID-based ID
                ->whereMonth('created_at', now()->month)
                ->exists();

            if (!$hasAccessed) {
                // ✅ Track the view and reduce the count (if applicable)
                DB::table('article_tracking')->insert([
                    'platform_user_id' => $user->id,
                    'entry_id' => $entry->id(),
                    'access_level' => $entry->get('access_level'),
                    'created_at' => now()
                ]);

                // ✅ Reduce free article count only for 'free' articles
                if ($entry->get('access_level') === 'free' && $user->remaining_free_articles > 0) {
                    // Temporarily disabled decrementing the remaining_free_articles counter to allow unlimited access
                    // $user->decrement('remaining_free_articles');
                }
            }

            // ✅ If AJAX request → return JSON response
            if ($request->ajax()) {
                return response()->json([
                    'remaining_free_articles' => $user->remaining_free_articles,
                    'subscription_active' => $user->subscription_active,
                ]);
            }
        }

        // ✅ Return the post view for non-AJAX requests
        return view('post.show', compact('entry'));
    }
}






