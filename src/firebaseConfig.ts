// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQy-dO_jnRBJ4zXaW3eFmbvPUGxJWq7f0",
  authDomain: "yasminmonth2025.firebaseapp.com",
  projectId: "yasminmonth2025",
  storageBucket: "yasminmonth2025.firebasestorage.app",
  messagingSenderId: "641160622036",
  appId: "1:641160622036:web:9e773420b01b033c9b3041",
  measurementId: "G-N6LQRK25H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
