
"use client";

import { ProductivitySuite } from "@/components/productivity-suite";
import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getValidAccessToken } from "@/lib/firebase/auth";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProductivitySuitePage() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

     useEffect(() => {
        const initializeToken = () => {
            try {
                const token = getValidAccessToken();
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
        <FadeIn className="h-full flex flex-col items-center justify-center p-4">
            <Card className="w-full h-full max-w-7xl flex flex-col">
                <CardHeader>
                    <CardTitle>My Flow</CardTitle>
                    <CardDescription>Orchestrate your day with calendar events and tasks, powered by Pravis.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    {accessToken ? <ProductivitySuite accessToken={accessToken} /> : (
                        <div className="text-center p-8 h-full flex flex-col justify-center items-center">
                            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
                            <p className="text-muted-foreground">Could not load Productivity Suite because the access token is missing.</p>
                            <p className="text-muted-foreground mt-1">Please log in or refresh the page.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </FadeIn>
    )
}
