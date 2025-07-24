
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function isConfigValid(config: typeof firebaseConfig): config is Record<string, string> {
    return Object.values(config).every(value => typeof value === 'string' && value.length > 0);
}

// Singleton instances
let app: FirebaseApp;
let auth: Auth;
const isConfigured = isConfigValid(firebaseConfig);

if (!isConfigured) {
    console.error('CRITICAL: Firebase configuration is invalid or incomplete. Please check your NEXT_PUBLIC_ environment variables.');
}

try {
    if (getApps().length === 0 && isConfigured) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
    } else if (isConfigured) {
        app = getApp();
        auth = getAuth(app);
    } else {
        // Provide dummy objects if config is invalid to prevent app from crashing on server,
        // but functionality will be broken. The error will be logged.
        app = {} as FirebaseApp;
        auth = {} as Auth;
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback for safety
    app = {} as FirebaseApp;
    auth = {} as Auth;
}

export function isFirebaseConfigured(): boolean {
    return isConfigured;
}

export { app, auth, firebaseConfig };
