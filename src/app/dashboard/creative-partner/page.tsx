
"use client";

import { InteractivePyramid, type PyramidFace } from "@/components/interactive-pyramid";
import { FadeIn } from "@/components/animations/fade-in";
import { MessageSquare, Phone, BrainCircuit, Zap } from "lucide-react";

const interactionModes: PyramidFace[] = [
  {
    id: "chat",
    title: "Chat with me",
    description: "Start a creative brainstorming session.",
    icon: MessageSquare,
    href: "/dashboard/creative-partner/chat",
  },
  {
    id: "call",
    title: "Call me",
    description: "Engage in a voice conversation.",
    icon: Phone,
    href: "#", // Placeholder
  },
  {
    id: "train",
    title: "Train me",
    description: "Personalize responses for you.",
    icon: BrainCircuit,
    href: "#", // Placeholder
  },
  {
    id: "future",
    title: "Future Feature",
    description: "A new way to interact is coming soon.",
    icon: Zap,
    href: "#", // Placeholder
  }
];

export default function CreativePartnerPage() {
    return (
        <FadeIn className="h-full flex flex-col items-center justify-center p-4 md:p-8 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Loud Think</h1>
                <p className="text-muted-foreground mt-2 text-lg">Choose how you want to interact with Pravis.</p>
            </div>
            <InteractivePyramid faces={interactionModes} />
        </FadeIn>
    )
}
