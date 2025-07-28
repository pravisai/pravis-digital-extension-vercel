'use server';

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
  // -- Strongest possible system prompt to enforce JSON response --
  const systemInstruction = `
You are Pravis, a personal AI assistant. Be compassionate, empathetic, and always guide the user with kindness.

- For email requests, reply ONLY as: {"toolRequest": {"action": "navigateToEmailCompose", ...params}}
- For calendar requests, reply ONLY as: {"toolRequest": {"action": "navigateToCalendar", ...params}}
- For other requests, reply ONLY as: {"reply": "your message"}
- If an image is provided, comment on it within your reply.

IMPORTANT: Your entire response MUST be a single, valid JSON object matching this shape and NOTHING else (no greetings, no explanation, no extra text). 

${JSON.stringify(ClarityChatOutputSchema.shape)}

For example: {"reply": "Hello! How can I help you today?"}
`;

  let responseText = '';
  try {
    responseText = await generateText(systemInstruction);
    console.log("Raw LLM response:", responseText);

    // Extract the first {...} JSON block (robust to minor LLM drift)
    const match = responseText.match(/{[\s\S]*}/m);
    if (!match) {
      console.error("No JSON object found in response.", responseText);
      return { reply: responseText.trim() };
    }
    const jsonString = match[0];

    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("JSON parse error in clarityChat:", parseErr, "jsonString:", jsonString, "FullResponse:", responseText);
      return {
        reply: "Sorry, I couldn't understand Pravis's response. Please try rephrasing your message.",
      };
    }

    try {
      return ClarityChatOutputSchema.parse(parsed);
    } catch(schemaErr) {
      console.error("Schema validation error in clarityChat:", schemaErr, "Parsed:", parsed, "FullResponse:", responseText);
      // Graceful fallback: return reply if present
      if (parsed && typeof parsed.reply === "string") return { reply: parsed.reply };
      return {
        reply: "Sorry, I couldn't interpret the result. Please try rephrasing.",
      };
    }
  } catch (error) {
    console.error("Top-level clarityChat error:", error, "Raw LLM response:", responseText);
    return {
      reply: "I'm sorry, something went wrong while processing your request. Please try again or check your network/API key.",
    };
  }
}
