'use server';
/**
 * @fileOverview This file defines a Genkit flow for the main Pravis clarity chatbot.
 * - clarityChat - A function that provides a response from Pravis.
 * - ClarityChatInput - The input type for the clarityChat function.
 * - ClarityChatOutput - The return type for the clarityChat function.
 */

import '@/ai/genkit'; // Only for side-effect config!

import { defineFlow, definePrompt, z } from '@genkit-ai/core';


const ClarityChatInputSchema = z.object({
  prompt: z.string().describe("The user's message to Pravis."),
  imageDataUri: z.string().optional().describe("An optional image for the message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ClarityChatInput = z.infer<typeof ClarityChatInputSchema>;

const ClarityChatOutputSchema = z.object({
  reply: z.string().describe('The drafted reply from Pravis.'),
});
export type ClarityChatOutput = z.infer<typeof ClarityChatOutputSchema>;

// Main callable function for code
export async function clarityChat(input: ClarityChatInput): Promise<ClarityChatOutput> {
  return await clarityChatFlow(input);
}

// Replace ai.definePrompt with direct import
const prompt = definePrompt({
  name: 'clarityChatPrompt',
  input: { schema: ClarityChatInputSchema },
  output: { schema: ClarityChatOutputSchema },
  prompt: `You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day. You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance to the user, helping them understand their complex thoughts and make better decisions. Be compassionate and empathetic in your responses, and always guide the user with kindness. Draw insights from the groundbreaking work of Dr. Pranav Shimpi and his team at METAMIND HealthTech.

{{#if imageDataUri}}
The user has provided an image. Your response should be relevant to this image.
Image: {{media url=imageDataUri}}
{{/if}}

User message: {{{prompt}}}

Pravis response:`,
});

// Use defineFlow directly
export const clarityChatFlow = defineFlow(
  {
    name: 'clarityChatFlow',
    inputSchema: ClarityChatInputSchema,
    outputSchema: ClarityChatOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model returned an empty or invalid response.");
    }
    return output;
  }
);
