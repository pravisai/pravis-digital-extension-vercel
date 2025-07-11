import { Modules } from "@/components/daily-rhythms";
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
      <div className="grid grid-cols-1 gap-8">
        <FadeIn delay={0.2}>
            <Modules />
        </FadeIn>
      </div>
    </div>
  )
}
