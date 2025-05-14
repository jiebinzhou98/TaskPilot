// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "taskpilot-f5f43.firebaseapp.com",
  projectId: "taskpilot-f5f43",
  storageBucket: "taskpilot-f5f43.firebasestorage.app",
  messagingSenderId: "306592434968",
  appId: "1:306592434968:web:0b28b05f237732073eec6d"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app)

const db =  getFirestore(app)

export { auth, db}