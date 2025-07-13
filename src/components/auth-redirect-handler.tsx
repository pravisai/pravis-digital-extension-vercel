// src/components/AuthRedirectHandler.tsx
"use client";

import { useEffect } from "react";
import { handleRedirectResult } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export const AuthRedirectHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const processRedirect = async () => {
        try {
            const { userCredential } = await handleRedirectResult();
            if (userCredential?.user) {
              console.log("✅ User signed in via redirect, navigating to dashboard.");
              router.push('/dashboard');
            }
        } catch (error) {
            console.error("Error processing redirect result in handler:", error);
        }
    };
    processRedirect();
  }, [router]);

  return null; // it's just a background effect
};
