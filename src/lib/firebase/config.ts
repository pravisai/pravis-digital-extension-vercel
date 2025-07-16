
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  
function isConfigValid(config: typeof firebaseConfig): boolean {
    return Object.values(config).every(value => !!value);
}

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;

// This check prevents initializing the app on the server if the variables are not set.
// On the client, the .env file will provide them.
if (isConfigValid(firebaseConfig)) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
} else {
    console.error("Firebase configuration is missing or incomplete. Please check your environment variables.");
    // Provide dummy objects to prevent app from crashing if config is invalid.
    app = {} as FirebaseApp;
    auth = {} as ReturnType<typeof getAuth>;
}

export function isFirebaseConfigured(): boolean {
    return isConfigValid(firebaseConfig);
}

export { app, auth };
