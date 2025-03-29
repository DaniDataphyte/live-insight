import { auth, signOut } from "../firebase";
import axios from "axios";

export default {
    async logout() {
        console.log("🔄 Logging out...");

        try {
            // ✅ Sign out from Firebase
            await signOut(auth);
            console.log("✅ Firebase logout successful");

            // ✅ Ensure CSRF token exists before making request
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (!csrfToken) {
                throw new Error("❌ CSRF token not found in the document.");
            }

            // ✅ Log out from Laravel backend
            await axios.post("/logout", {}, {
                headers: { "X-CSRF-TOKEN": csrfToken.content }
            });

            console.log("✅ Successfully logged out from Laravel");

            // ✅ Ensure Alpine store exists before updating state
            if (window.Alpine && Alpine.store("auth")) {
                Alpine.store("auth").updateAuthStatus(false, "/assets/default-avatar.png", 0, false);
            } else {
                console.warn("⚠️ Alpine store 'auth' not found. Skipping state update.");
            }

            // ✅ Dispatch event to update UI
            document.dispatchEvent(new CustomEvent("auth-updated"));

            // ✅ Redirect to homepage after logout
            window.location.href = "/";
        } catch (error) {
            console.error("❌ Logout error:", error);

            // ✅ Handle Firebase logout errors
            if (error.code) {
                console.error("❌ Firebase Logout Error:", error.message);
            }

            // ✅ Handle Laravel logout errors
            if (error.response) {
                console.error("❌ Laravel Logout Error:", error.response.status, error.response.data);
            }

            // ✅ Redirect to homepage even if logout fails
            window.location.href = "/";
        }
    }
};



// import { auth, signOut } from "../firebase";
// import axios from "axios";

// export default {
//     async logout() {
//         console.log("🔄 Logging out...");

//         signOut(auth)
//             .then(() => {
//                 axios.post('/logout', {}, {
//                     headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
//                 })
//                 .then(() => {
//                     console.log("✅ Successfully logged out");

//                     // ✅ Ensure auth state is updated properly
//                     Alpine.store("auth").updateAuthStatus(false, '/assets/default-avatar.png', 0, false);

//                     // ✅ Dispatch event to update UI
//                     document.dispatchEvent(new CustomEvent('auth-updated'));

//                     // ✅ Redirect after logout
//                     window.location.href = '/';
//                 })
//                 .catch(error => {
//                     console.error("❌ Logout failed:", error);
//                     window.location.href = '/';
//                 });
//             })
//             .catch(error => {
//                 console.error("❌ Firebase logout error:", error);
//                 window.location.href = '/';
//             });
//     }
// };


