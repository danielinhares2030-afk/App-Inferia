import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALxsSUclmKJXCBUFVPyTU9QWBfvjkM0tc",
  authDomain: "manga-inferia.firebaseapp.com",
  projectId: "manga-inferia",
  storageBucket: "manga-inferia.firebasestorage.app",
  messagingSenderId: "693080808285",
  appId: "1:693080808285:web:539180b1b290c38d3726b4",
  measurementId: "G-XMZ4911L2V"
};

const app = initializeApp(firebaseConfig);

// É exatamente esta linha do 'db' que a Vercel está a sentir falta!
export const auth = getAuth(app);
export const db = getFirestore(app);
