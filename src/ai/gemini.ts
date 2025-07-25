import { googleAI } from '@genkit-ai/googleai';

// Log for debug (remove for prod)
console.log('GEMINI_API_KEY in gemini.ts:', process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY environment variable is missing. Set it in your .env file and restart your server.'
  );
}

export const geminiAI = googleAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'googleai/gemini-2.0-flash',
});
