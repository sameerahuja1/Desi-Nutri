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

export type Suggestion = {
    suggestion: string;
    proteinGrams: number;
    carbGrams: number;
    fatGrams: number;
};

const SuggestProteinUpgradesOutputSchema = z.object({
  suggestions: z.array(z.object({
      suggestion: z.string().describe("The suggestion for a protein upgrade."),
      proteinGrams: z.number().describe("The amount of protein added in grams."),
      carbGrams: z.number().describe("The amount of carbs added in grams."),
      fatGrams: z.number().describe("The amount of fat added in grams."),
  })).describe('A list of suggestions for protein upgrades using local Indian ingredients.'),
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
  prompt: `You are a nutritionist specializing in Indian cuisine. A user has described their meal as "{{mealDescription}}" which contains {{currentProteinGrams}} grams of protein. Suggest some simple and actionable ways to increase the protein content of their meal using local Indian ingredients. Only suggest ingredients that can realistically be added to the meal as described. For each suggestion, provide the added protein, carbs, and fat in grams.

Example Output:
{
  "suggestions": [
    {
      "suggestion": "Add 100g of paneer",
      "proteinGrams": 20,
      "carbGrams": 4,
      "fatGrams": 22
    },
    {
      "suggestion": "Add 2 boiled eggs",
      "proteinGrams": 12,
      "carbGrams": 1,
      "fatGrams": 10
    },
    {
      "suggestion": "Drink a glass of milk (240ml)",
      "proteinGrams": 8,
      "carbGrams": 12,
      "fatGrams": 8
    }
  ]
}
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
