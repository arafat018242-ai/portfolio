// Firebase configuration for frontend
// Replace these values with your Firebase project configuration
// You can find these in Firebase Console > Project Settings > General > Your apps > Web app

const firebaseConfig = {
    apiKey: "AIzaSyBYFEdsar1pNHqvBEHrJVNmQVvlnBwM5Ig",
    authDomain: "portfolio-c6b89.firebaseapp.com",
    projectId: "portfolio-c6b89",
    storageBucket: "portfolio-c6b89.firebasestorage.app",
    messagingSenderId: "574205394209",
    appId: "1:574205394209:web:5304c2a04cec7979f49260"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
