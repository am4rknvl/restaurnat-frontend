"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiClient.getOrders()
      setOrders(Array.isArray(data) ? data.reverse() : [])
    } catch (err: any) {
      console.error("Failed to fetch orders", err)
      setError(err.message || "Failed to load orders")
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false
      if (query && !(o.id.includes(query) || (o.customer_name || "").toLowerCase().includes(query.toLowerCase()))) return false
      return true
    })
  }, [orders, statusFilter, query])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const handleReorder = async (order: any) => {
    try {
      toast({ title: "Reordering", description: "Placing reorder…" })
      const payload = {
        customer_name: order.customer_name || "Reorder",
        phone: order.phone || "",
        items: order.items,
        total_amount: order.total_amount,
      }
      const res = await apiClient.createOrder(payload)
      toast({ title: "Reorder placed", description: `Order #${res.id} created.` })
      fetchOrders()
    } catch (err: any) {
      console.error("Reorder failed", err)
      toast({ title: "Failed", description: err.message || "Unable to place reorder.", variant: "destructive" })
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="mt-2 text-muted-foreground">View past orders, filter by status, and quickly reorder favorites.</p>

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Search by order id or customer" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select onValueChange={(v) => setStatusFilter(v || null)}>
              <SelectTrigger className="w-40">
                <SelectValue>{statusFilter || "All statuses"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => fetchOrders()}>Refresh</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <CardHeader>
                  <CardTitle className="h-4 bg-gray-200 rounded w-48" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-100 rounded" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 bg-card text-center text-muted-foreground">No orders found.</div>
          ) : (
            paged.map((o) => (
              <Card key={o.id}>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium">Order #{o.id}</div>
                      <div className="text-sm text-muted-foreground">{o.customer_name || "Guest"} • {new Date(o.created_at).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">${o.total_amount?.toFixed(2) || "0.00"}</div>
                      <Button variant="outline" size="sm" onClick={() => handleReorder(o)}>Reorder</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{(o.items || []).map((it: any) => `${it.quantity}× ${it.name}`).join(", ")}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filtered.length > pageSize && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <div>Page {page}</div>
            <Button onClick={() => setPage((p) => p + 1)} disabled={page * pageSize >= filtered.length}>Next</Button>
          </div>
        )}
      </motion.div>
    </main>
  )
}
