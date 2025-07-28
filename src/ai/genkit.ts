
'use server';
/**
 * @fileoverview This file initializes the Genkit AI instance and configures the model.
 * It ensures a single, consistent AI setup throughout the application.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin
export const ai = genkit({
    plugins: [
        googleAI(),
    ],
    // Log errors to the console.
    logLevel: 'error',
    // Enable telemetry to capture errors and traces.
    enableTelemetry: true,
});
