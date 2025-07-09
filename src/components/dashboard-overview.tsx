"use client"

import * as React from "react"
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ChevronDown, Mail, Phone, Video } from "lucide-react";
import { FadeIn, StaggeredListItem } from "./animations/fade-in";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const activities = [
    {
        icon: Mail,
        title: "Send Payment Reminder",
        subtitle: "Jessi Johnson sent a payment reminder",
        accent: "bg-chart-1",
        avatar: "JJ"
    },
    {
        icon: Phone,
        title: "Call about the contract",
        subtitle: "Brian Carpenter, Google meets",
        accent: "bg-chart-2",
        avatar: "BC"
    },
    {
        icon: CheckCircle,
        title: "Finalize Project Proposal",
        subtitle: "Due in 2 days",
        accent: "bg-chart-4",
        avatar: "PP"
    },
     {
        icon: Video,
        title: "Team Sync",
        subtitle: "10:00 AM - Project Pravis",
        accent: "bg-chart-3",
        avatar: "TS"
    },
]

export function ActivityFeed() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activity</CardTitle>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
                    <span className="sr-only">Toggle Activity Feed</span>
                </Button>
            </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
            <CardContent>
                <FadeIn stagger className="space-y-4">
                    {activities.map((item, index) => (
                      <StaggeredListItem key={index}>
                        <div 
                          className="flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-card hover:shadow-neon-primary glow-sweep-effect"
                          style={{'--animation-delay': `${0.4 + index * 0.1}s`} as React.CSSProperties}
                        >
                              <Avatar>
                                  <div className={`w-full h-full rounded-full flex items-center justify-center ${item.accent}`}>
                                    <item.icon className="w-5 h-5 text-white" />
                                  </div>
                              </Avatar>
                              <div>
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                              </div>
                        </div>
                       </StaggeredListItem>
                    ))}
                </FadeIn>
            </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
