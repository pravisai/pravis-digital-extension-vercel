

"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send, ArrowLeft, PenSquare, User, BrainCircuit, RefreshCw, Mic, Waves } from 'lucide-react';
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getStoredAccessToken } from '@/lib/firebase/auth';
import { sendEmail } from '@/lib/gmail';
import { FadeIn } from '@/components/animations/fade-in';
import { Typewriter } from '@/components/animations/typewriter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { draftEmailReply, type DraftEmailReplyOutput } from '@/ai/flows/draft-email-reply';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { cn } from '@/lib/utils';

interface Message {
  role: "user" | "pravis";
  content: string | React.ReactNode;
}

const chatSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt cannot be empty." }),
});
type ChatFormValues = z.infer<typeof chatSchema>;

export default function ComposeEmailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<DraftEmailReplyOutput | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { prompt: '' },
  });

  const { isRecording, transcript, startRecording, stopRecording } = useSpeechToText({
    onTranscriptReady: (text) => {
        form.setValue("prompt", text);
        setTimeout(() => formRef.current?.requestSubmit(), 100);
    }
  });

  useEffect(() => {
    if (transcript) {
        form.setValue("prompt", transcript);
    }
  }, [transcript, form]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'pravis', content: "I'm ready to draft your email. Please provide the recipient, subject, and message content." }]);
    }
  }, [messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isDrafting]);


  const handleDraftEmail = async ({ prompt }: ChatFormValues) => {
    const userMessage: Message = { role: "user", content: prompt };
    setMessages(prev => [...prev, userMessage]);
    form.reset();
    setIsDrafting(true);
    setGeneratedDraft(null);

    const historyForApi = messages.map(msg => ({
        role: msg.role === 'pravis' ? 'model' : 'user',
        content: typeof msg.content === 'string' ? msg.content : "Structured message",
    }));

    try {
      const result = await draftEmailReply({ prompt, history: historyForApi });
      setGeneratedDraft(result);
      
      const pravisResponse: Message = { 
        role: "pravis", 
        content: (
            <div className="space-y-2 text-sm">
                <p>I've created a draft for you. You can revise it below or ask me for changes.</p>
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

  const handleRevise = () => {
    if (!generatedDraft) return;
    const revisionPrompt = `Revise the last draft. Recipient: ${generatedDraft.to}, Subject: ${generatedDraft.subject}, Body: ${generatedDraft.body}`;
    form.setValue("prompt", revisionPrompt);
  }

  const handleMicClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };
  
  return (
    <FadeIn className="h-full flex flex-col p-4 md:p-6 bg-background">
      <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 min-h-0">
        
        {/* Chat Section */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col bg-card border rounded-lg shadow-lg">
          <header className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold tracking-tight">Compose with Pravis</h1>
            </div>
          </header>
           <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
             <div className="space-y-6 p-4">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                        {message.role === "pravis" && <Avatar><AvatarFallback><BrainCircuit /></AvatarFallback></Avatar>}
                        <div className={`rounded-lg p-3 max-w-sm text-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
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
             <form ref={formRef} onSubmit={form.handleSubmit(handleDraftEmail)} className="flex items-center gap-2">
               <div className="flex-1 flex items-center bg-secondary rounded-full px-4">
                 <Input
                   {...form.register("prompt")}
                   placeholder={isRecording ? "Listening..." : "Send email to..."}
                   className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                   disabled={isDrafting || isRecording}
                 />
               </div>
               {form.watch('prompt') ? (
                 <Button type="submit" size="icon" className="rounded-full w-12 h-12" disabled={isDrafting}><Send className="h-6 w-6" /></Button>
               ) : (
                 <Button type="button" size="icon" onClick={handleMicClick} className={cn("rounded-full w-12 h-12", isRecording && "bg-destructive")} disabled={isDrafting}>
                   {isRecording ? <Waves className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                 </Button>
               )}
             </form>
           </footer>
        </div>

        {/* Email Preview Section */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col bg-card border rounded-lg shadow-lg overflow-hidden">
          <header className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Email Preview</h2>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleRevise} disabled={!generatedDraft || isDrafting || isSending}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Revise
                </Button>
                <Button onClick={handleSendEmail} disabled={!generatedDraft || isDrafting || isSending}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Send
                </Button>
            </div>
          </header>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {isDrafting && !generatedDraft ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-2"><span className="text-muted-foreground w-16 text-right">To:</span> <div className="h-6 w-1/2 bg-muted rounded animate-pulse" /></div>
                    <div className="flex items-center gap-2"><span className="text-muted-foreground w-16 text-right">Subject:</span> <div className="h-6 w-3/4 bg-muted rounded animate-pulse" /></div>
                    <div className="flex items-center gap-2"><span className="text-muted-foreground w-16 text-right">Tone:</span> <div className="h-6 w-1/4 bg-muted rounded animate-pulse" /></div>
                    <div className="mt-4 pt-4 border-t h-48 bg-muted rounded animate-pulse" />
                </div>
            ) : generatedDraft ? (
                <div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-muted-foreground w-16 text-right font-semibold">To:</span>
                        <p>{generatedDraft.to}</p>
                    </div>
                     <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-muted-foreground w-16 text-right font-semibold">Subject:</span>
                        <p className="font-semibold">{generatedDraft.subject}</p>
                    </div>
                     <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-muted-foreground w-16 text-right font-semibold">Tone:</span>
                        <p className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs">{generatedDraft.tone}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                        <p className="whitespace-pre-wrap">{generatedDraft.body}</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                    <div>
                        <PenSquare className="h-12 w-12 mx-auto" />
                        <p className="mt-4">Your generated email will appear here.</p>
                    </div>
                </div>
            )}
          </div>
        </div>

      </div>
    </FadeIn>
  );
}

