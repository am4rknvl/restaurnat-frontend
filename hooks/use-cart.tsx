"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type CartItem = { id: string; qty: number }

type CartContextValue = {
  items: CartItem[]
  add: (id: string, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  totalCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart_v1')
      if (raw) setItems(JSON.parse(raw))
    } catch (err) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cart_v1', JSON.stringify(items))
    } catch (err) {
      // ignore
    }
  }, [items])

  const add = (id: string, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.id === id)
      if (found) return cur.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
      return [...cur, { id, qty }]
    })
  }

  const remove = (id: string) => setItems((cur) => cur.filter((i) => i.id !== id))

  const setQty = (id: string, qty: number) => {
    setItems((cur) => {
      if (qty <= 0) return cur.filter((i) => i.id !== id)
      return cur.map((i) => (i.id === id ? { ...i, qty } : i))
    })
  }

  const clear = () => setItems([])

  const totalCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, totalCount }}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
