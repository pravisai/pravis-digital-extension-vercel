
"use client"

import Link from "next/link";
import { BrainCircuit, Calendar, Share2, Mail } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

const modules = [
    {
      href: "/dashboard/creative-partner",
      icon: BrainCircuit,
      label: "Loud Think",
      description: "AI-powered brainstorming and productivity suite.",
      bgClass: "bg-purple-600/10",
      iconClass: "text-purple-400"
    },
    {
      href: "/dashboard/calendar",
      icon: Calendar,
      label: "Calendar",
      description: "Manage your schedule and events seamlessly.",
      bgClass: "bg-sky-600/10",
      iconClass: "text-sky-400"
    },
    {
      href: "/dashboard/social-media",
      icon: Share2,
      label: "Socials",
      description: "Connect and manage your social media presence.",
      bgClass: "bg-rose-600/10",
      iconClass: "text-rose-400"
    },
    {
      href: "/dashboard/email-assistant",
      icon: Mail,
      label: "Email Assistant",
      description: "Draft replies and manage your inbox with AI.",
      bgClass: "bg-emerald-600/10",
      iconClass: "text-emerald-400"
    },
];


export function Modules() {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((item) => (
                    <Link href={item.href} key={item.label} className="group">
                        <Card className="h-full hover:border-primary/50 transition-colors">
                            <CardContent className="p-6 flex flex-col items-start gap-4">
                               <div className={cn("p-3 rounded-lg", item.bgClass)}>
                                    <item.icon className={cn("w-7 h-7", item.iconClass)} />
                               </div>
                               <div>
                                   <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                                   <p className="text-muted-foreground text-sm">{item.description}</p>
                               </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}
