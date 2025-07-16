
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCsp5cZghwKY0zXSFPCPQ6uCMlJvutFGFU",
    authDomain: "pravis-your-digital-extension.firebaseapp.com",
    projectId: "pravis-your-digital-extension",
    storageBucket: "pravis-your-digital-extension.appspot.com",
    messagingSenderId: "827924117533",
    appId: "1:827924117533:web:51d4b9d9ba16721bbbeef4"
};
  
function isConfigValid(config: typeof firebaseConfig): boolean {
    return Object.values(config).every(value => !!value && typeof value === 'string' && value.length > 0);
}

let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;

// This check prevents Firebase from being initialized on the server-side
// or if the configuration is invalid.
if (typeof window !== 'undefined' && isConfigValid(firebaseConfig)) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
} else {
    // Provide dummy objects if on server or if config is invalid
    app = {} as FirebaseApp;
    auth = {} as ReturnType<typeof getAuth>;
}

export function isFirebaseConfigured(): boolean {
    return isConfigValid(firebaseConfig);
}

export { app, auth };
