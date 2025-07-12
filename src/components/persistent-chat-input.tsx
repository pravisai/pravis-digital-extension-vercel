
"use client"

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/chat-context';
import { Send, Mic, BrainCircuit, Paperclip, Camera, Waves } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { cn } from '@/lib/utils';

export function PersistentChatInput() {
  const { input, setInput, handleSendMessage, isLoading, setPanelOpen } = useChat();
  const formRef = useRef<HTMLFormElement>(null);

  const { isRecording, transcript, startRecording, stopRecording } = useSpeechToText({
    onTranscriptReady: (text) => {
        setInput(text);
        // Automatically submit the form once transcription is ready
        setTimeout(() => formRef.current?.requestSubmit(), 100);
    }
  });

  useEffect(() => {
    if (transcript) {
        setInput(transcript);
    }
  }, [transcript]);

  const handleFocus = () => {
    setPanelOpen(true);
  }

  const handleMicClick = () => {
    setPanelOpen(true);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 p-2 backdrop-blur-sm border-t border-border">
      <form onSubmit={handleSendMessage} ref={formRef} className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-secondary rounded-full px-2">
            <Avatar className="h-9 w-9 ml-1 border-2 border-primary/50">
              <AvatarFallback className="bg-transparent">
                <BrainCircuit className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={handleFocus}
                placeholder={isRecording ? "Listening..." : "Message Pravis..."}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                disabled={isLoading || isRecording}
            />
            <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
                <Paperclip className="h-6 w-6 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
                <Camera className="h-6 w-6 text-muted-foreground" />
            </Button>
        </div>
         {input.trim() ? (
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
    </div>
  );
}
