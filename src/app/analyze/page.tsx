"use client";

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Loader2, Share2, ClipboardList, Lightbulb, RefreshCw, XCircle, Volume2, PlayCircle, Leaf, Egg, Beef, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { handleAnalyzeMeal, handleTextToSpeech } from '../actions';
import type { AnalyzeMealPhotoAndSuggestProteinOutput } from '@/ai/flows/analyze-meal-photo-and-suggest-protein';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type DietaryPreference = "veg" | "eggetarian" | "non-veg";

const MacroBar = ({ label, value, total, colorClass }: { label: string, value: number, total: number, colorClass: string }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="font-medium">{label}</span>
            <span className={`font-bold ${colorClass.replace('bg-', 'text-')}`}>{value || 0}g</span>
        </div>
        <Progress value={total > 0 ? ((value || 0) / total) * 100 : 0} className={`h-3 [&>div]:${colorClass}`} />
    </div>
);


export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeMealPhotoAndSuggestProteinOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>("veg");
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalysis(null);
      setError(null);
      setAudioUrl(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setAnalysis(null);
      setError(null);
      setAudioUrl(null);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const resetState = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
    setAudioUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a meal photo to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setAudioUrl(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        const result = await handleAnalyzeMeal(base64Image, dietaryPreference);
        setAnalysis(result);
      } catch (e: any) {
        setError(e.message || "An unknown error occurred.");
        toast({
          title: "Analysis Failed",
          description: e.message || "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsLoading(false);
    };
  };
  
  const parsedMacros = useMemo(() => analysis?.macros, [analysis]);
  
  const totalMacros = useMemo(() => {
    if (!parsedMacros) return 0;
    return (parsedMacros.protein || 0) + (parsedMacros.carbs || 0) + (parsedMacros.fat || 0);
  }, [parsedMacros]);

  const shareOnWhatsApp = () => {
    if (!analysis || !parsedMacros) return;
    const summary = `My ${analysis.mealName} has approx. ${parsedMacros.calories} calories!\n- Protein: ${parsedMacros.protein}g\n- Carbs: ${parsedMacros.carbs}g\n- Fat: ${parsedMacros.fat}g\n\nUpgrade Suggestions:\n${analysis.proteinUpgradeSuggestions.map(s => s.suggestion).join('\n')}\n\nAnalyzed with DesiNutri!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateShoppingList = () => {
    if (!analysis) return;
    const list = analysis.proteinUpgradeSuggestions.map(s => s.suggestion).join('\n');
    navigator.clipboard.writeText(list).then(() => {
      toast({
        title: "Shopping list copied!",
        description: "Your protein upgrade ingredients are on your clipboard.",
      });
    });
  };

  const playNutritionReport = async () => {
    if (audioUrl && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      return;
    }
    if (!analysis || !parsedMacros || isGeneratingAudio) return;

    setIsGeneratingAudio(true);
    setAudioUrl(null); // Reset previous audio
    try {
      const reportText = `Your meal is ${analysis.mealName}. It has approximately ${parsedMacros.calories} calories. Macros are: ${parsedMacros.protein} grams of protein, ${parsedMacros.carbs} grams of carbohydrates, and ${parsedMacros.fat} grams of fat. Here are some protein upgrade suggestions: ${analysis.proteinUpgradeSuggestions.map(s => s.suggestion).join(', ')}.`;
      const result = await handleTextToSpeech(reportText);
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
      {!analysis && !isLoading && (
         <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Analyze Your Meal</CardTitle>
            <CardDescription>Upload a photo and select your dietary style for personalized suggestions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div
              className="w-full max-w-lg border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              {previewUrl ? (
                 <div className="relative w-full aspect-video">
                  <Image src={previewUrl} alt="Meal preview" fill className="object-contain rounded-md" />
                 </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="font-semibold">Drag & drop or click to upload</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
            </div>
            
            <div className="w-full max-w-lg space-y-4">
                <CardTitle className="text-xl text-center">Dietary Style</CardTitle>
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

            {previewUrl && (
              <div className="flex gap-4">
                <Button size="lg" onClick={handleSubmit}>
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Analyze Meal
                </Button>
                <Button size="lg" variant="outline" onClick={resetState}>
                  <XCircle className="mr-2 h-5 w-5" />
                  Cancel
                </Button>
              </div>
            )}
             {!previewUrl && (
                <div className="flex gap-4">
                    <Button onClick={triggerFileSelect}>
                        <Upload className="mr-2 h-4 w-4" /> Upload Photo
                    </Button>
                    <Button variant="secondary" onClick={() => {
                      toast({ title: 'Camera access coming soon!', description: 'This feature is currently under development.'})
                    }}>
                        <Camera className="mr-2 h-4 w-4" /> Use Camera
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold font-headline">Analyzing your meal...</h2>
          <p className="text-muted-foreground">Our AI is working its magic. This might take a moment.</p>
          {previewUrl && <Image src={previewUrl} alt="Analyzing meal" width={300} height={200} className="rounded-lg shadow-lg mt-4" />}
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-4">
              <Button onClick={resetState}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {analysis && !isLoading && parsedMacros && (
        <div className="space-y-8 animate-in fade-in-0 duration-500">
           <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold font-headline">Nutrition Report</h2>
             <Button variant="outline" onClick={resetState}>
                <RefreshCw className="mr-2 h-4 w-4" /> Analyze Another Meal
              </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>{analysis.mealName}</CardTitle>
                </CardHeader>
                <CardContent>
                    {previewUrl && <Image src={previewUrl} alt={analysis.mealName} width={600} height={400} className="rounded-lg w-full object-cover aspect-video" />}
                </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Macros Breakdown</CardTitle>
                <CardDescription>Estimated values for your meal. Total: ~{parsedMacros.calories} kcal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MacroBar label="Protein" value={parsedMacros.protein} total={totalMacros} colorClass="bg-primary" />
                <MacroBar label="Carbohydrates" value={parsedMacros.carbs} total={totalMacros} colorClass="bg-yellow-500" />
                <MacroBar label="Fat" value={parsedMacros.fat} total={totalMacros} colorClass="bg-red-500" />
                
                {(parsedMacros.protein || 0) < 15 && <Alert className="mt-4 border-primary/50 text-primary">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Needs Attention: Protein Boost Needed!</AlertTitle>
                  <AlertDescription>
                    This meal is a bit low on protein. Check out the upgrade suggestions below to hit your goals!
                  </AlertDescription>
                </Alert>}
                 {(parsedMacros.protein || 0) >= 15 && <Alert className="mt-4 border-green-500/50 text-green-700">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Well Done: Good Protein Content!</AlertTitle>
                  <AlertDescription>
                    This meal has a solid amount of protein. Keep up the great work!
                  </AlertDescription>
                </Alert>}
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quick Protein Upgrades</CardTitle>
              <CardDescription>See how easy it is to boost your meal's protein with these suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.proteinUpgradeSuggestions.map((suggestion, index) => {
                const newMacros = {
                    protein: (parsedMacros.protein || 0) + suggestion.proteinGrams,
                    carbs: (parsedMacros.carbs || 0) + suggestion.carbGrams,
                    fat: (parsedMacros.fat || 0) + suggestion.fatGrams,
                };
                const newTotalMacros = newMacros.protein + newMacros.carbs + newMacros.fat;

                return (
                    <Card key={index} className="bg-green-50/50 border-green-200">
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                               <Lightbulb className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                               <span className="text-lg font-semibold">{suggestion.suggestion}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-3">
                                <p className="font-semibold text-center text-muted-foreground">Before</p>
                                <MacroBar label="Protein" value={parsedMacros.protein} total={totalMacros} colorClass="bg-primary" />
                                <MacroBar label="Carbs" value={parsedMacros.carbs} total={totalMacros} colorClass="bg-yellow-500" />
                                <MacroBar label="Fat" value={parsedMacros.fat} total={totalMacros} colorClass="bg-red-500" />
                            </div>
                             <div className="space-y-3">
                                <p className="font-semibold text-center text-muted-foreground">After</p>
                                <MacroBar label="Protein" value={newMacros.protein} total={newTotalMacros} colorClass="bg-primary" />
                                <MacroBar label="Carbs" value={newMacros.carbs} total={newTotalMacros} colorClass="bg-yellow-500" />
                                <MacroBar label="Fat" value={newMacros.fat} total={newTotalMacros} colorClass="bg-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                )
              })}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Share your results, create a shopping list, or listen to the report.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button onClick={shareOnWhatsApp}>
                <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
              </Button>
              <Button variant="secondary" onClick={generateShoppingList}>
                <ClipboardList className="mr-2 h-4 w-4" /> Copy Shopping List
              </Button>
              <Button variant="secondary" onClick={playNutritionReport} disabled={isGeneratingAudio}>
                {isGeneratingAudio ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    audioUrl && audioRef.current && !audioRef.current.paused ? <Volume2 className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />
                )}
                {isGeneratingAudio ? 'Generating...' : (audioUrl ? 'Play/Pause Report' : 'Read Report Aloud')}
              </Button>
              {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => {
                if(audioRef.current) audioRef.current.currentTime = 0;
              }} />}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
