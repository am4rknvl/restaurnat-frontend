"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { CartDrawer } from "@/components/cart-drawer"

type Product = {
  id: string
  name: string
  price: number
  description?: string
  image?: string
}

export default function OrdersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { items, add, remove, setQty, clear, totalCount } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await apiClient.getProducts()
        if (!mounted) return
        setProducts(Array.isArray(data) ? data : [])
      } catch (err: any) {
        setError(err.message || "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Place New Orders</h1>
            <p className="mt-2 text-muted-foreground">Browse products, add to cart, and checkout securely.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            {isLoading ? (
              <div>Loading products...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <div className="grid gap-4">
                {products.map((p) => (
                  <Card key={p.id} className="p-4">
                    <CardHeader>
                      <CardTitle>{p.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="font-semibold">${p.price.toFixed(2)}</div>
                        <Button variant="outline" size="sm" onClick={() => add(p.id, 1)}>Add to Cart</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
          <aside>
            <CartDrawer products={products} />
          </aside>
        </div>
      </motion.div>
    </main>
  )
}
  