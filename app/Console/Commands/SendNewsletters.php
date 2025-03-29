<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Statamic\Facades\Entry;
use Statamic\Facades\Antlers;
use Illuminate\Support\Facades\Log;
use Statamic\View\Antlers\AntlersString;

class SendNewsletters extends Command
{
    protected $signature = 'newsletter:send';
    protected $description = 'Send newsletters to subscribers based on their preferred categories';

    public function handle()
    {
        Log::info("Starting newsletter sending process...");

        $newsletters = Entry::query()
            ->where('collection', 'newsletters')
            ->where(function ($query) {
                $query->where('send_now', true)
                    ->orWhere('date', '<=', now());
            })
            ->where('published', true)
            ->get();

        if ($newsletters->isEmpty()) {
            Log::info("No newsletters found to send.");
            return;
        }

        foreach ($newsletters as $newsletter) {
            Log::info("Processing newsletter: " . $newsletter->get('title'));

            $targetGroups = (array) $newsletter->get('preferred', []);

            $subscribers = Entry::query()->where('collection', 'subscribers')->get()
                ->filter(function ($subscriber) use ($targetGroups) {
                    $subscriberGroups = $subscriber->get('preferred', '[]');

                    // Ensure it's an array (decode JSON if needed)
                    if (is_string($subscriberGroups)) {
                        $subscriberGroups = json_decode($subscriberGroups, true) ?? [];
                    }

                    return count(array_intersect($subscriberGroups, $targetGroups)) > 0;
                });

            if ($subscribers->isEmpty()) {
                Log::info("No matching subscribers for newsletter: " . $newsletter->get('title'));
                continue;
            }

            // Load the Antlers template from resources/views/newsletters/show.antlers.html
            $templatePath = resource_path('views/newsletters/show.antlers.html');
            if (!file_exists($templatePath)) {
                Log::error("Newsletter template not found: " . $templatePath);
                continue;
            }
            $antlersTemplate = file_get_contents($templatePath);

            // Ensure `content` is always a string
            $content = $newsletter->get('content', '');

            if ($content instanceof AntlersString) {
                $content = $content->value(); // Convert AntlersString to a raw string
            } elseif (is_array($content)) {
                // Flatten nested arrays into a string
                $content = $this->flattenArrayToString($content);
            }

            // Prepare data for Antlers template
            $variables = [
                'entry' => $newsletter->toAugmentedArray(),
                'content' => $content,
                'site_url' => config('app.url'),
            ];

            // Render the Antlers template with newsletter content
            $htmlContent = (string) Antlers::parse($antlersTemplate, $variables);

            foreach ($subscribers as $subscriber) {
                $email = $subscriber->get('email');

                Log::info("Preparing to send email to: " . $email);

                Mail::send([], [], function ($message) use ($subscriber, $newsletter, $htmlContent) {
                    $message->from(config('mail.from.address'), config('mail.from.name'))
                        ->to($subscriber->get('email'))
                        ->subject($newsletter->get('title'))
                        ->html($htmlContent);
                });

                Log::info("Email successfully sent to: " . $email);
            }

            Log::info("Completed sending newsletter: " . $newsletter->get('title'));
        }

        Log::info("Newsletter sending process finished.");
    }

    /**
     * Helper function to convert nested arrays into a readable string.
     */
    private function flattenArrayToString($array): string
    {
        $result = [];

        array_walk_recursive($array, function ($value) use (&$result) {
            $result[] = is_string($value) ? $value : json_encode($value);
        });

        return implode("\n", $result);
    }
}
