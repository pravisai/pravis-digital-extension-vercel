

"use client"

import { BrainCircuit, Mail, ListChecks, Bot, User, Settings, LogOut, ArrowLeft, LineChart, CheckCircle2, MessageSquare, Timer, Sun, Moon, RefreshCw, Loader2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOutUser } from "@/lib/firebase/auth"
import { useToast } from "@/hooks/use-toast"
import React, { useState, useEffect } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
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
import { ClarityChat } from "@/components/clarity-chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEmail } from "@/contexts/email-context"
import { EmailProvider } from "@/contexts/email-context"


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

  const menuItems = [
    { href: "/dashboard/email-assistant", label: "Email Assistant" },
    { href: "/dashboard/creative-partner", label: "Productivity Suite" },
  ];
  
  return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          {pathname !== '/dashboard' && (
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          )}
           <Link href="/dashboard" className="font-bold text-lg hidden md:block">Dashboard</Link>
          <nav className="hidden items-center gap-1 md:flex">
            {menuItems.map(item => (
              <Button asChild variant={pathname.startsWith(item.href) ? "secondary" : "ghost"} size="sm" key={item.href}>
                <Link href={item.href}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
  
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {(pathname === '/dashboard/email-assistant' || pathname.startsWith('/dashboard/email-assistant/')) && <EmailFetchButton />}
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


function MobileNav({ onChatOpen }: { onChatOpen: () => void }) {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-40 w-full h-20 bg-background/80 backdrop-blur-sm border-t">
      <div className="flex items-center justify-center h-full">
        <Button
          onClick={onChatOpen}
          size="icon"
          className="w-16 h-16 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-lg shadow-primary/30 -translate-y-4"
        >
          <Bot className="w-8 h-8" />
          <span className="sr-only">Open Pravis Assistant</span>
        </Button>
      </div>
    </div>
  );
}


function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);
  
    const isFullHeightPage = pathname === '/dashboard/creative-partner' || pathname === '/dashboard/clarity-chat' || pathname.startsWith('/dashboard/email-assistant');

    return (
        <div className="flex min-h-screen w-full flex-col">
            <DashboardHeader />
            <main className={cn(
                "flex-1 pb-20 md:pb-0",
                {
                    "p-4 md:p-8": !isFullHeightPage,
                    "h-[calc(100vh-4rem)]": isFullHeightPage,
                }
            )}>
                {children}
            </main>
            <MobileNav onChatOpen={() => setIsChatOpen(true)} />
            
            <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                <SheetContent side="bottom" className="h-[90vh] p-0 border-none flex flex-col bg-card rounded-t-lg">
                    <SheetHeader className="p-4">
                        <SheetTitle className="sr-only">Pravis Assistant</SheetTitle>
                    </SheetHeader>
                    <ClarityChat />
                </SheetContent>
            </Sheet>
        </div>
    )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === '/dashboard/email-assistant' || pathname.startsWith('/dashboard/email-assistant/')) {
    return (
      <EmailProvider>
        <LayoutWrapper>{children}</LayoutWrapper>
      </EmailProvider>
    )
  }

  return <LayoutWrapper>{children}</LayoutWrapper>
}
