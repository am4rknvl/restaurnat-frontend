import { ReservationsView } from "@/components/dashboard/reservations-view"

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
        <p className="text-muted-foreground">Manage your restaurant reservations and table bookings.</p>
      </div>
      <ReservationsView />
    </div>
  )
}
