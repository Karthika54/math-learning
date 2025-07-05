
'use client';

import { useState } from 'react';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiChatbotAssistant, AiChatbotAssistantInput } from '@/ai/flows/ai-chatbot-assistant';
import { cn } from '@/lib/utils';
import { useSettings } from '@/context/SettingsContext';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { grade } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: AiChatbotAssistantInput = {
        question: input,
        studentGrade: Number(grade),
        topic: 'General Math', // This could be dynamic based on current page
      };
      const result = await aiChatbotAssistant(chatInput);
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with AI assistant:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-transform duration-300 ease-in-out", isOpen ? "translate-x-[200%]" : "translate-x-0")}>
        <Button size="icon" className="rounded-full w-16 h-16 shadow-lg" onClick={() => setIsOpen(true)}>
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open AI Chat Assistant</span>
        </Button>
      </div>
      <div
        className={cn(
          'fixed bottom-4 right-4 z-50 w-full max-w-md transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-[120%]'
        )}
      >
        <Card className="flex flex-col h-[60vh] neumorphism-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline">AI Math Assistant</CardTitle>
                <CardDescription>Ask me anything!</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-2',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg p-3 text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      )}
                    >
                      {message.content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                     <div className="bg-secondary rounded-lg p-3 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your math question..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
