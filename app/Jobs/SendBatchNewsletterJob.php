<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Statamic\Facades\Entry;

class SendBatchNewsletterJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $newsletter;

    public function __construct($newsletter)
    {
        $this->newsletter = $newsletter;
    }

    public function handle()
    {
        $targetGroups = (array) $this->newsletter->get('preferred', []);

        Entry::query()
            ->where('collection', 'subscribers')
            ->chunk(50, function ($subscribers) use ($targetGroups) {
                foreach ($subscribers as $subscriber) {
                    $subscriberGroups = json_decode($subscriber->get('preferred', '[]'), true) ?? [];

                    if (count(array_intersect($subscriberGroups, $targetGroups)) > 0) {
                        Mail::send([], [], function ($message) use ($subscriber) {
                            $message->from(config('mail.from.address'), config('mail.from.name'))
                                ->to($subscriber->get('email'))
                                ->subject($this->newsletter->get('title'))
                                ->html($this->newsletter->get('content'));
                        });
                    }
                }
            });

        // ✅ Mark newsletter as sent
        $this->newsletter->set('sent_at', now()->format('Y-m-d H:i:s'));
        $this->newsletter->save();
    }
}
