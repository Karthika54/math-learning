
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { quizzes, topics, Question } from '@/lib/data';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowLeft, Loader2, BookX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"

type FeedbackState = 'correct' | 'incorrect' | null;

function QuizComponent() {
  const params = useParams<{ topic: string }>();
  const searchParams = useSearchParams();
  const level = searchParams.get('level');
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);

  const topicInfo = useMemo(() => topics.find((t) => t.id === params.topic), [params.topic]);
  
  const questions = useMemo(() => {
    const allQuestions = quizzes[params.topic] || [];
    if (level) {
      return allQuestions.filter(q => String(q.level) === level);
    }
    return [];
  }, [params.topic, level]);

  const topicId = params.topic;

  useEffect(() => {
    if (quizEnded && level && topicId) {
      try {
        const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
        if (!completedQuizzes[topicId]) {
          completedQuizzes[topicId] = [];
        }
        if (!completedQuizzes[topicId].includes(level)) {
            completedQuizzes[topicId].push(level);
        }
        localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
      } catch (error) {
        console.error("Could not update quiz completion status.", error);
      }
    }
  }, [quizEnded, topicId, level]);

  useEffect(() => {
    if (!topicInfo) {
      notFound();
    }
  }, [topicInfo]);

  if (!topicInfo) {
    return null;
  }
  
  const currentQuestion: Question | undefined = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion) return;

    if (!selectedAnswer) {
        toast({ title: "Oops!", description: "Please select an answer before submitting.", variant: "destructive" });
        return;
    };

    const isCorrect = String(selectedAnswer).toLowerCase() === String(currentQuestion.answer).toLowerCase();
    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setSelectedAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizEnded(false);
    setFeedback(null);
    setSelectedAnswer('');
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <Link href={`/app/topic/${params.topic}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Topic Levels
      </Link>
      <Card className="neumorphism-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl">{topicInfo.name} Quiz - Level {level}</CardTitle>
              <CardDescription>Test your knowledge on {topicInfo.name.toLowerCase()}.</CardDescription>
            </div>
            {questions.length > 0 && !quizEnded && <div className="text-lg font-bold">Score: {score}</div>}
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
             <div className="text-center py-10 flex flex-col items-center">
                <BookX className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold font-headline mb-2">Quiz Coming Soon!</h2>
                <p className="text-muted-foreground mb-6">There are no questions for this level yet. Please check back later.</p>
                <Button variant="outline" asChild>
                    <Link href={`/app/topic/${params.topic}`}>Back to Topic</Link>
                </Button>
            </div>
          ) : !quizEnded ? (
            <div>
              <Progress value={progress} className="mb-6 h-2" />
              {currentQuestion && (
                <>
                <div className="mb-6">
                  <p className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                  <p className="text-xl">{currentQuestion.text}</p>
                </div>

                <form onSubmit={handleAnswerSubmit}>
                  {currentQuestion.type === 'mcq' && currentQuestion.options && (
                    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-2" disabled={!!feedback}>
                      {currentQuestion.options.map((option, index) => (
                        <Label key={index} className="flex items-center gap-3 border rounded-md p-4 hover:bg-secondary has-[:checked]:bg-secondary has-[:checked]:border-primary transition-colors">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <span>{option}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQuestion.type === 'numeric' && (
                    <Input 
                      type="number" 
                      step="any"
                      value={selectedAnswer} 
                      onChange={(e) => setSelectedAnswer(e.target.value)} 
                      className="text-lg h-12"
                      disabled={!!feedback}
                    />
                  )}

                  {!feedback && <Button type="submit" className="mt-6 w-full">Submit Answer</Button>}
                </form>
                </>
              )}

              {feedback && currentQuestion && (
                <div 
                  className={cn(
                    "mt-6 p-4 rounded-md flex flex-col items-start gap-4 animate-in fade-in scale-95",
                    feedback === 'correct' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                  )}
                >
                  <div className="flex items-center gap-4 w-full">
                    {feedback === 'correct' ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">{feedback === 'correct' ? 'Correct!' : 'Not quite!'}</h3>
                      <p>The correct answer is: {currentQuestion.answer}</p>
                    </div>
                    <Button onClick={handleNextQuestion}>Next Question</Button>
                  </div>
                   {feedback === 'incorrect' && (
                    <div className="border-t border-red-300 w-full pt-3 mt-2 text-center text-sm">
                        <p>Stuck on this problem? Ask the AI Assistant in the bottom right corner for a step-by-step explanation!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-3xl font-bold font-headline mb-2">Level Complete!</h2>
              <p className="text-muted-foreground mb-6">Great job on finishing the quiz.</p>
              <p className="text-5xl font-bold mb-8">Your score: <span className="text-primary">{score} / {questions.length}</span></p>
              <div className="flex justify-center gap-4">
                <Button onClick={resetQuiz}>Try Again</Button>
                <Button variant="outline" asChild>
                  <Link href={`/app/topic/${params.topic}`}>Choose Another Level</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function QuizPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <QuizComponent />
    </Suspense>
  )
}
