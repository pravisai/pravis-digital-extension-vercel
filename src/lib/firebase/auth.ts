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
  displayName: string
): Promise<void> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('gmail_access_token');
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

export { onAuthStateChanged, auth };
export type { UserCredential, User };
