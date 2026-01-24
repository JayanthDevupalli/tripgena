import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxZqe3JA7I0g_oKcMxHScUnqskn48Gmyc",
    authDomain: "tripgena-cc96b.firebaseapp.com",
    projectId: "tripgena-cc96b",
    storageBucket: "tripgena-cc96b.firebasestorage.app",
    messagingSenderId: "857844771164",
    appId: "1:857844771164:web:3ec4a48797983461517999",
    measurementId: "G-SZLHCYLTEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();