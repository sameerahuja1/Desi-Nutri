
'use client';

import React from 'react';
import { Bean, IndianRupee, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const proteinData = [
  { name: 'Soya Chunks', protein: 52, price: 20, serving: '100g' },
  { name: 'Peanuts', protein: 26, price: 15, serving: '100g' },
  { name: 'Moong Dal', protein: 24, price: 18, serving: '100g' },
  { name: 'Chana Dal', protein: 25, price: 20, serving: '100g' },
  { name: 'Eggs', protein: 36, price: 42, serving: '6 large eggs (~300g)' },
  { name: 'Paneer', protein: 20, price: 70, serving: '200g' },
  { name: 'Tofu', protein: 8, price: 45, serving: '200g' },
  { name: 'Chicken Breast', protein: 31, price: 120, serving: '250g' },
  { name: 'Greek Yogurt', protein: 10, price: 50, serving: '1 cup (200g)' },
  { name: 'Milk', protein: 3.4, price: 25, serving: '500ml' },
].map(item => ({
  ...item,
  proteinPerRupee: parseFloat((item.protein / item.price).toFixed(2)),
})).sort((a, b) => b.proteinPerRupee - a.proteinPerRupee);

export default function ProteinPerRupeePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <Bean className="h-10 w-10"/>
            Protein-per-Rupee
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find the most cost-effective protein sources to meet your goals without breaking the bank.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Protein Cost-Effectiveness Ranking</CardTitle>
          <CardDescription>This list ranks common foods by how much protein you get for every rupee spent. Prices are estimates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Protein Source</TableHead>
                <TableHead className="text-center">Protein (g)</TableHead>
                <TableHead className="text-center">Est. Price (₹)</TableHead>
                <TableHead className="text-right">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="cursor-help font-bold text-primary flex items-center gap-1">
                                Protein per Rupee
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Higher is better! (Protein / Price)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proteinData.map((item, index) => (
                <TableRow key={item.name} className={index < 3 ? 'bg-primary/10' : ''}>
                  <TableCell className="font-bold text-lg text-center">
                    <div className="flex items-center justify-center">
                        {index < 3 ? <Trophy className={`w-6 h-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-yellow-700'}`}/> : index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">Serving: {item.serving}</div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">{item.protein}g</TableCell>
                  <TableCell className="text-center font-semibold">{item.price}</TableCell>
                  <TableCell className="text-right">
                    <Badge className="text-lg" variant={index < 3 ? 'default' : 'secondary'}>
                      {item.proteinPerRupee}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
