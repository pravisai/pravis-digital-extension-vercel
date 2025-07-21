
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);


export function isFirebaseConfigured(): boolean {
    return isConfigValid(firebaseConfig);
}

export { app, auth };
