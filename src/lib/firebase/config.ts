
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration pulled from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyD4gLIOIQEOxeztyjKJKn3Qpl7XBBcogdw",
  authDomain: "pravis-your-digital-extension.firebaseapp.com",
  projectId: "pravis-your-digital-extension",
  storageBucket: "pravis-your-digital-extension.firebasestorage.app",
  messagingSenderId: "827924117533",
  appId: "1:827924117533:web:51d4b9d9ba16721bbbeef4"
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
