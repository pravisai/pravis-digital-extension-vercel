
"use client"

import { BrainCircuit, Calendar, Mail, Share2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const hudButtons = [
    {
        href: "/dashboard/clarity-chat",
        icon: BrainCircuit,
        title: "Loud Think",
        color: "group-hover:text-cyan-300",
    },
    {
        href: "/dashboard/calendar",
        icon: Calendar,
        title: "Calendar",
        color: "group-hover:text-cyan-300",
    },
    {
        href: "/dashboard/social-media",
        icon: Share2,
        title: "Socials",
        color: "group-hover:text-cyan-300",
    },
    {
        href: "/dashboard/email-assistant",
        icon: Mail,
        title: "Email Assistant",
        color: "group-hover:text-cyan-300",
    },
];

export function DailyRhythms() {
    return (
        <section className="hud-container pt-8 pb-12">
            <div className="text-center mb-12">
                <h1 className="font-headline text-5xl font-bold tracking-tight text-cyan-400/80 [text-shadow:0_0_8px_hsl(var(--primary)/0.5)]">
                    PRAVIS
                </h1>
                <p className="text-muted-foreground font-code">Digital Extension</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-8 px-4 max-w-5xl mx-auto">
                {hudButtons.map((button, index) => (
                    <Link href={button.href} key={button.title} passHref>
                        <div 
                            className="hud-button-wrapper group"
                            style={{ '--animation-delay': `${index * 0.4}s` } as React.CSSProperties}
                        >
                            <div className="hud-button">
                                <button.icon className={cn("w-10 h-10 sm:w-12 sm:h-12 text-cyan-400/70 transition-colors duration-300", button.color)} strokeWidth={1.5} />
                                <span className="font-code mt-2 text-xs sm:text-sm text-cyan-400/80 transition-colors duration-300 group-hover:text-cyan-300 text-center">
                                    {button.title}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
