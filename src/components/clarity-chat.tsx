"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, Send, User, Paperclip, Mic, Smile, Camera, Waves, X } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useChat } from "@/contexts/chat-context";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

// === Agentic Intent Parser ===
function parseUIIntent(input: string) {
  const v = input.toLowerCase().trim();

  // Navigation for email composer:
  if (
    v.startsWith("open the email composer") ||
    v.startsWith("compose email") ||
    v.startsWith("go to email")
  ) {
    return { intent: "navigate", target: "/dashboard/email-assistant/compose" };
  }
  // Navigation for calendar:
  if (v.includes("calendar")) {
    return { intent: "navigate", target: "/dashboard/calendar" };
  }
  // Navigation for dashboard:
  if (v.includes("dashboard")) {
    return { intent: "navigate", target: "/dashboard" };
  }
  return null;
}

// ===== Main Chat UI Component =====

export function ClarityChat() {
  const {
    messages,
    isLoading,
    input,
    setInput,
    handleSendMessage,
    audioDataUri,
    setAudioDataUri,
    attachmentPreview,
    setAttachment
  } = useChat();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { isRecording, transcript, startRecording, stopRecording } = useSpeechToText({
    onTranscriptReady: (text) => {
      setInput(text);
      setTimeout(() => {
        formRef.current?.dispatchEvent(new CustomEvent('submit-voice', { bubbles: true }));
      }, 100);
    }
  });

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading, attachmentPreview]);

  useEffect(() => {
    if (audioDataUri && audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [audioDataUri]);

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // === MAIN FORM SUBMIT HANDLER - AGENTIC LOGIC ADDED ===
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const navIntent = parseUIIntent(input);
    if (navIntent && navIntent.intent === "navigate") {
      router.push(navIntent.target);
      setInput("");
      return;
    }

    handleSendMessage(e, false);
  };

  const handleVoiceSubmit = (e: React.FormEvent) => {
    handleSendMessage(e, true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const form = formRef.current;
    form?.addEventListener('submit-voice', handleVoiceSubmit);
    return () => {
      form?.removeEventListener('submit-voice', handleVoiceSubmit);
    };
  }, [handleVoiceSubmit]);

  return (
    <div className="flex flex-col h-full bg-card shadow-sm">
      <header className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback><BrainCircuit /></AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg">Pravis AI</h1>
            <p className="text-xs text-chart-4 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-chart-4 inline-block"></span>
              Online
            </p>
          </div>
        </div>
      </header>
      <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
        <div className="space-y-6 p-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}
            >
              {message.role === "pravis" && (
                <Avatar>
                  <AvatarFallback><BrainCircuit /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-md ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {typeof message.content === 'string'
                  ? <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  : message.content}
              </div>
              {message.role === "user" && (
                <Avatar>
                  {user?.photoURL
                    ? <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                    : <AvatarFallback><User /></AvatarFallback>}
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback><BrainCircuit className="animate-pulse" /></AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-secondary animate-pulse">
                <div className="h-4 w-24 rounded-md bg-muted"></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <footer className="p-2 border-t">
        {attachmentPreview && (
          <div className="p-2 relative w-fit">
            <img src={attachmentPreview} alt="attachment preview" className="h-20 w-20 object-cover rounded-md" />
            <Button 
              size="icon" 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => setAttachment(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleFormSubmit} ref={formRef} className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-secondary rounded-full px-2">
            <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
              <Smile className="h-6 w-6 text-muted-foreground" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? "Listening..." : "Shall we begin, sir?"}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
              disabled={isLoading || isRecording}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full" onClick={handleAttachmentClick}>
              <Paperclip className="h-6 w-6 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </Button>
          </div>
          {(input.trim() || attachmentPreview) ? (
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full w-12 h-12 bg-primary text-primary-foreground shrink-0 transition-all duration-300" 
              disabled={isLoading}
            >
              <Send className="h-6 w-6" />
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={handleMicClick} 
              size="icon" 
              className={cn(
                "rounded-full w-12 h-12 bg-primary text-primary-foreground shrink-0 transition-all duration-300",
                isRecording && "bg-destructive"
              )} 
              disabled={isLoading}
            >
              {isRecording ? <Waves className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          )}
        </form>
      </footer>
      <audio ref={audioRef} onEnded={() => setAudioDataUri(null)} className="hidden" />
    </div>
  );
}
