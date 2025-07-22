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

function isConfigValid(config: typeof firebaseConfig): boolean {
    return Object.values(config).every(value => !!value && typeof value === 'string' && value.length > 0);
}

// Enhanced initialization with error handling
let app: FirebaseApp;
let auth: Auth;

try {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    
    // Initialize Auth with the app instance
    auth = getAuth(app);
} catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback initialization
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
}

export function isFirebaseConfigured(): boolean {
    return isConfigValid(firebaseConfig);
}

// Additional helper function for debugging
export function getFirebaseApp(): FirebaseApp {
    return app;
}

export { app, auth, firebaseConfig };
