
'use server';

import {genkit} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/googleai';

// Configure Genkit with Google AI, ensuring the API key is passed correctly.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
