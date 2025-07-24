
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

function createFirebaseApp(config: object): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(config);
    }
    return getApp();
}

const isConfigValid = Object.values(firebaseConfig).every(value => typeof value === 'string' && value.length > 0);

if (!isConfigValid) {
    console.error('CRITICAL: Firebase configuration is invalid. Please check your NEXT_PUBLIC_ environment variables.');
}

const app = isConfigValid ? createFirebaseApp(firebaseConfig) : ({} as FirebaseApp);
const auth = isConfigValid ? getAuth(app) : ({} as Auth);


export function isFirebaseConfigured(): boolean {
    return isConfigValid;
}

export { app, auth, firebaseConfig };
