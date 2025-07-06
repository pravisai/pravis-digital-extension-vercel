'use client';
import {
  type UserCredential,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    // Handle specific errors (e.g., account exists with different credential) here if needed
    return null;
  }
};

export const signInWithFacebook = async (): Promise<UserCredential | null> => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Facebook:', error);
     // Handle specific errors here if needed
    return null;
  }
};
