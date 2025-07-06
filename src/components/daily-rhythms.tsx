"use client"

import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Calendar, Mail, Share2, Wand2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React, { useState, useEffect } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"

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
    {
        href: "#",
        icon: Wand2,
        title: "Test AI Key",
        color: "text-primary",
        borderColor: "border-primary shadow-primary/20",
    }
];

export function DailyRhythms() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [greeting, setGreeting] = useState("Good Afternoon");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting("Good Morning");
        } else if (hour < 18) {
            setGreeting("Good Afternoon");
        } else {
            setGreeting("Good Evening");
        }

        return () => unsubscribe();
    }, []);

    const displayName = user?.displayName?.split(' ')[0] || 'Dreamer';

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-primary-foreground/90">{greeting}, {displayName}</h1>
                    <p className="text-muted-foreground mt-2">Ready to be present and authentic?</p>
                </div>
                <Avatar className="h-24 w-24 border-2 border-primary/50">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                  <AvatarFallback className="text-4xl">{user?.displayName?.charAt(0) || 'D'}</AvatarFallback>
                </Avatar>
            </header>

            <section>
                <h2 className="text-2xl font-bold font-headline mb-4">For You</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {featureItems.map((feature, index) => (
                        <Link href={feature.href} key={index} className="transform hover:-translate-y-1 transition-transform duration-300">
                            <Card className={`bg-card/80 hover:bg-card/100 border-2 ${feature.borderColor} flex flex-col items-center justify-center text-center p-6 aspect-square rounded-2xl shadow-lg`}>
                                <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
                                    <feature.icon className={`w-1/2 h-1/2 ${feature.color}`} strokeWidth={1.5} />
                                    <p className="font-semibold text-lg">{feature.title}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
