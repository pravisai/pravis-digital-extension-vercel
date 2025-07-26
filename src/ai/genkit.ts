
'use server';
/**
 * @fileoverview This file initializes the Genkit AI instance and configures the model.
 * It ensures a single, consistent AI setup throughout the application.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize the AI plugin only once.
export const ai = genkit({
    plugins: [
        googleAI({
            apiVersion: 'v1beta', // Required for advanced models
        }),
    ],
    // Log errors to the console.
    logLevel: 'error',
    // Enable telemetry to capture errors and traces.
    enableTelemetry: true,
});
