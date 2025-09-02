"use server";
import { analyzeMealPhotoAndSuggestProtein } from '@/ai/flows/analyze-meal-photo-and-suggest-protein';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { AnalyzeMealPhotoAndSuggestProteinOutput } from '@/ai/flows/analyze-meal-photo-and-suggest-protein';
import type { TextToSpeechOutput } from '@/ai/flows/text-to-speech';

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

    