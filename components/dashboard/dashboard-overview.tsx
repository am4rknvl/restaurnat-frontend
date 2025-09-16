"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Users, Calendar } from "lucide-react"
import { useDashboardStats, useRecentOrders } from "@/hooks/use-dashboard-data"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import type { Order } from "@/lib/types"

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading,
}: {
  title: string
  value: string | number
  description: string
  icon: any
  isLoading: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function RecentActivity({ orders, isLoading }: { orders: Order[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="w-2 h-2 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No recent orders</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.slice(0, 5).map((order) => (
        <div key={order.id} className="flex items-center space-x-4">
          <div
            className={`w-2 h-2 rounded-full ${
              order.status === "completed"
                ? "bg-green-500"
                : order.status === "preparing"
                  ? "bg-yellow-500"
                  : order.status === "pending"
                    ? "bg-blue-500"
                    : "bg-primary"
            }`}
          ></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Order #{order.id.slice(-4)}</p>
            <p className="text-xs text-muted-foreground">
              {order.table_number ? `Table ${order.table_number}` : "Takeout"} - ${order.total_amount.toFixed(2)}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardOverview() {
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { orders, isLoading: ordersLoading } = useRecentOrders()

  const statsData = [
    {
      title: "Total Revenue",
      value: stats ? `$${stats.total_revenue.toLocaleString()}` : "$0",
      description: stats ? `+${stats.revenue_change}% from last month` : "No data",
      icon: DollarSign,
    },
    {
      title: "Orders Today",
      value: stats?.orders_today || 0,
      description: stats ? `+${stats.orders_change}% from yesterday` : "No data",
      icon: ShoppingCart,
    },
    {
      title: "Active Staff",
      value: stats?.active_staff || 0,
      description: "Currently on shift",
      icon: Users,
    },
    {
      title: "Reservations",
      value: stats?.reservations_today || 0,
      description: "For today",
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            isLoading={statsLoading}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest orders from your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity orders={orders} isLoading={ordersLoading} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Staff shifts and reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Morning Shift</p>
                  <p className="text-xs text-muted-foreground">6:00 AM - 2:00 PM</p>
                </div>
                <div className="text-xs text-muted-foreground">4 staff</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Evening Shift</p>
                  <p className="text-xs text-muted-foreground">2:00 PM - 10:00 PM</p>
                </div>
                <div className="text-xs text-muted-foreground">8 staff</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Peak Hours</p>
                  <p className="text-xs text-muted-foreground">6:00 PM - 9:00 PM</p>
                </div>
                <div className="text-xs text-primary">{stats?.reservations_today || 0} reservations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
