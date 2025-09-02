
'use client';

import React, { useState, useRef } from 'react';
import { ChefHat, Sparkles, Loader2, Volume2, PlayCircle, Leaf, Egg, Beef } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleCookingCoach, handleTextToSpeech } from '../actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DietaryPreference = "veg" | "eggetarian" | "non-veg";

export default function CookingCoachPage() {
  const [mealDescription, setMealDescription] = useState('');
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>("veg");

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const getTips = async () => {
    if (!mealDescription) {
      toast({
        title: 'Meal description is empty',
        description: 'Please tell me what you are cooking.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTips([]);
    setAudioUrl(null);

    try {
      const result = await handleCookingCoach(mealDescription, dietaryPreference);
      setTips(result.tips);
    } catch (e: any) {
      toast({
        title: 'Failed to get tips',
        description: e.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playTips = async () => {
    if (audioUrl && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      return;
    }
    if (!tips.length || isGeneratingAudio) return;

    setIsGeneratingAudio(true);
    setAudioUrl(null);
    try {
      const tipsText = `Here are some protein tips for your meal. ${tips.join('. ')}`;
      const result = await handleTextToSpeech(tipsText);
      setAudioUrl(result.media);
      toast({
          title: "Audio ready!",
          description: "Click the play button again to listen.",
        });
    } catch (e: any) {
       toast({
          title: "Audio Generation Failed",
          description: e.message || "Please try again later.",
          variant: "destructive",
        });
    } finally {
        setIsGeneratingAudio(false);
    }
  }


  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
            <ChefHat className="h-8 w-8" /> Cooking Coach
          </CardTitle>
          <CardDescription>Get live tips to boost protein while you cook!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="What are you cooking? e.g., 'Aloo Gobi' or 'Chicken Curry'"
              value={mealDescription}
              onChange={(e) => setMealDescription(e.target.value)}
              className="min-h-[100px] text-base"
            />
          </div>
            <div className="w-full space-y-2">
                <p className="font-medium text-center">Select Your Dietary Style</p>
                <Select onValueChange={(value: DietaryPreference) => setDietaryPreference(value)} defaultValue={dietaryPreference}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your dietary style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">
                      <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-green-600"/> Vegetarian</div>
                    </SelectItem>
                    <SelectItem value="eggetarian">
                      <div className="flex items-center gap-2"><Egg className="h-4 w-4 text-yellow-600"/> Eggetarian</div>
                    </SelectItem>
                    <SelectItem value="non-veg">
                      <div className="flex items-center gap-2"><Beef className="h-4 w-4 text-red-600"/> Non-Vegetarian</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
            </div>
          <div className="text-center">
            <Button onClick={getTips} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Getting Tips...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Protein Tips
                </>
              )}
            </Button>
          </div>
          
          {tips.length > 0 && (
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>AI-Powered Tips</span>
                         <Button variant="secondary" size="sm" onClick={playTips} disabled={isGeneratingAudio}>
                            {isGeneratingAudio ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                audioUrl && audioRef.current && !audioRef.current.paused ? <Volume2 className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />
                            )}
                            {isGeneratingAudio ? 'Generating...' : (audioUrl ? 'Play/Pause' : 'Read Aloud')}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background">
                                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                <p className="text-muted-foreground">{tip}</p>
                            </li>
                        ))}
                    </ul>
                    {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => {
                        if(audioRef.current) audioRef.current.currentTime = 0;
                    }} className="hidden" />}
                </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
