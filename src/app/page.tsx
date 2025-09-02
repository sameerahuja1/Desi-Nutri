import { CTA } from "@/components/home/CTA";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SampleUpgrades } from "@/components/home/SampleUpgrades";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <main className="flex-1 w-full">
        <Hero />
        <HowItWorks />
        <SampleUpgrades />
        <Features />
        <CTA />
      </main>
    </div>
  );
}
