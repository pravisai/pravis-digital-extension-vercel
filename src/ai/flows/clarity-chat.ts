
'use server';
/**
 * @fileOverview This is the OpenRouter version of the Clarity Chatbot.
 * It uses a structured prompt to parse user intent,
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
    const handlebarsContext = {
        prompt: input.prompt,
        imageDataUri: input.imageDataUri,
    };

    const promptTemplate = `
You are Pravis, a personal AI assistant. Be compassionate, empathetic, and always guide the user with kindness.
You can perform special actions. Based on the user's message, decide if a tool is needed or if a conversational reply is best.

Your tasks are:
- If the user asks to compose an email, you MUST respond with a "toolRequest" field. The action should be "navigateToEmailCompose". Extract parameters like 'to', 'subject', or 'body'.
- If the user asks to view or schedule something on their calendar, you MUST respond with a "toolRequest" field and the action "navigateToCalendar".
- For ALL OTHER requests, you MUST provide a conversational response in the "reply" field.
- If an image is provided, comment on it as part of your conversational reply.

User message: "{{prompt}}"
{{#if imageDataUri}}
(Image data is attached)
{{/if}}

Respond ONLY with a valid JSON object in the format { "reply": "..." } or { "toolRequest": { "action": "...", "params": { ... } } }. Do not add any extra text or explanation.
`;

    const finalPrompt = promptTemplate
      .replace('{{prompt}}', handlebarsContext.prompt)
      .replace('{{#if imageDataUri}}', handlebarsContext.imageDataUri ? '' : '{{/if}}')
      .replace('{{/if}}', '');

  try {
    const responseText = await generateText(finalPrompt);
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
        // If no JSON object is found, assume it's a direct conversational reply.
        return { reply: responseText };
    }
    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);
    return ClarityChatOutputSchema.parse(parsed);
  } catch (error) {
    console.error("Error in clarityChat:", error);
    return {
      reply: "I'm sorry, I encountered an issue processing your request. Please try again.",
    };
  }
}
