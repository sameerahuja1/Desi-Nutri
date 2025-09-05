import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary font-headline">
              DesiNutri
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground/80">
              Upgrade Your Everyday Indian Meals
            </p>
            <p className="max-w-2xl text-muted-foreground md:text-xl">
              Snap a photo of your meal, get an instant nutrition breakdown, and discover simple ways to add more protein with local ingredients.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/analyze">
                  Analyze Your Meal Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZWFsdGh5J2TIwZm9vZHxlbnwwfHx8fDE3NTcxMDE3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Healthy Indian Meal"
            data-ai-hint="indian thali"
            width={800}
            height={600}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  );
}
