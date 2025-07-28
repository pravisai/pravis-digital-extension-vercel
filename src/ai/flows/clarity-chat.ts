
'use server';
/**
 * @fileOverview This is the direct version of the Clarity Chatbot.
 * It uses Genkit with a Google AI configuration to parse user intent,
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


const clarityChatFlow = ai.defineFlow(
  {
    name: 'clarityChatFlow',
    inputSchema: ClarityChatInputSchema,
    outputSchema: ClarityChatOutputSchema,
  },
  async (input) => {
    
    const llm = ai.model('gemini-1.5-flash-latest');
    const systemInstruction = `You are Pravis, a personal AI assistant. Be compassionate, empathetic, and always guide the user with kindness.
You can perform special actions. Based on the user's message, decide if a tool is needed or if a conversational reply is best.

- If the user asks to compose an email, use the "navigateToEmailCompose" tool. Extract parameters like 'to', 'subject', or 'body'.
- If the user asks to view or schedule something on their calendar, use the "navigateToCalendar" tool.
- For all other requests, provide a conversational response in the "reply" field.
- If an image is provided, comment on it as part of your reply.
`;

    const parts = [
      { text: `User message: "${input.prompt}"` }
    ];

    if (input.imageDataUri) {
      parts.push({ media: { url: input.imageDataUri } });
    }
    
    const { output } = await ai.generate({
        model: llm,
        system: systemInstruction,
        prompt: {
            text: input.prompt
        },
        output: {
            schema: ClarityChatOutputSchema,
        }
    });
    
    return output || { reply: "I'm sorry, I could not process your request at the moment." };
  }
);


export async function clarityChat(input: ClarityChatInput): Promise<ClarityChatOutput> {
    return clarityChatFlow(input);
}
