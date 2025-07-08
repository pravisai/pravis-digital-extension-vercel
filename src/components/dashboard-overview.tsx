
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Phone, Video } from "lucide-react";

const activities = [
    {
        icon: Mail,
        title: "Send Payment Reminder",
        subtitle: "Jessi Johnson sent a payment reminder",
        accent: "bg-purple-500",
        avatar: "JJ"
    },
    {
        icon: Phone,
        title: "Call about the contract",
        subtitle: "Brian Carpenter, Google meets",
        accent: "bg-yellow-500",
        avatar: "BC"
    },
    {
        icon: CheckCircle,
        title: "Finalize Project Proposal",
        subtitle: "Due in 2 days",
        accent: "bg-green-500",
        avatar: "PP"
    },
     {
        icon: Video,
        title: "Team Sync",
        subtitle: "10:00 AM - Project Pravis",
        accent: "bg-sky-500",
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
            <div className="space-y-4">
                {activities.map((item, index) => (
                   <div key={index} className="flex items-start gap-4">
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
                ))}
            </div>
        </CardContent>
    </Card>
  )
}
