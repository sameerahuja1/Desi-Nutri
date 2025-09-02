import { BarChart } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="flex flex-col items-center justify-center text-center bg-card p-12 rounded-lg shadow-lg">
        <BarChart className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline">Meal History & Trends</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          This feature is coming soon! You'll be able to track your saved meals, view weekly nutrition graphs, and see your progress over time.
        </p>
      </div>
    </div>
  );
}
