import { Hero } from "@/components/home/Hero";
import { SampleUpgrades } from "@/components/home/SampleUpgrades";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <main className="flex-1 w-full">
        <Hero />
        <SampleUpgrades />
      </main>
    </div>
  );
}
