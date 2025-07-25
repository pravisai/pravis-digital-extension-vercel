'use server';

/**
 * @fileOverview This file initializes and configures the Genkit AI instance.
 * It sets up the Google AI plugin. This file should not export anything
 * and is imported for its side effects only.
 */

import { configureGenkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

configureGenkit({
  plugins: [
    // The googleAI plugin is configured to use the GEMINI_API_KEY from the environment.
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
