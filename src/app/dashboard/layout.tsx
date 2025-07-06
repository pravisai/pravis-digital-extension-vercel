
"use client"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import { BrainCircuit, Lightbulb, Mail, MessageSquare, Settings, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOutUser } from "@/lib/firebase/auth"
import { useToast } from "@/hooks/use-toast"
import React, { useState, useEffect } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { cn } from "@/lib/utils"

function PravisSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
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
    { href: "/dashboard/clarity-chat", icon: MessageSquare, label: "Clarity Chat", tooltip: "Clarity Chat" },
    { href: "/dashboard/email-assistant", icon: Mail, label: "Email Assistant", tooltip: "Email Assistant" },
    { href: "/dashboard/creative-partner", icon: Lightbulb, label: "Creative Partner", tooltip: "Creative Partner" },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <h2 className="text-xl font-headline tracking-widest text-primary-foreground group-data-[collapsible=icon]:hidden">PRAVIS</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={{children: item.tooltip}}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{children: 'Settings'}}>
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton asChild tooltip={{children: user ? user.displayName : 'Profile'}}>
              <Link href="#">
                <User />
                <span>{user ? user.displayName : "Profile"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton onClick={handleSignOut} tooltip={{children: 'Sign Out'}}>
                <LogOut />
                <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isEmailPage = pathname === '/dashboard/email-assistant';

  return (
    <SidebarProvider>
      <PravisSidebar />
      <SidebarInset>
        <header className="flex items-center p-2 md:p-4 border-b">
           <SidebarTrigger className="md:hidden" />
           <h1 className="text-2xl font-headline ml-4">Dashboard</h1>
        </header>
        <main className={cn("flex-1 bg-background/50", !isEmailPage && "p-4 md:p-6")}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
