'use server';

/**
 * @fileOverview This file initializes and configures the Genkit AI instance.
 * It sets up the Google AI plugin and exports a global `ai` object
 * that should be used for all AI-related tasks.
 */

import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY environment variable is missing. Set it in your .env.local file and restart your server.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
