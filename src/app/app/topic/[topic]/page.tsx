
'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { topics, lessons } from '@/lib/data';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, BookOpen, CheckCircle, Star, BookX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function TopicPage() {
  const params = useParams<{ topic: string }>();
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  const topicInfo = useMemo(() => topics.find((t) => t.id === params.topic), [params.topic]);
  const topicLessons = useMemo(() => lessons.filter((l) => l.topicId === params.topic), [params.topic]);

  useEffect(() => {
    if (params.topic) {
      try {
        const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
        const topicCompletedLevels = completedQuizzes[params.topic] || [];
        setCompletedLevels(topicCompletedLevels);
        
        const totalLevels = topicInfo?.levels?.length || 5;
        const newProgress = (topicCompletedLevels.length / totalLevels) * 100;
        setProgress(Math.round(newProgress));

      } catch (error) {
        console.error("Could not load quiz completion status.", error);
        setCompletedLevels([]);
        setProgress(0);
      }
    }
  }, [params.topic, topicInfo]);


  if (!topicInfo) {
    notFound();
  }

  const levelDescriptions = useMemo(() => {
    if (!topicInfo?.levels) return [];
    return topicInfo.levels.map(level => {
        const isCompleted = completedLevels.includes(String(level.number));
        const status = isCompleted ? 'Completed' : 'Not Started';
        const icon = isCompleted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Star className="w-5 h-5 text-gray-400" />;
        return { ...level, status, icon };
    });
  }, [completedLevels, topicInfo]);

  return (
    <div className="container mx-auto max-w-5xl">
      <Link href={`/app/dashboard?grade=${topicInfo.grade}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3 mb-2">
            <topicInfo.icon className="w-8 h-8 text-primary" />
            {topicInfo.name}
        </h1>
        <p className="text-muted-foreground text-lg">{topicInfo.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold font-headline mb-4">Select a Level</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {levelDescriptions.map((level) => (
            <Link key={level.number} href={`/app/quiz/${topicInfo.id}?level=${level.number}`} passHref>
              <Card 
                className="text-center hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col"
              >
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary">{level.number}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between p-4">
                  <div>
                      <p className="font-semibold">{level.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                  </div>
                  <div className="text-sm font-medium mt-4 flex items-center justify-center gap-2">
                      {level.icon}
                      <span>{level.status}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold font-headline flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            Study Materials
        </h2>
        {topicLessons.length > 0 ? (
          <Accordion type="single" collapsible className="w-full rounded-lg border">
              {topicLessons.map((lesson, index) => (
                  <AccordionItem key={lesson.id} value={lesson.id} className={cn(index === topicLessons.length - 1 && "border-b-0")}>
                      <AccordionTrigger className="px-6 text-lg font-semibold hover:no-underline text-left">{lesson.title}</AccordionTrigger>
                      <AccordionContent className="px-6 prose prose-sm max-w-none text-muted-foreground">
                         <p>{lesson.content}</p>
                      </AccordionContent>
                  </AccordionItem>
              ))}
          </Accordion>
        ) : (
          <div className="text-center py-10 flex flex-col items-center bg-secondary rounded-lg">
              <BookX className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold font-headline mb-2">Lessons Coming Soon!</h2>
              <p className="text-muted-foreground">There are no lessons for this topic yet. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
