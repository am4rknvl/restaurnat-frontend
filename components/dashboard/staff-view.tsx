import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, UserCheck, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useMemo, useState } from "react"
import { apiClient } from "@/lib/api-client"

interface StaffItem {
  id: string
  name: string
  role: string
  shift: string
  status: string
  hours?: string
  avatar?: string
}

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
  const [staff, setStaff] = useState<StaffItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      try {
        setIsLoading(true)
        const data = await apiClient.getStaff()
        if (!isMounted) return
        setStaff(
          (data || []).map((s: any) => ({
            id: String(s.id),
            name: s.name,
            role: s.role,
            shift: s.shift_start && s.shift_end ? (new Date(s.shift_start).getHours() < 12 ? 'Morning' : 'Evening') : 'N/A',
            status: s.is_active ? 'on-shift' : 'off-shift',
            hours: s.shift_start && s.shift_end ? `${new Date(s.shift_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(s.shift_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : undefined,
            avatar: "/placeholder.svg?height=32&width=32",
          }))
        )
      } catch (e) {
        setStaff([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
  }, [])

  const totals = useMemo(() => {
    const total = staff.length
    const onShift = staff.filter((s) => s.status === 'on-shift').length
    const hoursToday = onShift * 8 // naive calc
    const scheduledTomorrow = Math.max(0, Math.round(total * 0.75))
    return { total, onShift, hoursToday, scheduledTomorrow }
  }, [staff])
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
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{totals.total}</div>
                <p className="text-xs text-muted-foreground">Full & part-time</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Shift</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{totals.onShift}</div>
                <p className="text-xs text-muted-foreground">Currently working</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{totals.hoursToday}</div>
                <p className="text-xs text-muted-foreground">Total worked</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-3 w-20" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{totals.scheduledTomorrow}</div>
                <p className="text-xs text-muted-foreground">Tomorrow</p>
              </>
            )}
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
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <div className="w-40">
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
            ) : staff.length === 0 ? (
              <div className="text-muted-foreground text-sm">No staff</div>
            ) : (
              staff.map((member) => (
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
