
'use server';
/**
 * @fileOverview This file defines a Genkit flow for drafting email replies.
 *
 * - draftEmailReply - A function that drafts an email reply based on instructions.
 * - DraftEmailReplyInput - The input type for the draftEmailReply function.
 * - DraftEmailReplyOutput - The return type for the draftEmailReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const DraftEmailReplyInputSchema = z.object({
  instructions: z
    .string()
    .describe('The instructions for drafting the email reply.'),
  tone: z
    .string()
    .describe('The desired tone of the reply (e.g., Friendly, Formal).'),
});
export type DraftEmailReplyInput = z.infer<
  typeof DraftEmailReplyInputSchema
>;

const DraftEmailReplyOutputSchema = z.object({
  subject: z.string().describe('A suitable subject line for the email.'),
  reply: z.string().describe('The drafted email reply.'),
});
export type DraftEmailReplyOutput = z.infer<
  typeof DraftEmailReplyOutputSchema
>;

export async function draftEmailReply(
  input: DraftEmailReplyInput
): Promise<DraftEmailReplyOutput> {
  return draftEmailReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftEmailReplyPrompt',
  input: {schema: DraftEmailReplyInputSchema},
  output: {schema: DraftEmailReplyOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day. You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance.

Your task is to draft an email reply based on the user's instructions and desired tone. Be compassionate and empathetic in your response.

Instructions:
"{{{instructions}}}"

Tone: {{{tone}}}

Generate a suitable subject line and a complete, well-crafted email body.
`,
});

const draftEmailReplyFlow = ai.defineFlow(
  {
    name: 'draftEmailReplyFlow',
    inputSchema: DraftEmailReplyInputSchema,
    outputSchema: DraftEmailReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
