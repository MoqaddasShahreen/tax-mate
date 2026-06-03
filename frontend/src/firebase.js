import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6bk_lJic6OZihke4a5fBcbBCQRHHfrrQ",
  authDomain: "taxmate-d7293.firebaseapp.com",
  projectId: "taxmate-d7293",
  storageBucket: "taxmate-d7293.firebasestorage.app",
  messagingSenderId: "982051484485",
  appId: "1:982051484485:web:d346838ff5dff12189842c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);