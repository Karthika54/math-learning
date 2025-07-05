
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { badges, Badge } from '@/lib/badges';
import { topics } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Lock, Loader2, Trophy } from 'lucide-react';

export default function BadgesPage() {
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
      const earned = new Set<string>();

      const totalLevelsCompleted = Object.values(completedQuizzes).reduce((acc: number, levels: any) => acc + (levels?.length || 0), 0);

      const completedTopics = new Set<string>();
      Object.keys(completedQuizzes).forEach(topicId => {
        const topic = topics.find(t => t.id === topicId);
        if (topic && completedQuizzes[topicId]?.length >= (topic.levels?.length || 5)) {
          completedTopics.add(topicId);
        }
      });
      
      const topicsByGrade: Record<number, string[]> = {};
      topics.forEach(topic => {
          if (!topicsByGrade[topic.grade]) {
              topicsByGrade[topic.grade] = [];
          }
          topicsByGrade[topic.grade].push(topic.id);
      });
      
      const completedGrades = new Set<number>();
      Object.keys(topicsByGrade).forEach(gradeStr => {
          const grade = Number(gradeStr);
          const gradeTopics = topicsByGrade[grade];
          if (gradeTopics.length > 0) {
            const allTopicsInGradeCompleted = gradeTopics.every(topicId => completedTopics.has(topicId));
            if (allTopicsInGradeCompleted) {
                completedGrades.add(grade);
            }
          }
      });


      badges.forEach(badge => {
        switch (badge.criteria.type) {
          case 'levels_completed':
            if (badge.criteria.count && totalLevelsCompleted >= badge.criteria.count) {
              earned.add(badge.id);
            }
            break;
          case 'topic_completed':
            if (badge.criteria.topicId) {
                if(completedTopics.has(badge.criteria.topicId)) {
                    earned.add(badge.id);
                }
            } else {
                if (completedTopics.size > 0) {
                    earned.add(badge.id);
                }
            }
            break;
          case 'grade_completed':
            if (badge.criteria.grade) {
                 if (completedGrades.has(badge.criteria.grade)) {
                    earned.add(badge.id);
                 }
            } else {
                if (completedGrades.size > 0) {
                    earned.add(badge.id);
                }
            }
            break;
        }
      });

      setEarnedBadges(earned);
    } catch (error) {
      console.error("Failed to process badges:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-0 md:px-4">
      <div className="flex items-center gap-4 mb-8">
        <Trophy className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline">Your Achievements</h1>
          <p className="text-muted-foreground">Celebrate your progress with these badges!</p>
        </div>
      </div>
      
      <TooltipProvider>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {badges.map(badge => {
            const isEarned = earnedBadges.has(badge.id);
            return (
              <Tooltip key={badge.id} delayDuration={100}>
                <TooltipTrigger asChild>
                  <Card className={cn("text-center neumorphism-card p-2 sm:p-4", isEarned ? "border-accent" : "grayscale opacity-60")}>
                    <CardHeader className="items-center p-0 pb-2">
                      <div className={cn("p-3 sm:p-4 rounded-full mb-2", isEarned ? "bg-accent/10" : "bg-muted")}>
                         <badge.icon className={cn("w-10 h-10 sm:w-12 sm:h-12", isEarned ? "text-accent" : "text-muted-foreground")} />
                      </div>
                      <CardTitle className="font-headline text-base sm:text-lg leading-tight">{badge.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 h-8 flex items-center justify-center">
                      {!isEarned ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Lock className="w-4 h-4" />
                            <span>Locked</span>
                        </div>
                      ) : (
                        <p className="text-sm text-green-600 font-semibold animate-in fade-in">Unlocked!</p>
                      )}
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
