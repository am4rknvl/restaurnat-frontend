'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useCreateOrder } from '@/lib/hooks/use-orders'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PlaceOrderPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const createOrder = useCreateOrder()
  
  const [orderType, setOrderType] = useState<'dine-in' | 'takeout' | 'delivery'>('dine-in')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tableNumber: '',
    address: '',
    notes: '',
    paymentMethod: 'cash',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotalPrice() + 2.50 + (getTotalPrice() * 0.1),
        order_type: orderType,
        customer_name: formData.name,
        customer_phone: formData.phone,
        table_number: orderType === 'dine-in' ? formData.tableNumber : null,
        delivery_address: orderType === 'delivery' ? formData.address : null,
        notes: formData.notes,
        payment_method: formData.paymentMethod,
        status: 'pending',
      }

      await createOrder.mutateAsync(orderData)
      clearCart()
      router.push('/order-confirmed')
    } catch (error) {
      console.error('Order failed:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl mb-6 block">🍽️</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No items in your order</h2>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              View Menu
            </motion.button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/order">
              <button className="text-2xl hover:scale-110 transition-transform">←</button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Place Your Order</h1>
              <p className="text-sm text-gray-600">Choose how you'd like to receive your food</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Type Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">🍽️ Order Type</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                    orderType === 'dine-in' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="dine-in"
                      checked={orderType === 'dine-in'}
                      onChange={(e) => setOrderType(e.target.value as any)}
                      className="sr-only"
                    />
                    <span className="text-5xl mb-3">🪑</span>
                    <span className="font-bold text-gray-900">Dine-In</span>
                    <span className="text-sm text-gray-600 text-center mt-1">Eat at the restaurant</span>
                  </label>

                  <label className={`flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                    orderType === 'takeout' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="takeout"
                      checked={orderType === 'takeout'}
                      onChange={(e) => setOrderType(e.target.value as any)}
                      className="sr-only"
                    />
                    <span className="text-5xl mb-3">🥡</span>
                    <span className="font-bold text-gray-900">Takeout</span>
                    <span className="text-sm text-gray-600 text-center mt-1">Pick up your order</span>
                  </label>

                  <label className={`flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                    orderType === 'delivery' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={orderType === 'delivery'}
                      onChange={(e) => setOrderType(e.target.value as any)}
                      className="sr-only"
                    />
                    <span className="text-5xl mb-3">🚗</span>
                    <span className="font-bold text-gray-900">Delivery</span>
                    <span className="text-sm text-gray-600 text-center mt-1">We'll bring it to you</span>
                  </label>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">📱 Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Conditional Fields Based on Order Type */}
              {orderType === 'dine-in' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-md"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">🪑 Table Information</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Table Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tableNumber}
                      onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="e.g., 12"
                    />
                  </div>
                </motion.div>
              )}

              {orderType === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-md"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Delivery Address</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
                      placeholder="123 Main St, Apt 4B, City, State 12345"
                    />
                  </div>
                </motion.div>
              )}

              {/* Special Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Special Instructions</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes for the Kitchen (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
                    placeholder="Any allergies or special requests? (e.g., no onions, extra spicy)"
                  />
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">💳 Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-2xl">💵</span>
                    <span className="font-semibold text-gray-900">Cash</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-2xl">💳</span>
                    <span className="font-semibold text-gray-900">Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="mobile"
                      checked={formData.paymentMethod === 'mobile'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-2xl">📱</span>
                    <span className="font-semibold text-gray-900">Mobile Payment</span>
                  </label>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Service Charge</span>
                  <span className="font-semibold">$2.50</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${(getTotalPrice() + 2.50 + (getTotalPrice() * 0.1)).toFixed(2)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Confirm Order'
                )}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
