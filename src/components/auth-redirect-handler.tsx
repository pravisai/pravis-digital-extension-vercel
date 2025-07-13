// src/components/AuthRedirectHandler.tsx
"use client";

import { useEffect } from "react";
import { handleRedirectResult } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export const AuthRedirectHandler = () => {
  const router = useRouter();

  useEffect(() => {
    handleRedirectResult().then((res) => {
      if (res.userCredential?.user) {
        console.log("✅ User signed in via redirect, navigating to dashboard.");
        router.push('/dashboard');
      }
    });
  }, [router]);

  return null; // it's just a background effect
};
