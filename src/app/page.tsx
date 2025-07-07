
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.92 1.62-3.32 0-6.03-2.75-6.03-6.12s2.7-6.12 6.03-6.12c1.88 0 3.12.79 3.86 1.52l2.48-2.48C18.25.36 15.68 0 12.48 0 5.88 0 .5 5.34.5 12s5.38 12 11.98 12c3.24 0 5.92-1.08 7.9-3.02 2.05-2.01 2.6-5.02 2.6-7.72v-.92h-9.52z"
      />
    </svg>
);

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { userCredential, accessToken } = await signInWithGoogle();
      if (userCredential?.user) {
        if (accessToken) {
          sessionStorage.setItem('gmail_access_token', accessToken);
        }
        toast({ title: "Success!", description: `Authenticated as ${userCredential.user.displayName}` });
        router.push('/dashboard');
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error.message || 'Could not sign in. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4 font-body">
      <div className="w-full max-w-sm space-y-8 rounded-lg border border-border bg-card p-8 shadow-2xl">
        <div className="text-center space-y-2">
            <h1 className="font-headline text-5xl font-bold tracking-tight text-primary">PRAVIS</h1>
            <p className="text-muted-foreground">Your digital extension</p>
        </div>
        
        <div className="space-y-4 text-center">
            <p className="text-muted-foreground">Sign in to begin your session.</p>
        </div>
        
        <Button 
          className={cn(
            "w-full h-12 text-base font-semibold",
            "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground",
            "shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300"
          )} 
          onClick={handleGoogleSignIn} 
          disabled={isLoading}
        >
            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5"/>}
            Continue with Google
        </Button>
      </div>
    </div>
  );
}
