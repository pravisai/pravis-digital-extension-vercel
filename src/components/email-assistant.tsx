

"use client"

import React, { useEffect } from 'react'
import {
  Inbox,
  PenSquare,
  Send,
  Star,
  Trash2,
  FileText,
  Mail,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { InteractiveCube, type CubeFace } from './interactive-cube'
import { Typewriter } from './animations/typewriter'
import { useIntent } from '@/contexts/intent-context'
import { cn } from '@/lib/utils'
import { useChat } from '@/contexts/chat-context'


const emailCubeFaces: CubeFace[] = [
    { id: "Inbox", href: "/dashboard/email-assistant/inbox", icon: Inbox, label: "Inbox", description: "View your incoming mail", face: "front", colorClass: "neon-purple" },
    { id: "All Mail", href: "/dashboard/email-assistant/inbox", icon: Mail, label: "All Mail", description: "View all fetched mail", face: "right", colorClass: "electric-blue" },
    { id: "Sent", href: "/dashboard/email-assistant/inbox", icon: Send, label: "Sent", description: "View your sent mail", face: "back", colorClass: "bright-pink" },
    { id: "Drafts", href: "/dashboard/email-assistant/inbox", icon: FileText, label: "Drafts", description: "View your drafts", face: "left", colorClass: "acid-green" },
    { id: "Starred", href: "/dashboard/email-assistant/inbox", icon: Star, label: "Starred", description: "View starred messages", face: "top", colorClass: "neon-purple" },
    { id: "Compose", href: "/dashboard/email-assistant/compose", icon: PenSquare, label: "Compose", description: "Write a new email", face: "bottom", colorClass: "electric-blue" },
];

interface EmailAssistantContentProps {
  size?: 'default' | 'small';
}

export function EmailAssistantContent({ size = 'default' }: EmailAssistantContentProps) {
  const router = useRouter();
  const { intent, clearIntent } = useIntent();
  const { isPanelOpen } = useChat();

  // Handle intent-based navigation
  useEffect(() => {
    if (intent?.action === 'navigateToEmailCompose') {
      router.push('/dashboard/email-assistant/compose');
      // The intent is cleared in the compose page after it's used
    }
  }, [intent, router]);

  const handleFaceClick = (id: string) => {
    const face = emailCubeFaces.find(f => f.id === id);
    if (face?.href) {
      router.push(face.href);
    }
  }

  const enhancedEmailCubeFaces = emailCubeFaces.map(face => ({
    ...face,
    onClick: handleFaceClick,
  }));

  return (
    <div className={cn(
        "h-full w-full flex flex-col items-center justify-center text-foreground bg-background p-4 md:p-8 space-y-6 transition-all duration-300",
        isPanelOpen ? "pb-32 md:pb-8" : "pb-32 md:pb-0"
    )}>
      <div className="text-center">
        <Typewriter text="Welcome back. Shall I prepare your environment?" className="text-3xl md:text-4xl font-bold tracking-tight justify-center" />
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">Interact with the cube below to access different parts of your inbox or compose a new message.</p>
      </div>
      <InteractiveCube faces={enhancedEmailCubeFaces} size={size} />
    </div>
  )
}
