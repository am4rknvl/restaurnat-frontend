"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { useCart } from '@/hooks/use-cart'

export default function TableLanding({ params }: { params: { tableId: string } }) {
  const { tableId } = params
  const router = useRouter()
  const { setSession } = useCart()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await apiClient.createTableSession(tableId)
        // Expect backend to return { sessionId, tableId, expires_at }
        if (!res || !res.sessionId) throw new Error('No session returned')
        if (!mounted) return
        // Set session; merge carts by default
        setSession(res.sessionId, true)
        // Navigate to products so customer can order
        router.replace('/products')
      } catch (err: any) {
        console.error('Failed to create table session', err)
        setError(err.message || 'Failed to create session')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [tableId, router, setSession])

  return (
    <div className="container mx-auto py-24">
      {loading ? (
        <div className="text-center">Linking table {tableId}...</div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : null}
    </div>
  )
}
