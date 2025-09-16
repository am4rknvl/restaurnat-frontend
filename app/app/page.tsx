"use client"

import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { ErrorBoundary } from "@/components/error-boundary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function WelcomeHeader() {
  const { phoneNumber } = useAuth()
  const currentHour = new Date().getHours()

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning"
    if (currentHour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}! Welcome to RestaurantOS</h1>
      <p className="text-muted-foreground">
        {phoneNumber ? `Logged in as ${phoneNumber}` : "Here's what's happening at your restaurant today."}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeHeader />

      <ErrorBoundary
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Unable to load dashboard</CardTitle>
              <CardDescription>
                There was an error loading your dashboard data. Please refresh the page or contact support.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <DashboardOverview />
      </ErrorBoundary>
    </div>
  )
}
