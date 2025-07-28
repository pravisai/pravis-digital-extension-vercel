
'use server';
/**
 * @fileOverview This is the direct version of the Clarity Chatbot—
 * parses user intent, can trigger tool actions (navigation), or reply conversationally.
 * It uses Genkit for structured responses.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';

const ClarityChatInputSchema = z.object({
  prompt: z.string().describe("The user's message to Pravis."),
  imageDataUri: z.string().optional().describe("An optional image for the message, as a data URI with a MIME type and base64 encoding."),
});
export type ClarityChatInput = z.infer<typeof ClarityChatInputSchema>;

const ClarityChatOutputSchema = z.object({
  reply: z.string().optional().describe('The conversational reply from Pravis.'),
  toolRequest: z.object({
    action: z.enum(['navigateToEmailCompose', 'navigateToCalendar']),
    params: z.record(z.any()).optional(),
  }).optional().describe('Navigation/tool request, if any.'),
});
export type ClarityChatOutput = z.infer<typeof ClarityChatOutputSchema>;

const clarityChatPrompt = ai.definePrompt({
    name: 'clarityChatPrompt',
    input: { schema: ClarityChatInputSchema },
    output: { schema: ClarityChatOutputSchema },
    prompt: `You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day.
You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance to the user, helping them understand their complex thoughts and make better decisions. Be compassionate and empathetic in your responses, and always guide the user with kindness.

You can also perform the following special actions if requested or inferred from the user's text.
Your response MUST be a valid JSON object matching the defined schema.

- If the user asks to compose an email, use the "navigateToEmailCompose" tool.
- If the user asks to view or schedule something on their calendar, use the "navigateToCalendar" tool.
- For all other requests, provide a conversational response in the "reply" field.

User message: """{{{prompt}}}"""
{{#if imageDataUri}}
Attached image: {{media url=imageDataUri}}
{{/if}}
`,
});

const clarityChatFlow = ai.defineFlow(
  {
    name: 'clarityChatFlow',
    inputSchema: ClarityChatInputSchema,
    outputSchema: ClarityChatOutputSchema,
  },
  async (input) => {
    const { output } = await clarityChatPrompt(input);
    if (!output) {
      // Fallback in case the model fails to produce structured output
      return { reply: "I'm sorry, I couldn't process that request. Could you try rephrasing?" };
    }
    return output;
  }
);


export async function clarityChat(input: ClarityChatInput): Promise<ClarityChatOutput> {
  return clarityChatFlow(input);
}
