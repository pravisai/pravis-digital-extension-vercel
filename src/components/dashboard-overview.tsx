
"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

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

export function DashboardOverview() {
  const [isActivityOpen, setIsActivityOpen] = useState(true);

  return (
    <div className="space-y-6">
      <Card>
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
    </div>
  )
}
