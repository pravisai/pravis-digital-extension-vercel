
'use server';
/**
 * @fileOverview This is the Genkit version of the Clarity Chatbot.
 * It uses a structured prompt to parse user intent,
 * trigger tool actions (like navigation), or reply conversationally.
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
    prompt: `
You are Pravis, a personal AI assistant. Be compassionate, empathetic, and always guide the user with kindness.
You can perform special actions. Based on the user's message, decide if a tool is needed or if a conversational reply is best.

Your tasks are:
- If the user asks to compose an email, you MUST respond with a "toolRequest" field. The action should be "navigateToEmailCompose". Extract parameters like 'to', 'subject', or 'body'.
- If the user asks to view or schedule something on their calendar, you MUST respond with a "toolRequest" field and the action "navigateToCalendar".
- For ALL OTHER requests, you MUST provide a conversational response in the "reply" field.
- If an image is provided, comment on it as part of your conversational reply.

User message: "{{{prompt}}}"
{{#if imageDataUri}}
(Image data is attached: {{media url=imageDataUri}})
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
    try {
        const { output } = await clarityChatPrompt(input);
        if (!output) {
            // This can happen if the model returns a completely empty response.
            throw new Error("Received an empty response from the AI model.");
        }
        return output;
    } catch (error) {
        console.error("Error in clarityChatFlow:", error);
        // Provide a user-friendly error message in the expected format.
        return {
            reply: "I'm sorry, I encountered an issue processing your request. Please try again.",
        };
    }
  }
);

export async function clarityChat(input: ClarityChatInput): Promise<ClarityChatOutput> {
    return clarityChatFlow(input);
}
