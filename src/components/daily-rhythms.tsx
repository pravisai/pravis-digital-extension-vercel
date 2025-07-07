
"use client"

import { BrainCircuit, Calendar, Mail, Share2 } from "lucide-react";
import Link from "next/link";

const featureItems = [
    {
        href: "/dashboard/email-assistant",
        icon: Mail,
        title: "Email Draft",
        color: "text-primary",
        borderColor: "border-primary shadow-primary/20",
    },
    {
        href: "#",
        icon: Calendar,
        title: "Calendar",
        color: "text-primary",
        borderColor: "border-primary shadow-primary/20",
    },
    {
        href: "#",
        icon: Share2,
        title: "Social Media",
        color: "text-destructive",
        borderColor: "border-destructive shadow-destructive/20",
    },
    {
        href: "/dashboard/clarity-chat",
        icon: BrainCircuit,
        title: "Loud Think",
        color: "text-destructive",
        borderColor: "border-destructive shadow-destructive/20",
    },
];

export function DailyRhythms() {
    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold font-headline mb-4">For You</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featureItems.map((feature, index) => (
                        <Link href={feature.href} key={index} className="flip-card">
                            <div className="flip-card-inner">
                                <div className={`flip-card-front ${feature.borderColor}`}>
                                    <feature.icon className={`w-1/2 h-1/2 ${feature.color}`} strokeWidth={1.5} />
                                    <p className="font-semibold text-lg">{feature.title}</p>
                                </div>
                                <div className={`flip-card-back ${feature.borderColor}`}>
                                     <feature.icon className={`w-1/2 h-1/2 ${feature.color}`} strokeWidth={1.5} />
                                    <p className="font-semibold text-lg">{feature.title}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
