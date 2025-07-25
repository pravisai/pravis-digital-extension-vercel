'use server';

/**
 * @fileOverview This file initializes and configures the Gemini AI instance.
 * It sets up the Google Gemini SDK and exports a helper for all AI-related tasks.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY environment variable is missing. Set it in your .env.local file and restart your server.'
  );
}

// Create a Gemini instance (singleton pattern)
export const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);

// Example: Text generation function
export async function generateGeminiText(prompt: string) {
  const model = gemini.getGenerativeModel({ model: "gemini-pro" }); // or "gemini-1.5-pro", etc.
  const result = await model.generateContent(prompt);
  return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Add more helpers for multimodal, TTS, etc., as needed!
