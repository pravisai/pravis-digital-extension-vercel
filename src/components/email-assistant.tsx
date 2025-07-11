

"use client"

import React from 'react'
import {
  Inbox,
  PenSquare,
  Send,
  Star,
  Trash2,
  FileText,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { InteractiveCube, type CubeFace } from './interactive-cube'


const emailCubeFaces: CubeFace[] = [
    { id: "Inbox", href: "/dashboard/email-assistant/inbox", icon: Inbox, label: "Inbox", description: "View your incoming mail", face: "front", colorClass: "neon-purple" },
    { id: "Starred", href: "/dashboard/email-assistant/inbox", icon: Star, label: "Starred", description: "View starred messages", face: "right", colorClass: "electric-blue" },
    { id: "Sent", href: "/dashboard/email-assistant/inbox", icon: Send, label: "Sent", description: "View your sent mail", face: "back", colorClass: "bright-pink" },
    { id: "Drafts", href: "/dashboard/email-assistant/inbox", icon: FileText, label: "Drafts", description: "View your drafts", face: "left", colorClass: "acid-green" },
    { id: "Trash", href: "/dashboard/email-assistant/inbox", icon: Trash2, label: "Trash", description: "View trashed messages", face: "top", colorClass: "neon-purple" },
    { id: "Compose", href: "/dashboard/email-assistant/inbox", icon: PenSquare, label: "Compose", description: "Write a new email", face: "bottom", colorClass: "electric-blue" },
];


export function EmailAssistantContent() {
  const router = useRouter();

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
    <div className="h-full w-full flex flex-col text-foreground bg-background p-4 md:p-8 space-y-6">
      <InteractiveCube faces={enhancedEmailCubeFaces} />
    </div>
  )
}
