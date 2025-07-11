
"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/chat-context';
import { Send, Mic, Smile, Paperclip, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PersistentChatInput() {
  const { input, setInput, handleSendMessage, isLoading } = useChat();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 p-2 backdrop-blur-sm border-t border-border">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-secondary rounded-full px-2">
            <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
                <Smile className="h-6 w-6 text-muted-foreground" />
            </Button>
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Pravis..."
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                disabled={isLoading}
            />
            <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
                <Paperclip className="h-6 w-6 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" type="button" className="shrink-0 rounded-full">
                <Camera className="h-6 w-6 text-muted-foreground" />
            </Button>
        </div>
        <Button 
            type="submit" 
            size="icon" 
            className="rounded-full w-12 h-12 bg-primary text-primary-foreground shrink-0 transition-all duration-300" 
            disabled={isLoading}
        >
            {input.trim() ? <Send className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
      </form>
    </div>
  );
}
