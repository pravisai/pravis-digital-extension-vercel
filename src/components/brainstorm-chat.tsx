"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User, Mic, Loader2, Waves } from "lucide-react"
import React, { useRef, useState, useEffect } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { facilitateCreativeBrainstorming, type FacilitateCreativeBrainstormingInput, type FacilitateCreativeBrainstormingOutput } from "@/ai/flows/facilitate-creative-brainstorming"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import { cn } from "@/lib/utils"
import { PravisLogo } from "./pravis-logo"
import { generateText } from "@/ai/openrouter";

enum Stage {
  Topic,
  Problem,
  Outcome,
  Constraints,
  Ready,
  InProgress,
  Done,
}

interface Message {
  role: "user" | "pravis";
  content: string | React.ReactNode;
}

const stagePrompts = {
  [Stage.Topic]: "First, what's the general topic for our brainstorming session?",
  [Stage.Problem]: "Got it. Now, what's the specific problem we're trying to solve?",
  [Stage.Outcome]: "Excellent. What's the desired outcome of this session? What does success look like?",
  [Stage.Constraints]: "Perfect. Are there any known constraints we should keep in mind? (e.g., budget, timeline). If not, just say 'no'.",
  [Stage.Ready]: "Great, I have everything I need. I'll start the brainstorming session now. This may take a moment...",
}

export function BrainstormChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage>(Stage.Topic);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formValues = useRef<Partial<FacilitateCreativeBrainstormingInput>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const { isRecording, transcript, startRecording, stopRecording } = useSpeechToText({
    onTranscriptReady: (text) => {
        setInput(text);
        setTimeout(() => formRef.current?.requestSubmit(), 100);
    }
  });

  useEffect(() => {
    if (transcript) {
        setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: "pravis", content: "Welcome to a 'Loud Think' session. Let's brainstorm together." },
        { role: "pravis", content: stagePrompts[Stage.Topic] }
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    
    let nextStage = stage + 1;

    switch (stage) {
      case Stage.Topic:
        formValues.current.topic = currentInput;
        break;
      case Stage.Problem:
        formValues.current.problemStatement = currentInput;
        break;
      case Stage.Outcome:
        formValues.current.desiredOutcome = currentInput;
        break;
      case Stage.Constraints:
        formValues.current.knownConstraints = currentInput.toLowerCase() === 'no' ? undefined : currentInput;
        break;
    }

    if (nextStage === Stage.Ready) {
      setIsLoading(true);
      setMessages(prev => [...prev, { role: "pravis", content: stagePrompts[Stage.Ready] }]);
      try {
          // Clarify/repair user input step-by-step (safer async way and TS-friendly)
    let repairedInput = { ...formValues.current };
    const entries = Object.entries(formValues.current);
    
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      if (!value || String(value).trim().length < 3) {
        const clarifier = `
    You are an AI brainstorming facilitator. The user gave: "${value}". 
    If it's vague, short, or unclear, rewrite it as a useful prompt for brainstorming.
    If still not fixable, suggest a follow-up or offer two likely options.
        `;
        // Cast to any here to satisfy TS index signature
        (repairedInput as any)[key] = await generateText(clarifier);
      }
    }
    
    // Now call the brainstorming function with repaired input
    const result = await facilitateCreativeBrainstorming(repairedInput as FacilitateCreativeBrainstormingInput);    
        // ----------- AGENTIC UPDATE END -------------

        const pravisResponse: Message = {
            role: "pravis",
            content: <BrainstormingResults results={result} />
        };
        setMessages(prev => [...prev, pravisResponse]);
        setStage(Stage.Done);

      } catch (error) {
        console.error("Error during brainstorming:", error);
        setMessages(prev => [...prev, { role: "pravis", content: "An error occurred during the brainstorming session. Please try again." }]);
      } finally {
        setIsLoading(false);
      }
    } else {
          if (stagePrompts[nextStage as keyof typeof stagePrompts]) {
    setMessages(prev => [
      ...prev,
      { role: "pravis", content: stagePrompts[nextStage as keyof typeof stagePrompts] }
    ]);
  }
  setStage(nextStage);
  
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const BrainstormingResults = ({ results }: { results: FacilitateCreativeBrainstormingOutput }) => (
    <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Brainstorming Session Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{results.brainstormingSession}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Potential Solutions</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                    {results.potentialSolutions.map((solution, i) => <li key={i}>{solution}</li>)}
                </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
                 <ul className="list-disc pl-5 space-y-1">
                    {results.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                </ul>
            </CardContent>
        </Card>
        {results.nextSteps && (
            <Card>
                <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{results.nextSteps}</p>
                </CardContent>
            </Card>
        )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-card shadow-sm">
        <header className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="p-1.5">
                    <PravisLogo size={30} />
                </Avatar>
                <div>
                    <h1 className="font-semibold text-lg">Loud Think</h1>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        AI-Powered Brainstorming
                    </p>
                </div>
            </div>
        </header>
        <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
            <div className="space-y-6 p-6">
            {messages.map((message, index) => (
                <div
                key={index}
                className={`flex items-start gap-4 ${
                    message.role === "user" ? "justify-end" : ""
                }`}
                >
                {message.role === "pravis" && (
                    <Avatar className="p-1.5">
                        <PravisLogo size={30} />
                    </Avatar>
                )}
                <div
                    className={`rounded-lg p-3 max-w-2xl ${
                    message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                >
                    {typeof message.content === 'string' ? (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      message.content
                    )}
                </div>
                {message.role === "user" && (
                    <Avatar>
                    {user?.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                    ) : (
                        <AvatarFallback><User /></AvatarFallback>
                    )}
                    </Avatar>
                )}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-center gap-4">
                <Avatar className="p-1.5">
                    <PravisLogo size={30} />
                </Avatar>
                <div className="rounded-lg p-3 bg-secondary animate-pulse">
                    <Loader2 className="animate-spin" />
                </div>
                </div>
            )}
            </div>
      </ScrollArea>
      <footer className="p-2 border-t">
        <form onSubmit={handleSendMessage} ref={formRef} className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-secondary rounded-full px-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isRecording ? "Listening..." : (stage === Stage.Done ? "Brainstorming session complete." : "Your response...")}
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                    disabled={isLoading || stage === Stage.Done || stage === Stage.Ready || isRecording}
                />
            </div>

            {input.trim() ? (
                <Button 
                    type="submit" 
                    size="icon" 
                    className="rounded-full w-12 h-12 bg-primary text-primary-foreground shrink-0 transition-all duration-300" 
                    disabled={isLoading || stage === Stage.Done || stage === Stage.Ready}
                >
                    <Send className="h-6 w-6" />
                </Button>
            ) : (
                 <Button 
                    type="button" 
                    size="icon" 
                    onClick={handleMicClick}
                    className={cn(
                        "rounded-full w-12 h-12 bg-primary text-primary-foreground shrink-0 transition-all duration-300",
                        isRecording && "bg-destructive"
                    )}
                    disabled={isLoading || stage === Stage.Done || stage === Stage.Ready}
                >
                   {isRecording ? <Waves className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
            )}
        </form>
      </footer>
    </div>
  )
}
