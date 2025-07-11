'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { auth } from './config';

// ✅ Setup Google provider with Gmail & Calendar scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events'); // to create/edit events

// ✅ Sign in and get Gmail/Calendar OAuth token
export const signInWithGoogle = async (): Promise<{
  userCredential: UserCredential;
  accessToken: string | null;
}> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken ?? null;

    // ✅ Store token in sessionStorage (valid during session)
    if (accessToken) {
      sessionStorage.setItem('gmail_access_token', accessToken);
    }

    return { userCredential: result, accessToken };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// ✅ Sign out and clear token
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    sessionStorage.removeItem('gmail_access_token');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// ✅ Get access token from sessionStorage
export const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('gmail_access_token');
};
