
"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ClarityChat } from '@/components/clarity-chat';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
        isOpen ? 'h-[85%]' : 'h-16'
      )}
    >
        <Card className="flex-1 flex flex-col rounded-t-2xl overflow-hidden border-t border-border/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-2 flex justify-center items-center cursor-pointer bg-card hover:bg-accent transition-colors"
                aria-label={isOpen ? 'Collapse chat panel' : 'Expand chat panel'}
            >
                {isOpen ? <ChevronDown className="h-6 w-6 text-muted-foreground" /> : <ChevronUp className="h-6 w-6 text-muted-foreground" />}
            </button>
            <div className={cn("flex-1 min-h-0", !isOpen && "hidden")}>
                <ClarityChat />
            </div>
        </Card>
    </div>
  );
}
