
'use server';
/**
 * @fileOverview A text analysis AI agent using OpenRouter.
 * - analyzeText - A function that analyzes text.
 * - AnalyzeTextInput - The input type for the analyzeText function.
 * - AnalyzeTextOutput - The return type for the analyzeText function.
 */

import { z } from 'zod';
import { generateText } from '@/ai/openrouter';

const AnalyzeTextInputSchema = z.object({
  text: z.string().describe('The text to analyze.'),
});
export type AnalyzeTextInput = z.infer<typeof AnalyzeTextInputSchema>;

const AnalyzeTextOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the text provided.'),
});
export type AnalyzeTextOutput = z.infer<typeof AnalyzeTextOutputSchema>;

export async function analyzeText(input: AnalyzeTextInput): Promise<AnalyzeTextOutput> {
  const prompt = `You are a helpful assistant that analyzes text. Provide a concise analysis of the following text.

Text: ${input.text}

Respond with only the analysis, no extra conversational text.`;

  const analysis = await generateText(prompt);
  return { analysis };
}
