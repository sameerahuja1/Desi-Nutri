"use server";
import { analyzeMealPhotoAndSuggestProtein } from '@/ai/flows/analyze-meal-photo-and-suggest-protein';
import { suggestProteinUpgradesForVeg } from '@/ai/flows/suggest-protein-upgrades-for-veg-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { AnalyzeMealPhotoAndSuggestProteinOutput } from '@/ai/flows/analyze-meal-photo-and-suggest-protein';
import type { TextToSpeechOutput } from '@/ai/flows/text-to-speech';
import { suggestProteinUpgrades } from '@/ai/flows/suggest-protein-upgrades';

type DietaryPreference = "veg" | "eggetarian" | "non-veg";

export async function handleAnalyzeMeal(photoDataUri: string, dietaryPreference: DietaryPreference): Promise<AnalyzeMealPhotoAndSuggestProteinOutput> {
  if (!photoDataUri) {
    throw new Error('Image data is missing.');
  }

  try {
    // First, analyze the photo to get the meal name and macros
    const analysisResult = await analyzeMealPhotoAndSuggestProtein({ photoDataUri });

    // Then, get personalized suggestions based on diet
    let suggestionsResult;
    if (dietaryPreference === 'veg') {
      suggestionsResult = await suggestProteinUpgradesForVeg({
        mealDescription: analysisResult.mealName,
        currentProteinGrams: analysisResult.macros.protein,
      });
    } else {
        suggestionsResult = await suggestProteinUpgrades({
            mealDescription: analysisResult.mealName,
            currentProteinGrams: analysisResult.macros.protein,
            dietaryPreference: dietaryPreference,
        });
    }
    
    return {
      ...analysisResult,
      proteinUpgradeSuggestions: suggestionsResult.suggestions,
    };

  } catch (error) {
    console.error('Error analyzing meal:', error);
    throw new Error('Failed to analyze meal. The AI model might be busy. Please try again later.');
  }
}

export async function handleTextToSpeech(text: string): Promise<TextToSpeechOutput> {
  if (!text) {
    throw new Error('Text is missing.');
  }

  try {
    const result = await textToSpeech({ text });
    return result;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate audio. The AI model might be busy. Please try again later.');
  }
}
