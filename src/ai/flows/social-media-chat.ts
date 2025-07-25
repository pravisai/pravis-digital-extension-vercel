'use server';

/**
 * @fileOverview This file defines a Genkit flow for a social media assistant.
 * - socialMediaChat - A function that provides social media advice.
 * - SocialMediaChatInput - The input type for the socialMediaChat function.
 * - SocialMediaChatOutput - The return type for the socialMediaChat function.
 */

import '@/ai/genkit'; // Only for config side effect!
import { defineFlow, definePrompt, z } from '@genkit-ai/core';



const SocialMediaChatInputSchema = z.object({
  platform: z.string().describe('The social media platform for the post (e.g., Twitter, LinkedIn).'),
  instructions: z.string().describe("The user's request for social media help."),
  imageDataUri: z.string().optional().describe("An optional image for the post, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type SocialMediaChatInput = z.infer<typeof SocialMediaChatInputSchema>;

const SocialMediaChatOutputSchema = z.object({
  post: z.string().describe("The AI's generated social media post."),
});
export type SocialMediaChatOutput = z.infer<typeof SocialMediaChatOutputSchema>;

// Main callable function
export async function socialMediaChat(input: SocialMediaChatInput): Promise<SocialMediaChatOutput> {
  return await socialMediaChatFlow(input);
}

const prompt = definePrompt({
  name: 'socialMediaChatPrompt',
  input: { schema: SocialMediaChatInputSchema },
  output: { schema: SocialMediaChatOutputSchema },
  prompt: `You are an expert Social Media Strategist. Your goal is to help the user with their social media presence.
  
Generate a post for the specified social media platform based on the user's instructions.

Be creative, helpful, and align your suggestions with modern social media best practices for the target platform.

{{#if imageDataUri}}
The user has provided an image. Your post should be relevant to this image.
Image: {{media url=imageDataUri}}
{{/if}}

Platform: {{{platform}}}
User's Instructions: {{{instructions}}}

Your generated post:`,
});

export const socialMediaChatFlow = defineFlow(
  {
    name: 'socialMediaChatFlow',
    inputSchema: SocialMediaChatInputSchema,
    outputSchema: SocialMediaChatOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The model did not return a valid post.');
    }
    return output;
  }
);
