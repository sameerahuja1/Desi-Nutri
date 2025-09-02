"use server";
import { analyzeMealPhotoAndSuggestProtein } from '@/ai/flows/analyze-meal-photo-and-suggest-protein';
import type { AnalyzeMealPhotoAndSuggestProteinOutput } from '@/ai/flows/analyze-meal-photo-and-suggest-protein';

export async function handleAnalyzeMeal(photoDataUri: string): Promise<AnalyzeMealPhotoAndSuggestProteinOutput> {
  if (!photoDataUri) {
    throw new Error('Image data is missing.');
  }

  try {
    const result = await analyzeMealPhotoAndSuggestProtein({ photoDataUri });
    return result;
  } catch (error) {
    console.error('Error analyzing meal:', error);
    throw new Error('Failed to analyze meal. The AI model might be busy. Please try again later.');
  }
}
