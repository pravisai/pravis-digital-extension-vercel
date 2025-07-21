
"use client";

import { ProductivitySuite } from "@/components/productivity-suite";
import { FadeIn } from "@/components/animations/fade-in";
import { useToast } from "@/hooks/use-toast";
import { getStoredAccessToken, handleRedirectResult, signInWithGoogle } from "@/lib/firebase/auth";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function TasksPage() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

     useEffect(() => {
        const initializeToken = async () => {
            try {
                // First, check if we are returning from a redirect
                const { accessToken: redirectedToken } = await handleRedirectResult();
                if (redirectedToken) {
                    setAccessToken(redirectedToken);
                    setIsLoading(false);
                    return;
                }

                // If not, check for a stored token
                let token = getStoredAccessToken();
                if (!token) {
                    // If no token, initiate the sign-in process
                    await signInWithGoogle();
                    // The page will redirect, so we don't need to do anything further here.
                    // The next page load will handle the redirect result.
                    return; 
                }
                setAccessToken(token);
            } catch (error: any) {
                if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
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
                    <p className="text-sm text-muted-foreground">Authenticating with Google...</p>
                </div>
            </div>
        );
    }

    return (
        <FadeIn className="w-full h-full p-4 md:p-6">
            {accessToken ? <ProductivitySuite accessToken={accessToken} /> : <div className="text-center p-8">Could not load Productivity Suite. Access token is missing or authentication was cancelled. Please refresh the page.</div>}
        </FadeIn>
    )
}
