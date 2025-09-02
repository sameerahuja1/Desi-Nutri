import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-meal-photo-and-suggest-protein.ts';
import '@/ai/flows/suggest-protein-upgrades.ts';
import '@/ai/flows/suggest-protein-upgrades-for-veg-flow.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/translate-text.ts';
