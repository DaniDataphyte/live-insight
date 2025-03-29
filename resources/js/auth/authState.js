import { auth, onAuthStateChanged } from "../firebase";
import axios from "axios";

export default function authState() {
    return {
        isLoggedIn: false,
        userProfileImage: "/assets/default-avatar.png",
        remainingFreeArticles: 0,
        userSubscriptionActive: false,
        hasCheckedFirebaseLogin: false,

        // ✅ Update user authentication status
        updateAuthStatus(isLoggedIn, profileImage, remainingArticles = 0, subscriptionActive = false) {
            this.isLoggedIn = isLoggedIn;
            this.userProfileImage = profileImage || "/assets/default-avatar.png";
            this.remainingFreeArticles = remainingArticles;
            this.userSubscriptionActive = subscriptionActive;

            console.log("✅ Auth state updated:", {
                isLoggedIn: this.isLoggedIn,
                profileImage: this.userProfileImage,
                remainingFreeArticles: this.remainingFreeArticles,
                userSubscriptionActive: this.userSubscriptionActive
            });

            Alpine.nextTick(() => {
                document.dispatchEvent(new CustomEvent("auth-updated"));
            });
        },

        // ✅ Initialize Firebase Authentication Listener
        async initAuthListener() {
            if (this.hasCheckedFirebaseLogin) return;
            this.hasCheckedFirebaseLogin = true;

            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    console.log("✅ Firebase user detected:", firebaseUser);

                    try {
                        const idToken = await firebaseUser.getIdToken();

                         // ✅ Store Firebase token for API requests
            localStorage.setItem("firebase_token", idToken);

                        const response = await axios.post("/auth/firebase", 
                            { firebase_user: firebaseUser }, 
                            {
                                headers: {
                                    'Authorization': `Bearer ${idToken}`,
                                    'X-Auth-Guard': 'platform'
                                }
                            }
                        );

                        if (response.data.status === "success") {
                            console.log("✅ User data synced with backend:", response.data.user);

                            this.updateAuthStatus(
                                true,
                                response.data.user.profile_display,
                                response.data.user.remaining_free_articles,
                                response.data.user.subscription_active
                            );
                        } else {
                            console.warn("⚠️ Backend sync failed:", response.data);
                        }
                    } catch (error) {
                        console.error("❌ Firebase Sync Error:", error);

                        if (error.response) {
                            console.warn("⚠️ Response Status:", error.response.status);
                            console.warn("⚠️ Response Headers:", error.response.headers);
                            console.warn("⚠️ Response Data:", error.response.data);
                        }

                        if (error.response && error.response.status === 401) {
                            console.warn("⚠️ Unauthorized - Firebase token invalid");
                            this.updateAuthStatus(false, "/assets/default-avatar.png", 0, false);
                        }
                    }
                } else {
                    console.warn("⚠️ No Firebase user detected");
                    this.updateAuthStatus(false, "/assets/default-avatar.png", 0, false);
                }
            });
        }
    };
}




// import { auth, onAuthStateChanged } from "../firebase";
// import axios from "axios";

// export default function authState() {
//     return {
//         isLoggedIn: false,
//         userProfileImage: "/assets/default-avatar.png",
//         remainingFreeArticles: 0,
//         userSubscriptionActive: false,
//         hasCheckedFirebaseLogin: false,

//         // ✅ Update user authentication status
//         updateAuthStatus(isLoggedIn, profileImage, remainingArticles = 0, subscriptionActive = false) {
//             this.isLoggedIn = isLoggedIn;
//             this.userProfileImage = profileImage || "/assets/default-avatar.png";
//             this.remainingFreeArticles = remainingArticles;
//             this.userSubscriptionActive = subscriptionActive;

//             console.log("✅ Auth state updated:", {
//                 isLoggedIn: this.isLoggedIn,
//                 profileImage: this.userProfileImage,
//                 remainingFreeArticles: this.remainingFreeArticles,
//                 userSubscriptionActive: this.userSubscriptionActive
//             });

//             // ✅ Force Alpine to refresh UI state
//             Alpine.nextTick(() => {
//                 document.dispatchEvent(new CustomEvent("auth-updated"));
//             });
//         },

//         // ✅ Initialize Firebase Authentication Listener
//         async initAuthListener() {
//             if (this.hasCheckedFirebaseLogin) {
//                     console.warn("⚠️ Firebase login already checked");
//                     return;
//                 }
//             this.hasCheckedFirebaseLogin = true;

//             if (!this.hasCheckedFirebaseLogin) {
//                 this.hasCheckedFirebaseLogin = true;
//             onAuthStateChanged(auth, async (firebaseUser) => {
//                 if (firebaseUser) {
//                     console.log("✅ Firebase user detected:", firebaseUser);

//                     try {
//                         // ✅ Get Firebase token
//                         const idToken = await firebaseUser.getIdToken();

//                         // ✅ Sync platform user data with backend
//                         const response = await axios.post("/auth/firebase", 
//                             { firebase_user: firebaseUser }, 
//                             {
//                                 headers: {
//                                     'Authorization': `Bearer ${idToken}`,
//                                     'X-Auth-Guard': 'platform' // ✅ Target platform guard
//                                 }
//                             }
//                         );

//                         if (response.data.status === "success") {
//                             console.log("✅ User data synced with backend:", response.data.user);

//                             // ✅ Update Alpine store with user data
//                             this.updateAuthStatus(
//                                 true,
//                                 response.data.user.profile_display,
//                                 response.data.user.remaining_free_articles,
//                                 response.data.user.subscription_active
//                             );
//                         } else {
//                             console.warn("⚠️ Backend sync failed:", response.data);
//                         }
//                     } catch (error) {
//                         console.error("❌ Firebase Sync Error:", error);

//                         if (error.response) {
//                             console.warn("⚠️ Response Status:", error.response.status);
//                             console.warn("⚠️ Response Headers:", error.response.headers);
//                             console.warn("⚠️ Response Data:", error.response.data);
//                         }

//                         if (error.response && error.response.status === 401) {
//                             console.warn("⚠️ Unauthorized - Firebase token invalid");

//                             // ✅ Reset state when Firebase token fails
//                             this.updateAuthStatus(false, "/assets/default-avatar.png", 0, false);
//                         }
//                     }
//                 } else {
//                     console.warn("⚠️ No Firebase user detected");

//                     // ✅ Reset state if user logs out
//                     this.updateAuthStatus(false, "/assets/default-avatar.png", 0, false);
//                 }
//             });
//         }
        
//         }
//     };
// }






// import { auth, onAuthStateChanged } from "../firebase";
// import axios from "axios";

// export default function authState() {
//     return {
//         isLoggedIn: false,
//         userProfileImage: "/assets/default-avatar.png",
//         remainingFreeArticles: 0,
//         userSubscriptionActive: false,
//         hasCheckedFirebaseLogin: false,

//         // ✅ Update user authentication status
//         updateAuthStatus(isLoggedIn, profileImage, remainingArticles = 0, subscriptionActive = false) {
//             this.isLoggedIn = isLoggedIn;
//             this.userProfileImage = profileImage || "/assets/default-avatar.png";
//             this.remainingFreeArticles = remainingArticles;
//             this.userSubscriptionActive = subscriptionActive;

//             console.log("✅ Auth state updated:", {
//                 isLoggedIn: this.isLoggedIn,
//                 profileImage: this.userProfileImage,
//                 remainingFreeArticles: this.remainingFreeArticles,
//                 userSubscriptionActive: this.userSubscriptionActive
//             });

//             // ✅ Force Alpine to refresh UI state
//             Alpine.nextTick(() => {
//                 document.dispatchEvent(new CustomEvent("auth-updated"));
//             });
//         },

//         // ✅ Initialize Firebase Authentication Listener
//         async initAuthListener() {
//             if (this.hasCheckedFirebaseLogin) return;
//             this.hasCheckedFirebaseLogin = true;

//             onAuthStateChanged(auth, async (firebaseUser) => {
//                 if (firebaseUser) {
//                     console.log("✅ Firebase user detected:", firebaseUser);

//                     try {
//                         // ✅ Get Firebase token
//                         const idToken = await firebaseUser.getIdToken();

//                         // ✅ Send token to backend for syncing user data
//                         const response = await axios.post("/auth/firebase", 
//                             { firebase_user: firebaseUser },
//                             {
//                                 headers: {
//                                     'Authorization': `Bearer ${idToken}`,
//                                     'X-Auth-Guard': 'platform' // ✅ Set Platform Guard
//                                 }
//                             }
//                         );

//                         if (response.data.status === "success") {
//                             console.log("✅ User data synced with backend:", response.data.user);

//                             // ✅ Update Alpine store with user data
//                             this.updateAuthStatus(
//                                 true,
//                                 response.data.user.profile_display,
//                                 response.data.user.remaining_free_articles,
//                                 response.data.user.subscription_active
//                             );
//                         } else {
//                             console.warn("⚠️ Backend sync failed:", response.data);
//                         }
//                     } catch (error) {
//                         console.error("❌ Firebase Sync Error:", error);

//                         if (error.response) {
//                             console.warn("⚠️ Response Status:", error.response.status);
//                             console.warn("⚠️ Response Headers:", error.response.headers);
//                             console.warn("⚠️ Response Data:", error.response.data);
//                         }

//                         if (error.response && error.response.status === 401) {
//                             console.warn("⚠️ Unauthorized - Firebase token invalid");
//                         }
//                     }
//                 } else {
//                     console.warn("⚠️ No Firebase user detected");

//                     // ✅ Reset state if user logs out
//                     this.updateAuthStatus(false, "/assets/default-avatar.png", 0, false);
//                 }
//             });
//         }
//     };
// }





// import { auth, onAuthStateChanged } from "../firebase";
// import axios from "axios";

// export default function authState() {
//     return {
//         isLoggedIn: false,
//         userProfileImage: "/assets/default-avatar.png",
//         remainingFreeArticles: 0,
//         userSubscriptionActive: false,
//         hasCheckedFirebaseLogin: false,

//         // ✅ Update user authentication status
//         updateAuthStatus(isLoggedIn, profileImage, remainingArticles = 0, subscriptionActive = false) {
//             this.isLoggedIn = isLoggedIn;
//             this.userProfileImage = profileImage || "/assets/default-avatar.png";
//             this.remainingFreeArticles = remainingArticles;
//             this.userSubscriptionActive = subscriptionActive;

//             console.log("✅ Auth state updated:", {
//                 isLoggedIn: this.isLoggedIn,
//                 profileImage: this.userProfileImage,
//                 remainingFreeArticles: this.remainingFreeArticles,
//                 userSubscriptionActive: this.userSubscriptionActive
//             });

//             // ✅ Force Alpine to refresh UI state
//             Alpine.nextTick(() => {
//                 document.dispatchEvent(new CustomEvent("auth-updated"));
//             });
//         },

//         // ✅ Initialize Firebase Authentication Listener
//         async initAuthListener() {
//             if (this.hasCheckedFirebaseLogin) return;
//             this.hasCheckedFirebaseLogin = true;

//             onAuthStateChanged(auth, async (firebaseUser) => {
//                 if (firebaseUser) {
//                     console.log("✅ Firebase user detected:", firebaseUser);

//                     try {
//                         // ✅ Get Firebase token
//                         const idToken = await firebaseUser.getIdToken();

//                         // ✅ Send token to backend for syncing user data
//                         const response = await axios.post("/auth/firebase", 
//                             { firebase_user: firebaseUser },
//                             {
//                                 headers: {
//                                     'Authorization': `Bearer ${idToken}`
//                                 }
//                             }
//                         );

//                         if (response.data.status === "success") {
//                             console.log("✅ User data synced with backend:", response.data.user);

//                             this.updateAuthStatus(
//                                 true,
//                                 response.data.user.profile_display,
//                                 response.data.user.remaining_free_articles,
//                                 response.data.user.subscription_active
//                             );
//                         } else {
//                             console.warn("⚠️ Backend sync failed:", response.data);
//                         }
//                     } catch (error) {
//                         console.error("❌ Firebase Sync Error:", error);

//                         if (error.response && error.response.status === 401) {
//                             console.warn("⚠️ Unauthorized - Firebase token invalid");
//                         }
//                     }
//                 } else {
//                     console.warn("⚠️ No Firebase user detected");
//                     this.updateAuthStatus(false, "/assets/default-avatar.png", 0, false);
//                 }
//             });
//         }
//     };
// }

//




// import { auth, onAuthStateChanged } from "../firebase";
// import axios from "axios";

// export default function authState() {
//     return {
//         isLoggedIn: false,
//         userProfileImage: "/assets/default-avatar.png",
//         remainingFreeArticles: 0,
//         userSubscriptionActive: false,
//         hasCheckedFirebaseLogin: false,

//         updateAuthStatus(isLoggedIn, profileImage, remainingArticles = 0, subscriptionActive = false) {
//             this.isLoggedIn = isLoggedIn;
//             this.userProfileImage = profileImage || "/assets/default-avatar.png";
//             this.remainingFreeArticles = remainingArticles;
//             this.userSubscriptionActive = subscriptionActive;

//             // ✅ Force Alpine to refresh UI state
//             Alpine.nextTick(() => {
//                 document.dispatchEvent(new CustomEvent("auth-updated"));
//             });
//         },

//         // ✅ Initialize Firebase Authentication Listener
//         initAuthListener() {
//             if (this.hasCheckedFirebaseLogin) return;
//             this.hasCheckedFirebaseLogin = true;

//             onAuthStateChanged(auth, async (firebaseUser) => {
//                 if (firebaseUser) {
//                     axios.post("/auth/firebase", { firebase_user: firebaseUser })
//                         .then(response => {
//                             if (response.data.status === "success") {
//                                 this.updateAuthStatus(
//                                     true,
//                                     response.data.user.profile_display,
//                                     response.data.user.remaining_free_articles,
//                                     response.data.user.subscription_active
//                                 );
//                                 document.dispatchEvent(new CustomEvent("auth-updated"));
//                             }
//                         })
//                         .catch(error => console.error("❌ Firebase Sync Error:", error));
//                 } else {
//                     this.updateAuthStatus(false, "/assets/default-avatar.png", 0, false);
//                 }
//             });
//         }
//     };
// }


