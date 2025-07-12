
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
  platform: z.string().describe('The social media platform for the post (e.g., Twitter, LinkedIn).'),
  instructions: z.string().describe('The user\'s request for social media help.'),
});
export type SocialMediaChatInput = z.infer<typeof SocialMediaChatInputSchema>;

const SocialMediaChatOutputSchema = z.object({
  post: z.string().describe('The AI\'s generated social media post.'),
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
  
  Generate a post for the specified social media platform based on the user's instructions.
  
  Be creative, helpful, and align your suggestions with modern social media best practices for the target platform.

  Platform: {{{platform}}}
  User's Instructions: {{{instructions}}}

  Your generated post:`,
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
