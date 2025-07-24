
'use server';
/**
 * @fileOverview This file initializes and configures the Genkit AI instance.
 * It sets up the necessary plugins for Google AI and Firebase integration.
 */

import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    try {
        // When deployed to Firebase, service account credentials will be automatically
        // available without any configuration. For local development, you might need
        // to set up a service account file.
        admin.initializeApp();
        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
        console.error('Firebase Admin initialization failed:', error.message);
    }
}

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({ 
      // The API key is automatically sourced from the GEMINI_API_KEY environment
      // variable. There is no need to pass it explicitly here.
      // For deployments, set this key in your environment's secret management.
    }),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
