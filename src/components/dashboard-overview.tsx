
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardOverview() {
  return (
    <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-primary font-headline">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-primary/90 text-primary-foreground hover:bg-primary font-bold px-6 py-3 rounded-full hover:shadow-neon-primary transition-all duration-300">
                <Link href="/dashboard/email-assistant">Compose Email</Link>
            </Button>
            <Button asChild className="bg-primary/90 text-primary-foreground hover:bg-primary font-bold px-6 py-3 rounded-full hover:shadow-neon-primary transition-all duration-300">
                <Link href="/dashboard/calendar">Create Event</Link>
            </Button>
            <Button asChild className="bg-primary/90 text-primary-foreground hover:bg-primary font-bold px-6 py-3 rounded-full hover:shadow-neon-primary transition-all duration-300">
                <Link href="/dashboard/creative-partner">New Task</Link>
            </Button>
        </div>
    </div>
  )
}
