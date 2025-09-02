import { Camera, Lightbulb, BarChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const steps = [
  {
    icon: <Camera className="h-10 w-10 text-primary" />,
    title: '1. Snap a Photo',
    description: 'Take a picture of your meal. It can be anything from dal rice to a complex thali.',
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: '2. Get Instant Analysis',
    description: 'Our AI analyzes the photo to give you an estimated nutritional breakdown and health risk score.',
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    title: '3. Upgrade Your Meal',
    description: 'Receive simple, personalized suggestions using local ingredients to boost your protein intake.',
  },
];

export function HowItWorks() {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">How It Works</h2>
          <p className="max-w-2xl mx-auto mt-2 text-muted-foreground md:text-xl/relaxed">
            Improving your nutrition is as easy as 1-2-3.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="text-center p-6 shadow-lg border-t-4 border-primary">
              <CardHeader className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  {step.icon}
                </div>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription className="mt-2">{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
