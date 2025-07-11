
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/fade-in";
import { MessageSquare, Phone, BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const interactionModes = [
  {
    title: "Chat with me",
    description: "Start a creative brainstorming session or get clarity through text.",
    icon: MessageSquare,
    href: "/dashboard/creative-partner/chat",
    cta: "Start Chatting",
  },
  {
    title: "Call me",
    description: "Engage in a voice conversation for a more natural interaction.",
    icon: Phone,
    href: "#", // Placeholder
    cta: "Start a Call",
  },
  {
    title: "Train me",
    description: "Help Pravis learn and personalize its responses for you.",
    icon: BrainCircuit,
    href: "#", // Placeholder
    cta: "Begin Training",
  }
];

export default function CreativePartnerPage() {
    return (
        <FadeIn className="h-full flex flex-col items-center justify-center p-4 md:p-8 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Loud Think</h1>
                <p className="text-muted-foreground mt-2 text-lg">Choose how you want to interact with Pravis.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {interactionModes.map((mode) => (
                    <Card key={mode.title} className="flex flex-col text-center hover:border-primary hover:shadow-lg transition-all duration-300">
                        <CardHeader className="items-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <mode.icon className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{mode.title}</CardTitle>
                            <CardDescription>{mode.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end justify-center">
                            <Button asChild className="w-full">
                                <Link href={mode.href}>
                                    {mode.cta} <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </FadeIn>
    )
}
