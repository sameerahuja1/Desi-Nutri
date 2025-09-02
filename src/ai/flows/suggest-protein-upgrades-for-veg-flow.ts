'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest vegetarian protein upgrades for a meal, using local Indian ingredients.
 *
 * - suggestProteinUpgradesForVeg - A function that suggests vegetarian protein upgrades for a meal.
 * - SuggestProteinUpgradesForVegInput - The input type for the suggestProteinUpgradesForVeg function.
 * - SuggestProteinUpgradesForVegOutput - The return type for the suggestProteinUpgradesForVeg function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProteinUpgradesForVegInputSchema = z.object({
  mealDescription: z
    .string()
    .describe('A description of the meal for which to suggest protein upgrades.'),
  currentProteinGrams: z
    .number()
    .describe('The current amount of protein in the meal (in grams).'),
});
export type SuggestProteinUpgradesForVegInput = z.infer<typeof SuggestProteinUpgradesForVegInputSchema>;

const SuggestProteinUpgradesForVegOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions for vegetarian protein upgrades using local Indian ingredients.'),
});
export type SuggestProteinUpgradesForVegOutput = z.infer<typeof SuggestProteinUpgradesForVegOutputSchema>;

export async function suggestProteinUpgradesForVeg(
  input: SuggestProteinUpgradesForVegInput
): Promise<SuggestProteinUpgradesForVegOutput> {
  return suggestProteinUpgradesForVegFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProteinUpgradesForVegPrompt',
  input: {schema: SuggestProteinUpgradesForVegInputSchema},
  output: {schema: SuggestProteinUpgradesForVegOutputSchema},
  prompt: `You are a nutritionist specializing in Indian vegetarian cuisine. A user has described their meal as "{{mealDescription}}" which contains {{currentProteinGrams}} grams of protein. Suggest some simple and actionable ways to increase the protein content of their meal using ONLY VEGETARIAN local Indian ingredients. Only suggest ingredients that can realistically be added to the meal as described. Return suggestions as a numbered list.

Example Output:
1. Add 100g of paneer to increase protein by 20g.
2. Sprinkle 2 tablespoons of roasted chana dal to add 7g of protein.
3. Mix in a cup of boiled chickpeas for an extra 15g of protein.
`,
});

const suggestProteinUpgradesForVegFlow = ai.defineFlow(
  {
    name: 'suggestProteinUpgradesForVegFlow',
    inputSchema: SuggestProteinUpgradesForVegInputSchema,
    outputSchema: SuggestProteinUpgradesForVegOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
