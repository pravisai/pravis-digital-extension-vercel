
"use client";

import { CalendarView } from "@/components/calendar";
import { FadeIn } from "@/components/animations/fade-in";
import { useToast } from "@/hooks/use-toast";
import { getStoredAccessToken, signInWithGoogle } from "@/lib/firebase/auth";
import React, { useEffect, useState } from "react";

export default function CalendarPage() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const initializeToken = async () => {
            try {
                let token = getStoredAccessToken();
                if (!token) {
                    const { accessToken: newAccessToken } = await signInWithGoogle();
                    if (!newAccessToken) {
                        throw new Error('Failed to obtain access token.');
                    }
                    token = newAccessToken;
                }
                setAccessToken(token);
            } catch (error: any) {
                console.error("Authentication error:", error);
                toast({
                    variant: "destructive",
                    title: "Authentication Failed",
                    description: error.message || "Could not authenticate with Google to fetch calendar events.",
                });
            } finally {
                setIsLoading(false);
            }
        };
        initializeToken();
    }, [toast]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-lg font-semibold">Initializing Calendar...</p>
                </div>
            </div>
        );
    }
    
    return (
        <FadeIn className="h-full w-full">
           {accessToken ? <CalendarView accessToken={accessToken} /> : <div className="text-center p-8">Could not load calendar. Access token is missing.</div>}
        </FadeIn>
    );
}
