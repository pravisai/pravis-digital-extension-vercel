'use server';
/**
 * @fileOverview This file drafts email replies based on a user prompt using OpenRouter.
 */

import { z } from 'zod';
import { generateText } from '@/ai/openrouter';

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

export async function draftEmailReply(
  input: DraftEmailReplyInput
): Promise<DraftEmailReplyOutput> {
  const prompt = `
You are Pravis, an intelligent email composition assistant. A user will provide a prompt, and you must generate a complete, professional email based on their request.

Your tasks are:
1. Extract the recipient's email address from the prompt.
2. Create a concise and relevant subject line.
3. Draft a well-written email body that accurately reflects the user's instructions.

User Prompt:
"${input.prompt}"

Respond ONLY with a valid JSON object in the following format, with no additional text or explanation:
{
  "to": "...",
  "subject": "...",
  "body": "..."
}
`;

  const responseText = await generateText(prompt);
  try {
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON object found in the AI response.");
    }
    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);
    return DraftEmailReplyOutputSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to parse draft email reply from AI:", error, "Raw response:", responseText);
    throw new Error("Failed to generate a valid email draft. The AI response was not in the expected format.");
  }
}
