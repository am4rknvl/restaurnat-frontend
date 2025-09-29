"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

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
  const [cart, setCart] = useState<Record<string, number>>({})
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const { toast } = useToast()

  // Fetch product list from backend; if unavailable, use mock data
  useEffect(() => {
    let mounted = true
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const base = process.env.NEXT_PUBLIC_API_BASE || ''
        const res = await fetch(`${base}/api/v1/products`.replace(/(^\/)/, '/')).catch(() => null)
        const data = res ? await res.json().catch(() => null) : null
        if (!mounted) return
        if (data && Array.isArray(data)) {
          setProducts(data)
        } else {
          // Fallback mock products for development
          setProducts([
            { id: "p1", name: "Margherita Pizza", price: 12.99, description: "Classic pizza with fresh basil" },
            { id: "p2", name: "Spicy Ramen", price: 10.5, description: "Rich broth with chili oil" },
            { id: "p3", name: "Caesar Salad", price: 8.0, description: "Crisp romaine, creamy dressing" },
          ])
        }
      } catch (err: any) {
        console.error("Failed to load products", err)
        setError(err.message || "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }

    // Load prefill cart from Products page if present
    try {
      const prefill = JSON.parse(localStorage.getItem('prefill_cart') || '{}') as Record<string, number>
      if (prefill && Object.keys(prefill).length > 0) {
        setCart(prefill)
        // clear it after loading
        localStorage.removeItem('prefill_cart')
      }
    } catch {}

    fetchProducts()
    return () => {
      mounted = false
    }
  }, [])

  const addToCart = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const removeFromCart = (id: string) => setCart((c) => {
    const next = { ...c }
    if (!next[id]) return next
    next[id] = Math.max(0, next[id] - 1)
    if (next[id] === 0) delete next[id]
    return next
  })

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
  }, [cart, products])

  const subtotal = cartItems.reduce((s, it) => s + (it.product?.price || 0) * it.qty, 0)
  const tax = +(subtotal * 0.08).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({ title: "Cart is empty", description: "Add items to your cart before checkout.", variant: "destructive" })
      return
    }
    if (!phone || !customerName) {
      toast({ title: "Missing details", description: "Please provide your name and contact phone.", variant: "destructive" })
      return
    }

    try {
      const orderPayload = {
        customer_name: customerName,
        phone,
        items: cartItems.map((it) => ({ id: it.product?.id, name: it.product?.name, quantity: it.qty, price: it.product?.price })),
        total_amount: total,
      }
      toast({ title: "Placing order", description: "Please wait…" })
      const res = await apiClient.createOrder(orderPayload)
      toast({ title: "Order created", description: `Order #${res.id} placed successfully.` })
      // clear cart and form
      setCart({})
      setCustomerName("")
      setPhone("")
    } catch (err: any) {
      console.error("Checkout failed", err)
      toast({ title: "Order failed", description: err.message || "Failed to create order.", variant: "destructive" })
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Browse Menu</h1>
            <p className="mt-2 text-muted-foreground">Add items to your cart and checkout quickly.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <CardHeader>
                      <CardTitle className="h-6 bg-gray-200 rounded w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-gray-100 rounded mb-2" />
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 rounded">Failed to load products: {error}</div>
              ) : (
                products.map((p) => (
                  <Card key={p.id} className="p-4">
                    <CardHeader>
                      <CardTitle>{p.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-lg font-semibold">${p.price.toFixed(2)}</div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => removeFromCart(p.id)}>-</Button>
                          <div className="w-8 text-center">{cart[p.id] || 0}</div>
                          <Button size="sm" onClick={() => addToCart(p.id)}>Add</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <aside className="w-full max-w-md">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cart</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Your cart is empty.</div>
                  ) : (
                    <div className="space-y-2">
                      {cartItems.map((it) => (
                        <div key={it.product?.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{it.product?.name}</div>
                            <div className="text-xs text-muted-foreground">{it.qty} × ${it.product?.price.toFixed(2)}</div>
                          </div>
                          <div className="font-semibold">${((it.product?.price || 0) * it.qty).toFixed(2)}</div>
                        </div>
                      ))}

                      <div className="border-t pt-2">
                        <div className="flex justify-between text-sm text-muted-foreground">Subtotal <span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm text-muted-foreground">Tax <span>${tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-semibold text-lg mt-2">Total <span>${total.toFixed(2)}</span></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Input placeholder="Full name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <Button onClick={handleCheckout} className="w-full mt-2">Place Order</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </motion.div>
    </main>
  )
}
