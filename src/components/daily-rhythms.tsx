
"use client"

import Link from "next/link";
import { BrainCircuit, Calendar, Share2, Mail } from "lucide-react";

const hudButtons = [
    {
      href: "/dashboard/creative-partner",
      icon: BrainCircuit,
      label: "Loud Think",
      stagger: "stagger-1",
    },
    {
      href: "/dashboard/calendar",
      icon: Calendar,
      label: "Calendar",
      stagger: "stagger-2",
    },
    {
      href: "/dashboard/social-media",
      icon: Share2,
      label: "Socials",
      stagger: "stagger-3",
    },
    {
      href: "/dashboard/email-assistant",
      icon: Mail,
      label: "Email Assistant",
      stagger: "stagger-4",
    },
];


export function DailyRhythms() {
    return (
        <section>
            <h1 className="text-4xl font-bold text-primary mb-10 drop-shadow-neon-primary font-headline">
                Pravis Dashboard
            </h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {hudButtons.map((button) => (
                    <Link href={button.href} key={button.label} className={`hud-button ${button.stagger}`}>
                        <div className="scanline"></div>
                        <button.icon className="hud-icon" />
                        <span className="hud-text">{button.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    )
}
