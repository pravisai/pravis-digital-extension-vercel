
'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type UserCredential,
  signInWithRedirect,
  getRedirectResult,
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
  userCredential: UserCredential | null;
  accessToken: string | null;
}> => {
  if (typeof window === 'undefined') return { userCredential: null, accessToken: null };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // On mobile, the redirect will navigate away, so this function won't return a value here.
    // The result is handled by handleRedirectResult after the redirect.
    await signInWithRedirect(auth, googleProvider);
    return { userCredential: null, accessToken: null };
  } else {
    // Use popup for desktop
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken ?? null;
    if (accessToken) {
      sessionStorage.setItem('gmail_access_token', accessToken);
    }
    return { userCredential: result, accessToken };
  }
};

// Handle the redirect result on page load
export const handleRedirectResult = async (): Promise<{ userCredential: UserCredential | null, accessToken: string | null }> => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // This is the UserCredential object.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken ?? null;
      if (accessToken) {
        sessionStorage.setItem('gmail_access_token', accessToken);
      }
      return { userCredential: result, accessToken };
    }
  } catch (error) {
    console.error("Error handling redirect result:", error);
    // Rethrow to be caught by the caller
    throw error;
  }
  return { userCredential: null, accessToken: null };
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
