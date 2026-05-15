import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRAvSFl0Y1ObDAKw58iWv4aZPKKAcbZo0",
  authDomain: "app-admin-inferia.firebaseapp.com",
  projectId: "app-admin-inferia",
  storageBucket: "app-admin-inferia.firebasestorage.app",
  messagingSenderId: "998451568855",
  appId: "1:998451568855:web:f304729facff1d5c0e5092",
  measurementId: "G-4PHSB8KCYW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
