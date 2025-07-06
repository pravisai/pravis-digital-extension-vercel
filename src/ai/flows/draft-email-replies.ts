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
  emailContent: z.string().describe('The content of the email to reply to.'),
  tone: z.string().describe('The desired tone of the reply (e.g., formal, informal, friendly).'),
  parameters: z.string().describe('Any specific parameters or instructions for the reply.'),
});
export type DraftEmailRepliesInput = z.infer<typeof DraftEmailRepliesInputSchema>;

const DraftEmailRepliesOutputSchema = z.object({
  reply: z.string().describe('The drafted email reply.'),
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

  Based on the email content, desired tone, and any specific parameters, draft an email reply.

  Email Content: {{{emailContent}}}
  Tone: {{{tone}}}
  Parameters: {{{parameters}}}

  Reply:`, 
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
