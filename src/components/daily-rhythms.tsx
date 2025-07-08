
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, MessageSquare, Timer } from "lucide-react";
import Link from "next/link";

const statCards = [
  {
    title: "Tasks Completed",
    value: "24",
    icon: CheckCircle2,
    href: "/dashboard/creative-partner"
  },
  {
    title: "Emails Processed",
    value: "156",
    icon: Mail,
    href: "/dashboard/email-assistant"
  },
  {
    title: "AI Conversations",
    value: "42",
    icon: MessageSquare,
    href: "/dashboard/clarity-chat"
  },
  {
    title: "Time Saved",
    value: "3.2h",
    icon: Timer,
    href: "#"
  },
]

export function DailyRhythms() {
    return (
        <section>
            <h1 className="text-4xl font-bold text-primary mb-10 drop-shadow-neon-primary font-headline">
                Pravis Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <Link href={card.href} key={card.title}>
                        <Card className="bg-card border-border rounded-2xl shadow-sm hover:shadow-neon-primary transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <card.icon className="text-primary w-7 h-7" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">{card.title}</p>
                                        <p className="text-2xl font-semibold">{card.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}
