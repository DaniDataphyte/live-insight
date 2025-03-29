<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class PlatformUser extends Authenticatable
{
    protected $fillable = [
        'firebase_uid', 'email', 'fullname', 'bio', 'gender',
        'dob', 'country', 'profession', 'profile_display', 'password',
        'remaining_free_articles', 'subscription_active', 'subscription_expires_at',
        'last_login_at', 'remember_token' // ✅ Include remember_token
    ];

    protected $hidden = ['password', 'remember_token'];

    // ✅ Extract first name from fullname
    public function getFirstnameAttribute()
    {
        return explode(' ', $this->fullname)[0] ?? '';
    }

    // ✅ Extract last name from fullname
    public function getLastnameAttribute()
    {
        $parts = explode(' ', $this->fullname);
        return count($parts) > 1 ? end($parts) : '';
    }
}
