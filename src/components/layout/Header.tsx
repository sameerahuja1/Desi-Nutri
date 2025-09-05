
'use client';
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center">
            <SidebarTrigger className="h-10 w-10" />
             <Link href="/" className="ml-2 mr-6 flex items-center space-x-2">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                <span className="font-bold inline-block">DesiNutri</span>
            </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <Link href="/analyze">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
