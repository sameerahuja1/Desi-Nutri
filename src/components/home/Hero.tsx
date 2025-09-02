import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary font-headline">
            DesiNutri
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-foreground/80">
            Upgrade Your Everyday Indian Meals
          </p>
          <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Snap a photo of your meal, get an instant nutrition breakdown, and discover simple ways to add more protein with local ingredients.
          </p>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/analyze">
                Analyze Your Meal Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
