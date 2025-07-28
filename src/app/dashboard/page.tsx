
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Modules } from "@/components/daily-rhythms";
import { FadeIn } from "@/components/animations/fade-in";
import { Typewriter } from "@/components/animations/typewriter";
import { Skeleton } from "@/components/ui/skeleton";


export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="h-full flex flex-col items-center justify-center space-y-8 pb-32 md:pb-0">
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
      <div className="w-full">
        <FadeIn delay={0.2}>
          <Modules />
        </FadeIn>
      </div>
    </div>
  );
}
