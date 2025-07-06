
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
import { BrainCircuit, Lightbulb, Mail, MessageSquare, Settings, User, Zap, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

function PravisSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  
  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", tooltip: "Dashboard" },
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
             <SidebarMenuButton asChild tooltip={{children: 'Profile'}}>
              <Link href="#">
                <User />
                <span>Dr. Pranav Shimpi</span>
              </Link>
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
  return (
    <SidebarProvider>
      <PravisSidebar />
      <SidebarInset>
        <header className="flex items-center p-2 md:p-4 border-b">
           <SidebarTrigger className="md:hidden" />
           <h1 className="text-2xl font-headline ml-4">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-background/50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
