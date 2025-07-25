'use server';
/**
 * @fileOverview A creative brainstorming AI agent (direct Gemini version).
 */

import { z } from 'zod';
import { generateText } from '@/ai/gemini';

const FacilitateCreativeBrainstormingInputSchema = z.object({
  topic: z.string().describe('The topic for the brainstorming session.'),
  problemStatement: z.string().describe('A clear and concise problem statement for which solutions are needed.'),
  desiredOutcome: z.string().describe('A description of the desired outcome of the brainstorming session.'),
  knownConstraints: z.string().optional().describe('Any known constraints that should be considered during brainstorming.'),
});
export type FacilitateCreativeBrainstormingInput = z.infer<typeof FacilitateCreativeBrainstormingInputSchema>;

const FacilitateCreativeBrainstormingOutputSchema = z.object({
  brainstormingSession: z.string().describe('A detailed summary of the brainstorming session.'),
  potentialSolutions: z.array(z.string()).describe('A list of potential solutions generated during the session.'),
  keyInsights: z.array(z.string()).describe('A list of key insights discovered during the brainstorming session.'),
  nextSteps: z.string().optional().describe('Suggested next steps to implement the solutions.'),
});
export type FacilitateCreativeBrainstormingOutput = z.infer<typeof FacilitateCreativeBrainstormingOutputSchema>;

export async function facilitateCreativeBrainstorming(
  input: FacilitateCreativeBrainstormingInput
): Promise<FacilitateCreativeBrainstormingOutput> {
  const prompt = `
You are a creative brainstorming facilitator. Your goal is to help the user generate innovative ideas to solve a problem.

Please use coaching frameworks to guide the brainstorming session.

The brainstorming session should cover the following:
- Topic: ${input.topic}
- Problem Statement: ${input.problemStatement}
- Desired Outcome: ${input.desiredOutcome}
${input.knownConstraints ? `- Known Constraints: ${input.knownConstraints}` : ''}

Based on the above, respond ONLY with this JSON (no extra text):

{
  "brainstormingSession": "...",
  "potentialSolutions": ["..."],
  "keyInsights": ["..."],
  "nextSteps": "..."
}
  `.trim();

  const response = await generateText(prompt);

  try {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    const jsonString = response.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);

    return FacilitateCreativeBrainstormingOutputSchema.parse(data);
  } catch (error) {
    throw new Error('Failed to parse Gemini response as JSON: ' + (error as any)?.toString());
  }
}
