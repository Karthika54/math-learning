
'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { topics, Topic } from '@/lib/data';
import { ArrowRight, BookX, Loader2 } from 'lucide-react';

type TopicWithProgress = Topic & { progress: number };

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const gradeFromUrl = searchParams.get('grade');

  const [selectedGrade, setSelectedGrade] = useState(gradeFromUrl || '8');
  const [topicsWithProgress, setTopicsWithProgress] = useState<TopicWithProgress[]>([]);

  useEffect(() => {
    // Keeps the component's state in sync with the URL's query parameter.
    const newGradeFromUrl = searchParams.get('grade');
    if (newGradeFromUrl && newGradeFromUrl !== selectedGrade) {
      setSelectedGrade(newGradeFromUrl);
    }
  }, [searchParams, selectedGrade]);

  useEffect(() => {
    try {
      const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
      
      const updatedTopics = topics.map(topic => {
        const completedLevels = completedQuizzes[topic.id] || [];
        const totalLevels = 5;
        const progress = Math.round((completedLevels.length / totalLevels) * 100);
        return { ...topic, progress };
      });

      setTopicsWithProgress(updatedTopics);
    } catch (error) {
      console.error("Could not calculate progress", error);
      setTopicsWithProgress(topics.map(t => ({...t, progress: 0})));
    }
  }, []);

  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade);
    const params = new URLSearchParams(searchParams.toString());
    params.set('grade', newGrade);
    router.push(`${pathname}?${params.toString()}`);
  };

  const filteredTopics = useMemo(() => {
    return topicsWithProgress.filter(
      (topic) =>
        topic.grade === parseInt(selectedGrade)
    );
  }, [selectedGrade, topicsWithProgress]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Let's continue your math adventure. What are we learning today?</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Select Your Grade:</span>
                <Select value={selectedGrade} onValueChange={handleGradeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(7)].map((_, i) => {
                        const grade = i + 4;
                        return <SelectItem key={grade} value={String(grade)}>{grade}th Grade</SelectItem>
                    })}
                  </SelectContent>
                </Select>
            </div>
        </div>
      </div>
      
      {filteredTopics.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="flex flex-col neumorphism-card">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                 <div className="p-3 bg-secondary rounded-full">
                   <topic.icon className="w-8 h-8 text-primary" />
                 </div>
                 <div>
                  <CardTitle className="font-headline text-2xl">{topic.name}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-bold">{topic.progress}%</span>
                  </div>
                  <Progress value={topic.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/app/topic/${topic.id}`}>
                    View Topic <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg bg-secondary/50 backdrop-blur border">
            <BookX className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold font-headline">No Topics Found</h2>
            <p className="text-muted-foreground">There are no topics available for the selected grade.</p>
            <p className="text-muted-foreground mt-1">Please try a different selection.</p>
        </div>
      )}
    </div>
  );
}


export default function Dashboard() {
  return (
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <DashboardContent />
      </Suspense>
  )
}
