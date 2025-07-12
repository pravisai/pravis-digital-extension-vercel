
'use server';

/**
 * @fileOverview This file defines a Genkit flow for a social media assistant.
 *
 * - socialMediaChat - A function that provides social media advice.
 * - SocialMediaChatInput - The input type for the socialMediaChat function.
 * - SocialMediaChatOutput - The return type for the socialMediaChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SocialMediaChatInputSchema = z.object({
  userMessage: z.string().describe('The user\'s request for social media help.'),
});
export type SocialMediaChatInput = z.infer<typeof SocialMediaChatInputSchema>;

const SocialMediaChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response with social media advice, post ideas, or other content.'),
});
export type SocialMediaChatOutput = z.infer<typeof SocialMediaChatOutputSchema>;

export async function socialMediaChat(input: SocialMediaChatInput): Promise<SocialMediaChatOutput> {
  return socialMediaChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialMediaChatPrompt',
  input: {schema: SocialMediaChatInputSchema},
  output: {schema: SocialMediaChatOutputSchema},
  prompt: `You are an expert Social Media Strategist. Your goal is to help the user with their social media presence.
  
  You can generate post ideas, write engaging captions, suggest relevant hashtags, and provide strategic advice for platforms like Instagram, Twitter, Facebook, and LinkedIn.
  
  Be creative, helpful, and align your suggestions with modern social media best practices.

  User's request: {{{userMessage}}}

  Your expert response:`,
});

const socialMediaChatFlow = ai.defineFlow(
  {
    name: 'socialMediaChatFlow',
    inputSchema: SocialMediaChatInputSchema,
    outputSchema: SocialMediaChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
