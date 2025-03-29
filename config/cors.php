<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'user/profile', 'user/profile/*', '/auth/firebase'],

    'allowed_methods' => ['*'], // ✅ Allow all HTTP methods

    'allowed_origins' => ['*'], // ✅ Allow requests from any domain (for development)

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // ✅ Allow all headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // ✅ Important for CSRF + cookies
];