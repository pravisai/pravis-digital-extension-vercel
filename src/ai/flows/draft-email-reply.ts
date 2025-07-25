'use server';
/**
 * @fileOverview This file drafts email replies conversationally using direct Gemini API calls.
 */

import { z } from 'zod';
import { generateText } from '@/ai/gemini';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const DraftEmailReplyInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  prompt: z.string().describe('The latest user prompt.'),
});
export type DraftEmailReplyInput = z.infer<typeof DraftEmailReplyInputSchema>;

const DraftEmailReplyOutputSchema = z.object({
  to: z.string().describe('The recipient email address.'),
  subject: z.string().describe('A suitable subject line for the email.'),
  tone: z.string().describe('The detected or specified tone of the email.'),
  body: z.string().describe('The drafted email reply body.'),
});
export type DraftEmailReplyOutput = z.infer<typeof DraftEmailReplyOutputSchema>;

export async function draftEmailReply(
  input: DraftEmailReplyInput
): Promise<DraftEmailReplyOutput> {
  const prompt = `
You are Pravis, an intelligent email composition assistant. Users will interact with you to create emails. Parse their input and generate complete, professional emails based on their requirements.

Input Processing:
- Extract recipient information from the user's prompt.
- Identify the main message/request.
- Determine the appropriate tone (e.g., Professional, Formal, Casual, Urgent, Diplomatic, Follow-up).
- Understand any specific requirements or context from the conversation history.

Response Format:
Always respond ONLY with the following JSON object:

{
  "to": "recipient@example.com",
  "subject": "Subject line of the email",
  "tone": "Professional",
  "body": "Body of the drafted email"
}

Conversation History:
${input.history.map(m => `${m.role === 'user' ? 'User' : 'Pravis'}: ${m.content}`).join('\n')}

Current User Request: "${input.prompt}"
`;

  const response = await generateText(prompt);

  try {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    const jsonString = response.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);

    return DraftEmailReplyOutputSchema.parse(data);
  } catch (error) {
    throw new Error('Failed to parse Gemini response as JSON: ' + (error as any).toString());
  }
}
