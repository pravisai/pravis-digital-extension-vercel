
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration pulled from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Health check for Firebase config
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey &&
         firebaseConfig.authDomain &&
         firebaseConfig.projectId &&
         firebaseConfig.storageBucket &&
         firebaseConfig.messagingSenderId &&
         firebaseConfig.appId;
};

// Initialize Firebase
const app = isFirebaseConfigured() 
  ? !getApps().length ? initializeApp(firebaseConfig) : getApp()
  : null;

const auth = app ? getAuth(app) : ({} as any); // Provide a dummy auth object if not configured

if (!app) {
  console.error("Firebase configuration is missing or incomplete. Please check your environment variables.");
}


export { app, auth, isFirebaseConfigured };
