'use server';
/**
 * @fileOverview Analyzes a meal photo for a family with diverse dietary needs
 * and provides personalized protein upgrade suggestions for each member.
 *
 * - familyMealAnalysis - The main function to call.
 * - FamilyMealAnalysisInput - The input type for the function.
 * - FamilyMealAnalysisOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { analyzeMealPhotoAndSuggestProtein, AnalyzeMealPhotoAndSuggestProteinInput } from './analyze-meal-photo-and-suggest-protein';
import { suggestProteinUpgrades, SuggestProteinUpgradesInput, Suggestion } from './suggest-protein-upgrades';
import { suggestProteinUpgradesForVeg, SuggestProteinUpgradesForVegInput } from './suggest-protein-upgrades-for-veg-flow';

const FamilyMemberSchema = z.object({
    name: z.string().describe("The family member's name."),
    dietaryPreference: z.enum(['veg', 'eggetarian', 'non-veg']).describe("The family member's dietary preference."),
});
export type FamilyMember = z.infer<typeof FamilyMemberSchema>;

const FamilyMealAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  familyMembers: z.array(FamilyMemberSchema).describe("An array of family members with their dietary preferences."),
});
export type FamilyMealAnalysisInput = z.infer<typeof FamilyMealAnalysisInputSchema>;

const FamilyMealAnalysisOutputSchema = z.object({
    mealName: z.string().describe('The name of the meal identified from the photo.'),
    baseMacros: z.object({
        protein: z.number().describe('Base protein content in grams.'),
        carbs: z.number().describe('Base carbohydrates content in grams.'),
        fat: z.number().describe('Base fat content in grams.'),
        calories: z.number().describe('Base total calories.'),
    }),
    familySuggestions: z.array(z.object({
        name: z.string(),
        dietaryPreference: z.string(),
        suggestions: z.array(z.object({
            suggestion: z.string(),
            proteinGrams: z.number(),
            carbGrams: z.number(),
            fatGrams: z.number(),
        }))
    }))
});
export type FamilyMealAnalysisOutput = z.infer<typeof FamilyMealAnalysisOutputSchema>;

export async function familyMealAnalysis(
  input: FamilyMealAnalysisInput
): Promise<FamilyMealAnalysisOutput> {
  return familyMealAnalysisFlow(input);
}


const familyMealAnalysisFlow = ai.defineFlow(
  {
    name: 'familyMealAnalysisFlow',
    inputSchema: FamilyMealAnalysisInputSchema,
    outputSchema: FamilyMealAnalysisOutputSchema,
  },
  async ({ photoDataUri, familyMembers }) => {
    // 1. Analyze the base meal from the photo
    const mealAnalysis = await analyzeMealPhotoAndSuggestProtein({ photoDataUri });
    const { mealName, macros } = mealAnalysis;

    // 2. For each family member, get tailored suggestions
    const familySuggestions = await Promise.all(
        familyMembers.map(async (member) => {
            let suggestionsResult;

            const suggestionInput = {
                mealDescription: mealName,
                currentProteinGrams: macros.protein,
                dietaryPreference: member.dietaryPreference,
            };

            if (member.dietaryPreference === 'veg') {
                suggestionsResult = await suggestProteinUpgradesForVeg(suggestionInput);
            } else {
                suggestionsResult = await suggestProteinUpgrades(suggestionInput);
            }

            return {
                name: member.name,
                dietaryPreference: member.dietaryPreference,
                suggestions: suggestionsResult.suggestions,
            };
        })
    );

    return {
        mealName,
        baseMacros: macros,
        familySuggestions,
    };
  }
);
