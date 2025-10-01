"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

type Product = { id: string; name: string; price: number; description?: string }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getProducts({ q: query || undefined, category })
        if (!mounted) return
        if (Array.isArray(data)) setProducts(data)
        else
          setProducts([
            { id: 'p1', name: 'Margherita Pizza', price: 12.99, description: 'Classic tomato, mozzarella, basil' },
            { id: 'p2', name: 'Chicken Biryani', price: 13.5, description: 'Fragrant rice with spices' },
            { id: 'p3', name: 'Miso Ramen', price: 11.0, description: 'Savory broth with noodles' },
          ])
      } catch (err: any) {
        console.error('Failed to load products', err)
        setError(err.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [query, category])

  const addToCartAndGo = (productId: string) => {
    try {
      // Persist a small prefill cart to localStorage so Orders page picks it up
      if (typeof window === 'undefined') return
      const existing = JSON.parse(localStorage.getItem('prefill_cart') || '{}') as Record<string, number>
      existing[productId] = (existing[productId] || 0) + 1
      localStorage.setItem('prefill_cart', JSON.stringify(existing))
      toast({ title: 'Added to cart', description: 'Open Orders to continue to checkout.' })
    } catch (err) {
      console.error('Failed to persist cart prefill', err)
      toast({ title: 'Error', description: 'Could not add to cart' })
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products & Menu</h1>
            <p className="mt-2 text-muted-foreground">Browse items and add them to the cart for quick checkout.</p>
          </div>
          <div>
            <Link href="/orders" className="underline">Open Orders →</Link>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search menu..." className="input" />
          <select value={category || ''} onChange={(e) => setCategory(e.target.value || undefined)} className="input">
            <option value="">All categories</option>
            <option value="pizza">Pizza</option>
            <option value="asian">Asian</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <CardHeader>
                  <CardTitle className="h-4 bg-gray-200 rounded w-48" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-100 rounded" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
          ) : (
            products.map((p) => (
              <Card key={p.id} className="p-4">
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="font-semibold">${p.price.toFixed(2)}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => addToCartAndGo(p.id)}>Add & Open Orders</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </motion.div>
    </main>
  )
}
