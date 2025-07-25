'use server';
/**
 * @fileOverview This file defines a Genkit flow for the main Pravis clarity chatbot.
 * - clarityChat - A function that provides a response from Pravis.
 * - ClarityChatInput - The input type for the clarityChat function.
 * - ClarityChatOutput - The return type for the clarityChat function.
 */
import { ai } from '@/ai/gemini';
import { z } from 'zod';

// Tool Schemas
const navigateToEmailComposeTool = ai.defineTool(
  {
    name: 'navigateToEmailCompose',
    description: 'Navigates the user to the email composition screen to start a new draft.',
    inputSchema: z.object({
      to: z.string().optional().describe('The recipient email address.'),
      subject: z.string().optional().describe('The subject line of the email.'),
      body: z.string().optional().describe('The body content of the email.'),
    }),
    outputSchema: z.string(),
  },
  async () => "Okay, I'll open the email composer for you."
);

const navigateToCalendarTool = ai.defineTool(
  {
    name: 'navigateToCalendar',
    description: 'Navigates the user to their calendar/tasks page to view events or create a new one.',
    inputSchema: z.object({
      date: z.string().optional().describe("The date to view in ISO format (e.g., '2024-07-29')."),
      summary: z.string().optional().describe('The summary or title of an event to create.'),
      startTime: z.string().optional().describe("The start time of an event to create in 'HH:mm' format."),
    }),
    outputSchema: z.string(),
  },
  async () => "Okay, I'll take you to your calendar."
);


const ClarityChatInputSchema = z.object({
  prompt: z.string().describe("The user's message to Pravis."),
  imageDataUri: z.string().optional().describe("An optional image for the message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ClarityChatInput = z.infer<typeof ClarityChatInputSchema>;

// The output can be a standard text reply or a tool request
const ClarityChatOutputSchema = z.object({
  reply: z.string().optional().describe('The conversational reply from Pravis.'),
  toolRequest: z.any().optional().describe('A request from the AI to use a tool.'),
});
export type ClarityChatOutput = z.infer<typeof ClarityChatOutputSchema>;

// Main callable function for code
export async function clarityChat(input: ClarityChatInput): Promise<ClarityChatOutput> {
  return await clarityChatFlow(input);
}

const prompt = `You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day. You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance to the user, helping them understand their complex thoughts and make better decisions. Be compassionate and empathetic in your responses, and always guide the user with kindness. Draw insights from the groundbreaking work of Dr. Pranav Shimpi and his team at METAMIND HealthTech.

Based on the user's prompt, you can use the available tools to help them navigate the app and perform actions.

{{#if imageDataUri}}
The user has provided an image. Your response should be relevant to this image.
Image: {{media url=imageDataUri}}
{{/if}}

User message: {{{prompt}}}`;


// Use defineFlow directly
export const clarityChatFlow = ai.defineFlow(
  {
    name: 'clarityChatFlow',
    inputSchema: ClarityChatInputSchema,
    outputSchema: ClarityChatOutputSchema,
  },
  async (input) => {
    const response = await ai.generate({
      model: 'googleai/gemini-pro',
      tools: [navigateToEmailComposeTool, navigateToCalendarTool],
      prompt: prompt,
      config: {
        // Add safety settings if needed
      },
      input,
    });
    
    const output = response.output;
    if (!output) {
      throw new Error("The AI model returned an empty or invalid response.");
    }
    
    if (output.content.some(part => part.toolRequest)) {
      // It's a tool request
      return { toolRequest: output.content.find(part => part.toolRequest)!.toolRequest };
    } else {
      // It's a text reply
      return { reply: response.text };
    }
  }
);
