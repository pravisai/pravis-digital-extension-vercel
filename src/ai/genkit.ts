'use server';
import {genkit, type GenkitOptions} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/googleai';
import {Plugin} from '@genkit-ai/core';

const plugins: Plugin<any>[] = [];

if (process.env.GEMINI_API_KEY) {
  plugins.push(
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  );
} else {
  console.warn(
    '\n********************************************************************\n' +
      'WARNING: GEMINI_API_KEY is not set.\n' +
      'The application will run, but AI features will be disabled.\n' +
      'Please get a key from Google AI Studio and add it to your .env file.\n' +
      '********************************************************************\n'
  );
}

export const ai = genkit({
  plugins: plugins,
  model: 'gemini-1.5-flash-latest',
});
