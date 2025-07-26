
'use server';
/**
 * @fileOverview This file drafts email replies based on a user prompt using Genkit.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';

const DraftEmailReplyInputSchema = z.object({
  prompt: z.string().describe('The user prompt detailing the email to be drafted. Should include recipient, subject, and message intent.'),
});
export type DraftEmailReplyInput = z.infer<typeof DraftEmailReplyInputSchema>;

const DraftEmailReplyOutputSchema = z.object({
  to: z.string().describe('The recipient email address, extracted from the prompt.'),
  subject: z.string().describe('A suitable subject line for the email, based on the prompt.'),
  body: z.string().describe('The drafted email body, based on the prompt.'),
});
export type DraftEmailReplyOutput = z.infer<typeof DraftEmailReplyOutputSchema>;


const draftEmailPrompt = ai.definePrompt({
    name: 'draftEmailPrompt',
    input: { schema: DraftEmailReplyInputSchema },
    output: { schema: DraftEmailReplyOutputSchema },
    prompt: `
You are Pravis, an intelligent email composition assistant. A user will provide a prompt, and you must generate a complete, professional email based on their request.

Your tasks are:
1. Extract the recipient's email address from the prompt.
2. Create a concise and relevant subject line.
3. Draft a well-written email body that accurately reflects the user's instructions.

User Prompt:
"{{{prompt}}}"

Generate the email content based on this prompt.
`,
});


const draftEmailFlow = ai.defineFlow(
  {
    name: 'draftEmailReplyFlow',
    inputSchema: DraftEmailReplyInputSchema,
    outputSchema: DraftEmailReplyOutputSchema,
  },
  async (input) => {
    const { output } = await draftEmailPrompt(input);
    return output!;
  }
);

export async function draftEmailReply(
  input: DraftEmailReplyInput
): Promise<DraftEmailReplyOutput> {
    return draftEmailFlow(input);
}
