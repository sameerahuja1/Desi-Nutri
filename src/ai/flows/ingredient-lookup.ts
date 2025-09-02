'use server';
/**
 * @fileOverview A flow to look up nutritional information for a single ingredient.
 *
 * - ingredientLookup - Looks up nutritional info for a given ingredient.
 * - IngredientLookupInput - The input type for the ingredientLookup function.
 * - IngredientLookupOutput - The return type for the ingredientLookup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IngredientLookupInputSchema = z.object({
  ingredientName: z.string().describe('The name of the ingredient to look up.'),
});
export type IngredientLookupInput = z.infer<typeof IngredientLookupInputSchema>;

const IngredientLookupOutputSchema = z.object({
  servingSize: z.string().describe('The standard serving size for the nutrition facts (e.g., "100g").'),
  macros: z.object({
    protein: z.number().describe('Protein content in grams.'),
    carbs: z.number().describe('Carbohydrates content in grams.'),
    fat: z.number().describe('Fat content in grams.'),
    calories: z.number().describe('Total calories.'),
  }),
  notes: z.string().optional().describe('Any additional notes or interesting facts about the ingredient.'),
});
export type IngredientLookupOutput = z.infer<typeof IngredientLookupOutputSchema>;

export async function ingredientLookup(
  input: IngredientLookupInput
): Promise<IngredientLookupOutput> {
  return ingredientLookupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ingredientLookupPrompt',
  input: {schema: IngredientLookupInputSchema},
  output: {schema: IngredientLookupOutputSchema},
  prompt: `You are an expert nutritionist. A user wants to know the nutritional information for a specific ingredient.

Ingredient: "{{ingredientName}}"

Provide the nutritional breakdown (protein, carbs, fat, calories) for a standard 100g serving of this ingredient. Also include a brief, interesting note about the ingredient if applicable.

Example for "Paneer":
{
  "servingSize": "100g",
  "macros": {
    "protein": 20,
    "carbs": 4,
    "fat": 22,
    "calories": 294
  },
  "notes": "Paneer is a fresh, non-aging cheese common in Indian cuisine. It's a great source of protein for vegetarians."
}
`,
});

const ingredientLookupFlow = ai.defineFlow(
  {
    name: 'ingredientLookupFlow',
    inputSchema: IngredientLookupInputSchema,
    outputSchema: IngredientLookupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
