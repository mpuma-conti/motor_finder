'use server';

/**
 * @fileOverview A flow to suggest alternative motors based on performance metrics and compatibility.
 *
 * - suggestAlternativeMotors - A function that handles the suggestion of alternative motors.
 * - SuggestAlternativeMotorsInput - The input type for the suggestAlternativeMotors function.
 * - SuggestAlternativeMotorsOutput - The return type for the suggestAlternativeMotors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeMotorsInputSchema = z.object({
  motorCode: z.string().describe('The motor code of the malfunctioning motor.'),
  powerHp: z.number().optional().describe('The power in horsepower of the motor.'),
  rpm: z.number().optional().describe('The RPM of the motor.'),
  flange: z.string().optional().describe('The flange type of the motor.'),
  performanceMetrics: z.string().describe('Performance metrics of the current motor.'),
});
export type SuggestAlternativeMotorsInput = z.infer<typeof SuggestAlternativeMotorsInputSchema>;

const SuggestAlternativeMotorsOutputSchema = z.object({
  suggestions: z.string().describe('AI-generated suggestions for alternative motors.'),
});
export type SuggestAlternativeMotorsOutput = z.infer<typeof SuggestAlternativeMotorsOutputSchema>;

export async function suggestAlternativeMotors(input: SuggestAlternativeMotorsInput): Promise<SuggestAlternativeMotorsOutput> {
  return suggestAlternativeMotorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeMotorsPrompt',
  input: {schema: SuggestAlternativeMotorsInputSchema},
  output: {schema: SuggestAlternativeMotorsOutputSchema},
  prompt: `You are an expert maintenance engineer. Based on the following information about a malfunctioning motor, suggest suitable alternative motors. Take into consideration performance metrics and compatibility.

Motor Code: {{{motorCode}}}
Power (HP): {{{powerHp}}}
RPM: {{{rpm}}}
Flange Type: {{{flange}}}
Performance Metrics: {{{performanceMetrics}}}

Suggestions:`, 
});

const suggestAlternativeMotorsFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeMotorsFlow',
    inputSchema: SuggestAlternativeMotorsInputSchema,
    outputSchema: SuggestAlternativeMotorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
