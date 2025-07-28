'use server';

/**
 * @fileOverview This file defines a Gemini-powered social media assistant.
 * - socialMediaChat - A function that provides social media advice.
 * - SocialMediaChatInput - The input type for the socialMediaChat function.
 * - SocialMediaChatOutput - The return type for the socialMediaChat function.
 */

import { z } from 'zod';
import { generateText } from '@/ai/openrouter';

const SocialMediaChatInputSchema = z.object({
  platform: z.string().describe('The social media platform for the post (e.g., Twitter, LinkedIn).'),
  instructions: z.string().describe("The user's request for social media help."),
  imageDataUri: z.string().optional().describe("An optional image for the post, as a data URI (with MIME type, base64)."),
});
export type SocialMediaChatInput = z.infer<typeof SocialMediaChatInputSchema>;

const SocialMediaChatOutputSchema = z.object({
  post: z.string().describe("The AI's generated social media post."),
});
export type SocialMediaChatOutput = z.infer<typeof SocialMediaChatOutputSchema>;

export async function socialMediaChat(input: SocialMediaChatInput): Promise<SocialMediaChatOutput> {
  const prompt = `
You are an expert Social Media Strategist. Your goal is to help the user with their social media presence.

Generate a post for the specified social media platform based on the user's instructions.

Be creative, helpful, and align your suggestions with modern social media best practices for the target platform.

${input.imageDataUri ? `
The user has provided an image. Your post should be relevant to this image.
` : ''}

Platform: ${input.platform}
User's Instructions: ${input.instructions}

Respond ONLY with a valid JSON object in this format. Do not add any extra text or explanation.
{
  "post": "Your generated post here"
}
  `.trim();

  const response = await generateText(prompt);

  try {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON object found in the AI response.");
    }
    const jsonString = response.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);

    return SocialMediaChatOutputSchema.parse(data);
  } catch (error) {
    console.error("Failed to parse social media chat response from AI:", error, "Raw response:", response);
    throw new Error('Failed to parse AI response as JSON. The format was invalid.');
  }
}
