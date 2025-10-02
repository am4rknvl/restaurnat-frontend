"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [order, setOrder] = useState<any | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const evtSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchOrder = async () => {
      try {
        const o = await apiClient.getOrder(id)
        if (!mounted) return
        setOrder(o)
        setStatus(o?.status || null)
      } catch (e) {
        console.error(e)
      }
    }
    fetchOrder()

    // Try EventSource to listen for order updates
    try {
      const es = new EventSource(`${(process.env.NEXT_PUBLIC_API_BASE || '')}/api/v1/orders/${id}/events`)
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data)
          if (data.status) setStatus(data.status)
          setOrder((prev: any) => ({ ...(prev || {}), ...data }))
        } catch (e) {
          console.error('Invalid event data', e)
        }
      }
      es.onerror = (err) => {
        console.warn('EventSource error', err)
        es.close()
      }
      evtSourceRef.current = es
    } catch (e) {
      console.warn('EventSource not available, falling back to polling')
      const iv = setInterval(async () => {
        try {
          const o = await apiClient.getOrder(id)
          setOrder(o)
          setStatus(o?.status || null)
        } catch (e) {
          console.error(e)
        }
      }, 4000)
      return () => clearInterval(iv)
    }

    return () => {
      mounted = false
      if (evtSourceRef.current) evtSourceRef.current.close()
    }
  }, [id])

  return (
    <main className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Order {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">Status: <strong>{status}</strong></div>
          <div className="space-y-2">
            {order?.items?.map((it: any) => (
              <div key={it.product_id} className="flex justify-between">
                <div>{it.product_name || it.product_id} x{it.quantity}</div>
                <div>${(it.price || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
