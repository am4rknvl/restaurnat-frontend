import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Phone } from "lucide-react"

const reservations = [
  {
    id: "1",
    customerName: "John Smith",
    phone: "(555) 123-4567",
    date: "Today",
    time: "7:30 PM",
    guests: 4,
    table: "Table 12",
    status: "confirmed",
  },
  {
    id: "2",
    customerName: "Sarah Johnson",
    phone: "(555) 987-6543",
    date: "Today",
    time: "8:00 PM",
    guests: 2,
    table: "Table 5",
    status: "confirmed",
  },
  {
    id: "3",
    customerName: "Mike Wilson",
    phone: "(555) 456-7890",
    date: "Tomorrow",
    time: "6:00 PM",
    guests: 6,
    table: "Table 8",
    status: "pending",
  },
  {
    id: "4",
    customerName: "Emily Davis",
    phone: "(555) 321-0987",
    date: "Tomorrow",
    time: "7:00 PM",
    guests: 3,
    table: "Table 3",
    status: "confirmed",
  },
]

export function ReservationsView() {
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tables</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Out of 20 tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7:30 PM</div>
            <p className="text-xs text-muted-foreground">Most bookings</p>
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
            {reservations.map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{reservation.customerName}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{reservation.phone}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>
                      {reservation.date} at {reservation.time}
                    </p>
                    <p className="text-muted-foreground">
                      {reservation.guests} guests • {reservation.table}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                    {reservation.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
