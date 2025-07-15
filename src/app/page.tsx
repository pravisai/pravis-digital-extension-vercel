
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signInWithGoogle, handleRedirectResult, signInWithEmail, signUpWithEmail } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FadeIn, StaggeredListItem } from '@/components/animations/fade-in';
import { Typewriter } from '@/components/animations/typewriter';

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
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured()) {
        setIsProcessingRedirect(false);
        return;
    }
    const processRedirect = async () => {
      try {
        const { userCredential } = await handleRedirectResult();
        if (userCredential?.user) {
          toast({ title: "Success!", description: `Authenticated as ${userCredential.user.displayName}` });
          router.push('/dashboard');
        }
      } catch (error: any) {
         if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
          console.error("Redirect Error:", error);
          toast({ variant: 'destructive', title: 'Authentication Failed', description: error.message });
        }
      } finally {
        setIsProcessingRedirect(false);
      }
    };
    processRedirect();
  }, [router, toast]);
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    if (!isFirebaseConfigured()) {
      toast({
            variant: 'destructive',
            title: 'Configuration Error',
            description: 'Firebase environment variables are not set. Please configure them in your .env file or deployment settings.',
            duration: 10000,
          });
      setIsGoogleLoading(false);
      return;
    }
    try {
      const { userCredential } = await signInWithGoogle();
      if (userCredential?.user) {
        toast({ title: "Success!", description: `Authenticated as ${userCredential.user.displayName}` });
        router.push('/dashboard');
      }
    } catch (error: any) {
       if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error('Google Sign In Error:', error);
        toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: 'Could not sign in with Google. Please check the console for details and ensure your domain is authorized in Firebase.',
            duration: 10000,
        });
      }
    } finally {
        setIsGoogleLoading(false);
    }
  };
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    if (!isFirebaseConfigured()) {
        toast({
            variant: 'destructive',
            title: 'Configuration Error',
            description: 'Firebase environment variables are not set.',
            duration: 10000,
          });
        setIsEmailLoading(false);
        return;
    }
    
    if (isSignUp) {
        const { userCredential, error } = await signUpWithEmail(email, password, displayName);
        if (error) {
            toast({ variant: 'destructive', title: 'Sign Up Failed', description: error.message });
        } else if (userCredential) {
            toast({ title: "Account Created!", description: `Welcome, ${userCredential.user.displayName}` });
            router.push('/dashboard');
        }
    } else {
        const { userCredential, error } = await signInWithEmail(email, password);
        if (error) {
            if (error.code === 'auth/invalid-credential') {
                toast({ 
                    variant: 'destructive', 
                    title: 'Login Failed', 
                    description: "Incorrect email or password. Please check your credentials or sign up if you don't have an account." 
                });
            } else {
                toast({ variant: 'destructive', title: 'Sign In Failed', description: error.message });
            }
        } else if (userCredential?.user?.displayName) {
            toast({ title: "Success!", description: `Welcome back, ${userCredential.user.displayName}` });
            router.push('/dashboard');
        } else if (userCredential) {
            toast({ title: "Success!", description: `Welcome back!`});
            router.push('/dashboard');
        }
    }
    
    setIsEmailLoading(false);
  };

  if (isProcessingRedirect) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-background p-4">
            <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Authenticating...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4 font-body">
      <FadeIn stagger className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-8 shadow-2xl">
        <StaggeredListItem>
            <div className="text-center space-y-2">
                <Typewriter text="PRAVIS" className="font-headline text-5xl font-bold tracking-tight text-primary [text-shadow:0_0_8px_hsl(var(--primary)/0.5)] justify-center" />
                <p className="text-muted-foreground">Your digital extension</p>
            </div>
        </StaggeredListItem>
        
        <StaggeredListItem>
            <div className="space-y-4 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">{isSignUp ? "Create an Account" : "Welcome Back"}</h2>
                <p className="text-muted-foreground">{isSignUp ? "Enter your details to begin your journey." : "Log in to continue your journey with Pravis."}</p>
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
            disabled={isGoogleLoading || isEmailLoading}
            >
                {isGoogleLoading ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5"/>}
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
                        Or {isSignUp ? "sign up" : "log in"} with email
                    </span>
                </div>
            </div>
        </StaggeredListItem>
        
        <StaggeredListItem>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
                {isSignUp && (
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="displayName" className="text-muted-foreground">Display Name</Label>
                        <Input 
                            id="displayName" 
                            type="text" 
                            placeholder="John Doe" 
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            disabled={isGoogleLoading || isEmailLoading}
                            required
                        />
                    </div>
                )}
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="dreamer@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isGoogleLoading || isEmailLoading}
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
                        disabled={isGoogleLoading || isEmailLoading}
                        required
                    />
                </div>
                <Button type="submit" className="w-full h-12 text-base" disabled={isEmailLoading || isGoogleLoading}>
                    {isEmailLoading && <Loader2 className="mr-2 animate-spin" />}
                    {isSignUp ? "Sign Up" : "Log In"}
                </Button>
            </form>
        </StaggeredListItem>

        <StaggeredListItem>
             <p className="px-8 text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => setIsSignUp(!isSignUp)} className="underline underline-offset-4 hover:text-primary disabled:opacity-50" disabled={isEmailLoading || isGoogleLoading}>
                    {isSignUp ? "Log In" : "Sign Up"}
                </button>
            </p>
        </StaggeredListItem>

      </FadeIn>
    </div>
  );
}
