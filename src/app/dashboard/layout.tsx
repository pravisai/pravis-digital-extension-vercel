
"use client"

import { BrainCircuit, Mail, ListChecks, Bot, User, Settings, LogOut } from "lucide-react"
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
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ClarityChat } from "@/components/clarity-chat"


function DesktopNav() {
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
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/email-assistant", label: "Email Assistant" },
    { href: "/dashboard/creative-partner", label: "Productivity Suite" },
  ];

  return (
      <header className="sticky top-0 z-30 hidden h-16 items-center justify-between gap-4 border-b bg-background px-4 md:flex md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-lg font-headline tracking-widest text-primary-foreground">PRAVIS</span>
          </Link>
          <nav className="flex items-center gap-1">
            {menuItems.map(item => (
              <Button asChild variant={pathname === item.href ? "secondary" : "ghost"} size="sm" key={item.href}>
                <Link href={item.href}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
  
        <div className="flex items-center gap-4">
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

  const navItemsLeft = [
    { href: "/dashboard", label: "Dashboard", icon: BrainCircuit },
    { href: "/dashboard/email-assistant", icon: Mail, label: "Email" },
  ];
  const navItemsRight = [
    { href: "/dashboard/creative-partner", icon: ListChecks, label: "Tasks" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-40 w-full h-20 bg-background border-t border-border/50">
      <div className="grid h-full grid-cols-5 mx-auto font-medium">
        {navItemsLeft.map(item => (
          <Link key={item.href} href={item.href} className="inline-flex flex-col items-center justify-center px-2 text-center hover:bg-accent group">
            <item.icon className={cn("w-6 h-6 mb-1 text-muted-foreground group-hover:text-primary", { "text-primary": pathname.startsWith(item.href) })} />
            <span className={cn("text-xs text-muted-foreground group-hover:text-primary", { "text-primary": pathname.startsWith(item.href) })}>{item.label}</span>
          </Link>
        ))}
        
        <div className="flex items-center justify-center">
          <Button
            onClick={onChatOpen}
            size="icon"
            className="w-16 h-16 bg-primary rounded-full hover:bg-primary/90 shadow-lg shadow-primary/30 -translate-y-4"
          >
            <Bot className="w-8 h-8 text-primary-foreground" />
            <span className="sr-only">Open Pravis Assistant</span>
          </Button>
        </div>

        {navItemsRight.map(item => (
          <Link key={item.href} href={item.href} className="inline-flex flex-col items-center justify-center px-2 text-center hover:bg-accent group">
            <item.icon className={cn("w-6 h-6 mb-1 text-muted-foreground group-hover:text-primary", { "text-primary": pathname.startsWith(item.href) })} />
            <span className={cn("text-xs text-muted-foreground group-hover:text-primary", { "text-primary": pathname.startsWith(item.href) })}>{item.label}</span>
          </Link>
        ))}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex flex-col items-center justify-center px-2 hover:bg-accent group">
              {user ? (
                 <Avatar className="w-6 h-6 mb-1">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
              ) : (
                 <User className="w-6 h-6 mb-1 text-muted-foreground group-hover:text-primary" />
              )}
              <span className="text-xs text-muted-foreground group-hover:text-primary">Profile</span>
            </button>
          </DropdownMenuTrigger>
          {user && (
            <DropdownMenuContent className="w-56 mb-2" align="center" side="top" forceMount>
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
          )}
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const isEmailPage = pathname === '/dashboard/email-assistant';
  const isFullHeightPage = pathname === '/dashboard/creative-partner' || pathname === '/dashboard/clarity-chat';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DesktopNav />
      <header className="sticky top-0 z-30 flex md:hidden h-16 items-center justify-between gap-4 border-b bg-background px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-lg font-headline tracking-widest text-primary-foreground">PRAVIS</span>
        </Link>
      </header>
      <main className={cn(
        "flex-1 pb-24 md:pb-0",
        {
          "p-4 md:p-6": !isEmailPage,
          "h-[calc(100vh-4rem)]": isFullHeightPage,
        }
      )}>
        {children}
      </main>
      <MobileNav onChatOpen={() => setIsChatOpen(true)} />
      
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="bottom" className="h-[90vh] p-0 border-none flex flex-col bg-card rounded-t-lg">
           <ClarityChat />
        </SheetContent>
      </Sheet>
    </div>
  )
}
