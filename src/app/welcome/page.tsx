import Link from 'next/link';
import { Dumbbell, LineChart, ListChecks, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center space-y-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Track Your Fitness Journey with WeightWise
          </h1>
          <p className="text-xl text-muted-foreground">
            Your personal weight tracking companion for a healthier lifestyle
          </p>
        </div>
        <div className="flex gap-4 mt-8">
          <Link href="/sign-up">
            <Button size="lg" className="font-semibold">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="lg" className="font-semibold">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-full px-8 md:px-16 py-16 grid gap-8 md:grid-cols-3">
        <Card className="transition-all hover:shadow-lg">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Track Progress</h2>
            <p className="text-muted-foreground">
              Log your weight, body fat, and muscle percentage to monitor your fitness journey
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <LineChart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Visualize Data</h2>
            <p className="text-muted-foreground">
              See your progress with beautiful charts and track your trends over time
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <ListChecks className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Manage Records</h2>
            <p className="text-muted-foreground">
              Easily manage and update your fitness records anytime
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WeightWise. Track your journey to a healthier you.</p>
      </footer>
    </div>
  );
}