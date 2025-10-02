"use client"

import React from 'react'
import { useKitchenOrders } from '@/hooks/use-dashboard-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function KitchenDashboard() {
  const { orders, isLoading, updateOrderStatus } = useKitchenOrders()

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Kitchen Display</h1>
      <div className="grid gap-4">
        {isLoading ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div>No active orders</div>
        ) : (
          orders.map((o: any) => (
            <Card key={o.id}>
              <CardHeader>
                <CardTitle>Order {o.id} • {o.table_number ? `Table ${o.table_number}` : 'Takeout'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <strong>Status:</strong> {o.status}
                </div>
                <div className="space-y-1 mb-4">
                  {o.items?.map((it: any) => (
                    <div key={it.product_id} className="flex justify-between">
                      <div>{it.product_name || it.product_id} x{it.quantity}</div>
                      <div>{it.notes || ''}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => updateOrderStatus(o.id, 'preparing')}>Mark Preparing</Button>
                  <Button onClick={() => updateOrderStatus(o.id, 'ready')}>Mark Ready</Button>
                  <Button onClick={() => updateOrderStatus(o.id, 'served')}>Mark Served</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
