import { auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendEmailVerification } from "../firebase";
import axios from "axios";

export default function emailAuth() {
    return {
        loginForm: { email: "", password: "" },
        signupForm: { name: "", email: "", password: "" },
        showPassword: false,
        error: null,
        formErrors: {},

        resetForms() {
            this.loginForm = { email: "", password: "" };
            this.signupForm = { name: "", email: "", password: "" };
            this.showPassword = false;
            this.error = null;
            this.formErrors = {};
        },

        validateForm() {
            this.formErrors = {};

            if (!this.signupForm.name) this.formErrors.name = "Name is required.";
            if (!this.signupForm.email) this.formErrors.email = "Email is required.";
            if (!this.signupForm.password) {
                this.formErrors.password = "Password is required.";
            } else if (this.signupForm.password.length < 6) {
                this.formErrors.password = "Password must be at least 6 characters.";
            }

            return Object.keys(this.formErrors).length === 0;
        },

        async handleSignup() {
            if (!this.validateForm()) return;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, this.signupForm.email, this.signupForm.password);
                const firebaseUser = userCredential.user;

                // Update user profile
                await updateProfile(firebaseUser, { displayName: this.signupForm.name });

                // Send verification email
                await sendEmailVerification(firebaseUser);

                this.error = "A verification email has been sent. Please verify your email before logging in.";
            } catch (error) {
                console.error("❌ Signup Error:", error);
                this.error = "Signup failed. Please try again.";
            }
        },

        async handleLogin() {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, this.loginForm.email, this.loginForm.password);
                const firebaseUser = userCredential.user;

                // Check if email is verified before allowing login
                if (!firebaseUser.emailVerified) {
                    this.error = "Please verify your email before logging in.";
                    return;
                }

                // Send user data to backend after successful login
                const response = await axios.post("/auth/firebase", {
                    firebase_user: {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName,
                    }
                });

                if (response.data.status === "success") {
                    Alpine.store("auth").updateAuthStatus(
                        true,
                        response.data.user.profile_display,
                        response.data.user.remaining_free_articles,
                        response.data.user.subscription_active
                    );
                    Alpine.store("modalManager").closeAllModals();
                    window.location.href = sessionStorage.getItem("redirectAfterLogin") || "/";
                }
            } catch (error) {
                console.error("❌ Login Failed:", error);
                this.error = "Invalid email or password.";
            }
        }
    };
}

console.log("✅ emailAuth.js loaded successfully");






// import { auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "../firebase";
// import axios from "axios";

// export default function emailAuth() {
//     return {
//         loginForm: { email: "", password: "" },
//         signupForm: { name: "", email: "", password: "" },
//         showPassword: false,
//         error: null,
//         formErrors: {}, // ✅ Define formErrors

//         resetForms() {
//             this.loginForm = { email: "", password: "" };
//             this.signupForm = { name: "", email: "", password: "" };
//             this.showPassword = false;
//             this.error = null;
//             this.formErrors = {}; // ✅ Reset form errors
//         },

//         validateForm() {
//             this.formErrors = {}; // ✅ Clear previous errors

//             if (!this.signupForm.name) this.formErrors.name = "Name is required.";
//             if (!this.signupForm.email) this.formErrors.email = "Email is required.";
//             if (!this.signupForm.password) {
//                 this.formErrors.password = "Password is required.";
//             } else if (this.signupForm.password.length < 6) {
//                 this.formErrors.password = "Password must be at least 6 characters.";
//             }

//             return Object.keys(this.formErrors).length === 0; // ✅ Return true if no errors
//         },

//         async handleSignup() {
//             if (!this.validateForm()) return; // ✅ Stop signup if validation fails

//             try {
//                 // ✅ Create user in Firebase
//                 const userCredential = await createUserWithEmailAndPassword(auth, this.signupForm.email, this.signupForm.password);
//                 const firebaseUser = userCredential.user;

//                 // ✅ Update Firebase profile with user's name
//                 await updateProfile(firebaseUser, { displayName: this.signupForm.name });

//                 // ✅ Send user data to the backend
//                 const response = await axios.post("/auth/firebase", {
//                     firebase_user: {
//                         uid: firebaseUser.uid,
//                         email: firebaseUser.email,
//                         name: this.signupForm.name,
//                     }
//                 });

//                 if (response.data.status === "success") {
//                     // ✅ Update Alpine state
//                     Alpine.store("auth").updateAuthStatus(
//                         true,
//                         response.data.user.profile_display,
//                         response.data.user.remaining_free_articles,
//                         response.data.user.subscription_active
//                     );

//                     Alpine.store("modalManager").closeAllModals();

//                     // ✅ Redirect user
//                     window.location.href = sessionStorage.getItem("redirectAfterLogin") || "/";
//                 }
//             } catch (error) {
//                 console.error("❌ Signup Error:", error);
//                 this.error = "Signup failed. Please try again.";
//             }
//         },

//         async handleLogin() {
//             try {
//                 const userCredential = await signInWithEmailAndPassword(auth, this.loginForm.email, this.loginForm.password);
//                 console.log("✅ Login Successful:", userCredential.user);

//                 Alpine.store("auth").updateAuthStatus(true, userCredential.user.photoURL);
//                 Alpine.store("modalManager").closeAllModals();
//                 window.location.href = sessionStorage.getItem("redirectAfterLogin") || "/";
//             } catch (error) {
//                 console.error("❌ Login Failed:", error);
//                 this.error = "Invalid email or password.";
//             }
//         }
//     };
// }

// console.log("✅ emailAuth.js loaded successfully");



// import { auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "../firebase";
// import axios from "axios";

// export default function emailAuth() {
//     return {
//         loginForm: { email: "", password: "" },
//         signupForm: { name: "", email: "", password: "" },
//         showPassword: false,
//         error: null,
//         formErrors: {}, // ✅ Define formErrors

//         resetForms() {
//             this.loginForm = { email: "", password: "" };
//             this.signupForm = { name: "", email: "", password: "" };
//             this.showPassword = false;
//             this.error = null;
//             this.formErrors = {}; // ✅ Reset form errors
//         },

//         validateForm() {
//             this.formErrors = {}; // ✅ Clear previous errors

//             if (!this.signupForm.name) this.formErrors.name = "Name is required.";
//             if (!this.signupForm.email) this.formErrors.email = "Email is required.";
//             if (!this.signupForm.password) {
//                 this.formErrors.password = "Password is required.";
//             } else if (this.signupForm.password.length < 6) {
//                 this.formErrors.password = "Password must be at least 6 characters.";
//             }

//             return Object.keys(this.formErrors).length === 0; // ✅ Return true if no errors
//         },

//         async handleSignup() {
//             if (!this.validateForm()) return; // ✅ Stop signup if validation fails

//             try {
//                 // ✅ Create user in Firebase
//                 const userCredential = await createUserWithEmailAndPassword(auth, this.signupForm.email, this.signupForm.password);
//                 const firebaseUser = userCredential.user;

//                 // ✅ Update Firebase profile with user's name
//                 await updateProfile(firebaseUser, { displayName: this.signupForm.name });

//                 // ✅ Send user data to the backend
//                 const response = await axios.post("/auth/firebase", {
//                     firebase_user: {
//                         uid: firebaseUser.uid,
//                         email: firebaseUser.email,
//                         name: this.signupForm.name,
//                     }
//                 });

//                 if (response.data.status === "success") {
//                     // ✅ Update Alpine state
//                     Alpine.store("auth").updateAuthStatus(
//                         true,
//                         response.data.user.profile_display,
//                         response.data.user.remaining_free_articles,
//                         response.data.user.subscription_active
//                     );

//                     Alpine.store("modalManager").closeAllModals();

//                     // ✅ Redirect user
//                     window.location.href = sessionStorage.getItem("redirectAfterLogin") || "/";
//                 }
//             } catch (error) {
//                 console.error("❌ Signup Error:", error);
//                 this.error = "Signup failed. Please try again.";
//             }
//         },

//         async handleLogin() {
//             try {
//                 const userCredential = await signInWithEmailAndPassword(auth, this.loginForm.email, this.loginForm.password);
//                 console.log("✅ Login Successful:", userCredential.user);

//                 Alpine.store("auth").updateAuthStatus(true, userCredential.user.photoURL);
//                 Alpine.store("modalManager").closeAllModals();
//                 window.location.href = sessionStorage.getItem("redirectAfterLogin") || "/";
//             } catch (error) {
//                 console.error("❌ Login Failed:", error);
//                 this.error = "Invalid email or password.";
//             }
//         }
//     };
// }

// console.log("✅ emailAuth.js loaded successfully");



