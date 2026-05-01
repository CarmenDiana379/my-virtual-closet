import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjilCCecjlw7PGCgi9wGUVF2vqmiiCMZU",
  authDomain: "my-virtual-closet-82365.firebaseapp.com",
  projectId: "my-virtual-closet-82365",
  storageBucket: "my-virtual-closet-82365.firebasestorage.app",
  messagingSenderId: "584828593305",
  appId: "1:584828593305:web:1ac523c9781699fc830408"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);