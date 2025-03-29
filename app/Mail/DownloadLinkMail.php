<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DownloadLinkMail extends Mailable
{
    use Queueable, SerializesModels;

    public $downloadUrl;

    public function __construct($downloadUrl)
    {
        $this->downloadUrl = $downloadUrl;
    }

    public function build()
    {
        return $this->subject('Your Download Link')
                    ->view('emails.download-link')
                    ->with([
                        'downloadUrl' => $this->downloadUrl
                    ]);
    }
}
