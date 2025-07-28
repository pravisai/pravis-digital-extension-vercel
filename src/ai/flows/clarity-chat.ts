
'use server';
/**
 * @fileOverview This is the direct version of the Clarity Chatbot.
 * It uses a direct fetch call to OpenRouter to parse user intent,
 * trigger tool actions (like navigation), or reply conversationally.
 */

import { z } from 'zod';
import { generateText } from '@/ai/openrouter';

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

export async function clarityChat(input: ClarityChatInput): Promise<ClarityChatOutput> {
  const systemInstruction = `You are Pravis, a personal AI assistant. Be compassionate, empathetic, and always guide the user with kindness.
You can perform special actions. Based on the user's message, decide if a tool is needed or if a conversational reply is best.

- If the user asks to compose an email, respond with a JSON object containing a "toolRequest" field. The action should be "navigateToEmailCompose". Extract parameters like 'to', 'subject', or 'body'.
- If the user asks to view or schedule something on their calendar, respond with a JSON object with a "toolRequest" field and the action "navigateToCalendar".
- For all other requests, provide a conversational response in the "reply" field of the JSON object.
- If an image is provided, comment on it as part of your reply.

User message: "${input.prompt}"
${input.imageDataUri ? `(Image data is attached)` : ''}

Your entire response MUST be a single JSON object matching this Zod schema:
${JSON.stringify(ClarityChatOutputSchema.shape)}
`;

  try {
    const responseText = await generateText(systemInstruction);

    // Find the JSON in the model's response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      // If no JSON object is found, assume it's a simple text reply
      return { reply: responseText };
    }
    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonString);

    // Validate result via schema
    return ClarityChatOutputSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to process clarity chat:", error);
    // Return a fallback error message
    return {
      reply: "I'm sorry, I encountered an issue processing your request. Please try again.",
    };
  }
}
