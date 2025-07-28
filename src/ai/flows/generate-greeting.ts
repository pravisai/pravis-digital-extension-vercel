'use server';
/**
 * @fileOverview This file generates a personalized greeting message for the user.
 * - generateGreeting - A function that crafts a welcome message including a summary of today's events.
 * - GenerateGreetingInput - The input type for the function.
 * - GenerateGreetingOutput - The return type for the function.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';

const EventSchema = z.object({
    summary: z.string().describe("The title of the calendar event."),
    start: z.string().describe("The start time of the event (e.g., '10:00 AM')."),
});

const GenerateGreetingInputSchema = z.object({
  userName: z.string().describe("The user's first name."),
  events: z.array(EventSchema).describe("A list of today's upcoming calendar events or tasks."),
});
export type GenerateGreetingInput = z.infer<typeof GenerateGreetingInputSchema>;

const GenerateGreetingOutputSchema = z.object({
  greeting: z.string().describe("The personalized greeting message."),
});
export type GenerateGreetingOutput = z.infer<typeof GenerateGreetingOutputSchema>;

const greetingPrompt = ai.definePrompt({
    name: 'generateGreetingPrompt',
    input: { schema: GenerateGreetingInputSchema },
    output: { schema: GenerateGreetingOutputSchema },
    prompt: `
You are Pravis, a personal AI assistant. Your tone is professional, respectful, and helpful.

Generate a brief, welcoming greeting for the user, {{userName}}.

If the user has upcoming events today, summarize them concisely. Refer to the schedule as "My Flow".

After the summary, ask if there are any changes or additions to their flow.

If there are no events, simply provide a warm welcome and ask how you can assist them today.

Keep the entire message to a maximum of 3-4 sentences.

---
User Name: {{userName}}
Today's Events:
{{#if events}}
  {{#each events}}
  - {{this.summary}} at {{this.start}}
  {{/each}}
{{else}}
  No events scheduled.
{{/if}}
---
`,
});

const generateGreetingFlow = ai.defineFlow(
  {
    name: 'generateGreetingFlow',
    inputSchema: GenerateGreetingInputSchema,
    outputSchema: GenerateGreetingOutputSchema,
  },
  async (input) => {
    const { output } = await greetingPrompt(input);
    return output!;
  }
);

export async function generateGreeting(
  input: GenerateGreetingInput
): Promise<GenerateGreetingOutput> {
    return generateGreetingFlow(input);
}
