'use server';
/**
 * @fileOverview A Cooking Coach AI agent that provides protein-boosting tips during meal preparation.
 *
 * - cookingCoach - Provides protein-boosting tips for a given meal description.
 * - CookingCoachInput - The input type for the cookingCoach function.
 * - CookingCoachOutput - The return type for the cookingCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CookingCoachInputSchema = z.object({
  mealDescription: z
    .string()
    .describe('A description of the meal the user is preparing.'),
  dietaryPreference: z.enum(['veg', 'eggetarian', 'non-veg']).describe('The user\'s dietary preference.')
});
export type CookingCoachInput = z.infer<typeof CookingCoachInputSchema>;

const CookingCoachOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of actionable, step-by-step tips to increase the protein content of the meal.'),
});
export type CookingCoachOutput = z.infer<typeof CookingCoachOutputSchema>;

export async function cookingCoach(
  input: CookingCoachInput
): Promise<CookingCoachOutput> {
  return cookingCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cookingCoachPrompt',
  input: {schema: CookingCoachInputSchema},
  output: {schema: CookingCoachOutputSchema},
  prompt: `You are a "Cooking Coach" for DesiNutri, specializing in Indian cuisine. A user is currently preparing a meal and needs your help to make it more protein-rich.

User's Meal: "{{mealDescription}}"
Dietary Preference: "{{dietaryPreference}}"

Provide a short, friendly introduction and then give 3-5 simple, actionable, and step-by-step tips they can apply *right now* as they are cooking. The tips should be tailored to their dietary preference and use common, local Indian ingredients.

Focus on what they can add or change during the cooking process. For example, if they are making "dal tadka", suggest adding paneer cubes or a handful of roasted chana.

Example Output:
{
  "tips": [
    "Great choice! While your dal is simmering, you can toss in 100g of crumbled paneer. It will absorb the flavors beautifully and add a great protein punch.",
    "Consider adding a handful of moong dal sprouts along with your other vegetables. They cook quickly and will increase the fiber and protein.",
    "For the tadka, instead of just spices, add a tablespoon of chopped peanuts or cashews. This will add a nice crunch and healthy fats along with protein."
  ]
}
`,
});

const cookingCoachFlow = ai.defineFlow(
  {
    name: 'cookingCoachFlow',
    inputSchema: CookingCoachInputSchema,
    outputSchema: CookingCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
