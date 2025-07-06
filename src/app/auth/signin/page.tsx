import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, LogIn } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
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
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="#" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
