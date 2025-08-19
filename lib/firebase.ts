// Firebase configuration and initialization
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCu3hXDaqQ58VvHNQ1On5wxcgaU0CIXCo8",
  authDomain: "eco-guardian-bd74f.firebaseapp.com",
  projectId: "eco-guardian-bd74f",
  storageBucket: "eco-guardian-bd74f.appspot.com",
  messagingSenderId: "917905910857",
  appId: "1:917905910857:android:5886ab1db46cec56912398",
}

export const isFirebaseConfigured = () => {
  return true // Always true now with hardcoded config
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export default app
