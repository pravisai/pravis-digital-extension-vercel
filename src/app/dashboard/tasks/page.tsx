
"use client";

import { ProductivitySuite } from "@/components/productivity-suite";
import { FadeIn } from "@/components/animations/fade-in";
import { useToast } from "@/hooks/use-toast";
import { getStoredAccessToken } from "@/lib/firebase/auth";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function TasksPage() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

     useEffect(() => {
        const initializeToken = () => {
            try {
                // Check for a stored token, but do not trigger sign-in from here.
                const token = getStoredAccessToken();
                setAccessToken(token);
            } catch (error: any) {
                console.error("Token retrieval error:", error);
                toast({
                    variant: "destructive",
                    title: "Authentication Error",
                    description: "Could not retrieve authentication credentials.",
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
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold">Loading Productivity Suite...</p>
                    <p className="text-sm text-muted-foreground">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <FadeIn className="w-full h-full p-4 md:p-6">
            {accessToken ? <ProductivitySuite accessToken={accessToken} /> : (
                <div className="text-center p-8 h-full flex flex-col justify-center items-center">
                    <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
                    <p className="text-muted-foreground">Could not load Productivity Suite because the access token is missing.</p>
                    <p className="text-muted-foreground mt-1">Please log in or refresh the page.</p>
                </div>
            )}
        </FadeIn>
    )
}
