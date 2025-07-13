
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FadeIn, StaggeredListItem } from '@/components/animations/fade-in';
import { Typewriter } from '@/components/animations/typewriter';
import { AuthRedirectHandler } from '@/components/auth-redirect-handler';

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
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { userCredential } = await signInWithGoogle();
      // For desktop, this will resolve with user. For mobile, it will be null and redirect.
      if (userCredential?.user) {
        toast({ title: "Success!", description: `Authenticated as ${userCredential.user.displayName}` });
        router.push('/dashboard');
      }
      // For mobile, the page will redirect, and the AuthRedirectHandler will take over.
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error.message || 'Could not sign in with Google. Please try again.',
        });
      }
       setIsLoading(false);
    } 
  };
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    // This is a placeholder for actual email/password authentication
    setTimeout(() => {
      toast({
        variant: 'destructive',
        title: 'Feature Not Available',
        description: 'Email/password login is not yet implemented.',
      });
      setIsEmailLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4 font-body">
      <AuthRedirectHandler />
      {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Authenticating...</p>
          </div>
        ) : (
          <FadeIn stagger className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-8 shadow-2xl">
            <StaggeredListItem>
                <div className="text-center space-y-2">
                    <Typewriter text="PRAVIS" className="font-headline text-5xl font-bold tracking-tight text-primary [text-shadow:0_0_8px_hsl(var(--primary)/0.5)] justify-center" />
                    <p className="text-muted-foreground">Your digital extension</p>
                </div>
            </StaggeredListItem>
            
            <StaggeredListItem>
                <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome Back</h2>
                    <p className="text-muted-foreground">Log in to continue your journey with Pravis.</p>
                </div>
            </StaggeredListItem>
            
            <StaggeredListItem>
                <Button 
                className={cn(
                    "w-full h-12 text-base font-semibold",
                    "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground",
                    "shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300"
                )} 
                onClick={handleGoogleSignIn} 
                disabled={isLoading || isEmailLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5"/>}
                    Continue with Google
                </Button>
            </StaggeredListItem>
            
            <StaggeredListItem>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or log in with email
                        </span>
                    </div>
                </div>
            </StaggeredListItem>
            
            <StaggeredListItem>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="dreamer@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isEmailLoading || isLoading}
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                        <Input 
                            id="password" 
                            type="password"
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isEmailLoading || isLoading}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full h-12 text-base" disabled={isEmailLoading || isLoading}>
                        {isEmailLoading && <Loader2 className="mr-2 animate-spin" />}
                        Log In
                    </Button>
                </form>
            </StaggeredListItem>

            <StaggeredListItem>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Sign Up
                    </a>
                </p>
            </StaggeredListItem>

          </FadeIn>
      )}
    </div>
  );
}
