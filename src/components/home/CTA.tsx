import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="w-full py-16 md:py-24 bg-secondary">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            Ready to Upgrade Your Meals?
          </h2>
          <p className="text-muted-foreground md:text-xl">
            Start your journey towards a healthier, protein-rich diet today. It's free and easy to get started.
          </p>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/analyze">
                Analyze Your First Meal <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
