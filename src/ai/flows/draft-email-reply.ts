
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
  prompt: `You are an expert email assistant. Draft an email reply based on the following instructions and desired tone.

Instructions:
"{{{instructions}}}"

Tone: {{{tone}}}

Generate a suitable subject line and a complete email body.
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
