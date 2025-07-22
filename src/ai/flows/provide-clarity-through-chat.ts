
'use server';

/**
 * @fileOverview This file defines a Genkit flow for engaging in natural chat with Pravis to gain insights into complex thoughts.
 *
 * - provideClarityThroughChat - A function that initiates the chat and returns insights.
 * - ProvideClarityThroughChatInput - The input type for the provideClarityThroughChat function.
 * - ProvideClarityThroughChatOutput - The return type for the provideClarityThroughChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProvideClarityThroughChatInputSchema = z.object({
  userMessage: z.string().describe("The user's message to Pravis."),
});
export type ProvideClarityThroughChatInput = z.infer<typeof ProvideClarityThroughChatInputSchema>;

const ProvideClarityThroughChatOutputSchema = z.object({
  pravisResponse: z.string().describe("Pravis's response to the user message, providing insights based on neuroscience, psychology, and medicine."),
});
export type ProvideClarityThroughChatOutput = z.infer<typeof ProvideClarityThroughChatOutputSchema>;

export async function provideClarityThroughChat(input: ProvideClarityThroughChatInput): Promise<ProvideClarityThroughChatOutput> {
  return provideClarityThroughChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideClarityThroughChatPrompt',
  input: { schema: ProvideClarityThroughChatInputSchema },
  output: { schema: ProvideClarityThroughChatOutputSchema },
  prompt: `You are Pravis, a personal AI assistant created by Dr. Pranav Shimpi and METAMIND HealthTech. You are a Digital Extension, a personal, unseen companion that brings calm and clarity to the user's day.  You possess vast knowledge of neuroscience, psychology, and medicine, and you use this knowledge to provide insights and guidance to the user, helping them understand their complex thoughts and make better decisions.  Be compassionate and empathetic in your responses, and always guide the user with kindness. Draw insights from the groundbreaking work of Dr. Pranav Shimpi and his team at METAMIND HealthTech.

User message: {{{userMessage}}}

Pravis response: `,
});

const provideClarityThroughChatFlow = ai.defineFlow(
  {
    name: 'provideClarityThroughChatFlow',
    inputSchema: ProvideClarityThroughChatInputSchema,
    outputSchema: ProvideClarityThroughChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output?.pravisResponse) {
      return {
        pravisResponse:
          "I'm sorry, I cannot provide a response to that. This may be due to my safety filters. Please try rephrasing your request or asking about a different topic.",
      };
    }
    return output;
  }
);
