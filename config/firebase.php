<?php


declare(strict_types=1);

return [
    'default' => env('FIREBASE_PROJECT', 'dataphyte-insight'),

    'projects' => [
        env('FIREBASE_PROJECT') => [
            'credentials' => env('FIREBASE_CREDENTIALS', env('GOOGLE_APPLICATION_CREDENTIALS')),

            // ✅ Disable Firestore & Database since they are not used
            'database' => [
                'url' => null,
            ],

            'firestore' => [
                'database' => null,
            ],

            'storage' => [
                'default_bucket' => env('FIREBASE_STORAGE_DEFAULT_BUCKET'),
            ],
        ],
    ],
];
