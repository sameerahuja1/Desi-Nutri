
'use client';
import type {Metadata} from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { Header } from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { UtensilsCrossed, Home, Camera, Users, ChefHat, Search, Trophy, Bell, Star, Bean } from 'lucide-react';
import { usePathname } from 'next/navigation';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
});

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/analyze', label: 'Analyze Meal', icon: Camera },
  { href: '/family-meal', label: 'Family Meal', icon: Users },
  { href: '/cooking-coach', label: 'Cooking Coach', icon: ChefHat },
  { href: '/lookup', label: 'Ingredient Lookup', icon: Search },
  { href: '/protein-per-rupee', label: 'Protein-per-Rupee', icon: Bean },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/challenges', label: 'Challenges', icon: Star },
  { href: '/reminders', label: 'Reminders', icon: Bell },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-body antialiased", poppins.variable)}>
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <UtensilsCrossed className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">DesiNutri</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href}>
                                <SidebarMenuButton isActive={pathname === item.href}>
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    {/* Footer content if any */}
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                 <Header />
                <main className="flex-1 p-2 sm:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
