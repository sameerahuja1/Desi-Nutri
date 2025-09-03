
'use client';

import React, { useState } from 'react';
import { Search, Loader2, BarChart3, Droplets, Beef, Flame } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleIngredientLookup } from '../actions';
import type { IngredientLookupOutput } from '@/ai/flows/ingredient-lookup';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const MacroCard = ({ icon, label, value, unit, colorClass }: { icon: React.ReactNode, label: string, value?: number, unit: string, colorClass: string }) => (
    <Card className={`flex-1 ${colorClass}`}>
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <div className="mb-2">{icon}</div>
            <p className="text-2xl font-bold">{value ?? 'N/A'}{unit}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </CardContent>
    </Card>
);

export default function IngredientLookupPage() {
  const [ingredientName, setIngredientName] = useState('');
  const [result, setResult] = useState<IngredientLookupOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!ingredientName) {
      toast({
        title: 'Ingredient name is empty',
        description: 'Please enter an ingredient to look up.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const lookupResult = await handleIngredientLookup(ingredientName);
      setResult(lookupResult);
    } catch (e: any) {
      toast({
        title: 'Failed to look up ingredient',
        description: e.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
       <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <BarChart3 className="h-10 w-10"/>
            Ingredient Lookup
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Quickly check the nutritional value of any ingredient.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Search for an Ingredient</CardTitle>
            <CardDescription>Enter the name of a food item to see its nutritional information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., 'Paneer', 'Moong Dal', 'Brown Rice'"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-base"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {isLoading && (
             <div className="flex justify-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
          )}
          
          {result && (
            <Card className="bg-muted/50 animate-in fade-in-0 duration-500">
                <CardHeader>
                    <CardTitle className="text-2xl capitalize">{ingredientName}</CardTitle>
                    <CardDescription>Nutritional information per {result.servingSize}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                         <MacroCard 
                            icon={<Beef className="h-8 w-8 text-primary" />}
                            label="Protein"
                            value={result.macros.protein}
                            unit="g"
                            colorClass="bg-primary/10"
                        />
                        <MacroCard 
                            icon={<Flame className="h-8 w-8 text-yellow-500" />}
                            label="Carbs"
                            value={result.macros.carbs}
                            unit="g"
                            colorClass="bg-yellow-500/10"
                        />
                        <MacroCard 
                            icon={<Droplets className="h-8 w-8 text-red-500" />}
                            label="Fat"
                            value={result.macros.fat}
                            unit="g"
                            colorClass="bg-red-500/10"
                        />
                    </div>
                    <Alert>
                        <Flame className="h-4 w-4"/>
                        <AlertTitle>Total Calories</AlertTitle>
                        <AlertDescription>
                            Approximately <span className="font-bold">{result.macros.calories} kcal</span> per {result.servingSize}.
                        </AlertDescription>
                    </Alert>

                     {result.notes && (
                        <Alert variant="default" className="border-primary/50">
                            <AlertTitle>Did you know?</AlertTitle>
                            <AlertDescription>{result.notes}</AlertDescription>
                        </Alert>
                     )}
                </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
