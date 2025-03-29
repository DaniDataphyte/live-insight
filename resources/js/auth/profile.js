import axios from "axios";

export default function profile() {
    return {
        // ✅ User profile properties
        firstname: "",
        lastname: "",
        email: "",
        bio: "",
        gender: "",
        dob: "",
        country: "",
        profession: "",
        profileImage: "/assets/default-avatar.png", // ✅ Default profile image
        subscriptionPlan: "None",
        remainingFreeArticles: 0,
        subscriptionActive: false,

        // ✅ Form handling
        password: "",
        passwordConfirmation: "",
        uploadedProfileImage: null, // ✅ Store uploaded image for submission

        isLoading: false,
        errorMessage: null,
        successMessage: null,

        // ✅ Fetch User Profile Data
        async fetchUserProfile() {
            console.log("🔍 Fetching user profile...");
            this.isLoading = true;
        
            try {
                const token = localStorage.getItem("firebase_token");
                if (!token) {
                    console.error("❌ No Firebase token found.");
                    this.errorMessage = "Authentication error: Missing token.";
                    return;
                }
        
                const response = await axios.get("/api/user/profile", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
        
                console.log("✅ API RAW Response:", response);
        
                // 🚨 Check if response is HTML (indicating a redirect)
                if (typeof response.data === "string" && response.data.startsWith("<!DOCTYPE html>")) {
                    console.warn("⚠️ Server returned HTML, likely a redirect.");
                    this.errorMessage = "Authentication required. Please log in again.";
                    window.location.href = "/login"; // Force login
                    return;
                }
        
                if (response.data.status === "success") {
                    console.log("✅ JSON Response:", response.data);
                    const user = response.data.user;
        
                    // ✅ Bind user data
                    this.firstname = user.fullname?.split(" ")[0] || "";
                    this.lastname = user.fullname?.split(" ").slice(1).join(" ") || "";
                    this.email = user.email;
                    this.bio = user.bio || "";
                    this.gender = user.gender || "";
                    this.dob = user.dob || "";
                    this.country = user.country || "";
                    this.profession = user.profession || "";
                    this.profileImage = user.profile_display || "/assets/default-avatar.png";
                    this.subscriptionPlan = user.subscription_plan || "None";
                    this.remainingFreeArticles = user.remaining_free_articles || 0;
                    this.subscriptionActive = user.subscription_active || false;
        
                    console.log("✅ Profile successfully loaded:", this);
                } else {
                    console.warn("⚠️ Unexpected API response format:", response);
                    this.errorMessage = "Failed to load profile.";
                }
            } catch (error) {
                console.error("❌ Error fetching profile:", error);
                if (error.response) {
                    console.warn("⚠️ Response Status:", error.response.status);
                    console.warn("⚠️ Response Data:", error.response.data);
                }
                this.errorMessage = "Failed to load profile.";
            } finally {
                this.isLoading = false;
            }
        },
        
        

        // ✅ Handle Profile Image Upload
        handleProfileImage(event) {
            const file = event.target.files[0];
            if (file) {
                this.profileImage = URL.createObjectURL(file); // ✅ Preview image
                this.uploadedProfileImage = file; // ✅ Store file for upload
                console.log("✅ Selected profile image:", this.profileImage);
            }
        },

        // ✅ Submit Profile Update
        async updateUserProfile() {
            this.isLoading = true;
            this.errorMessage = null;
            this.successMessage = null;

            try {
                const formData = new FormData();
                formData.append("fullname", `${this.firstname} ${this.lastname}`);
                formData.append("bio", this.bio);
                formData.append("email", this.email);
                formData.append("gender", this.gender);
                formData.append("dob", this.dob);
                formData.append("country", this.country);
                formData.append("profession", this.profession);

                if (this.uploadedProfileImage) {
                    formData.append("profile_display", this.uploadedProfileImage);
                }

                const token = localStorage.getItem("firebase_token");
                if (!token) {
                    console.error("❌ No Firebase token found.");
                    return;
                }

                const response = await axios.post("/api/user/profile/update", formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.status === "success") {
                    console.log("✅ Profile updated:", response.data.user);
                    this.successMessage = "Profile updated successfully.";

                    // ✅ Update Alpine Store
                    Alpine.store("auth").updateAuthStatus(
                        true,
                        response.data.user.profile_display,
                        response.data.user.remaining_free_articles,
                        response.data.user.subscription_active
                    );

                    // ✅ Refresh Profile
                    this.fetchUserProfile();
                } else {
                    console.warn("⚠️ Update failed:", response.data.message);
                    this.errorMessage = response.data.message;
                }
            } catch (error) {
                console.error("❌ Error updating profile:", error);
                if (error.response) {
                    console.warn("⚠️ Response Status:", error.response.status);
                    console.warn("⚠️ Response Data:", error.response.data);
                }
                this.errorMessage = "Failed to update profile. Please try again.";
            } finally {
                this.isLoading = false;
            }
        },

        // ✅ Update User Password
        async updateUserPassword() {
            if (!this.password || !this.passwordConfirmation) {
                this.errorMessage = "Please enter a valid password.";
                return;
            }

            this.isLoading = true;
            this.errorMessage = null;
            this.successMessage = null;

            try {
                const token = localStorage.getItem("firebase_token");
                if (!token) {
                    console.error("❌ No Firebase token found.");
                    return;
                }

                const response = await axios.post("/api/user/profile/password", {
                    password: this.password,
                    password_confirmation: this.passwordConfirmation,
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (response.data.status === "success") {
                    console.log("✅ Password updated");
                    this.successMessage = "Password updated successfully.";
                } else {
                    console.warn("⚠️ Password update failed:", response.data.message);
                    this.errorMessage = response.data.message;
                }
            } catch (error) {
                console.error("❌ Error updating password:", error);
                this.errorMessage = "Failed to update password. Please try again.";
            } finally {
                this.isLoading = false;
            }
        },
    };
}





// import axios from "axios";

// export default function profile() {
//     return {
//         // ✅ User profile properties
//         firstname: "",
//         lastname: "",
//         email: "",
//         bio: "",
//         gender: "",
//         dob: "",
//         country: "",
//         profession: "",
//         profileImage: "/assets/default-avatar.png", // ✅ Default profile image
//         subscriptionPlan: "None",
//         remainingFreeArticles: 0,
//         subscriptionActive: false,

//         // ✅ Form handling
//         password: "",
//         passwordConfirmation: "",

//         isLoading: false,
//         errorMessage: null,
//         successMessage: null,

//         // ✅ Fetch User Profile Data
//         async fetchUserProfile() {
//             console.log("🔍 Fetching user profile...");
//             this.isLoading = true;

//             try {
//                 const token = localStorage.getItem("firebase_token"); // ✅ Ensure token is included
//                 if (!token) {
//                     console.error("❌ No Firebase token found.");
//                     return;
//                 }

//                 const response = await axios.get("/profile", {
//                     headers: {
//                         "Authorization": `Bearer ${token}`,
//                     }
//                 });

//                 if (response.data.status === "success") {
//                     const user = response.data.user;

//                     // ✅ Bind correct properties to AlpineJS
//                     this.firstname = user.fullname.split(" ")[0] || "";
//                     this.lastname = user.fullname.split(" ").slice(1).join(" ") || "";
//                     this.email = user.email;
//                     this.bio = user.bio;
//                     this.gender = user.gender;
//                     this.dob = user.dob;
//                     this.country = user.country;
//                     this.profession = user.profession;
//                     this.profileImage = user.profile_display || "/assets/default-avatar.png";
//                     this.subscriptionPlan = user.subscription_plan;
//                     this.remainingFreeArticles = user.remaining_free_articles;
//                     this.subscriptionActive = user.subscription_active;

//                     console.log("✅ Profile loaded:", this);
//                 } else {
//                     console.warn("⚠️ Failed to fetch profile data:", response.data.message);
//                     this.errorMessage = "Failed to load profile.";
//                 }
//             } catch (error) {
//                 console.error("❌ Error fetching profile:", error);
//                 this.errorMessage = "Failed to load profile.";
//             } finally {
//                 this.isLoading = false;
//             }
//         },

//         // ✅ Handle Profile Image Upload
//         handleProfileImage(event) {
//             const file = event.target.files[0];
//             if (file) {
//                 this.profileImage = URL.createObjectURL(file); // ✅ Preview image
//                 this.uploadedProfileImage = file; // ✅ Store file for upload
//                 console.log("✅ Selected profile image:", this.profileImage);
//             }
//         },

//         // ✅ Submit Profile Update
//         async updateUserProfile() {
//             this.isLoading = true;
//             this.errorMessage = null;
//             this.successMessage = null;

//             try {
//                 const formData = new FormData();
//                 formData.append("fullname", `${this.firstname} ${this.lastname}`);
//                 formData.append("bio", this.bio);
//                 formData.append("email", this.email);
//                 formData.append("gender", this.gender);
//                 formData.append("dob", this.dob);
//                 formData.append("country", this.country);
//                 formData.append("profession", this.profession);

//                 if (this.uploadedProfileImage) {
//                     formData.append("profile_display", this.uploadedProfileImage);
//                 }

//                 const token = localStorage.getItem("firebase_token");
//                 if (!token) {
//                     console.error("❌ No Firebase token found.");
//                     return;
//                 }

//                 const response = await axios.post("/profile/update", formData, {
//                     headers: {
//                         "Authorization": `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data",
//                     },
//                 });

//                 if (response.data.status === "success") {
//                     console.log("✅ Profile updated:", response.data.user);
//                     this.successMessage = "Profile updated successfully.";

//                     // ✅ Update Alpine Store
//                     Alpine.store("auth").updateAuthStatus(
//                         true,
//                         response.data.user.profile_display,
//                         response.data.user.remaining_free_articles,
//                         response.data.user.subscription_active
//                     );

//                     // ✅ Refresh Profile
//                     this.fetchUserProfile();
//                 } else {
//                     console.warn("⚠️ Update failed:", response.data.message);
//                     this.errorMessage = response.data.message;
//                 }
//             } catch (error) {
//                 console.error("❌ Error updating profile:", error);
//                 this.errorMessage = "Failed to update profile. Please try again.";
//             } finally {
//                 this.isLoading = false;
//             }
//         },

//         // ✅ Update User Password
//         async updateUserPassword() {
//             if (!this.password || !this.passwordConfirmation) {
//                 this.errorMessage = "Please enter a valid password.";
//                 return;
//             }

//             this.isLoading = true;
//             this.errorMessage = null;
//             this.successMessage = null;

//             try {
//                 const token = localStorage.getItem("firebase_token");
//                 if (!token) {
//                     console.error("❌ No Firebase token found.");
//                     return;
//                 }

//                 const response = await axios.post("/profile/password", {
//                     password: this.password,
//                     password_confirmation: this.passwordConfirmation,
//                 }, {
//                     headers: {
//                         "Authorization": `Bearer ${token}`,
//                     }
//                 });

//                 if (response.data.status === "success") {
//                     console.log("✅ Password updated");
//                     this.successMessage = "Password updated successfully.";
//                 } else {
//                     console.warn("⚠️ Password update failed:", response.data.message);
//                     this.errorMessage = response.data.message;
//                 }
//             } catch (error) {
//                 console.error("❌ Error updating password:", error);
//                 this.errorMessage = "Failed to update password. Please try again.";
//             } finally {
//                 this.isLoading = false;
//             }
//         },
//     };
// }



// import axios from "axios";

// export default function profile() {
//     return {
//         firstname: "",
//         lastname: "",
//         email: "",
//         bio: "",
//         gender: "",
//         dob: "",
//         country: "",
//         profession: "",
//         profileImage: "/assets/default-avatar.png", // ✅ Default profile image
//         subscriptionPlan: "None",
//         remainingFreeArticles: 0,
//         subscriptionActive: false,

//         isLoading: false,
//         errorMessage: null,
//         successMessage: null,

//         // ✅ Fetch User Profile Data
//         async fetchUserProfile() {
//             console.log("🔍 Fetching user profile...");
//             this.isLoading = true;

//             try {
//                 const response = await axios.get("/profile", {
//                     headers: {
//                         "Authorization": `Bearer ${localStorage.getItem("firebase_token")}`, // ✅ Use Firebase token
//                     }
//                 });

//                 if (response.data.status === "success") {
//                     const user = response.data.user;

//                     this.firstname = user.fullname.split(" ")[0] || "";
//                     this.lastname = user.fullname.split(" ").slice(1).join(" ") || "";
//                     this.email = user.email;
//                     this.bio = user.bio;
//                     this.gender = user.gender;
//                     this.dob = user.dob;
//                     this.country = user.country;
//                     this.profession = user.profession;
//                     this.profileImage = user.profile_display || "/assets/default-avatar.png";
//                     this.subscriptionPlan = user.subscription_plan;
//                     this.remainingFreeArticles = user.remaining_free_articles;
//                     this.subscriptionActive = user.subscription_active;

//                     console.log("✅ Profile loaded:", this);
//                 } else {
//                     console.warn("⚠️ Failed to fetch profile data:", response.data.message);
//                 }
//             } catch (error) {
//                 console.error("❌ Error fetching profile:", error);
//                 this.errorMessage = "Failed to load profile.";
//             } finally {
//                 this.isLoading = false;
//             }
//         },

//         // ✅ Handle Profile Image Upload
//         handleProfileImage(event) {
//             this.profileImage = event.target.files[0];
//             console.log("✅ Selected profile image:", this.profileImage);
//         },

//         // ✅ Submit Profile Update
//         async updateUserProfile() {
//             this.isLoading = true;
//             this.errorMessage = null;
//             this.successMessage = null;

//             try {
//                 const formData = new FormData();
//                 formData.append("fullname", this.userProfile.fullname);
//                 formData.append("bio", this.userProfile.bio);
//                 formData.append("email", this.userProfile.email);
//                 formData.append("gender", this.userProfile.gender);
//                 formData.append("dob", this.userProfile.dob);
//                 formData.append("country", this.userProfile.country);
//                 formData.append("profession", this.userProfile.profession);

//                 if (this.profileImage) {
//                     formData.append("profile_display", this.profileImage);
//                 }

//                 if (this.userProfile.password) {
//                     formData.append("password", this.userProfile.password);
//                     formData.append("password_confirmation", this.userProfile.password_confirmation);
//                 }

//                 const response = await axios.post("/profile/update", formData, {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 });

//                 if (response.data.status === "success") {
//                     console.log("✅ Profile updated:", response.data.user);
//                     this.successMessage = "Profile updated successfully.";

//                     // ✅ Update Alpine Store
//                     Alpine.store("auth").updateAuthStatus(
//                         true,
//                         response.data.user.profile_display,
//                         response.data.user.remaining_free_articles,
//                         response.data.user.subscription_active
//                     );
//                 } else {
//                     console.warn("⚠️ Update failed:", response.data.message);
//                     this.errorMessage = response.data.message;
//                 }
//             } catch (error) {
//                 console.error("❌ Error updating profile:", error);
//                 this.errorMessage = "Failed to update profile. Please try again.";
//             } finally {
//                 this.isLoading = false;
//             }
//         },

//         // ✅ Update User Password
//         async updateUserPassword() {
//             if (!this.userProfile.password || !this.userProfile.password_confirmation) {
//                 this.errorMessage = "Please enter a valid password.";
//                 return;
//             }

//             this.isLoading = true;
//             this.errorMessage = null;
//             this.successMessage = null;

//             try {
//                 const response = await axios.post("/profile/password", {
//                     password: this.userProfile.password,
//                     password_confirmation: this.userProfile.password_confirmation,
//                 });

//                 if (response.data.status === "success") {
//                     console.log("✅ Password updated");
//                     this.successMessage = "Password updated successfully.";
//                 } else {
//                     console.warn("⚠️ Password update failed:", response.data.message);
//                     this.errorMessage = response.data.message;
//                 }
//             } catch (error) {
//                 console.error("❌ Error updating password:", error);
//                 this.errorMessage = "Failed to update password. Please try again.";
//             } finally {
//                 this.isLoading = false;
//             }
//         },
//     };
// }





// async fetchUserProfile() {
        //     console.log("🔍 Fetching user profile...");
        //     this.isLoading = true;

        //     try {
        //         const token = localStorage.getItem("firebase_token");
        //         if (!token) {
        //             console.error("❌ No Firebase token found.");
        //             this.errorMessage = "Authentication error: Missing token.";
        //             return;
        //         }

        //         const response = await axios.get("/profile", {
        //             headers: {
        //                 "Authorization": `Bearer ${token}`,
        //             }
        //         });

        //         console.log("✅ API RAW Response:", response); // ✅ Debugging

        //         if (response.data && response.data.status === "success") {

        //             console.log("✅ JSON Response:", response.data);

        //             const user = response.data.user;

        //             // ✅ Bind correct properties to AlpineJS
        //             this.firstname = user.fullname?.split(" ")[0] || "";
        //             this.lastname = user.fullname?.split(" ").slice(1).join(" ") || "";
        //             this.email = user.email;
        //             this.bio = user.bio || "";
        //             this.gender = user.gender || "";
        //             this.dob = user.dob || "";
        //             this.country = user.country || "";
        //             this.profession = user.profession || "";
        //             this.profileImage = user.profile_display || "/assets/default-avatar.png";
        //             this.subscriptionPlan = user.subscription_plan || "None";
        //             this.remainingFreeArticles = user.remaining_free_articles || 0;
        //             this.subscriptionActive = user.subscription_active || false;

        //             console.log("✅ Profile successfully loaded:", this);
        //         } else {
        //             console.warn("⚠️ Failed to fetch profile data: Invalid response format", response.data);
        //             this.errorMessage = "Failed to load profile.";
        //         }
        //     } catch (error) {
        //         console.error("❌ Error fetching profile:", error);
        //         if (error.response) {
        //             console.warn("⚠️ Response Status:", error.response.status);
        //             console.warn("⚠️ Response Data:", error.response.data);
        //         }
        //         this.errorMessage = "Failed to load profile.";
        //     } finally {
        //         this.isLoading = false;
        //     }
        // },

        // async fetchUserProfile() {
        //     console.log("🔍 Fetching user profile...");
        //     this.isLoading = true;
        
        //     try {
        //         const token = localStorage.getItem("firebase_token");
        //         if (!token) {
        //             console.error("❌ No Firebase token found.");
        //             this.errorMessage = "Authentication error: Missing token.";
        //             return;
        //         }
        
        //         const response = await axios.get("/profile", {
        //             headers: {
        //                 "Authorization": `Bearer ${token}`,
        //                 "Accept": "application/json"
        //             }
        //         });
        
        //         console.log("✅ API RAW Response:", response);
        
        //         // 🚨 Check if response is HTML (indicating a redirect)
        //         if (typeof response.data === "string" && response.data.startsWith("<!DOCTYPE html>")) {
        //             console.warn("⚠️ Server returned HTML, likely a redirect.");
        //             this.errorMessage = "Authentication required. Please log in again.";
        //             window.location.href = "/login"; // Force login
        //             return;
        //         }
        
        //         if (response.data.status === "success") {
        //             console.log("✅ JSON Response:", response.data);
        //             const user = response.data.user;
        
        //             // ✅ Bind user data
        //             this.firstname = user.fullname?.split(" ")[0] || "";
        //             this.lastname = user.fullname?.split(" ").slice(1).join(" ") || "";
        //             this.email = user.email;
        //             this.bio = user.bio || "";
        //             this.gender = user.gender || "";
        //             this.dob = user.dob || "";
        //             this.country = user.country || "";
        //             this.profession = user.profession || "";
        //             this.profileImage = user.profile_display || "/assets/default-avatar.png";
        //             this.subscriptionPlan = user.subscription_plan || "None";
        //             this.remainingFreeArticles = user.remaining_free_articles || 0;
        //             this.subscriptionActive = user.subscription_active || false;
        
        //             console.log("✅ Profile successfully loaded:", this);
        //         } else {
        //             console.warn("⚠️ Unexpected API response format:", response);
        //             this.errorMessage = "Failed to load profile.";
        //         }
        //     } catch (error) {
        //         console.error("❌ Error fetching profile:", error);
        //         if (error.response) {
        //             console.warn("⚠️ Response Status:", error.response.status);
        //             console.warn("⚠️ Response Data:", error.response.data);
        //         }
        //         this.errorMessage = "Failed to load profile.";
        //     } finally {
        //         this.isLoading = false;
        //     }
        // },