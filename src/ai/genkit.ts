
'use server';
/**
 * @fileOverview This file initializes and configures the Genkit AI instance.
 * It sets up the necessary plugins for Google AI and Firebase integration.
 */

import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI(), // API key is automatically sourced from Firebase Functions config when deployed.
  ],
});
