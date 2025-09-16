import { StaffView } from "@/components/dashboard/staff-view"

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
        <p className="text-muted-foreground">Manage your restaurant team, shifts, and schedules.</p>
      </div>
      <StaffView />
    </div>
  )
}
