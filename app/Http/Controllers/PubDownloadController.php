<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Entry;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use App\Mail\DownloadLinkMail;
use Illuminate\Support\Facades\Log;

class PubDownloadController extends Controller
{
    public function download(Request $request)
    {
        Log::info('Download form hit', $request->all());

        $request->validate([
            'title' => 'required', //'title' as the firstname
            'lastname' => 'required',
            'email' => 'required|email',
            'downcontent' => 'required',
            'slug' => 'required', // ✅ Ensure slug is passed
            'preferred' => 'nullable|array',
        ]);

        // ✅ Save to Content Downloads collection
        Entry::make()
            ->collection('content_downloads')
            ->data([
                'title' => $request->title,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'downloaded_content' => $request->downcontent, // Capture content name
            ])
            ->save();

        // ✅ Save to Subscribers collection if preferred options are selected
        if ($request->filled('preferred')) {
            Entry::make()
                ->collection('subscribers')
                ->data([
                    'title' => $request->title,
                    'lastname' => $request->lastname,
                    'email' => $request->email,
                    'preferred' => json_encode($request->preferred),
                ])
                ->save();
        }

        // ✅ Generate a signed download link
        $publication = Entry::query()
            ->where('collection', 'publications')
            ->where('slug', $request->slug) // Ensure slug is passed
            ->first();

        if ($publication) {
            $downloadUrl = URL::signedRoute('pub.download.file', ['id' => $publication->id]);

            try {
                Log::info('Sending email to: ' . $request->email);
                Mail::to($request->email)->send(new DownloadLinkMail($downloadUrl));
                Log::info('Email sent successfully to: ' . $request->email);
            } catch (\Exception $e) {
                Log::error('Email failed to send: ' . $e->getMessage());
                return back()->with('error', 'Failed to send download link email.');
            }

            return back()->with('success', 'Download link has been sent to your email.');
        } else {
            Log::error('Publication not found for slug: ' . $request->slug);
            return back()->with('error', 'Failed to generate download link.'); // ✅ Return proper error message
        }
    }

    public function downloadFile(Request $request, $id)
    {
        if (! $request->hasValidSignature()) {
            abort(403);
        }

        $publication = Entry::find($id);
        if ($publication) {
            $downloadPath = storage_path('app/public/publication-downloads/' . basename($publication->get('downloadable_content')));

            if (file_exists($downloadPath)) {
                // Increment download count
                $downloadCount = $publication->get('download_count', 0) + 1;
                $publication->set('download_count', $downloadCount)->save();

                return response()->download($downloadPath);
            }

            abort(404, 'File not found.');
        }

        abort(404);
    }
}
