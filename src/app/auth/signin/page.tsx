"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { signInWithGoogle, signInWithFacebook } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.92 1.62-3.32 0-6.03-2.75-6.03-6.12s2.7-6.12 6.03-6.12c1.88 0 3.12.79 3.86 1.52l2.48-2.48C18.25.36 15.68 0 12.48 0 5.88 0 .5 5.34.5 12s5.38 12 11.98 12c3.24 0 5.92-1.08 7.9-3.02 2.05-2.01 2.6-5.02 2.6-7.72v-.92h-9.52z"
      />
    </svg>
);
  
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
<svg role="img" viewBox="0 0 24 24" {...props}>
    <path
    fill="currentColor"
    d="M23.998 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.61 22.954 23.998 17.99 23.998 12z"
    />
</svg>
);


export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<null | 'google' | 'facebook'>(null);

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    setIsLoading(provider);
    try {
      const signInMethod = provider === 'google' ? signInWithGoogle : signInWithFacebook;
      const result = await signInMethod();
      if (result) {
        toast({ title: "Success!", description: `Signed in as ${result.user.displayName}` });
        router.push('/dashboard');
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: 'Could not sign in. Please try again.',
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 -z-1"></div>
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm border-primary/30 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="w-16 h-16 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]" />
          </div>
          <CardTitle className="font-headline text-4xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your digital extension.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-headline">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-headline">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full font-headline tracking-wider shadow-lg shadow-primary/20">
            <Link href="/dashboard">
              <LogIn className="mr-2" />
              Sign In
            </Link>
          </Button>

          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('google')} disabled={!!isLoading}>
              {isLoading === 'google' ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4"/>}
              Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('facebook')} disabled={!!isLoading}>
              {isLoading === 'facebook' ? <Loader2 className="mr-2 animate-spin" /> : <FacebookIcon className="mr-2 h-4 w-4"/>}
              Facebook
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-2">
            Don't have an account?{" "}
            <Link href="#" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
