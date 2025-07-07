import { DailyRhythms } from "@/components/daily-rhythms";
import { DashboardOverview } from "@/components/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DailyRhythms />
      <DashboardOverview />
    </div>
  )
}
