<?php

namespace App\Listeners;

use App\Jobs\SendBatchNewsletterJob;
use Statamic\Events\EntrySaved;

class TriggerNewsletterJob
{
    public function handle(EntrySaved $event)
    {
        $entry = $event->entry;

        if ($entry->collectionHandle() === 'newsletters' 
            && $entry->get('send_time') === 'now'
            && !$entry->get('sent_at')) {

            // Dispatch as a job (queue handles the load)
            SendBatchNewsletterJob::dispatch($entry);
        }
    }
}

