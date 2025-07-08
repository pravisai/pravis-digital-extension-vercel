
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Phone, Video } from "lucide-react";
import { FadeIn, StaggeredListItem } from "./animations/fade-in";

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
  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Activity</CardTitle>
        </CardHeader>
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
    </Card>
  )
}
