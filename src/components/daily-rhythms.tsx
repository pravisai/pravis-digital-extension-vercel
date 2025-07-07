
"use client"

import { BrainCircuit, Calendar, Mail, Share2 } from "lucide-react";
import Link from "next/link";

const cubeFaces = [
    {
        href: "/dashboard/email-assistant",
        icon: Mail,
        title: "Email Draft",
        color: "text-primary",
        className: "cube__face--front",
    },
    {
        href: "#",
        icon: Calendar,
        title: "Calendar",
        color: "text-primary",
        className: "cube__face--right",
    },
    {
        href: "#",
        icon: Share2,
        title: "Social Media",
        color: "text-destructive",
        className: "cube__face--back",
    },
    {
        href: "/dashboard/clarity-chat",
        icon: BrainCircuit,
        title: "Loud Think",
        color: "text-destructive",
        className: "cube__face--left",
    },
];

export function DailyRhythms() {
    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold font-headline mb-12 text-center">For You</h2>
                <div className="flex justify-center items-center">
                    <div className="scene">
                        <div className="cube">
                            {cubeFaces.map((face) => (
                                <Link
                                    href={face.href}
                                    key={face.title}
                                    className={`cube__face ${face.className}`}
                                >
                                    <face.icon className={`w-24 h-24 ${face.color}`} strokeWidth={1} />
                                    <p className="font-semibold text-xl">{face.title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
