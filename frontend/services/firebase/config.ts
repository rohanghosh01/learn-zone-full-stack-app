import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import config from "../../config/config.json";

const firebaseConfig = config.FIREBASE_CONFIG;

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const currentUser = auth.currentUser;
export const googleProvider = new GoogleAuthProvider();
