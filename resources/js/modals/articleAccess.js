export default function articleAccess() {
    return {
        handlePostClick(accessLevel, url) {
            const authStore = Alpine.store("auth");

            // ✅ Open reports without an access level
            if (!accessLevel) {
                console.warn("⚠️ No Access Level assigned. Opening article...");
                window.location.href = url;
                return;
            }

            // ✅ Instantly open funded & sponsored articles
            if (accessLevel === "funded" || accessLevel === "sponsored") {
                window.location.href = url;
                return;
            }

            // ✅ Free articles (now unlimited)
            if (accessLevel === "free") {
                if (!authStore.isLoggedIn) {
                    Alpine.store("modalManager").openModal("login");
                    return;
                }

                // No limit on free articles anymore
                window.location.href = url;
                return;
            }

            // ✅ Premium articles (require active subscription)
            if (accessLevel === "premium") {
                if (!authStore.isLoggedIn) {
                    Alpine.store("modalManager").openModal("login");
                    return;
                }

                if (authStore.userSubscriptionActive) {
                    window.location.href = url;
                } else {
                    Alpine.store("modalManager").openModal("renew");
                }

                return;
            }

            // ✅ Default case: Open login modal if no condition matches
            Alpine.store("modalManager").openModal("login");
        }
    };
}



// export default function articleAccess() {
//     return {
//         handlePostClick(accessLevel, url) {
//             if (!accessLevel) {
//                 console.error("⚠️ Access Level is missing.");
//                 return;
//             }

//             const authStore = Alpine.store("auth");

//             if (["funded", "sponsored"].includes(accessLevel)) {
//                 // ✅ Redirect instantly for public articles
//                 window.location.href = url;
//                 return;
//             }

//             if (accessLevel === "free") {
//                 if (!authStore.isLoggedIn) {
//                     Alpine.store("modalManager").openModal("login");
//                     return;
//                 }

//                 // ✅ Allow unlimited access without backend checks
//                 window.location.href = url;
//                 return;
//             }

//             if (accessLevel === "premium") {
//                 if (!authStore.isLoggedIn) {
//                     Alpine.store("modalManager").openModal("login");
//                     return;
//                 }

//                 if (authStore.userSubscriptionActive) {
//                     window.location.href = url;
//                 } else {
//                     Alpine.store("modalManager").openModal("renew");
//                 }

//                 return;
//             }

//             Alpine.store("modalManager").openModal("login");
//         }
//     };
// }










// import axios from "axios";

// export default function articleAccess() {
//     return {
//         handlePostClick(accessLevel, url) {
//             if (!accessLevel) return console.error("⚠️ Access Level is missing.");

//             if (accessLevel === "funded" || accessLevel === "sponsored") {
//                 window.location.href = url;
//             } else if (accessLevel === "free" && Alpine.store("auth").isLoggedIn) {
//                 if (Alpine.store("auth").remainingFreeArticles > 0) {
//                     axios.get(url).then(response => {
//                         Alpine.store("auth").remainingFreeArticles = response.data.remaining_free_articles;
//                         window.location.href = url;
//                     });
//                 } else {
//                     Alpine.store("modalManager").openModal("upgrade");
//                 }
//             } else if (accessLevel === "premium" && Alpine.store("auth").isLoggedIn) {
//                 if (Alpine.store("auth").userSubscriptionActive) {
//                     window.location.href = url;
//                 } else {
//                     Alpine.store("modalManager").openModal("renew");
//                 }
//             } else {
//                 Alpine.store("modalManager").openModal("login");
//             }
//         }
//     };
// }







// import axios from 'axios';

// export default function articleAccess() {
//     return {
//         handlePostClick(accessLevel, url) {
//             if (!accessLevel || accessLevel === "undefined") {
//                 console.error("⚠️ Access Level is missing. Check Antlers binding.");
//                 window.location.href = url;
//                 return;
//             }

//             console.log(`🔎 Handling post click - Access Level: ${accessLevel}`);

//             if (accessLevel === 'funded' || accessLevel === 'sponsored') {
//                 // ✅ Open directly without restriction
//                 window.location.href = url;
//             } 
            
//             else if (accessLevel === 'free') {
//                 if (Alpine.store('auth').isLoggedIn) {
//                     if (Alpine.store('auth').remainingFreeArticles > 0) {
//                         axios.get(url)
//                             .then(response => {
//                                 // ✅ Update remaining free articles
//                                 Alpine.store('auth').remainingFreeArticles = response.data.remaining_free_articles;
//                                 window.location.href = url;
//                             })
//                             .catch(error => {
//                                 console.error("❌ Failed to update free article count:", error);
//                             });
//                     } else {
//                         // ✅ Free limit reached — show upgrade modal
//                         Alpine.store('modalManager').openModal('upgrade');
//                     }
//                 } else {
//                     // ✅ Not logged in — show login modal
//                     Alpine.store('modalManager').openModal('login');
//                 }
//             } 
            
//             else if (accessLevel === 'premium') {
//                 if (Alpine.store('auth').isLoggedIn) {
//                     if (Alpine.store('auth').userSubscriptionActive) {
//                         window.location.href = url;
//                     } else {
//                         // ✅ Premium content but no active subscription — show renew modal
//                         Alpine.store('modalManager').openModal('renew');
//                     }
//                 } else {
//                     // ✅ Not logged in — show login modal
//                     Alpine.store('modalManager').openModal('login');
//                 }
//             }
//         },
//     };
// }



// import axios from "axios";

// export default function articleAccess() {
//     return {
//         handlePostClick(accessLevel, url) {
//             if (!accessLevel) {
//                 console.error("⚠️ Access Level is missing.");
//                 return;
//             }

//             if (accessLevel === "funded" || accessLevel === "sponsored") {
//                 window.location.href = url;
//             } else if (accessLevel === "free") {
//                 if (Alpine.store("auth").isLoggedIn) {
//                     if (Alpine.store("auth").remainingFreeArticles > 0) {
//                         axios.get(url).then(response => {
//                             Alpine.store("auth").remainingFreeArticles = response.data.remaining_free_articles;
//                             window.location.href = url;
//                         });
//                     } else {
//                         console.log("🚨 Opening Upgrade Modal");
//                         Alpine.store("modalManager").openModal("upgrade");
//                     }
//                 } else {
//                     console.log("🚨 Opening Login Modal");
//                     Alpine.store("modalManager").openModal("login");
//                 }
//             } else if (accessLevel === "premium") {
//                 if (Alpine.store("auth").isLoggedIn) {
//                     if (Alpine.store("auth").userSubscriptionActive) {
//                         window.location.href = url;
//                     } else {
//                         console.log("🚨 Opening Renew Modal");
//                         Alpine.store("modalManager").openModal("renew");
//                     }
//                 } else {
//                     Alpine.store("modalManager").openModal("login");
//                 }
//             }
//         }
//     };
// }
