import type { AnalyzeMealPhotoAndSuggestProteinOutput } from "@/ai/flows/analyze-meal-photo-and-suggest-protein";

export type AnalysisResult = AnalyzeMealPhotoAndSuggestProteinOutput;

export type ParsedMacros = {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
};
