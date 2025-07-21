'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing the emotional content of a conversation and flagging it if it needs a more empathetic touch.
 *
 * - analyzeConversationEmotions - A function that analyzes the emotional content of a conversation.
 * - AnalyzeConversationEmotionsInput - The input type for the analyzeConversationEmotions function.
 * - AnalyzeConversationEmotionsOutput - The return type for the analyzeConversationEmotions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  return analyzeConversationEmotionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeConversationEmotionsPrompt',
  input: {schema: AnalyzeConversationEmotionsInputSchema},
  output: {schema: AnalyzeConversationEmotionsOutputSchema},
  prompt: `You are an AI assistant designed to analyze conversations and determine if they need a more empathetic touch.

  A conversation needs a more empathetic touch if it contains negative emotions, conflict, or misunderstanding.

  Analyze the following conversation:

  "{{{conversation}}}"

  Based on your analysis, determine if the conversation needs a more empathetic touch and provide a short summary of the emotional content of the conversation.`,
});

const analyzeConversationEmotionsFlow = ai.defineFlow(
  {
    name: 'analyzeConversationEmotionsFlow',
    inputSchema: AnalyzeConversationEmotionsInputSchema,
    outputSchema: AnalyzeConversationEmotionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
