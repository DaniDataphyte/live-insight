<?php

protected $listen = [
    'Statamic\Events\EntrySaved' => [
        'App\Listeners\TriggerNewsletterJob',
    ],
];
