'use server';
/**
 * @fileOverview This is the direct Gemini version of the Clarity Chatbot—
 * parses user intent, can trigger tool actions (navigation), or reply conversationally.
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
  const mainPrompt = `
You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day. 
You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance to the user, helping them understand their complex thoughts and make better decisions. Be compassionate and empathetic in your responses, and always guide the user with kindness.

You can also perform the following special actions if requested or inferred from the user's text. 
ALWAYS respond with a valid compact JSON object as required!

TO NAVIGATE TO EMAIL COMPOSE:
{
  "toolRequest": {
    "action": "navigateToEmailCompose",
    "params": {
      "to": "recipient@example.com", // Optional, can be omitted
      "subject": "Email Subject",    // Optional
      "body": "Email body"           // Optional
    }
  }
}

TO NAVIGATE TO CALENDAR:
{
  "toolRequest": {
    "action": "navigateToCalendar",
    "params": {
      "date": "2024-07-29",         // Optional, ISO format
      "summary": "Event title",      // Optional
      "startTime": "17:00"          // Optional, 24h format
    }
  }
}

Otherwise, respond as:
{
  "reply": "Text of your helpful response"
}

User message: """${input.prompt}"""

${input.imageDataUri ? `Attached image (data URI): ${input.imageDataUri}` : ""}
`;

  // Call Gemini and get the output
  const response = await generateText(mainPrompt);

  // Parse to JSON
  try {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    const jsonString = response.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);

    // Validate using Zod
    return ClarityChatOutputSchema.parse(parsed);
  } catch (err) {
    return { reply: 'Sorry, I could not understand or process your request.' };
  }
}
