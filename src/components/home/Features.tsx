import { Users, ChefHat, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: <Users className="h-8 w-8 text-accent" />,
    title: 'Family Meal Mode',
    description: 'Get personalized suggestions for the entire family from a single photo.',
  },
  {
    icon: <ChefHat className="h-8 w-8 text-accent" />,
    title: 'Cooking Coach',
    description: 'Receive real-time tips to boost protein while you are preparing your meal.',
  },
  {
    icon: <Search className="h-8 w-8 text-accent" />,
    title: 'Ingredient Lookup',
    description: 'Quickly check the nutritional value of any single ingredient without a photo.',
  },
];

export function Features() {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">More Than Just Analysis</h2>
          <p className="max-w-2xl mx-auto mt-2 text-muted-foreground md:text-xl/relaxed">
            Tools to help you at every step of your nutrition journey.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center">
              <CardHeader className="flex flex-col items-center">
                 <div className="mb-4 rounded-full bg-accent/10 p-3">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="mt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
