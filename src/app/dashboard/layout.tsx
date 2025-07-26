"use client"

import { BrainCircuit, Mail, ListChecks, Bot, User, Settings, LogOut, ArrowLeft, LineChart, CheckCircle2, MessageSquare, Timer, Sun, Moon, RefreshCw, Loader2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOutUser, onAuthStateChanged, auth, type User as FirebaseUser } from "@/lib/firebase/auth"
import { useToast } from "@/hooks/use-toast"
import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { EmailProvider, useEmail } from "@/contexts/email-context"
import { PravisLogo } from "@/components/pravis-logo"

// ====== AGENTIC LOGIC IMPORTS ======
import { AgentAutoNavigator } from "@/components/AgentAutoNavigator";
import AgentCommandBox from "@/components/AgentCommandBox";
// ===================================

const statCards = [
  {
    title: "Tasks Completed",
    value: "24",
    change: "+12%",
    changeColor: "text-green-500",
    icon: CheckCircle2,
  },
  {
    title: "Emails Processed",
    value: "156",
    change: "+8%",
    changeColor: "text-green-500",
    icon: Mail,
  },
  {
    title: "AI Conversations",
    value: "42",
    change: "+23%",
    changeColor: "text-green-500",
    icon: MessageSquare,
  },
  {
    title: "Time Saved",
    value: "3.2h",
    change: "+15%",
    changeColor: "text-green-500",
    icon: Timer,
  },
]

function EmailFetchButton() {
    const { handleFetchEmails, isFetchingEmails } = useEmail();
    return (
        <Button onClick={handleFetchEmails} disabled={isFetchingEmails} variant="outline" size="sm">
            {isFetchingEmails ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Fetch Inbox
        </Button>
    )
}

function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: 'Could not sign out. Please try again.',
      });
    }
  };
  
  return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          {pathname !== '/dashboard' ? (
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          ) : (
             <Link href="/dashboard" className="font-bold text-lg md:hidden">
                <PravisLogo size={28} />
             </Link>
          )}
        </div>
  
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {(pathname.startsWith('/dashboard/email-assistant')) && <EmailFetchButton />}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <LineChart className="h-5 w-5" />
                <span className="sr-only">View Analytics</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Analytics</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {statCards.map((card) => (
                  <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                      <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                      <p className={`text-xs ${card.changeColor}`}>{card.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          )}
        </div>
      </header>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
  
    const isFullHeightPage = pathname === '/dashboard' || pathname === '/dashboard/creative-partner' || pathname === '/dashboard/productivity-suite' || pathname === '/dashboard/clarity-chat' || pathname.startsWith('/dashboard/email-assistant') || pathname === '/dashboard/tasks' || pathname === '/dashboard/social-media';
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/');
            } else {
                setIsLoading(false);
            }
        });
        
        if (typeof window !== 'undefined') {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    (err) => {
                        console.log('Service Worker registration failed: ', err);
                    }
                );
            }
            
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        toast({ title: "Notifications Enabled", description: "You will now receive updates from Pravis." });
                    } else {
                        toast({ title: "Notifications Blocked", description: "You can enable notifications in your browser settings." });
                    }
                });
            }
        }
        
        return () => unsubscribe();
    }, [router, toast]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            {/* --- Agentic: Auto intent-based navigation for ALL dashboard child pages --- */}
            <AgentAutoNavigator />
            {/* --- Optional: Agent command box for manual NL testing --- */}
            <div className="py-2 px-4 bg-muted/40 border-b border-muted">
                <AgentCommandBox />
            </div>
            <DashboardHeader />
            <main className={cn(
                "flex-1",
                {
                    "p-4 md:p-8": !isFullHeightPage,
                    "h-[calc(100vh-4rem)]": isFullHeightPage,
                },
                 pathname === '/dashboard' && "p-0 md:p-0"
            )}>
                {children}
            </main>
        </div>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <EmailProvider>
        <LayoutWrapper>{children}</LayoutWrapper>
    </EmailProvider>
  )
}
