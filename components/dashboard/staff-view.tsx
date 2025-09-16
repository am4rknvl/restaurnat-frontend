import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, UserCheck, Calendar } from "lucide-react"

const staff = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "Head Chef",
    shift: "Morning",
    status: "on-shift",
    hours: "6:00 AM - 2:00 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Bob Smith",
    role: "Server",
    shift: "Evening",
    status: "on-shift",
    hours: "2:00 PM - 10:00 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Carol Davis",
    role: "Bartender",
    shift: "Evening",
    status: "on-shift",
    hours: "4:00 PM - 12:00 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "David Wilson",
    role: "Server",
    shift: "Morning",
    status: "off-shift",
    hours: "6:00 AM - 2:00 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Emma Brown",
    role: "Sous Chef",
    shift: "Evening",
    status: "on-shift",
    hours: "2:00 PM - 10:00 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "on-shift":
      return "default"
    case "off-shift":
      return "secondary"
    case "break":
      return "outline"
    default:
      return "secondary"
  }
}

export function StaffView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button>Add Staff</Button>
          <Button variant="outline">Schedule</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Full & part-time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Shift</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96</div>
            <p className="text-xs text-muted-foreground">Total worked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Tomorrow</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Overview</CardTitle>
          <CardDescription>Current staff status and shift information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{member.shift} Shift</p>
                    <p className="text-muted-foreground">{member.hours}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(member.status)} className="capitalize">
                    {member.status.replace("-", " ")}
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
