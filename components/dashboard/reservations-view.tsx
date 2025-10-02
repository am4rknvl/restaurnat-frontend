import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Phone } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import { useEffect, useState } from "react"

interface ReservationItem {
  id: string
  customer_name: string
  customer_phone: string
  date: string
  time: string
  party_size: number
  table_number?: number
  status: string
}

export function ReservationsView() {
  const [reservations, setReservations] = useState<ReservationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      try {
        setIsLoading(true)
        const data = await apiClient.getReservations()
        if (!isMounted) return
        setReservations(
          (data || []).map((r: any) => ({
            id: String(r.id),
            customer_name: r.customer_name,
            customer_phone: r.customer_phone,
            date: r.date,
            time: r.time,
            party_size: r.party_size,
            table_number: r.table_number,
            status: r.status,
          }))
        )
      } catch (e) {
        setReservations([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button>Add Reservation</Button>
          <Button variant="outline">View Calendar</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Reservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{reservations.filter(r => r.date.toLowerCase() === 'today').length}</div>
                <p className="text-xs text-muted-foreground">Compared to yesterday</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tables</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Out of 20 tables</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">7:30 PM</div>
                <p className="text-xs text-muted-foreground">Most bookings</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Reservations</CardTitle>
          <CardDescription>Manage your upcoming table reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <div className="w-48">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-muted-foreground text-sm">No reservations</div>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{reservation.customer_name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{reservation.customer_phone}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p>
                        {reservation.date} at {reservation.time}
                      </p>
                      <p className="text-muted-foreground">
                        {reservation.party_size} guests{reservation.table_number ? ` • Table ${reservation.table_number}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"} className="capitalize">
                      {reservation.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
