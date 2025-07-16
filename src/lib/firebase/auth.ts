
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
import { auth, isFirebaseConfigured } from './config';

// Ensure Firebase is only initialized client-side to avoid SSG/SSR issues
if (typeof window === 'undefined' && !isFirebaseConfigured()) {
  console.warn('Firebase auth is not available on the server-side. Ensure client-side initialization.');
}

// Add scopes for Gmail and Calendar
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');


export const signInWithGoogle = async (): Promise<{
  userCredential: UserCredential | null;
  accessToken: string | null;
}> => {
  // Prevent execution on server-side or if Firebase is not configured
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    console.warn('signInWithGoogle: Called on server-side or Firebase not configured, returning null.');
    return { userCredential: null, accessToken: null };
  }

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
    // Log the full error for better debugging
    console.error(`Google Sign-In Error (Code: ${error.code}):`, error.message);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/invalid-api-key') {
      console.error('signInWithGoogle: Invalid Firebase API key. Check environment variables in ./config.');
    } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      console.error('Error during signInWithGoogle:', error);
    }
    throw error;
  }
};

export const handleRedirectResult = async (): Promise<{
  userCredential: UserCredential | null;
  accessToken: string | null;
}> => {
  // Prevent execution on server-side or if Firebase is not configured
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    console.warn('handleRedirectResult: Called on server-side or Firebase not configured, returning null.');
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
    return { userCredential: null, accessToken: null };
  } catch (error: any) {
    if (error.code === 'auth/invalid-api-key') {
      console.error('handleRedirectResult: Invalid Firebase API key. Check environment variables in ./config.');
    } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      console.error('Error handling redirect result:', error);
    }
    throw error;
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ userCredential: UserCredential; error?: undefined } | { userCredential?: undefined; error: any }> => {
  if (!isFirebaseConfigured()) return { error: { message: "Firebase not configured." }};
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { userCredential };
  } catch (error: any) {
    if (error.code === 'auth/invalid-api-key') {
      console.error('signInWithEmail: Invalid Firebase API key. Check environment variables in ./config.');
    }
    return { error };
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<{ userCredential: UserCredential; error?: undefined } | { userCredential?: undefined; error: any }> => {
  if (!isFirebaseConfigured()) return { error: { message: "Firebase not configured." }};
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return { userCredential };
  } catch (error: any) {
    if (error.code === 'auth/invalid-api-key') {
      console.error('signUpWithEmail: Invalid Firebase API key. Check environment variables in ./config.');
    }
    return { error };
  }
};

export const signOutUser = async (): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  try {
    await signOut(auth);
    sessionStorage.removeItem('gmail_access_token');
  } catch (error: any) {
    if (error.code === 'auth/invalid-api-key') {
      console.error('signOutUser: Invalid Firebase API key. Check environment variables in ./config.');
    }
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    console.warn('getStoredAccessToken: Called on server-side or Firebase not configured, returning null.');
    return null;
  }
  return sessionStorage.getItem('gmail_access_token');
};
