import { DailyRhythms } from "@/components/daily-rhythms";
import { DashboardOverview } from "@/components/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="px-6 py-10">
      <DailyRhythms />
      <DashboardOverview />
    </div>
  )
}
