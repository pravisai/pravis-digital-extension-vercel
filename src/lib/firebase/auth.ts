
'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';

// Add scopes for Gmail and Calendar
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

// Health check for Firebase config
const isFirebaseConfigured = () => {
  return auth.app.options && Object.values(auth.app.options).every(value => !!value);
};

export const signInWithGoogle = async (): Promise<{
  userCredential: UserCredential | null;
  accessToken: string | null;
}> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase configuration is missing or incomplete.');
  }
  if (typeof window === 'undefined') return { userCredential: null, accessToken: null };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    if (isMobile) {
      await signInWithRedirect(auth, googleProvider);
      return { userCredential: null, accessToken: null };
    } else {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken ?? null;
      if (accessToken) {
        sessionStorage.setItem('gmail_access_token', accessToken);
      }
      return { userCredential: result, accessToken };
    }
  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error('Error during signInWithGoogle:', error);
        throw error;
    }
    return { userCredential: null, accessToken: null };
  }
};

export const handleRedirectResult = async (): Promise<{
  userCredential: UserCredential | null;
  accessToken: string | null;
}> => {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    return { userCredential: null, accessToken: null };
  }
  
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken ?? null;
      if (accessToken) {
        sessionStorage.setItem('gmail_access_token', accessToken);
      }
      return { userCredential: result, accessToken };
    }
  } catch (error: any) {
    if ((error as any).code !== 'auth/popup-closed-by-user' && (error as any).code !== 'auth/cancelled-popup-request') {
        console.error('Error handling redirect result:', error);
        throw error;
    }
  }
  return { userCredential: null, accessToken: null };
};

export const signInWithEmail = async (email: string, password: string): Promise<{ userCredential: UserCredential; error?: undefined } | { userCredential?: undefined; error: any }> => {
    if (!isFirebaseConfigured()) return { error: { message: 'Firebase not configured.' }};
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { userCredential };
    } catch (error: any) {
        return { error };
    }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<{ userCredential: UserCredential; error?: undefined } | { userCredential?: undefined; error: any }> => {
    if (!isFirebaseConfigured()) return { error: { message: 'Firebase not configured.' }};
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        return { userCredential };
    } catch (error: any) {
        return { error };
    }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    sessionStorage.removeItem('gmail_access_token');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('gmail_access_token');
};
