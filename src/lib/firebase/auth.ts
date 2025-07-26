
'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './config';

// Add scopes for Gmail and Calendar
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');

// Force fresh consent to get refresh tokens
googleProvider.setCustomParameters({
  'access_type': 'offline',
  'prompt': 'consent'
});

export const signInWithGoogle = async (): Promise<{
  userCredential: UserCredential | null;
  accessToken: string | null;
}> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken ?? null;
    
    if (accessToken && typeof window !== 'undefined') {
      sessionStorage.setItem('gmail_access_token', accessToken);
      sessionStorage.setItem('gmail_token_time', Date.now().toString());
    }
    
    return { userCredential: result, accessToken };
  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      console.error(`Google Sign-In Error (Code: ${error.code}):`, error.message);
    }
    throw error;
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
  occupation: string // Added occupation
): Promise<void> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
    // Here you would typically save the occupation to a user profile in Firestore
    // For now, we just log it to show it's being captured.
    console.log(`New user signed up with occupation: ${occupation}`);
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('gmail_access_token');
      sessionStorage.removeItem('gmail_token_time');
    }
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return sessionStorage.getItem('gmail_access_token');
};

// Check if token is likely expired (older than 50 minutes)
export const isTokenLikelyExpired = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const tokenTime = sessionStorage.getItem('gmail_token_time');
  if (!tokenTime) return true;
  
  const tokenAge = Date.now() - parseInt(tokenTime, 10);
  return tokenAge > (50 * 60 * 1000); // 50 minutes
};

export const getValidAccessToken = (): string | null => {
  const token = getStoredAccessToken();
  if (!token || isTokenLikelyExpired()) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('gmail_access_token');
      sessionStorage.removeItem('gmail_token_time');
    }
    return null;
  }
  return token;
};

export { onAuthStateChanged, auth };
export type { UserCredential, User };
