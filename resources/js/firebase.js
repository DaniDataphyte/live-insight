import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  // YahooAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile,  // ✅ Ensure this is imported
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4NAfIgOp2TzL6bPR0CxXAQ6riYzG4Gjo",
  authDomain: "dataphyte-insight.firebaseapp.com",
  projectId: "dataphyte-insight",
  storageBucket: "dataphyte-insight.appspot.com",
  messagingSenderId: "890049014162",
  appId: "1:890049014162:web:a4d818d95494f5ebb7f94b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ✅ Set persistence to persist Firebase state across reloads
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("✅ Firebase persistence enabled");
    })
    .catch((error) => {
        console.error("❌ Error setting Firebase persistence:", error);
});



const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
// const yahooProvider = new YahooAuthProvider();


// ✅ Export only the necessary Firebase services
export {
  app,
  auth,
  googleProvider,
  appleProvider,
  facebookProvider,
  twitterProvider,
  // yahooProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendEmailVerification
};





onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ User is logged in:", user.email);

    user.getIdToken(true)
      .then(token => console.log("🔥 Firebase Token:", token))
      .catch(error => console.error("❌ Error getting token:", error));
  } else {
    console.warn("⚠️ No authenticated user found. Please log in.");
  }
});
