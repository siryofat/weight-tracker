
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, Dumbbell, ListChecks, LogOut } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { UserButton } from "@clerk/nextjs";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  let activeTabValue = 'data';
  if (pathname === '/progress') {
    activeTabValue = 'progress';
  } else if (pathname === '/edit') {
    activeTabValue = 'edit';
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-background">
      <Card className="w-full max-w-4xl shadow-xl">
        <header className="p-6 border-b">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <Dumbbell className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">WeightWise</h1>
            </div>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>

        <nav className="p-4 border-b">
          <Tabs value={activeTabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="data" asChild>
                <Link href="/" className="flex items-center justify-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>Enter Data</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger value="progress" asChild>
                <Link href="/progress" className="flex items-center justify-center space-x-2">
                  <LineChart className="w-5 h-5" />
                  <span>View Progress</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger value="edit" asChild>
                <Link href="/edit" className="flex items-center justify-center space-x-2">
                  <ListChecks className="w-5 h-5" />
                  <span>Manage Records</span>
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </nav>

        <main className="p-6">
          {children}
        </main>
      </Card>
      <footer className="mt-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WeightWise. Track your journey to a healthier you.</p>
      </footer>
    </div>
  );
}
