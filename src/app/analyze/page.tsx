"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Camera, Upload, Loader2, Share2, ClipboardList, Lightbulb, RefreshCw, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { handleAnalyzeMeal } from '../actions';
import type { AnalyzeMealPhotoAndSuggestProteinOutput } from '@/ai/flows/analyze-meal-photo-and-suggest-protein';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeMealPhotoAndSuggestProteinOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalysis(null);
      setError(null);
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
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const resetState = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
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

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        const result = await handleAnalyzeMeal(base64Image);
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
  
  const totalMacros = (parsedMacros?.protein ?? 0) + (parsedMacros?.carbs ?? 0) + (parsedMacros?.fat ?? 0);

  const shareOnWhatsApp = () => {
    if (!analysis || !parsedMacros) return;
    const summary = `My ${analysis.mealName} has approx. ${parsedMacros.calories} calories!\n- Protein: ${parsedMacros.protein}g\n- Carbs: ${parsedMacros.carbs}g\n- Fat: ${parsedMacros.fat}g\n\nUpgrade Suggestions:\n${analysis.proteinUpgradeSuggestions.join('\n')}\n\nAnalyzed with DesiNutri!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateShoppingList = () => {
    if (!analysis) return;
    const list = analysis.proteinUpgradeSuggestions.join('\n');
    navigator.clipboard.writeText(list).then(() => {
      toast({
        title: "Shopping list copied!",
        description: "Your protein upgrade ingredients are on your clipboard.",
      });
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      {!analysis && !isLoading && (
         <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Analyze Your Meal</CardTitle>
            <CardDescription>Upload a photo to get an instant nutritional breakdown.</CardDescription>
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
                    <Button variant="secondary" onClick={triggerFileSelect}>
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
                    {previewUrl && <Image src={previewUrl} alt="Analyzed meal" width={600} height={400} className="rounded-lg w-full object-cover aspect-video" />}
                </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Macros Breakdown</CardTitle>
                <CardDescription>Estimated values for your meal. Total: ~{parsedMacros.calories} kcal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Protein</span>
                    <span className="font-bold text-primary">{parsedMacros.protein}g</span>
                  </div>
                  <Progress value={(parsedMacros.protein / totalMacros) * 100} className="h-3 [&>div]:bg-primary" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Carbohydrates</span>
                    <span className="font-bold text-yellow-500">{parsedMacros.carbs}g</span>
                  </div>
                  <Progress value={(parsedMacros.carbs / totalMacros) * 100} className="h-3 [&>div]:bg-yellow-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Fat</span>
                    <span className="font-bold text-red-500">{parsedMacros.fat}g</span>
                  </div>
                  <Progress value={(parsedMacros.fat / totalMacros) * 100} className="h-3 [&>div]:bg-red-500" />
                </div>
                {parsedMacros.protein < 15 && <Alert className="mt-4 border-primary/50 text-primary">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Protein Boost Needed!</AlertTitle>
                  <AlertDescription>
                    This meal is a bit low on protein. Check out the upgrade suggestions!
                  </AlertDescription>
                </Alert>}
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quick Protein Upgrades</CardTitle>
              <CardDescription>Easy, actionable ways to boost your meal with local Indian ingredients.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.proteinUpgradeSuggestions.map((suggestion, index) => (
                <Card key={index} className="bg-green-50/50 border-green-200">
                    <CardHeader>
                        <CardTitle className="flex items-start gap-2">
                           <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                           <span className="text-base">{suggestion}</span>
                        </CardTitle>
                    </CardHeader>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Share your results or create a shopping list.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button onClick={shareOnWhatsApp}>
                <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
              </Button>
              <Button variant="secondary" onClick={generateShoppingList}>
                <ClipboardList className="mr-2 h-4 w-4" /> Generate Shopping List
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
