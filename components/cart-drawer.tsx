"use client"

import React from "react"
import { useCart } from "@/hooks/use-cart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export function CartDrawer({ products = [], isSheet = false }: { products?: any[]; isSheet?: boolean }) {
  const { items, setQty, clear, totalCount, sessionId } = useCart()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = React.useState(false)
  const [payment, setPayment] = React.useState<any | null>(null)
  const [paymentStatus, setPaymentStatus] = React.useState<string | null>(null)
  const pollRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [])

  const itemsWithProduct = items.map((it: any) => ({ ...it, product: products.find((p) => p.id === it.id) }))
  const subtotal = itemsWithProduct.reduce((s: number, it: any) => s + ((it.product?.price || 0) * it.qty), 0)
  const tax = +(subtotal * 0.08).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)

  const startTelebirrPayment = async () => {
    if (items.length === 0) {
      toast({ title: 'Cart empty', description: 'Add items before checkout', variant: 'destructive' })
      return
    }
    setIsProcessing(true)
    try {
      const orderItems = items.map((it: any) => ({ product_id: it.id, quantity: it.qty }))
      // amount in main currency units expected by backend (server handles cents if needed)
      const res = await apiClient.createPayment({ method: 'telebirr', amount: total, currency: 'ETB', items: orderItems })
      setPayment(res)
      setPaymentStatus(res.status || 'pending')

      // start polling
      if (res?.id) {
        pollRef.current = window.setInterval(async () => {
          try {
            const p = await apiClient.getPayment(res.id)
            setPaymentStatus(p.status || null)
            if (p.status === 'paid' || p.status === 'completed') {
              // finalize order
              if (pollRef.current) {
                window.clearInterval(pollRef.current)
                pollRef.current = null
              }
              try {
                const orderPayload: any = {
                  customer_name: p.metadata?.customer_name || 'Telebirr Customer',
                  phone: p.metadata?.phone || '',
                  items: orderItems,
                  payment_id: p.id,
                  total_amount: p.amount || total,
                }
                if (sessionId) {
                  orderPayload.session_id = sessionId
                }
                const orderResp = await apiClient.createOrder(orderPayload)
                toast({ title: 'Order placed', description: `Order #${orderResp.id} created.` })
                clear()
              } catch (err: any) {
                console.error('Failed to create order after payment', err)
                toast({ title: 'Order creation failed', description: err.message || 'Saved payment but failed to create order', variant: 'destructive' })
              }
              setIsProcessing(false)
            }
            if (p.status === 'failed' || p.status === 'cancelled') {
              toast({ title: 'Payment failed', description: 'Please try again or use another payment method', variant: 'destructive' })
              if (pollRef.current) {
                window.clearInterval(pollRef.current)
                pollRef.current = null
              }
              setIsProcessing(false)
            }
          } catch (e) {
            console.error('Polling error', e)
          }
        }, 3000)
      }
    } catch (err: any) {
      console.error('Payment initiation failed', err)
      toast({ title: 'Payment error', description: err.message || 'Could not start payment', variant: 'destructive' })
      setIsProcessing(false)
    }
  }

  return (
    <aside className={`w-full ${isSheet ? '' : 'max-w-md'}`}>
      <div className={`space-y-4 ${isSheet ? '' : 'sticky top-24'}`}>
        <Card>
          <CardHeader>
            <CardTitle>Cart ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {itemsWithProduct.length === 0 ? (
              <div className="text-sm text-muted-foreground">Your cart is empty.</div>
            ) : (
              <div className="space-y-2">
                {itemsWithProduct.map((it: any) => (
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

                {payment && (
                  <div className="p-2 bg-muted rounded">
                    <div className="text-sm">Payment status: <strong>{paymentStatus || payment.status}</strong></div>
                    {payment.checkout_url || payment.payment_url ? (
                      <a className="text-primary underline" href={payment.checkout_url || payment.payment_url} target="_blank" rel="noreferrer">Open payment page</a>
                    ) : null}
                    {payment.qr && <img src={payment.qr} alt="Payment QR" className="w-40 mt-2" />}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button onClick={startTelebirrPayment} className="flex-1" disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Pay with Telebirr'}</Button>
                  <Button variant="ghost" onClick={() => { if (!isProcessing) clear() }}>Clear</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
