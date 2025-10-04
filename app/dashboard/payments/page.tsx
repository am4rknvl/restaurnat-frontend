'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { DuoInput } from '@/components/ui/duo-input'
import { apiClient } from '@/lib/api/client'

export default function PaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)

  const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', emoji: '📱', color: 'bg-duo-blue' },
    { id: 'chapa', name: 'Chapa', emoji: '💳', color: 'bg-duo-green' },
    { id: 'cash', name: 'Cash', emoji: '💵', color: 'bg-duo-yellow' },
  ]

  const handlePayment = async () => {
    if (!selectedMethod || !amount || !orderId) return

    setLoading(true)
    try {
      if (selectedMethod === 'telebirr') {
        const response = await apiClient.payments.telebirr.c2b.create({
          order_id: orderId,
          amount: parseFloat(amount),
        })
        console.log('Telebirr payment initiated:', response.data)
      } else if (selectedMethod === 'chapa') {
        const response = await apiClient.payments.create({
          order_id: orderId,
          amount: parseFloat(amount),
          method: 'chapa',
        })
        console.log('Chapa payment initiated:', response.data)
      }
      // Show success message
      alert('Payment initiated successfully!')
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">💳</div>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Payments</h1>
              <p className="text-lg text-gray-600">Secure & fast checkout</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <DuoCard>
          <h3 className="text-2xl font-extrabold text-duo-darkGray mb-6">Process Payment</h3>

          <div className="space-y-6">
            {/* Order ID */}
            <DuoInput
              label="Order ID"
              placeholder="Enter order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />

            {/* Amount */}
            <DuoInput
              label="Amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-bold text-duo-darkGray mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`
                      p-6 rounded-2xl border-4 transition-all
                      ${selectedMethod === method.id 
                        ? `${method.color} text-white border-duo-darkGray shadow-duo` 
                        : 'bg-white text-duo-darkGray border-duo-lightGray hover:border-duo-blue'
                      }
                    `}
                  >
                    <div className="text-5xl mb-3">{method.emoji}</div>
                    <div className="text-lg font-extrabold">{method.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <DuoButton
              onClick={handlePayment}
              disabled={!selectedMethod || !amount || !orderId || loading}
              variant="success"
              size="lg"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                `💰 Pay $${amount || '0.00'}`
              )}
            </DuoButton>
          </div>
        </DuoCard>

        {/* Payment Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <DuoCard>
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <div className="text-sm font-bold text-duo-darkGray">Secure</div>
              <div className="text-xs text-gray-600 mt-1">256-bit encryption</div>
            </div>
          </DuoCard>
          <DuoCard>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-sm font-bold text-duo-darkGray">Fast</div>
              <div className="text-xs text-gray-600 mt-1">Instant processing</div>
            </div>
          </DuoCard>
          <DuoCard>
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-sm font-bold text-duo-darkGray">Verified</div>
              <div className="text-xs text-gray-600 mt-1">Trusted partners</div>
            </div>
          </DuoCard>
        </div>
      </div>
    </div>
  )
}
