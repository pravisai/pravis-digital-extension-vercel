// IMPORTANT: Add the Firebase SDK for Google Analytics
// import { getAnalytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration that you get from the Firebase console
// Replace with your actual credentials
const firebaseConfig = {
  apiKey: "AIzaSyD4gLIOIQEOxeztyjKJKn3Qpl7XBBcogdw",
  authDomain: "pravis-your-digital-extension.firebaseapp.com",
  projectId: "pravis-your-digital-extension",
  storageBucket: "pravis-your-digital-extension.firebasestorage.app",
  messagingSenderId: "827924117533",
  appId: "1:827924117533:web:51d4b9d9ba16721bbbeef4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { app, auth };
