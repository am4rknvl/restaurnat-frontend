"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"
import { useKitchenOrders } from "@/hooks/use-dashboard-data"
import { formatDistanceToNow } from "date-fns"
import type { Order } from "@/lib/types"
import { OrderStatus } from "@/lib/types" // Import OrderStatus
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PREPARING:
      return "secondary"
    case OrderStatus.READY:
      return "default"
    case OrderStatus.COMPLETED:
      return "outline"
    case OrderStatus.PENDING:
      return "destructive"
    default:
      return "secondary"
  }
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PREPARING:
      return <Clock className="h-3 w-3" />
    case OrderStatus.READY:
      return <AlertCircle className="h-3 w-3" />
    case OrderStatus.COMPLETED:
      return <CheckCircle className="h-3 w-3" />
    case OrderStatus.PENDING:
      return <ShoppingCart className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

function OrderCard({
  order,
  onStatusUpdate,
  isUpdating,
}: {
  order: Order
  onStatusUpdate: (orderId: string, status: string) => Promise<void>
  isUpdating: boolean
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>(order.status)

  const handleStatusChange = async (newStatus: string) => {
    try {
      await onStatusUpdate(order.id, newStatus)
      setSelectedStatus(newStatus)
    } catch (error) {
      console.error("[v0] Failed to update order status:", error)
      // Reset to original status on error
      setSelectedStatus(order.status)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div>
          <p className="font-medium">#{order.id.slice(-4)}</p>
          <p className="text-sm text-muted-foreground">
            {order.table_number ? `Table ${order.table_number}` : "Takeout"}
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">{order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}</p>
          <p className="text-muted-foreground">
            ${order.total_amount.toFixed(2)} • {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={getStatusColor(order.status as OrderStatus)} className="flex items-center space-x-1">
          {getStatusIcon(order.status as OrderStatus)}
          <span className="capitalize">{order.status}</span>
        </Badge>
        <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
            <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
            <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
            <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
            <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function OrdersView() {
  const { orders, isLoading, updateOrderStatus } = useKitchenOrders()
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  // Calculate stats from orders
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  })

  const preparingOrders = orders.filter((order) => order.status === OrderStatus.PREPARING)
  const readyOrders = orders.filter((order) => order.status === OrderStatus.READY)

  // Calculate average preparation time (mock for now)
  const avgPrepTime = "18m"

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId)
    try {
      await updateOrderStatus(orderId, status)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
          <Button variant="outline">Kitchen View</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{todayOrders.length}</div>
                <p className="text-xs text-muted-foreground">Active orders</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{preparingOrders.length}</div>
                <p className="text-xs text-muted-foreground">In kitchen</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{readyOrders.length}</div>
                <p className="text-xs text-muted-foreground">For pickup</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg. Time</CardTitle>
            <CardDescription>Preparation time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPrepTime}</div>
            <p className="text-xs text-muted-foreground">Preparation time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
          <CardDescription>Real-time order tracking and management</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  isUpdating={updatingOrderId === order.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
