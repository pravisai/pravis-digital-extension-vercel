
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Send, ArrowLeft, BrainCircuit, Sparkles, X, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getStoredAccessToken } from '@/lib/firebase/auth';
import { sendEmail } from '@/lib/gmail';
import { FadeIn } from '@/components/animations/fade-in';
import { draftEmailReply } from '@/ai/flows/draft-email-reply';
import { useIntent } from '@/contexts/intent-context';
import { Card, CardContent } from '@/components/ui/card';

export default function ComposeEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { intent, clearIntent } = useIntent();

  const prefillTo = searchParams.get("to") || "";
  const prefillSubject = searchParams.get("subject") || "";
  const prefillBody = searchParams.get("body") || "";

  useEffect(() => {
    let handled = false;
    if (intent?.action === 'navigateToEmailCompose') {
      const { to, subject, body } = intent.params;
      if (to) setTo(to);
      if (subject) setSubject(subject);
      if (body) setBody(body);
      clearIntent();
      handled = true;
    }
    
    // Only prefill from URL if intent didn't handle it
    if (!handled) {
      if (prefillTo) setTo(prefillTo);
      if (prefillSubject) setSubject(prefillSubject);
      if (prefillBody) setBody(prefillBody);
    }
  }, [intent, clearIntent, prefillTo, prefillSubject, prefillBody]);


  const handleGenerateWithPravis = async () => {
    if (!aiPrompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please provide instructions for Pravis.',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await draftEmailReply({ prompt: aiPrompt });
      setTo(prev => prev || result.to);
      setSubject(result.subject);
      setBody(result.body);
    } catch (error) {
      console.error("Failed to generate with Pravis:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate email content. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!to || !subject || !body) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in the To, Subject, and Body fields.',
      });
      return;
    }
    setIsSending(true);
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'Please refresh the page and sign in again.' });
      setIsSending(false);
      return;
    }

    try {
      await sendEmail(accessToken, to, subject, body);
      toast({ title: 'Email Sent!', description: `Your message to ${to} has been sent successfully.` });
      router.push('/dashboard/email-assistant/inbox');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sending Failed', description: error.message });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleDiscard = () => {
    setTo('');
    setSubject('');
    setBody('');
    setAiPrompt('');
    toast({ title: 'Draft Discarded' });
    router.back();
  }

  return (
    <FadeIn className="h-full flex flex-col bg-background">
      <div className="flex-1 flex flex-col bg-card border-l border-r rounded-t-lg shadow-lg min-h-0 max-w-5xl w-full mx-auto">
        <header className="p-3 border-b flex items-center justify-between bg-muted/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-medium">New Message</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
                <Label htmlFor="to" className="text-muted-foreground">To</Label>
                <Input
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipient"
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent flex-1"
                />
            </div>
             <div className="flex items-center gap-2 border-b pb-2">
                <Label htmlFor="subject" className="text-muted-foreground">Subject</Label>
                <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent flex-1"
                />
            </div>
            
            <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compose your email..."
                className="flex-1 h-96 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base"
            />
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      <Label htmlFor="ai-prompt" className="font-semibold text-primary">Generate with Pravis</Label>
                  </div>
                  <Textarea
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., Write a follow-up email to John about our meeting last week and ask for the documents."
                    className="bg-background/50"
                  />
                  <div className="flex justify-end">
                      <Button onClick={handleGenerateWithPravis} disabled={isGenerating} size="sm" variant="secondary">
                          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Generate
                      </Button>
                  </div>
              </CardContent>
            </Card>

        </div>

        <footer className="p-4 border-t flex justify-between items-center">
          <Button onClick={handleSendEmail} disabled={isSending || isGenerating}>
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDiscard}>
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Discard draft</span>
          </Button>
        </footer>
      </div>
    </FadeIn>
  );
}
