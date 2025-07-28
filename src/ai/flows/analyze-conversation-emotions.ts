'use server';
/**
 * @fileOverview This file analyzes the emotional content of a conversation and flags it if it needs a more empathetic touch.
 * - analyzeConversationEmotions - A function that analyzes the emotional content of a conversation.
 * - AnalyzeConversationEmotionsInput - The input type for the function.
 * - AnalyzeConversationEmotionsOutput - The return type for the function.
 */

import { z } from 'zod';
import { generateText } from '@/ai/openrouter';

const AnalyzeConversationEmotionsInputSchema = z.object({
  conversation: z
    .string()
    .describe('The conversation to analyze. Should include multiple turns.'),
});
export type AnalyzeConversationEmotionsInput = z.infer<typeof AnalyzeConversationEmotionsInputSchema>;

const AnalyzeConversationEmotionsOutputSchema = z.object({
  needsEmpatheticTouch: z
    .boolean()
    .describe(
      'Whether the conversation needs a more empathetic touch. True if the conversation contains negative emotions, conflict, or misunderstanding. False otherwise.'
    ),
  summary: z
    .string()
    .describe('A short summary of the emotional content of the conversation.'),
});
export type AnalyzeConversationEmotionsOutput = z.infer<typeof AnalyzeConversationEmotionsOutputSchema>;

export async function analyzeConversationEmotions(
  input: AnalyzeConversationEmotionsInput
): Promise<AnalyzeConversationEmotionsOutput> {
  const prompt = `You are an AI assistant designed to analyze conversations and determine if they need a more empathetic touch.

A conversation needs a more empathetic touch if it contains negative emotions, conflict, or misunderstanding.

Analyze the following conversation:

"${input.conversation}"

Based on your analysis, respond ONLY with a valid JSON object in the format:
{
  "needsEmpatheticTouch": true|false,
  "summary": "Short summary of the emotional content"
}
`;

  const responseText = await generateText(prompt);

  try {
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON object found in the AI response.");
    }
    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);
    return AnalyzeConversationEmotionsOutputSchema.parse(parsed);
  } catch (err) {
    console.error("Failed to parse conversation analysis from AI:", err, "Raw response:", responseText);
    throw new Error('Failed to parse AI response as JSON. The format was invalid.');
  }
}
