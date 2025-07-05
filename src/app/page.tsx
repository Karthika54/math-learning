
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Bot, BarChart, BrainCircuit } from 'lucide-react';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div>
          <Logo />
          <p className="text-xs text-muted-foreground -mt-1 ml-9">
            AI-Powered Math Academy
          </p>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left mb-12">
              <div 
                className="animate-in fade-in zoom-in-75 duration-500"
              >
                <div className="bg-primary/10 p-5 rounded-2xl inline-block">
                  <BrainCircuit className="h-16 w-16 md:h-20 md:w-20 text-primary" />
                </div>
              </div>
              <div>
                <h1 
                  className="text-4xl sm:text-5xl md:text-7xl font-bold font-headline tracking-tighter mb-2 animate-in fade-in slide-in-from-bottom-5 duration-700"
                  style={{ animationDelay: '200ms' }}
                >
                  MATHWHIZ
                </h1>
                <p 
                  className="text-md sm:text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-700"
                  style={{ animationDelay: '400ms' }}
                >
                  AI-POWERED MATH ACADEMY
                </p>
              </div>
            </div>
            <div 
              className="text-center animate-in fade-in slide-in-from-bottom-5 duration-700"
              style={{ animationDelay: '600ms' }}
            >
              <Button size="lg" asChild>
                <Link href="/signup">Start Learning for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">Why Choose MathWhiz?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<BookOpen className="w-10 h-10 text-primary" />}
                title="Interactive Learning"
                description="Engage with adaptive quizzes that match your skill level and provide instant feedback."
              />
              <FeatureCard
                icon={<Target className="w-10 h-10 text-primary" />}
                title="Intelligent Tutoring"
                description="Get step-by-step AI explanations, alternative methods, and real-world examples for any problem."
              />
              <FeatureCard
                icon={<Bot className="w-10 h-10 text-primary" />}
                title="AI Chat Assistant"
                description="Your friendly AI tutor is always available to answer questions and clarify doubts."
              />
              <FeatureCard
                icon={<BarChart className="w-10 h-10 text-primary" />}
                title="Track Your Progress"
                description="Visualize your growth with a detailed progress dashboard and AI-powered recommendations."
              />
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold font-headline mb-4">Ready to master math?</h2>
                <p className="text-muted-foreground text-lg mb-8">
                    Join thousands of students who are already excelling. Your journey to math confidence starts here.
                </p>
                <Button size="lg" asChild>
                    <Link href="/signup">Sign Up Now</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MathWhiz. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="text-center p-6 neumorphism-card hover:shadow-lg transition-all transform hover:-translate-y-1">
      <CardHeader className="flex items-center justify-center mb-4">
        <div className="bg-primary/10 p-4 rounded-full">
            {icon}
        </div>
      </CardHeader>
      <CardTitle className="mb-2 font-headline text-xl">{title}</CardTitle>
      <CardContent className="text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  );
}
