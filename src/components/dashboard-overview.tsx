
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import {
  CheckCircle2,
  Mail,
  MessageSquare,
  Timer,
  Bot,
  Sunrise,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

const recentActivity = [
    {
        text: "AI drafted reply to client inquiry",
        time: "2 min ago",
        color: "bg-green-500",
    },
    {
        text: "Daily intention set: Focus on project launch",
        time: "1 hour ago",
        color: "bg-blue-500",
    },
    {
        text: "Generated social media content for campaign",
        time: "2 hours ago",
        color: "bg-purple-500",
    },
    {
        text: "Scheduled meeting with team",
        time: "3 hours ago",
        color: "bg-yellow-500",
    }
]

const quickActions = [
    {
        href: "/dashboard/clarity-chat",
        label: "Ask Pravis",
        icon: Bot
    },
    {
        href: "/dashboard/email-assistant",
        label: "Draft Email",
        icon: Mail
    },
    {
        href: "#",
        label: "Daily Intention",
        icon: Sunrise
    },
    {
        href: "/dashboard/creative-partner",
        label: "Creative Content",
        icon: Sparkles
    }
]

export function DashboardOverview() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [isActivityOpen, setIsActivityOpen] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const displayName = user?.displayName?.split(" ")[0] || "User"

  return (
    <div className="space-y-6">
      {/* This header was removed to clean up the UI, but can be added back if needed */}
      {/* 
      <header>
        <h1 className="text-3xl font-bold">Welcome back, {displayName}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your AI assistant today.
        </p>
      </header>
      */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <Collapsible
              open={isActivityOpen}
              onOpenChange={setIsActivityOpen}
            >
              <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between p-6 text-left">
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">Your latest AI-assisted tasks</p>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", isActivityOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <ul className="space-y-6">
                      {recentActivity.map((activity, index) => (
                          <li key={index} className="flex items-center gap-4">
                              <div className="relative">
                                 <div className={`h-3 w-3 rounded-full ${activity.color}`} />
                              </div>
                              <div className="flex-1">
                                 <p className="font-medium">{activity.text}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </li>
                      ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
        </Card>

        <Card>
           <CardHeader>
             <CardTitle>Quick Actions</CardTitle>
           </CardHeader>
           <CardContent className="pt-2">
             <div className="grid grid-cols-2 gap-4">
               {quickActions.map((action) => (
                 <Link
                   key={action.label}
                   href={action.href}
                   className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-background p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
                 >
                   <action.icon className="h-8 w-8" />
                   <span className="font-medium text-sm">{action.label}</span>
                 </Link>
               ))}
             </div>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
