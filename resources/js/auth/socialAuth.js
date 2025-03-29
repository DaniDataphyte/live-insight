import { 
    auth, 
    signInWithPopup, 
    googleProvider, 
    appleProvider, 
    facebookProvider, 
    twitterProvider 
} from "../firebase";
import axios from "axios";

export default function socialAuth() {
    return {
        signInWithGoogle() {
            this.handleSocialLogin(googleProvider);
        },

        signInWithApple() {
            this.handleSocialLogin(appleProvider);
        },

        signInWithFacebook() {
            this.handleSocialLogin(facebookProvider);
        },

        signInWithTwitter() {
            this.handleSocialLogin(twitterProvider);
        },

        // ✅ Centralized Social Login Handler
        handleSocialLogin(provider) {
            sessionStorage.setItem("redirectAfterLogin", window.location.href);

            signInWithPopup(auth, provider)
                .then(result => {
                    this.syncFirebaseUser(result.user);
                })
                .catch(error => {
                    console.error(`❌ ${provider.providerId} login failed:`, error);
                });
        },

        // ✅ Sync Firebase User with Backend
        syncFirebaseUser(firebaseUser) {
            if (!firebaseUser) return;

            console.log("✅ Syncing Firebase user:", firebaseUser);

            axios.post('/auth/firebase', { firebase_user: firebaseUser })
                .then(response => {
                    if (response.data.status === 'success') {
                        Alpine.store('auth').updateAuthStatus(
                            true,
                            response.data.user.profile_display,
                            response.data.user.remaining_free_articles,
                            response.data.user.subscription_active
                        );

                        Alpine.store('modalManager')?.closeAllModals();

                        // ✅ Dispatch event to update UI
                        document.dispatchEvent(new CustomEvent('auth-updated'));

                        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
                        sessionStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirectUrl;
                    }
                })
                .catch(error => {
                    console.error('❌ Firebase login sync failed:', error);
                });
        }
    };
}



// import {
//     auth,
//     signInWithPopup,
//     googleProvider,
//     appleProvider,
//     facebookProvider,
//     twitterProvider
// } from "../firebase";
// import axios from "axios";

// export default function socialAuth() {
//     return {
//         signInWithGoogle() {
//             this.handleSocialLogin(googleProvider);
//         },

//         signInWithApple() {
//             this.handleSocialLogin(appleProvider);
//         },

//         signInWithFacebook() {
//             this.handleSocialLogin(facebookProvider);
//         },

//         signInWithTwitter() {
//             this.handleSocialLogin(twitterProvider);
//         },

//         // ✅ Centralized Social Login Handler
//         async handleSocialLogin(provider) {
//             sessionStorage.setItem("redirectAfterLogin", window.location.href);

//             try {
//                 const result = await signInWithPopup(auth, provider);

//                 console.log("✅ Social login successful:", result.user);

//                 // ✅ Get Firebase token
//                 const idToken = await result.user.getIdToken();

//                 // ✅ Sync user with backend (platform guard)
//                 await this.syncFirebaseUser(result.user, idToken);
//             } catch (error) {
//                 console.error(`❌ ${provider.providerId} login failed:`, error);
//             }
//         },

//         // ✅ Sync Firebase User with Backend (Platform User)
//         async syncFirebaseUser(firebaseUser, idToken) {
//             if (!firebaseUser) return;

//             console.log("✅ Syncing Firebase user with platform:", firebaseUser);

//             try {
//                 const response = await axios.post('/auth/firebase',
//                     { firebase_user: firebaseUser },
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${idToken}`,
//                             'X-Auth-Guard': 'platform'
//                         }
//                     }
//                 );

//                 if (response.data.status === 'success') {
//                     console.log('✅ Firebase login sync successful:', response.data);

//                     const user = response.data.user;
//                     Alpine.store('auth').updateAuthStatus(
//                         true,
//                         user.profile_display || '/assets/default-avatar.png',
//                         user.remaining_free_articles || 0,
//                         user.subscription_active || false
//                     );

//                     Alpine.store('modalManager')?.closeAllModals();
//                     document.dispatchEvent(new CustomEvent('auth-updated'));

//                     // ✅ Redirect after login
//                     const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
//                     sessionStorage.removeItem('redirectAfterLogin');
//                     window.location.href = redirectUrl;
//                 }
//             } catch (error) {
//                 console.error('❌ Firebase login sync failed:', error);

//                 if (error.response) {
//                     console.warn("⚠️ Response Status:", error.response.status);
//                     console.warn("⚠️ Response Headers:", error.response.headers);
//                     console.warn("⚠️ Response Data:", error.response.data);
//                 }
//             }
//         }
        

//         async syncFirebaseUser(firebaseUser, idToken) {
//             if (!firebaseUser) return;

//             console.log("✅ Syncing Firebase user with platform:", firebaseUser);

//             try {
//                 const response = await axios.post('/auth/firebase',
//                     { firebase_user: firebaseUser },
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${idToken}`,
//                             'X-Auth-Guard': 'platform' // ✅ Target platform guard explicitly
//                         }
//                     }
//                 );

//                 if (response.data.status === 'success') {
//                     console.log('✅ Firebase login sync successful:', response.data);

//                     const user = response.data.user;

//                     // ✅ Update Alpine store with platform user data
//                     Alpine.store('auth').updateAuthStatus(
//                         true,
//                         user.profile_display || '/assets/default-avatar.png',
//                         user.remaining_free_articles || 0,
//                         user.subscription_active || false
//                     );

//                     Alpine.store('modalManager')?.closeAllModals();

//                     // ✅ Dispatch event to update UI
//                     document.dispatchEvent(new CustomEvent('auth-updated'));

//                     // ✅ Redirect after login
//                     const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
//                     sessionStorage.removeItem('redirectAfterLogin');
//                     window.location.href = redirectUrl;
//                 }
//             } catch (error) {
//                 console.error('❌ Firebase login sync failed:', error);

//                 if (error.response) {
//                     console.warn("⚠️ Response Status:", error.response.status);
//                     console.warn("⚠️ Response Headers:", error.response.headers);
//                     console.warn("⚠️ Response Data:", error.response.data);
//                 }
//             }
//         }
//     };
// }





// import {
//     auth,
//     signInWithPopup,
//     googleProvider,
//     appleProvider,
//     facebookProvider,
//     twitterProvider
// } from "../firebase";
// import axios from "axios";

// export default function socialAuth() {
//     return {
//         signInWithGoogle() {
//             this.handleSocialLogin(googleProvider);
//         },

//         signInWithApple() {
//             this.handleSocialLogin(appleProvider);
//         },

//         signInWithFacebook() {
//             this.handleSocialLogin(facebookProvider);
//         },

//         signInWithTwitter() {
//             this.handleSocialLogin(twitterProvider);
//         },

//         // ✅ Centralized Social Login Handler
//         async handleSocialLogin(provider) {
//             sessionStorage.setItem("redirectAfterLogin", window.location.href);

//             try {
//                 const result = await signInWithPopup(auth, provider);

//                 console.log("✅ Social login successful:", result.user);

//                 // ✅ Get Firebase token
//                 const idToken = await result.user.getIdToken();

//                 // ✅ Sync user with backend (platform guard)
//                 await this.syncFirebaseUser(result.user, idToken);
//             } catch (error) {
//                 console.error(`❌ ${provider.providerId} login failed:`, error);
//             }
//         },

//         // ✅ Sync Firebase User with Backend (Platform User)
//         async syncFirebaseUser(firebaseUser, idToken) {
//             if (!firebaseUser) return;

//             console.log("✅ Syncing Firebase user with platform:", firebaseUser);

//             try {
//                 const response = await axios.post('/auth/firebase',
//                     { firebase_user: firebaseUser },
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${idToken}`
//                         }
//                     }
//                 );

//                 if (response.data.status === 'success') {
//                     console.log('✅ Firebase login sync successful:', response.data);

//                     const user = response.data.user;

//                     // ✅ Update Alpine store with platform user data
//                     Alpine.store('auth').updateAuthStatus(
//                         true,
//                         user.profile_display || '/assets/default-avatar.png',
//                         user.remaining_free_articles || 0,
//                         user.subscription_active || false
//                     );

//                     Alpine.store('modalManager')?.closeAllModals();

//                     // ✅ Dispatch event to update UI
//                     document.dispatchEvent(new CustomEvent('auth-updated'));

//                     // ✅ Redirect after login
//                     const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
//                     sessionStorage.removeItem('redirectAfterLogin');
//                     window.location.href = redirectUrl;
//                 }
//             } catch (error) {
//                 console.error('❌ Firebase login sync failed:', error);

//                 if (error.response) {
//                     console.warn("⚠️ Response Status:", error.response.status);
//                     console.warn("⚠️ Response Headers:", error.response.headers);
//                     console.warn("⚠️ Response Data:", error.response.data);
//                 }
//             }
//         }
//     };
// }



// //

// import {
//     auth,
//     signInWithPopup,
//     googleProvider,
//     appleProvider,
//     facebookProvider,
//     twitterProvider
// } from "../firebase";
// import axios from "axios";

// export default function socialAuth() {
//     return {
//         signInWithGoogle() {
//             this.handleSocialLogin(googleProvider);
//         },

//         signInWithApple() {
//             this.handleSocialLogin(appleProvider);
//         },

//         signInWithFacebook() {
//             this.handleSocialLogin(facebookProvider);
//         },

//         signInWithTwitter() {
//             this.handleSocialLogin(twitterProvider);
//         },

//         // ✅ Centralized Social Login Handler
//         handleSocialLogin(provider) {
//             sessionStorage.setItem("redirectAfterLogin", window.location.href);

//             signInWithPopup(auth, provider)
//                 .then(result => {
//                     this.syncFirebaseUser(result.user);
//                 })
//                 .catch(error => {
//                     console.error(`❌ ${provider.providerId} login failed:`, error);
//                 });
//         },

//         // ✅ Sync Firebase User with Backend
//         syncFirebaseUser(firebaseUser) {
//             if (!firebaseUser) return;

//             console.log("✅ Syncing Firebase user:", firebaseUser);

//             axios.post('/auth/firebase', { firebase_user: firebaseUser })
//                 .then(response => {
//                     if (response.data.status === 'success') {
//                         Alpine.store('auth').updateAuthStatus(
//                             true,
//                             response.data.user.profile_display,
//                             response.data.user.remaining_free_articles,
//                             response.data.user.subscription_active
//                         );

//                         Alpine.store('modalManager')?.closeAllModals();

//                         // ✅ Dispatch event to update UI
//                         document.dispatchEvent(new CustomEvent('auth-updated'));

//                         const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
//                         sessionStorage.removeItem('redirectAfterLogin');
//                         window.location.href = redirectUrl;
//                     }
//                 })
//                 .catch(error => {
//                     console.error('❌ Firebase login sync failed:', error);
//                 });
//         }
//     };
// }