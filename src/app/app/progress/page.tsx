
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { topics } from '@/lib/data';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TopicProgress = {
  name: string;
  completion: number;
  grade: number;
};

type Suggestion = {
    topic: string;
    reason: string;
};

const chartConfig = {
  completion: {
    label: 'Completion',
    color: 'hsl(var(--chart-1))',
  },
};

function ProgressPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const gradeFromUrl = searchParams.get('grade');

  const [selectedGrade, setSelectedGrade] = useState(gradeFromUrl || '8');
  const [overallCompletion, setOverallCompletion] = useState(0);
  const [topicPerformance, setTopicPerformance] = useState<TopicProgress[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        let totalProgress = 0;
        const totalTopics = topics.length;

        const performanceData: TopicProgress[] = [];

        if (totalTopics > 0) {
            topics.forEach(topic => {
                const completedLevels = completedQuizzes[topic.id] || [];
                const progress = Math.round((completedLevels.length / 5) * 100); // 5 levels per topic
                totalProgress += progress;
                performanceData.push({ name: topic.name, completion: progress, grade: topic.grade });
            });

            setOverallCompletion(Math.round(totalProgress / totalTopics));
            setTopicPerformance(performanceData);

            // Generate AI Suggestions
            const suggestions: Suggestion[] = [];
            
            // Suggest topics with some progress but not complete
            const inProgressTopics = performanceData
                .filter(p => p.completion > 0 && p.completion < 100)
                .sort((a, b) => a.completion - b.completion);
            
            if (inProgressTopics.length > 0) {
                suggestions.push({
                    topic: inProgressTopics[0].name,
                    reason: "You're close! Keep up the momentum on this topic.",
                });
            }

            // Suggest topics not started yet
            const notStartedTopics = performanceData.filter(p => p.completion === 0);
            if (suggestions.length < 3 && notStartedTopics.length > 0) {
                 suggestions.push({
                    topic: notStartedTopics[0].name,
                    reason: "A great topic to start next and expand your skills.",
                });
            }

            // Suggest reviewing lowest score if all are complete
             if (suggestions.length === 0 && performanceData.length > 0) {
                const allTopicsSorted = [...performanceData].sort((a, b) => a.completion - b.completion);
                 suggestions.push({
                    topic: allTopicsSorted[0].name,
                    reason: 'Great job completing topics! Why not review this one for mastery?',
                });
            }
            
            setAiSuggestions(suggestions.slice(0, 3)); // Limit to 3 suggestions
        }
    } catch (error) {
        console.error("Could not calculate progress", error);
        setOverallCompletion(0);
        setTopicPerformance([]);
        setAiSuggestions([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade);
    const params = new URLSearchParams(searchParams.toString());
    params.set('grade', newGrade);
    router.push(`${pathname}?${params.toString()}`);
  };

  const filteredTopicPerformance = useMemo(() => {
    if (!selectedGrade) return [];
    return topicPerformance.filter(topic => topic.grade === parseInt(selectedGrade));
  }, [selectedGrade, topicPerformance]);


  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline">Your Progress</h1>
         <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by Grade:</span>
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

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 neumorphism-card">
          <CardHeader>
            <CardTitle>Topic Completion</CardTitle>
            <CardDescription>Your completion percentage for Grade {selectedGrade} topics.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={filteredTopicPerformance} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis unit="%" />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="completion" fill="var(--color-completion)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="neumorphism-card">
                <CardHeader>
                    <CardTitle>Overall Completion</CardTitle>
                    <CardDescription>You're making great progress across all grades!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <div className="text-5xl font-bold text-primary">{overallCompletion}%</div>
                    <Progress value={overallCompletion} className="w-full" />
                </CardContent>
            </Card>

            <Card className="neumorphism-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="text-accent" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Topics you should focus on next.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <li key={suggestion.topic} className="flex items-start gap-3">
                        <div className="mt-1 flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                        <div>
                            <p className="font-semibold">{suggestion.topic}</p>
                            <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                        </div>
                    </li>
                  ))}
                  {aiSuggestions.length === 0 && (
                    <p className="text-sm text-muted-foreground">Start a quiz to get recommendations!</p>
                  )}
                </ul>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ProgressPageContent />
    </Suspense>
  )
}

