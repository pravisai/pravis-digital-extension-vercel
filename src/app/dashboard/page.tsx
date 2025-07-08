import { Modules } from "@/components/daily-rhythms";
import { ActivityFeed } from "@/components/dashboard-overview";
import { FadeIn } from "@/components/animations/fade-in";
import { Typewriter } from "@/components/animations/typewriter";


export default function DashboardPage() {
  return (
    <div className="space-y-8">
       <FadeIn>
        <div className="text-left">
            <Typewriter text="Dashboard" className="text-4xl font-bold tracking-tight" />
            <p className="text-muted-foreground mt-2">Here's a snapshot of your digital extension.</p>
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FadeIn delay={0.2} className="lg:col-span-2">
            <Modules />
        </FadeIn>
        <FadeIn delay={0.4} className="lg:col-span-1">
            <ActivityFeed />
        </FadeIn>
      </div>
    </div>
  )
}
