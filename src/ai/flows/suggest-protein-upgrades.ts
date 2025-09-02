'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest protein upgrades for a meal, using local Indian ingredients.
 *
 * - suggestProteinUpgrades - A function that suggests protein upgrades for a meal.
 * - SuggestProteinUpgradesInput - The input type for the suggestProteinUpgrades function.
 * - SuggestProteinUpgradesOutput - The return type for the suggestProteinUpgrades function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProteinUpgradesInputSchema = z.object({
  mealDescription: z
    .string()
    .describe('A description of the meal for which to suggest protein upgrades.'),
  currentProteinGrams: z
    .number()
    .describe('The current amount of protein in the meal (in grams).'),
});
export type SuggestProteinUpgradesInput = z.infer<typeof SuggestProteinUpgradesInputSchema>;

const SuggestProteinUpgradesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions for protein upgrades using local Indian ingredients.'),
});
export type SuggestProteinUpgradesOutput = z.infer<typeof SuggestProteinUpgradesOutputSchema>;

export async function suggestProteinUpgrades(
  input: SuggestProteinUpgradesInput
): Promise<SuggestProteinUpgradesOutput> {
  return suggestProteinUpgradesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProteinUpgradesPrompt',
  input: {schema: SuggestProteinUpgradesInputSchema},
  output: {schema: SuggestProteinUpgradesOutputSchema},
  prompt: `You are a nutritionist specializing in Indian cuisine. A user has described their meal as "{{mealDescription}}" which contains {{currentProteinGrams}} grams of protein. Suggest some simple and actionable ways to increase the protein content of their meal using local Indian ingredients. Only suggest ingredients that can realistically be added to the meal as described. Return suggestions as a numbered list.

Example Output:
1. Add 100g of paneer to increase protein by 20g.
2. Sprinkle 2 tablespoons of roasted chana dal to add 7g of protein.
3. Drink a glass of milk (240ml) to supplement with 8g of protein.
`,
});

const suggestProteinUpgradesFlow = ai.defineFlow(
  {
    name: 'suggestProteinUpgradesFlow',
    inputSchema: SuggestProteinUpgradesInputSchema,
    outputSchema: SuggestProteinUpgradesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
