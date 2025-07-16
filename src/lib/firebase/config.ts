import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Health check for Firebase configuration
const isFirebaseConfigured = (): boolean => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field as keyof typeof firebaseConfig]
  );

  if (missingFields.length > 0) {
    console.error(
      `Firebase configuration is missing or incomplete. Missing fields: ${missingFields.join(', ')}. Check environment variables.`
    );
    return false;
  }
  return true;
};

// Initialize Firebase only if configuration is valid
let app = null;
let auth = {} as any; // Dummy auth object if initialization fails

if (isFirebaseConfigured()) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error: any) {
    console.error('Failed to initialize Firebase:', error);
    if (error.code === 'auth/invalid-api-key') {
      console.error(
        'Invalid Firebase API key. Verify NEXT_PUBLIC_FIREBASE_API_KEY in your environment variables.'
      );
    }
  }
} else {
  console.warn(
    'Firebase not initialized due to missing configuration. Ensure all NEXT_PUBLIC_FIREBASE_* environment variables are set.'
  );
}

// Log configuration for debugging (avoid logging sensitive data in production)
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config Status:', {
    isConfigured: isFirebaseConfigured(),
    apiKey: firebaseConfig.apiKey ? '[Redacted]' : 'Missing',
    projectId: firebaseConfig.projectId || 'Missing',
  });
}

export { app, auth, isFirebaseConfigured }; 