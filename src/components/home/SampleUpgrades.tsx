import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sampleMeals = [
  {
    before: {
      title: "Simple Dal Rice",
      protein: "12g",
      image: "https://picsum.photos/600/400?random=1",
      hint: "dal rice",
    },
    after: {
      title: "Dal Rice with Paneer",
      protein: "28g",
      upgrade: "+16g Protein",
      image: "https://picsum.photos/600/400?random=2",
      hint: "paneer rice",
    },
    suggestion: "Add 100g of Paneer",
  },
  {
    before: {
      title: "Vegetable Poha",
      protein: "8g",
      image: "https://picsum.photos/600/400?random=3",
      hint: "vegetable poha",
    },
    after: {
      title: "Poha with Peanuts & Sprouts",
      protein: "18g",
      upgrade: "+10g Protein",
      image: "https://picsum.photos/600/400?random=4",
      hint: "poha peanuts",
    },
    suggestion: "Add a handful of Peanuts & Sprouts",
  },
  {
    before: {
      title: "Plain Roti & Sabzi",
      protein: "10g",
      image: "https://picsum.photos/600/400?random=5",
      hint: "roti sabzi",
    },
    after: {
      title: "Roti, Sabzi & a glass of Lassi",
      protein: "20g",
      upgrade: "+10g Protein",
      image: "https://picsum.photos/600/400?random=6",
      hint: "roti lassi",
    },
    suggestion: "Pair with a glass of Lassi",
  },
];

export function SampleUpgrades() {
  return (
    <section className="w-full py-16 md:py-24 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">See the Transformation</h2>
          <p className="max-w-2xl mx-auto mt-2 text-muted-foreground md:text-xl/relaxed">
            Small changes make a big difference. See how easy it is to boost your meals.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {sampleMeals.map((meal, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{meal.suggestion}</CardTitle>
                       <CardDescription>
                         <Badge variant="secondary" className="bg-green-100 text-green-800">{meal.after.upgrade}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">Before</p>
                        <Image
                          src={meal.before.image}
                          alt={meal.before.title}
                          width={300}
                          height={200}
                          data-ai-hint={meal.before.hint}
                          className="rounded-md object-cover aspect-video"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">{meal.before.title}</p>
                          <p className="font-bold text-xs">P: {meal.before.protein}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">After</p>
                        <Image
                           src={meal.after.image}
                           alt={meal.after.title}
                           width={300}
                           height={200}
                           data-ai-hint={meal.after.hint}
                           className="rounded-md object-cover aspect-video"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">{meal.after.title}</p>
                          <p className="font-bold text-xs text-primary">P: {meal.after.protein}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
