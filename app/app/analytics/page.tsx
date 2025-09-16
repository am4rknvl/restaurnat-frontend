import { AnalyticsView } from "@/components/dashboard/analytics-view"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into your restaurant's performance and trends.</p>
      </div>
      <AnalyticsView />
    </div>
  )
}
