"use client"

import React from "react"
import { useCart } from "@/hooks/use-cart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CartDrawer({ products }: { products: any[] }) {
  const { items, add, remove, setQty, clear, totalCount } = useCart()

  const itemsWithProduct = items.map((it) => ({ ...it, product: products.find((p) => p.id === it.id) }))
  const subtotal = itemsWithProduct.reduce((s, it) => s + ((it.product?.price || 0) * it.qty), 0)
  const tax = +(subtotal * 0.08).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)

  return (
    <aside className="w-full max-w-md">
      <div className="space-y-4 sticky top-24">
        <Card>
          <CardHeader>
            <CardTitle>Cart ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {itemsWithProduct.length === 0 ? (
              <div className="text-sm text-muted-foreground">Your cart is empty.</div>
            ) : (
              <div className="space-y-2">
                {itemsWithProduct.map((it) => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{it.product?.name || it.id}</div>
                      <div className="text-xs text-muted-foreground">{it.qty} × ${((it.product?.price || 0)).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setQty(it.id, Math.max(0, it.qty - 1))}>-</Button>
                      <div className="w-8 text-center">{it.qty}</div>
                      <Button size="sm" onClick={() => setQty(it.id, it.qty + 1)}>+</Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm text-muted-foreground">Subtotal <span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground">Tax <span>${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between font-semibold text-lg mt-2">Total <span>${total.toFixed(2)}</span></div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={() => alert('Proceed to checkout (not implemented)')} className="flex-1">Checkout</Button>
                  <Button variant="ghost" onClick={() => clear()}>Clear</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
