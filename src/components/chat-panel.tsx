
"use client"

import React from 'react';
import { ChevronDown } from 'lucide-react';

import { ClarityChat } from '@/components/clarity-chat';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { useChat } from '@/contexts/chat-context';

export function ChatPanel() {
  const { isPanelOpen, setPanelOpen } = useChat();

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
        isPanelOpen ? 'h-[70%]' : 'h-0'
      )}
    >
        <Card className="flex-1 flex flex-col rounded-t-2xl overflow-hidden border-t border-border/50">
            <button
                onClick={() => setPanelOpen(false)}
                className="w-full py-2 flex justify-center items-center cursor-pointer bg-card hover:bg-accent transition-colors"
                aria-label={'Collapse chat panel'}
            >
                <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </button>
            <div className={cn("flex-1 min-h-0", !isPanelOpen && "hidden")}>
                <ClarityChat />
            </div>
        </Card>
    </div>
  );
}
