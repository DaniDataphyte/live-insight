<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Authenticate extends Middleware
{
    protected function authenticate($request, array $guards)
    {
        if (Auth::guard('platform')->user()) { // ✅ Check if user exists instead of relying on check()
            Auth::shouldUse('platform'); // ✅ Explicitly use the platform guard
            return;
        }

        $this->unauthenticated($request, $guards);
    }

    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson()) {
            abort(response()->json(['status' => 'error', 'message' => 'Unauthenticated'], 401));
        }

        redirect('/login')->send();
        exit;
    }

    protected function redirectTo($request)
    {
        return $request->expectsJson() ? null : '/login';
    }
}


