import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCsp5cZghwKY0zXSFPCPQ6uCMlJvutFGFU",
    authDomain: "pravis-your-digital-extension.firebaseapp.com",
    projectId: "pravis-your-digital-extension",
    storageBucket: "pravis-your-digital-extension.firebasestorage.app",
    messagingSenderId: "827924117533",
    appId: "1:827924117533:web:51d4b9d9ba16721bbbeef4",
    measurementId: "G-3ZKWGHPVJ0"
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
