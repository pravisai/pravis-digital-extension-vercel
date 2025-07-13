
"use client";

import { ProductivitySuite } from "@/components/productivity-suite";
import { FadeIn } from "@/components/animations/fade-in";
import { useToast } from "@/hooks/use-toast";
import { getStoredAccessToken, signInWithGoogle } from "@/lib/firebase/auth";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function TasksPage() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

     useEffect(() => {
        const initializeToken = async () => {
            try {
                let token = getStoredAccessToken();
                if (!token) {
                    const { accessToken: newAccessToken } = await signInWithGoogle();
                    // If signInWithGoogle returns no token (e.g., popup closed), stop loading but don't show an error.
                    if (!newAccessToken) {
                        setIsLoading(false);
                        return;
                    }
                    token = newAccessToken;
                }
                setAccessToken(token);
            } catch (error: any) {
                // The signInWithGoogle function already handles the popup-closed error, 
                // but we keep this check as a safeguard.
                if (error.code !== 'auth/popup-closed-by-user') {
                    console.error("Authentication error:", error);
                    toast({
                        variant: "destructive",
                        title: "Authentication Failed",
                        description: error.message || "Could not authenticate with Google to fetch calendar events.",
                    });
                }
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
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold">Loading Productivity Suite...</p>
                </div>
            </div>
        );
    }

    return (
        <FadeIn className="w-full h-full p-4 md:p-6">
            {accessToken ? <ProductivitySuite accessToken={accessToken} /> : <div className="text-center p-8">Could not load Productivity Suite. Access token is missing or authentication was cancelled.</div>}
        </FadeIn>
    )
}
