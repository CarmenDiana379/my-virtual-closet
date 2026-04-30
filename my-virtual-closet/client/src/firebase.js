// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firestore
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjblICCeccjlv7PGCgi9wGUVF2vgmiCMZU",
  authDomain: "my-virtual-closet-82365.firebaseapp.com",
  projectId: "my-virtual-closet-82365",
  storageBucket: "my-virtual-closet-82365.firebasestorage.app",
  messagingSenderId: "584828593305",
  appId: "1:584828593305:web:1ac523c9781699fc830408",
  measurementId: "G-CRCJPRSRJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export database
export { db };