'use server';
/**
 * @fileOverview Analyzes a meal photo, provides a nutritional breakdown,
 * and suggests protein upgrades.
 *
 * - analyzeMealPhotoAndSuggestProtein - Analyzes the meal photo and suggests protein upgrades.
 * - AnalyzeMealPhotoAndSuggestProteinInput - The input type for the analyzeMealPhotoAndSuggestProtein function.
 * - AnalyzeMealPhotoAndSuggestProteinOutput - The return type for the analyzeMealPhotoAndSuggestProtein function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Suggestion } from './suggest-protein-upgrades';

const AnalyzeMealPhotoAndSuggestProteinInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeMealPhotoAndSuggestProteinInput = z.infer<typeof AnalyzeMealPhotoAndSuggestProteinInputSchema>;

const AnalyzeMealPhotoAndSuggestProteinOutputSchema = z.object({
  mealName: z.string().describe('The name of the meal identified from the photo.'),
  macros: z.object({
    protein: z.number().describe('Protein content in grams.'),
    carbs: z.number().describe('Carbohydrates content in grams.'),
    fat: z.number().describe('Fat content in grams.'),
    calories: z.number().describe('Total calories.'),
  }),
  proteinUpgradeSuggestions: z.array(z.object({
    suggestion: z.string(),
    proteinGrams: z.number(),
    carbGrams: z.number(),
    fatGrams: z.number(),
  })).describe('Suggestions for protein upgrades with local Indian ingredients.'),
});
export type AnalyzeMealPhotoAndSuggestProteinOutput = {
    mealName: string;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
        calories: number;
    };
    proteinUpgradeSuggestions: Suggestion[];
};

export async function analyzeMealPhotoAndSuggestProtein(
  input: AnalyzeMealPhotoAndSuggestProteinInput
): Promise<AnalyzeMealPhotoAndSuggestProteinOutput> {
  // This function is a bit of a misnomer now. It only does the photo analysis part.
  // The suggestions are handled in the action.
  const result = await analyzeMealPhotoAndSuggestProteinFlow(input);
  return {
    ...result,
    proteinUpgradeSuggestions: [], // This will be populated by the action
  };
}

const analyzeMealPhotoAndSuggestProteinPrompt = ai.definePrompt({
  name: 'analyzeMealPhotoAndSuggestProteinPrompt',
  input: {schema: AnalyzeMealPhotoAndSuggestProteinInputSchema},
  output: {schema: z.object({
    mealName: z.string().describe('The name of the meal identified from the photo.'),
    macros: z.object({
      protein: z.number().describe('Protein content in grams.'),
      carbs: z.number().describe('Carbohydrates content in grams.'),
      fat: z.number().describe('Fat content in grams.'),
      calories: z.number().describe('Total calories.'),
    }),
  })},
  prompt: `You are an expert nutritionist. Analyze the meal in the photo. Identify the meal and provide a nutritional breakdown (protein, carbs, fat, calories).

Photo: {{media url=photoDataUri}}
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const analyzeMealPhotoAndSuggestProteinFlow = ai.defineFlow(
  {
    name: 'analyzeMealPhotoAndSuggestProteinFlow',
    inputSchema: AnalyzeMealPhotoAndSuggestProteinInputSchema,
    outputSchema: z.object({
        mealName: z.string(),
        macros: z.object({
            protein: z.number(),
            carbs: z.number(),
            fat: z.number(),
            calories: z.number(),
        }),
    }),
  },
  async input => {
    const {output} = await analyzeMealPhotoAndSuggestProteinPrompt(input);
    return output!;
  }
);
