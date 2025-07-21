'use server';
/**
 * @fileOverview This file defines a Genkit flow for drafting email replies based on email content and user-specified parameters.
 *
 * - draftEmailReplies - A function that handles the email reply drafting process.
 * - DraftEmailRepliesInput - The input type for the draftEmailReplies function.
 * - DraftEmailRepliesOutput - The return type for the draftEmailReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftEmailRepliesInputSchema = z.object({
  instructions: z.string().describe('Instructions for what the email should be about.'),
  tone: z.string().describe('The desired tone of the reply (e.g., formal, informal, friendly).'),
});
export type DraftEmailRepliesInput = z.infer<typeof DraftEmailRepliesInputSchema>;

const DraftEmailRepliesOutputSchema = z.object({
  subject: z.string().describe('The generated subject line for the email.'),
  reply: z.string().describe('The drafted email reply body.'),
});
export type DraftEmailRepliesOutput = z.infer<typeof DraftEmailRepliesOutputSchema>;

export async function draftEmailReplies(input: DraftEmailRepliesInput): Promise<DraftEmailRepliesOutput> {
  return draftEmailRepliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftEmailRepliesPrompt',
  input: {schema: DraftEmailRepliesInputSchema},
  output: {schema: DraftEmailRepliesOutputSchema},
  prompt: `You are Pravis, a personal assistant designed to draft email replies.

  Based on the instructions and desired tone, draft an email reply including a subject line.

  Instructions: {{{instructions}}}
  Tone: {{{tone}}}
  
  Generate a suitable subject line and a reply body.`, 
});

const draftEmailRepliesFlow = ai.defineFlow(
  {
    name: 'draftEmailRepliesFlow',
    inputSchema: DraftEmailRepliesInputSchema,
    outputSchema: DraftEmailRepliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
