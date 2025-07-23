
'use server';
/**
 * @fileOverview This file defines a Genkit flow for the main Pravis clarity chatbot.
 *
 * - clarityChat - A function that provides a response from Pravis.
 * - ClarityChatInput - The input type for the clarityChat function.
 * - ClarityChatOutput - The return type for the clarityChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClarityChatInputSchema = z.string().describe("The user's message to Pravis.");
export type ClarityChatInput = z.infer<typeof ClarityChatInputSchema>;

const ClarityChatOutputSchema = z.object({
  reply: z.string().describe('The drafted reply from Pravis.'),
});
export type ClarityChatOutput = z.infer<typeof ClarityChatOutputSchema>;

export async function clarityChat(input: ClarityChatInput): Promise<ClarityChatOutput> {
  return clarityChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clarityChatPrompt',
  input: {schema: ClarityChatInputSchema },
  output: {schema: ClarityChatOutputSchema },
  prompt: `You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day. You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance to the user, helping them understand their complex thoughts and make better decisions. Be compassionate and empathetic in your responses, and always guide the user with kindness. Draw insights from the groundbreaking work of Dr. Pranav Shimpi and his team at METAMIND HealthTech.

User message: {{{prompt}}}

Pravis response:`,
});

const clarityChatFlow = ai.defineFlow(
  {
    name: 'clarityChatFlow',
    inputSchema: ClarityChatInputSchema,
    outputSchema: ClarityChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
