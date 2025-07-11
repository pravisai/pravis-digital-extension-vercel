

"use client"

import React from 'react';
import { EmailAssistantContent } from "@/components/email-assistant";
import { EmailProvider } from '@/contexts/email-context';
import { FadeIn } from "@/components/animations/fade-in";

export default function EmailAssistantPage() {
  return (
    <FadeIn className="h-full w-full">
      <EmailProvider>
        <EmailAssistantContent />
      </EmailProvider>
    </FadeIn>
  );
}
