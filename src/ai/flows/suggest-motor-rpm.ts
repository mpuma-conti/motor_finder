'use server';

/**
 * @fileOverview A flow to suggest motor RPM based on the equipment application.
 *
 * - suggestMotorRpm - A function that handles the RPM suggestion.
 * - SuggestMotorRpmInput - The input type for the suggestMotorRpm function.
 * - SuggestMotorRpmOutput - The return type for the suggestMotorRpm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMotorRpmInputSchema = z.object({
  equipment: z.string().describe('The description of the equipment or application where the motor is used.'),
});
export type SuggestMotorRpmInput = z.infer<typeof SuggestMotorRpmInputSchema>;

const SuggestMotorRpmOutputSchema = z.object({
  suggestion: z.string().describe('AI-generated suggestion for motor RPM (1700 or 3600).'),
});
export type SuggestMotorRpmOutput = z.infer<typeof SuggestMotorRpmOutputSchema>;

export async function suggestMotorRpm(input: SuggestMotorRpmInput): Promise<SuggestMotorRpmOutput> {
  return suggestMotorRpmFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMotorRpmPrompt',
  input: {schema: SuggestMotorRpmInputSchema},
  output: {schema: SuggestMotorRpmOutputSchema},
  prompt: `You are an expert maintenance engineer. Based on the equipment description, suggest whether a 1700 RPM or 3600 RPM motor is more appropriate. 
  - For applications requiring high torque and low speed like conveyors, mixers, or pumps for viscous fluids, suggest 1700 RPM.
  - For applications requiring high speed like fans, centrifugal pumps, or compressors, suggest 3600 RPM.
  Provide a brief explanation for your choice.

Equipment: {{{equipment}}}

Suggestion:`, 
});

const suggestMotorRpmFlow = ai.defineFlow(
  {
    name: 'suggestMotorRpmFlow',
    inputSchema: SuggestMotorRpmInputSchema,
    outputSchema: SuggestMotorRpmOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
