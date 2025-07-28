
"use client"

import React from 'react';
import { EmailAssistantContent } from "@/components/email-assistant";
import { EmailProvider } from '@/contexts/email-context';
import { FadeIn } from "@/components/animations/fade-in";
import { useChat } from '@/contexts/chat-context';

export default function EmailAssistantPage() {
  const { isPanelOpen } = useChat();
  return (
    <FadeIn className="h-full w-full">
        <EmailAssistantContent size={isPanelOpen ? 'small' : 'default'} />
    </FadeIn>
  );
}
