'use client'

import { useQRMenu } from '@/lib/hooks/use-menu'
import { useCreateOrder } from '@/lib/hooks/use-orders'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { useParams } from 'next/navigation'

export default function QRMenuPage() {
  const params = useParams()
  const restaurantId = params.restaurantId as string
  const tableId = params.tableId as string
  
  const { data: menu, isLoading } = useQRMenu(restaurantId, tableId)
  const createOrder = useCreateOrder()
  const [cart, setCart] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const addToCart = (item: any) => {
    setCart([...cart, { ...item, quantity: 1 }])
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    try {
      await createOrder.mutateAsync({
        table_id: tableId,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
      })
      setCart([])
      alert('Order placed successfully! 🎉')
    } catch (error) {
      console.error('Failed to place order:', error)
    }
  }

  const categories = menu?.categories || []
  const items = selectedCategory 
    ? menu?.items?.filter((item: any) => item.category_id === selectedCategory)
    : menu?.items || []

  return (
    <div className="min-h-screen bg-duo-gray pb-24">
      {/* Header */}
      <div className="bg-white shadow-duo p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-5xl mb-2">🍽️</div>
            <h1 className="text-3xl font-extrabold text-duo-darkGray">
              {menu?.restaurant_name || 'Menu'}
            </h1>
            <p className="text-sm text-gray-600">Table {tableId}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap ${
                selectedCategory === '' ? 'bg-duo-green text-white shadow-duo' : 'bg-white text-duo-darkGray'
              }`}
            >
              All
            </motion.button>
            {categories.map((cat: any) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap ${
                  selectedCategory === cat.id ? 'bg-duo-green text-white shadow-duo' : 'bg-white text-duo-darkGray'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        )}

        {/* Menu Items */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 font-bold text-gray-600">Loading menu...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DuoCard>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-duo-yellow to-duo-green rounded-2xl flex items-center justify-center text-4xl">
                      {item.emoji || '🍽️'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold text-duo-darkGray mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-extrabold text-duo-green">
                          ${item.price?.toFixed(2)}
                        </span>
                        <DuoButton
                          onClick={() => addToCart(item)}
                          variant="primary"
                          size="sm"
                        >
                          ➕ Add
                        </DuoButton>
                      </div>
                    </div>
                  </div>
                </DuoCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-duo p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm text-gray-600">{cart.length} items</p>
                <p className="text-2xl font-extrabold text-duo-green">${total.toFixed(2)}</p>
              </div>
              <DuoButton
                onClick={handleCheckout}
                variant="success"
                size="lg"
              >
                🛒 Checkout
              </DuoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
