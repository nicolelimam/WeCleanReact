// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgAQlcGEKJqVDSnzFObomoby7KXhwCUv4",
  authDomain: "weclean-4a88b.firebaseapp.com",
  projectId: "weclean-4a88b",
  storageBucket: "weclean-4a88b.appspot.com",
  messagingSenderId: "28516738723",
  appId: "1:28516738723:web:05a5fdfb70d26011e20116"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { app, auth, db, provider };