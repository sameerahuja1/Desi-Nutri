
'use client';

import React, { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { handleTranslateText } from '../actions';

const languages = [
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Odia', label: 'Odia' },
  { value: 'Punjabi', label: 'Punjabi' },
  { value: 'Malayalam', label: 'Malayalam' },
];

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Hindi');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!inputText) {
      toast({
        title: 'No text to translate',
        description: 'Please enter some text to translate.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTranslatedText('');

    try {
      const result = await handleTranslateText(inputText, targetLanguage);
      setTranslatedText(result.translatedText);
    } catch (e: any) {
      toast({
        title: 'Translation Failed',
        description: e.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
            <Languages className="h-8 w-8" /> Text Translator
          </CardTitle>
          <CardDescription>Translate text into various Indian languages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textarea
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] text-base"
            />
            <Textarea
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              className="min-h-[150px] bg-muted text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Select onValueChange={setTargetLanguage} defaultValue={targetLanguage}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleTranslate} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                'Translate'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
