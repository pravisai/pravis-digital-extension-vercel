
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send, User, Paperclip, Mic, Smile, Camera, Waves, X
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useChat } from "@/contexts/chat-context";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { PravisLogo } from "./pravis-logo";

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
    setAttachment,
  } = useChat();

  const [user, setUser] = useState<FirebaseUser | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { isRecording, transcript, startRecording, stopRecording } =
    useSpeechToText({
      onTranscriptReady: (text) => {
        setInput(text);
        setTimeout(() => {
          formRef.current?.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
        }, 100);
      },
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
      const viewport = scrollAreaRef.current.querySelector(
        "div[data-radix-scroll-area-viewport]"
      );
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading, attachmentPreview]);

  useEffect(() => {
    if (audioDataUri && audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch((e) =>
        console.error("Audio playback failed:", e)
      );
    }
  }, [audioDataUri]);

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !attachmentPreview) return;
    handleSendMessage(input);
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
  
  return (
<<<<<<< HEAD
    <div className="flex flex-col h-full bg-transparent">
      <header className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
        </div>
        {isMobile && isPanelOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPanelOpen(false)}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        )}
      </header>
=======
    <div className="flex flex-col h-full rounded-lg bg-transparent">
>>>>>>> 3dabb8b897697fd81238fef3f5fc7b737edf502e
      <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
        <div className="space-y-4 p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "pravis" && (
                <Avatar className="p-1.5 h-9 w-9">
                  <PravisLogo size={20} />
                </Avatar>
              )}
              <div className="flex flex-col">
                {message.role === 'pravis' && (
                    <span className="text-xs text-muted-foreground ml-3 mb-1">Pravis</span>
                )}
                 <div
                    className={cn(
                      "max-w-md",
                      message.role === "user"
                        ? "chat-bubble-user"
                        : "chat-bubble-pravis"
                    )}
                  >
                  {typeof message.content === "string" ? (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  ) : (
                    message.content
                  )}
                 </div>
              </div>
              {message.role === "user" && (
                <Avatar>
                  {user?.photoURL ? (
                    <AvatarImage
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                    />
                  ) : (
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3">
              <Avatar className="p-1.5 h-9 w-9">
                <PravisLogo size={20} />
              </Avatar>
              <div className="rounded-lg p-3 bg-secondary/50 animate-pulse">
                <div className="h-4 w-24 rounded-md bg-muted"></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
<<<<<<< HEAD
      <footer className="p-2">
=======
      <footer className="p-2 border-t">
>>>>>>> 3dabb8b897697fd81238fef3f5fc7b737edf502e
        {attachmentPreview && (
          <div className="p-2 relative w-fit">
            <img
              src={attachmentPreview}
              alt="attachment preview"
              className="h-20 w-20 object-cover rounded-md"
            />
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
          <div className="flex-1 flex items-center bg-transparent border border-primary/50 shadow-[0_0_8px_hsl(var(--primary)/0.5)] rounded-full px-2">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="shrink-0 rounded-full"
            >
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? "Listening..." : "Ready when you are"}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
              disabled={isLoading || isRecording}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="shrink-0 rounded-full"
              onClick={handleAttachmentClick}
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="shrink-0 rounded-full"
            >
              <Camera className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          {(input.trim() || attachmentPreview) ? (
            <Button
              type="submit"
              size="icon"
              className="rounded-full w-11 h-11 bg-primary text-primary-foreground shrink-0 transition-all duration-300"
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleMicClick}
              size="icon"
              className={cn(
                "rounded-full w-11 h-11 bg-primary text-primary-foreground shrink-0 transition-all duration-300",
                isRecording && "bg-destructive"
              )}
              disabled={isLoading}
            >
              {isRecording ? <Waves className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
        </form>
      </footer>
      <audio ref={audioRef} onEnded={() => setAudioDataUri(null)} className="hidden" />
    </div>
  );
}
