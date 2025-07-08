import { Modules } from "@/components/daily-rhythms";
import { ActivityFeed } from "@/components/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-left">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Here's a snapshot of your digital extension.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Modules />
        </div>
        <div className="lg:col-span-1">
            <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
