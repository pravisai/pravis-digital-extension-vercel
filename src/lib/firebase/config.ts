
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCYdzbPrsQ7vW6UrdpgSeN5KW85kzGliPA",
    authDomain: "pravis-your-digital-extension.firebaseapp.com",
    projectId: "pravis-your-digital-extension",
    storageBucket: "pravis-your-digital-extension.firebasestorage.app",
    messagingSenderId: "827924117533",
    appId: "1:827924117533:web:51d4b9d9ba16721bbbeef4"
  };

function isConfigValid(config: typeof firebaseConfig): boolean {
    return Object.values(config).every(value => !!value);
}

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;

if (isConfigValid(firebaseConfig)) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
} else {
    console.error("Firebase configuration is missing or incomplete. Please check your environment variables.");
    // Provide dummy objects to prevent app from crashing
    app = {} as FirebaseApp;
    auth = {} as ReturnType<typeof getAuth>;
}

const isFirebaseConfigured = () => isConfigValid(firebaseConfig);

export { app, auth, isFirebaseConfigured };
