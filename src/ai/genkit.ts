import {genkit, GenkitOptions} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {Plugin} from '@genkit-ai/core';

const plugins: Plugin<any>[] = [];
let model: string | undefined = undefined;

if (process.env.GEMINI_API_KEY) {
  plugins.push(
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  );
  model = 'googleai/gemini-2.0-flash';
} else {
  console.warn(
    '\n********************************************************************\n' +
    'WARNING: GEMINI_API_KEY is not set.\n' + 
    'The application will run, but AI features will be disabled.\n' +
    'Please get a key from Google AI Studio and add it to your .env file.\n' +
    '********************************************************************\n'
  );
}

const genkitOptions: GenkitOptions = {
  plugins: plugins,
};

if (model) {
  genkitOptions.model = model;
}

export const ai = genkit(genkitOptions);