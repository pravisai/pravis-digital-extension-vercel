
"use client";

import { InteractivePyramid, type PyramidFace } from "@/components/interactive-pyramid";
import { FadeIn } from "@/components/animations/fade-in";
import { MessageSquare, Phone, BrainCircuit } from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { cn } from "@/lib/utils";
import { DashboardPageLayout } from "@/components/dashboard-page-layout";

const interactionModes: PyramidFace[] = [
  {
    id: "chat",
    title: "Chat with me",
    icon: MessageSquare,
    href: "/dashboard/creative-partner/chat",
    position: "front"
  },
  {
    id: "call",
    title: "Call me",
    icon: Phone,
    href: "#", // Placeholder
    position: "right"
  },
  {
    id: "train",
    title: "Train me",
    icon: BrainCircuit,
    href: "#", // Placeholder
    position: "back"
  }
];

export default function CreativePartnerPage() {
    const { isPanelOpen } = useChat();
    return (
        <DashboardPageLayout>
            <FadeIn className="h-full flex flex-col items-center justify-center p-4 md:p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Loud Think</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Choose how you want to interact with Pravis.</p>
                </div>
                <InteractivePyramid faces={interactionModes} size={isPanelOpen ? 'small' : 'default'} />
            </FadeIn>
        </DashboardPageLayout>
    )
}
