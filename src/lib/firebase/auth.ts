'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { auth } from './config';

// ✅ Set up Google provider with Gmail & Calendar scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

export const signInWithGoogle = async (): Promise<{
  userCredential: UserCredential | null;
  accessToken: string | null;
}> => {
  if (typeof window === 'undefined') return { userCredential: null, accessToken: null };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    if (isMobile) {
      // 📱 On mobile, redirect flow (will leave the current page)
      await signInWithRedirect(auth, googleProvider);
      return { userCredential: null, accessToken: null }; // redirect in progress
    } else {
      // 💻 On desktop, use popup flow
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken ?? null;

      if (accessToken) {
        sessionStorage.setItem('gmail_access_token', accessToken);
      }

      return { userCredential: result, accessToken };
    }
  } catch (error) {
    console.error('❌ Error during signInWithGoogle:', error);
    throw error;
  }
};

// ✅ Handle redirect result on page load (Mobile)
export const handleRedirectResult = async (): Promise<{
  userCredential: UserCredential | null;
  accessToken: string | null;
}> => {
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
  } catch (error) {
    console.error('❌ Error handling redirect result:', error);
    throw error;
  }

  return { userCredential: null, accessToken: null };
};

// ✅ Sign out and clear session token
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    sessionStorage.removeItem('gmail_access_token');
  } catch (error) {
    console.error('❌ Error signing out:', error);
    throw error;
  }
};

// ✅ Utility to retrieve stored token from session
export const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('gmail_access_token');
};
