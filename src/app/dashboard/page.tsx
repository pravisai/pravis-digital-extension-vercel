
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Modules } from "@/components/daily-rhythms";
import { FadeIn } from "@/components/animations/fade-in";
import { Typewriter } from "@/components/animations/typewriter";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/contexts/chat-context";
import { cn } from "@/lib/utils";
import { DashboardPageLayout } from "@/components/dashboard-page-layout";


export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isPanelOpen } = useChat();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getGreeting = () => {
    if (isLoading) {
      return <Skeleton className="h-10 w-64" />;
    }
    return (
      <Typewriter
        text="All checks passed. Let’s begin."
        className="text-4xl font-bold tracking-tight justify-center text-center"
      />
    );
  };

  return (
    <DashboardPageLayout>
      <div className={cn(
        "w-full h-full flex flex-col items-center justify-start pt-16 space-y-8 transition-all duration-300"
      )}>
        {/* Agent Command Box for agent command input testing */}
        <div className="w-full max-w-md px-4">
        
        </div>

        <FadeIn className="w-full">
          <div className="text-center">
            {getGreeting()}
            <p className="text-muted-foreground mt-2">
              Here's a snapshot of your digital extension.
            </p>
          </div>
        </FadeIn>
        <div className="w-full flex-1 min-h-0">
          <FadeIn delay={0.2} className="h-full">
            <Modules size={isPanelOpen ? 'small' : 'default'} />
          </FadeIn>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
