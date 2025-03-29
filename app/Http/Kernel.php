<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
use Illuminate\Console\Scheduling\Schedule;

class Kernel extends HttpKernel
{

    // ✅ Merge all middleware definitions into one array
    protected $routeMiddleware = [
        'article.access' => \App\Http\Middleware\CheckArticleAccess::class,
        'check.subscription' => \App\Http\Middleware\CheckSubscriptionStatus::class,
        'firebase.auth' => \App\Http\Middleware\FirebaseAuthMiddleware::class,
        'auth' => \App\Http\Middleware\Authenticate::class,
    ];

    // ✅ Ensure scheduled tasks are correctly handled
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('articles:reset')->monthly();
    }

    // ✅ Middleware groups for different request types
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class, // ✅ CSRF Protection
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,

        ],
    ];

}