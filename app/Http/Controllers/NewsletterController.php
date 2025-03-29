<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // ✅ Add this
use Statamic\Facades\Entry;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'title' => 'required|string', // 'title' is used as firstname
            'lastname' => 'required|string',
            'email' => 'required|email',
            'preferred' => 'array'
        ]);

        // ✅ Check if subscriber already exists (use JSON query)
        $existingSubscriber = DB::table('entries')
            ->where('collection', 'subscribers')
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.email')) = ?", [$request->email])
            ->first();

        if ($existingSubscriber) {
            return response()->json(['message' => 'Email already subscribed!'], 409);
        }

        // ✅ Create new subscriber (Statamic Entry)
        $subscriber = Entry::make()
            ->collection('subscribers')
            ->data([
                'title' => $request->title,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'preferred' => json_encode($request->preferred),
            ]);

        $subscriber->save(); // ✅ Save entry

        return redirect('/newsletters')->with([
            'success' => "Hi {$request->title}, your subscription was successful! You are interested in receiving newsletters on: " . implode(', ', array_map(fn($topic) => ucwords(str_replace('_', ' ', $topic)), $request->preferred))
        ]);
        
    }
}
