<?php

namespace App\Services;

use App\Models\PlatformUser;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\AuthException;

class FirebaseAuthService
{
    protected $firebaseAuth;

    public function __construct(FirebaseAuth $firebaseAuth)
    {
        $this->firebaseAuth = $firebaseAuth;
    }

    /**
    * Verify a Firebase ID token
    *
    * @param string $idToken
    * @return array
    * @throws \InvalidArgumentException
    */
    public function verifyFirebaseToken(string $idToken): array
    {
        try {
            $verifiedIdToken = $this->firebaseAuth->verifyIdToken($idToken);
            return $verifiedIdToken->claims()->all();
        } catch (FailedToVerifyToken $e) {
            Log::error('Firebase token verification failed', ['error' => $e->getMessage()]);
            throw new \InvalidArgumentException('Invalid Firebase token');
        } catch (\Exception $e) {
            Log::error('Firebase authentication error', ['error' => $e->getMessage()]);
            throw new \InvalidArgumentException('Firebase authentication failed');
        }
    }

    /**
    * Create or update a platform user from Firebase user data
    *
    * @param array $firebaseUser
    * @return PlatformUser
    */
    public function createOrUpdateUser(array $firebaseUser): PlatformUser
    {
        try {
            $user = PlatformUser::where('firebase_uid', $firebaseUser['uid'])->first();

            if (!$user) {
                return $this->createPlatformUser($firebaseUser);
            }

            return $this->syncUserData($firebaseUser, $user);
        } catch (\Exception $e) {
            Log::error('Failed to create/update platform user', [
                'firebase_uid' => $firebaseUser['uid'] ?? null,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
    * Sync user data between Firebase and platform user
    *
    * @param array $firebaseUser
    * @param PlatformUser|null $user
    * @return PlatformUser
    */
    public function syncUserData(array $firebaseUser, ?PlatformUser $user): PlatformUser
    {
        if (!$user) {
            return $this->createPlatformUser($firebaseUser);
        }

        $user->update([
            'email' => $firebaseUser['email'] ?? $user->email,
            'name' => $firebaseUser['displayName'] ?? $user->name,
            'avatar_url' => $firebaseUser['photoURL'] ?? $user->avatar_url,
            'email_verified_at' => $firebaseUser['emailVerified'] ? now() : $user->email_verified_at,
        ]);

        return $user;
    }

    /**
    * Get a platform user by Firebase UID
    *
    * @param string $firebaseUid
    * @return PlatformUser|null
    */
    public function getUserByFirebaseUid(string $firebaseUid): ?PlatformUser
    {
        return PlatformUser::where('firebase_uid', $firebaseUid)->first();
    }

    /**
    * Create a new platform user from Firebase data
    *
    * @param array $firebaseUser
    * @return PlatformUser
    */
    protected function createPlatformUser(array $firebaseUser): PlatformUser
    {
        return PlatformUser::create([
            'firebase_uid' => $firebaseUser['uid'],
            'email' => $firebaseUser['email'],
            'name' => $firebaseUser['displayName'] ?? 'New User',
            'avatar_url' => $firebaseUser['photoURL'] ?? null,
            'email_verified_at' => $firebaseUser['emailVerified'] ? now() : null,
            'status' => 'active'
        ]);
    }
}

