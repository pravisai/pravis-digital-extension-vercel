
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

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
      const result = await signInWithGoogle();
      if (result) {
        toast({ title: "Success!", description: `Signed in as ${result.user.displayName}` });
        router.push('/dashboard');
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error: any) {
      console.error(error);
      let description = 'Could not sign in. Please try again.';
      if (error.code === 'auth/unauthorized-domain') {
        description = 'This domain is not authorized. Go to your Firebase console -> Authentication -> Settings -> Authorized domains and add it.';
      }
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background text-foreground p-4 font-body">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-headline text-5xl font-bold tracking-widest text-primary-foreground/90">
            PRAVIS
          </h1>
          <p className="font-headline text-base text-accent tracking-widest uppercase">
            Your digital extension
          </p>
        </div>

        <div className="space-y-6">
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
            <div className="text-center">
                <h2 className="text-3xl font-bold font-headline">Welcome Back</h2>
                <p className="text-muted-foreground mt-2">Log in to continue your journey with Pravis.</p>
            </div>
          
            <Button variant="outline" className="w-full border-primary/50 text-primary-foreground hover:bg-primary/10 hover:text-primary-foreground h-12 text-base" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5"/>}
                Continue with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Or log in with email
                </span>
                </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                    <Input id="email" type="email" placeholder="dreamer@example.com" className="bg-input/50 h-12"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password"  className="text-muted-foreground">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" className="bg-input/50 h-12"/>
                </div>
                 {/* The "Log In" button uses a Link for now, as email/password auth logic is not yet implemented */}
                <Button asChild className="w-full font-headline tracking-wider h-12 text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20">
                    <Link href="/dashboard">
                        Log In
                    </Link>
                </Button>
            </form>

            <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="#" className="font-semibold text-primary hover:underline">
                Sign Up
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
