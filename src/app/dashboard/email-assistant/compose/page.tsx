

"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send, ArrowLeft, BrainCircuit, User, Mic, Waves } from 'lucide-react';
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getStoredAccessToken } from '@/lib/firebase/auth';
import { sendEmail } from '@/lib/gmail';
import { FadeIn } from '@/components/animations/fade-in';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { draftEmailReply, type DraftEmailReplyOutput } from '@/ai/flows/draft-email-reply';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { cn } from '@/lib/utils';
import { Typewriter } from '@/components/animations/typewriter';

interface Message {
  role: "user" | "pravis";
  content: string | React.ReactNode;
}

const initialMessage: Message = { role: 'pravis', content: "I'm ready to draft your email. Please provide the recipient, subject, and message content. For example: 'Send email to test@example.com about our meeting tomorrow, in a formal tone.'" };

export default function ComposeEmailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [input, setInput] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState<DraftEmailReplyOutput | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isDrafting]);


  const handleDraftEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    const currentInput = input;
    setInput('');
    
    setIsDrafting(true);
    setGeneratedDraft(null);

    const historyForApi = newMessages
        .map(msg => ({
            role: msg.role === 'pravis' ? 'model' : 'user',
            content: typeof msg.content === 'string' ? msg.content : "Okay, I've drafted that for you. What's next?",
        }));

    try {
      const result = await draftEmailReply({ prompt: currentInput, history: historyForApi.slice(0, -1) });
      setGeneratedDraft(result);
      
      const pravisResponse: Message = { 
        role: "pravis", 
        content: (
            <div className="space-y-4 text-sm">
                <p>I've created a draft for you. You can revise it below or ask me for changes.</p>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <p className="font-semibold">To: <span className="font-normal">{result.to}</span></p>
                    <p className="font-semibold">Subject: <span className="font-normal">{result.subject}</span></p>
                    <p className="font-semibold">Tone: <span className="font-normal">{result.tone}</span></p>
                    <hr className="my-2 border-border/50" />
                    <p className="whitespace-pre-wrap">{result.body}</p>
                </div>
                <p className="text-xs text-muted-foreground">*Type "send" to dispatch this email or "revise" with your changes.*</p>
            </div>
        )
      };
      setMessages(prev => [...prev, pravisResponse]);

    } catch (error) {
      console.error("Failed to draft email:", error);
      const errorMessage = { role: 'pravis', content: 'Sorry, I encountered an error while drafting the email. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to draft email. Please try again.",
      });
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSendEmail = async () => {
    if (!generatedDraft) {
        toast({ variant: 'destructive', title: 'No Draft', description: 'Please generate a draft first.' });
        return;
    }
    
    setIsSending(true);
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      toast({ variant: 'destructive', title: 'Auth Error', description: 'Please refresh the page.' });
      setIsSending(false);
      return;
    }

    try {
      await sendEmail(accessToken, generatedDraft.to, generatedDraft.subject, generatedDraft.body);
      toast({ title: 'Email Sent!', description: `Your message to ${generatedDraft.to} has been sent.` });
      router.push('/dashboard/email-assistant');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sending Failed', description: error.message });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleMicClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };
  
  return (
    <FadeIn className="h-full flex flex-col p-4 md:p-6 bg-background">
        <div className="flex-1 flex flex-col bg-card border rounded-lg shadow-lg min-h-0">
          <header className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold tracking-tight">Compose with Pravis</h1>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleSendEmail} disabled={!generatedDraft || isDrafting || isSending}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Send
                </Button>
            </div>
          </header>
           <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
             <div className="space-y-6 p-4">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                        {message.role === "pravis" && <Avatar><AvatarFallback><BrainCircuit /></AvatarFallback></Avatar>}
                        <div className={`rounded-lg p-3 max-w-2xl text-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                            {typeof message.content === 'string' ? <p className="whitespace-pre-wrap">{message.content}</p> : message.content}
                        </div>
                        {message.role === "user" && <Avatar>{user?.photoURL ? <AvatarImage src={user.photoURL} /> : <AvatarFallback><User /></AvatarFallback>}</Avatar>}
                    </div>
                ))}
                {isDrafting && (
                  <div className="flex items-start gap-3">
                    <Avatar><AvatarFallback><BrainCircuit className="animate-pulse" /></AvatarFallback></Avatar>
                    <div className="rounded-lg p-3 bg-secondary animate-pulse"><Loader2 className="animate-spin" /></div>
                  </div>
                )}
             </div>
           </ScrollArea>
           <footer className="p-2 border-t">
             <form ref={formRef} onSubmit={handleDraftEmail} className="flex items-center gap-2">
               <div className="flex-1 flex items-center bg-secondary rounded-full px-4">
                 <Input
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder={isRecording ? "Listening..." : "Send email to..."}
                   className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                   disabled={isDrafting || isRecording}
                 />
               </div>
               {input ? (
                 <Button type="submit" size="icon" className="rounded-full w-12 h-12" disabled={isDrafting}><Send className="h-6 w-6" /></Button>
               ) : (
                 <Button type="button" size="icon" onClick={handleMicClick} className={cn("rounded-full w-12 h-12", isRecording && "bg-destructive")} disabled={isDrafting}>
                   {isRecording ? <Waves className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                 </Button>
               )}
             </form>
           </footer>
        </div>
    </FadeIn>
  );
}
