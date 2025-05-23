'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating motivational messages based on user goals and progress.
 *
 * - generateMotivationalMessage - A function that generates a motivational message.
 * - MotivationalMessageInput - The input type for the generateMotivationalMessage function.
 * - MotivationalMessageOutput - The return type for the generateMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalMessageInputSchema = z.object({
  goals: z
    .array(z.string())
    .describe('A list of the user goals for the day, e.g., [\"Do exercise\", \"Drink 10 glasses of water\", \"Eat healthy\"]'),
  progress: z
    .number()
    .min(0)
    .max(100)
    .describe('The percentage of goals completed, ranging from 0 to 100.'),
});
export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('A motivational message based on the user goals and progress.'),
});
export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;

export async function generateMotivationalMessage(
  input: MotivationalMessageInput
): Promise<MotivationalMessageOutput> {
  return motivationalMessageFlow(input);
}

const motivationalMessagePrompt = ai.definePrompt({
  name: 'motivationalMessagePrompt',
  input: {schema: MotivationalMessageInputSchema},
  output: {schema: MotivationalMessageOutputSchema},
  prompt: `You are a motivational coach. Generate a motivational message for the user based on their goals and progress.

Here are the user's goals for the day:
{{#each goals}}
- {{this}}
{{/each}}

Progress: {{progress}}%

Message:`,
});

const motivationalMessageFlow = ai.defineFlow(
  {
    name: 'motivationalMessageFlow',
    inputSchema: MotivationalMessageInputSchema,
    outputSchema: MotivationalMessageOutputSchema,
  },
  async input => {
    const {output} = await motivationalMessagePrompt(input);
    return output!;
  }
);
