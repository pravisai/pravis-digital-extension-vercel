import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Droplet, Wind, Coffee, BrainCircuit } from "lucide-react";

const nudgeItems = [
    {
        icon: Droplet,
        title: "Stay Hydrated",
        description: "Time for a glass of water to keep your mind sharp.",
        color: "text-blue-400",
        shadow: "shadow-blue-400/20"
    },
    {
        icon: Wind,
        title: "Mindful Moment",
        description: "Take a few deep breaths. Inhale calm, exhale stress.",
        color: "text-purple-400",
        shadow: "shadow-purple-400/20"
    },
    {
        icon: Coffee,
        title: "Short Break",
        description: "Step away from your screen for a few minutes. Stretch your legs.",
        color: "text-yellow-400",
        shadow: "shadow-yellow-400/20"
    },
    {
        icon: BrainCircuit,
        title: "Refocus",
        description: "Check in with your main goal for today. Are you on track?",
        color: "text-green-400",
        shadow: "shadow-green-400/20"
    }
]

export function DailyRhythms() {
    return (
        <Card className="w-full shadow-lg border-primary/40 shadow-primary/10">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Zap className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle className="font-headline text-2xl">Daily Rhythms</CardTitle>
                        <CardDescription>Gentle nudges to support your well-being and focus throughout the day.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nudgeItems.map((nudge, index) => (
                        <Card key={index} className={`bg-card/50 hover:bg-card/80 transition-all transform hover:-translate-y-1 shadow-lg ${nudge.shadow}`}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                <div className={`p-2 bg-background rounded-full ${nudge.color}`}>
                                    <nudge.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="font-headline text-lg">{nudge.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{nudge.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
