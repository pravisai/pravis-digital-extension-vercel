
'use server';
/**
 * @fileOverview This is the direct version of the Clarity Chatbot—
 * parses user intent, can trigger tool actions (navigation), or reply conversationally.
 * It uses the OpenRouter helper, not Genkit, to align with other parts of the app.
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
    const systemPrompt = `You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day.
You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance to the user, helping them understand their complex thoughts and make better decisions. Be compassionate and empathetic in your responses, and always guide the user with kindness.

You can also perform the following special actions if requested or inferred from the user's text.
Your response MUST be a valid JSON object matching this schema:
{
  "reply": "Your conversational reply from Pravis, if any.",
  "toolRequest": {
    "action": "navigateToEmailCompose" | "navigateToCalendar",
    "params": { "to": "...", "subject": "...", "body": "..." }
  }
}

- If the user asks to compose an email, use the "navigateToEmailCompose" tool. Extract parameters like 'to', 'subject', or 'body' from the user's message.
- If the user asks to view or schedule something on their calendar, use the "navigateToCalendar" tool.
- For all other requests, provide a conversational response in the "reply" field.
- If the user provides an image, comment on it as part of your reply.

User message: """${input.prompt}"""
${input.imageDataUri ? `Attached image data is available.` : ''}
`;

    const responseText = await generateText(systemPrompt);

    try {
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) {
            // Fallback if the model doesn't return JSON
            return { reply: responseText };
        }
        const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);
        return ClarityChatOutputSchema.parse(parsed);
    } catch (error) {
        console.error("Failed to parse AI response as JSON:", error);
        // If parsing fails, return the raw text as a reply.
        return { reply: responseText };
    }
}
