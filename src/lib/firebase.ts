import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBkAQjuOPN1dF3tZxqVqk0Jf7H-Dy0qfmU",
    authDomain: "prezagia.firebaseapp.com",
    projectId: "prezagia",
    storageBucket: "prezagia.firebasestorage.app",
    messagingSenderId: "127247743698",
    appId: "1:127247743698:web:86782ab8a88c5f46c14b0b",
    measurementId: "G-T58160CJWD"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
