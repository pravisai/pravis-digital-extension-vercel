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

  let responseText = '';
  try {
    responseText = await generateText(systemInstruction);
    console.log("Raw LLM response:", responseText);

    // Find the JSON in the model's response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      // If no JSON object is found, reply with all text
      return { reply: responseText.trim() };
    }
    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);

    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("JSON parse error in clarityChat:", parseErr, "jsonString:", jsonString, "FullResponse:", responseText);
      return {
        reply: "Sorry, I couldn't understand the AI's response. Please try rephrasing your message.",
      };
    }

    // Validate result via schema
    try {
      return ClarityChatOutputSchema.parse(parsed);
    } catch(schemaErr) {
      console.error("Schema validation error in clarityChat:", schemaErr, "Parsed:", parsed, "FullResponse:", responseText);
      return {
        reply: "Sorry, I couldn't interpret the result. Please try rephrasing.",
      };
    }
  } catch (error) {
    console.error("Failed to process clarity chat:", error, responseText);
    return {
      reply: "I'm sorry, something went wrong while processing your request. Please try again or check your network/API key.",
    };
  }
}
