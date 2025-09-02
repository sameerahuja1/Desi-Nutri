
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Loader2, Share2, ClipboardList, Lightbulb, RefreshCw, XCircle, Leaf, Egg, Beef, PlusCircle, Trash2, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleFamilyMealAnalysis } from '../actions';
import type { FamilyMealAnalysisOutput, FamilyMember } from '@/ai/flows/family-meal-analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


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

const DietIcon = ({ preference }: { preference: DietaryPreference }) => {
    switch (preference) {
        case 'veg': return <Leaf className="h-5 w-5 text-green-600" />;
        case 'eggetarian': return <Egg className="h-5 w-5 text-yellow-600" />;
        case 'non-veg': return <Beef className="h-5 w-5 text-red-600" />;
        default: return null;
    }
}

export default function FamilyMealPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<FamilyMealAnalysisOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
        { name: 'Person 1', dietaryPreference: 'veg' },
    ]);

    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAddMember = () => {
        setFamilyMembers([...familyMembers, { name: `Person ${familyMembers.length + 1}`, dietaryPreference: 'veg' }]);
    };

    const handleRemoveMember = (index: number) => {
        if (familyMembers.length > 1) {
            setFamilyMembers(familyMembers.filter((_, i) => i !== index));
        } else {
            toast({
                title: "Cannot remove last member",
                description: "At least one person is needed for analysis.",
                variant: "destructive",
            });
        }
    };

    const handleMemberChange = (index: number, field: 'name' | 'dietaryPreference', value: string) => {
        const newMembers = [...familyMembers];
        newMembers[index] = { ...newMembers[index], [field]: value };
        setFamilyMembers(newMembers);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
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
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            toast({ title: "No file selected", description: "Please select a meal photo to analyze.", variant: "destructive" });
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
                const result = await handleFamilyMealAnalysis({ photoDataUri: base64Image, familyMembers });
                setAnalysis(result);
            } catch (e: any) {
                setError(e.message || "An unknown error occurred.");
                toast({ title: "Analysis Failed", description: e.message || "Please try again later.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError("Failed to read the file.");
            setIsLoading(false);
        };
    };

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4">
            {!analysis && !isLoading && (
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
                           <Users className="h-8 w-8" /> Family Meal Analysis
                        </CardTitle>
                        <CardDescription>Get personalized protein suggestions for everyone at the table.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <div className="w-full max-w-lg border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition-colors"
                            onClick={triggerFileSelect}>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            {previewUrl ? (
                                <div className="relative w-full aspect-video">
                                    <Image src={previewUrl} alt="Meal preview" fill className="object-contain rounded-md" />
                                </div>
                            ) : (
                                <div className="space-y-2 flex flex-col items-center">
                                    <Upload className="h-12 w-12 text-muted-foreground" />
                                    <p className="font-semibold">Click to upload a photo of your meal</p>
                                    <p className="text-sm text-muted-foreground">PNG, JPG, or WEBP</p>
                                </div>
                            )}
                        </div>

                        <Card className="w-full max-w-lg">
                            <CardHeader>
                                <CardTitle className="text-xl text-center">Family Members</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {familyMembers.map((member, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                        <Input
                                            placeholder="Name"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                            className="flex-grow"
                                        />
                                        <Select onValueChange={(value: DietaryPreference) => handleMemberChange(index, 'dietaryPreference', value)} defaultValue={member.dietaryPreference}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Dietary Style" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="veg"><div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-green-600"/> Vegetarian</div></SelectItem>
                                                <SelectItem value="eggetarian"><div className="flex items-center gap-2"><Egg className="h-4 w-4 text-yellow-600"/> Eggetarian</div></SelectItem>
                                                <SelectItem value="non-veg"><div className="flex items-center gap-2"><Beef className="h-4 w-4 text-red-600"/> Non-Vegetarian</div></SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={handleAddMember} className="w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Member
                                </Button>
                            </CardContent>
                        </Card>


                        {previewUrl && (
                            <div className="flex gap-4">
                                <Button size="lg" onClick={handleSubmit}><Lightbulb className="mr-2 h-5 w-5" /> Analyze for Family</Button>
                                <Button size="lg" variant="outline" onClick={resetState}><XCircle className="mr-2 h-5 w-5" /> Cancel</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
             {isLoading && (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <h2 className="text-2xl font-semibold font-headline">Analyzing for the family...</h2>
                    <p className="text-muted-foreground">This might take a moment.</p>
                </div>
            )}

            {analysis && !isLoading && (
                <div className="space-y-8 animate-in fade-in-0 duration-500">
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold font-headline">Family Nutrition Report</h2>
                        <Button variant="outline" onClick={resetState}><RefreshCw className="mr-2 h-4 w-4" /> Analyze Another Meal</Button>
                    </div>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>{analysis.mealName}</CardTitle>
                            <CardDescription>Base nutritional info for the shared meal before personal upgrades.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-8">
                             {previewUrl && <Image src={previewUrl} alt={analysis.mealName} width={600} height={400} className="rounded-lg w-full object-cover aspect-video" />}
                             <div className="space-y-4">
                                 <p className="font-bold text-center">Total Calories: ~{analysis.baseMacros.calories} kcal</p>
                                 {/* You can add macro bars here if you want */}
                             </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Personalized Protein Upgrades</CardTitle>
                            <CardDescription>Here are tailored suggestions for each family member.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible className="w-full" defaultValue={analysis.familySuggestions[0]?.name}>
                                {analysis.familySuggestions.map((memberResult, idx) => (
                                    <AccordionItem value={memberResult.name} key={idx}>
                                        <AccordionTrigger className="text-lg font-semibold">
                                            <div className="flex items-center gap-3">
                                                <DietIcon preference={memberResult.dietaryPreference as DietaryPreference} />
                                                {memberResult.name}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                            {memberResult.suggestions.length > 0 ? memberResult.suggestions.map((suggestion, sIdx) => (
                                                <Card key={sIdx} className="bg-green-50/50 border-green-200">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-start gap-3">
                                                            <Lightbulb className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                                                            <span className="text-lg font-semibold">{suggestion.suggestion}</span>
                                                        </CardTitle>
                                                        <CardDescription>
                                                          + {suggestion.proteinGrams}g Protein, + {suggestion.carbGrams}g Carbs, + {suggestion.fatGrams}g Fat
                                                        </CardDescription>
                                                    </CardHeader>
                                                </Card>
                                            )) : (
                                                <Alert>
                                                    <AlertTitle>No specific upgrades found!</AlertTitle>
                                                    <AlertDescription>The base meal might already be well-suited for this dietary style.</AlertDescription>
                                                </Alert>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
