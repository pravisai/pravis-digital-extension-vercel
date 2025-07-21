
'use server';
/**
 * @fileOverview A creative brainstorming AI agent.
 *
 * - facilitateCreativeBrainstorming - A function that handles the creative brainstorming process.
 * - FacilitateCreativeBrainstormingInput - The input type for the facilitateCreativeBrainstorming function.
 * - FacilitateCreativeBrainstormingOutput - The return type for the facilitateCreativeBrainstorming function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FacilitateCreativeBrainstormingInputSchema = z.object({
  topic: z.string().describe('The topic for the brainstorming session.'),
  problemStatement: z
    .string()
    .describe('A clear and concise problem statement for which solutions are needed.'),
  desiredOutcome: z
    .string()
    .describe('A description of the desired outcome of the brainstorming session.'),
  knownConstraints: z
    .string()
    .optional()
    .describe('Any known constraints that should be considered during brainstorming.'),
});
export type FacilitateCreativeBrainstormingInput = z.infer<
  typeof FacilitateCreativeBrainstormingInputSchema
>;

const FacilitateCreativeBrainstormingOutputSchema = z.object({
  brainstormingSession:
    z.string().describe('A detailed summary of the brainstorming session.'),
  potentialSolutions: z
    .array(z.string())
    .describe('A list of potential solutions generated during the session.'),
  keyInsights: z
    .array(z.string())
    .describe('A list of key insights discovered during the brainstorming session.'),
  nextSteps: z
    .string()
    .optional()
    .describe('Suggested next steps to implement the solutions.'),
});
export type FacilitateCreativeBrainstormingOutput = z.infer<
  typeof FacilitateCreativeBrainstormingOutputSchema
>;

export async function facilitateCreativeBrainstorming(
  input: FacilitateCreativeBrainstormingInput
): Promise<FacilitateCreativeBrainstormingOutput> {
  return facilitateCreativeBrainstormingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'facilitateCreativeBrainstormingPrompt',
  input: {schema: FacilitateCreativeBrainstormingInputSchema},
  output: {schema: FacilitateCreativeBrainstormingOutputSchema},
  prompt: `You are a creative brainstorming facilitator. Your goal is to help the user generate innovative ideas to solve a problem.

  Please use coaching frameworks to guide the brainstorming session.

  The brainstorming session should cover the following:
  - Topic: {{{topic}}}
  - Problem Statement: {{{problemStatement}}}
  - Desired Outcome: {{{desiredOutcome}}}
  {{#if knownConstraints}}
  - Known Constraints: {{{knownConstraints}}}
  {{/if}}

  Based on the information above, please provide a detailed summary of the brainstorming session, a list of potential solutions, a list of key insights, and suggested next steps to implement the solutions.
  `,
});

const facilitateCreativeBrainstormingFlow = ai.defineFlow(
  {
    name: 'facilitateCreativeBrainstormingFlow',
    inputSchema: FacilitateCreativeBrainstormingInputSchema,
    outputSchema: FacilitateCreativeBrainstormingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
