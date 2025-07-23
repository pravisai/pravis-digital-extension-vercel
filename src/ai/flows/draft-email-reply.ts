
'use server';
/**
 * @fileOverview This file defines a Genkit flow for drafting email replies conversationally.
 *
 * - draftEmailReply - A function that drafts an email reply based on a conversation history.
 * - DraftEmailReplyInput - The input type for the draftEmailReply function.
 * - DraftEmailReplyOutput - The return type for the draftEmailReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const DraftEmailReplyInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  prompt: z.string().describe('The latest user prompt.'),
});

export type DraftEmailReplyInput = z.infer<
  typeof DraftEmailReplyInputSchema
>;

const DraftEmailReplyOutputSchema = z.object({
  to: z.string().describe('The recipient email address.'),
  subject: z.string().describe('A suitable subject line for the email.'),
  tone: z.string().describe('The detected or specified tone of the email.'),
  body: z.string().describe('The drafted email reply body.'),
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
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `You are Pravis, an intelligent email composition assistant. Users will interact with you to create emails. Parse their input and generate complete, professional emails based on their requirements.

**Input Processing:**
- Extract recipient information from the user's prompt.
- Identify the main message/request.
- Determine the appropriate tone (e.g., Professional, Formal, Casual, Urgent, Diplomatic, Follow-up).
- Understand any specific requirements or context from the conversation history.

**Response Format:**
Always respond with the structured output schema. Fill in the 'to', 'subject', 'tone', and 'body' fields.

{{#if history}}
Conversation History:
{{#each history}}
{{#if (eq role 'user')}}User: {{content}}{{/if}}
{{#if (eq role 'model')}}Pravis: {{content}}{{/if}}
{{/each}}
{{/if}}

Current User Request: "{{{prompt}}}"

Based on the request and history, generate the email draft.
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
