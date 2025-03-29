<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckArticleAccess
{
    public function handle($request, Closure $next)
    {
        $user = auth()->guard('web')->user();
        $entry = $request->route()->parameter('entry');
        $accessLevel = $entry->get('access_level');
    
        // Always allow funded and sponsored articles
        if (in_array($accessLevel, ['funded', 'sponsored'])) {
            return $next($request);
        }
    
        if ($accessLevel === 'free') {
            if ($user->remaining_free_articles > 0) {
                $user->decrement('remaining_free_articles');
    
                // ✅ Track free article usage based on entry ID
                \DB::table('article_tracking')->insert([
                    'platform_user_id' => $user->id,
                    'entry_id' => $entry->id(),
                    'access_level' => 'free',
                    'created_at' => now()
                ]);
    
                return $next($request);
            }
    
            return redirect('/subscription')->with('openModal', 'upgrade');
        }
    
        if ($accessLevel === 'premium') {
            if ($user->subscription_active && $user->subscription_expires_at >= now()) {
                return $next($request);
            }
    
            return redirect('/subscription/renew')->with('openModal', 'renew');
        }
    
        return redirect('/login')->with('openModal', 'login');
    }
}