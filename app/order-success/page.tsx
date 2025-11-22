'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OrderSuccessPage() {
  const [orderNumber] = useState(() => Math.floor(Math.random() * 10000).toString().padStart(4, '0'))

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-green-100 rounded-full p-8 mb-6">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-8xl"
            >
              ✅
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Order Confirmed!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 mb-2"
          >
            Your order has been sent to the kitchen
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-block bg-blue-100 px-6 py-3 rounded-full"
          >
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-blue-600">#{orderNumber}</p>
          </motion.div>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Order Confirmation</h3>
                <p className="text-gray-600 text-sm">
                  We've received your order and our kitchen is preparing your delicious meal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Preparation</h3>
                <p className="text-gray-600 text-sm">
                  Your food will be ready in approximately 15-20 minutes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Stay Updated</h3>
                <p className="text-gray-600 text-sm">
                  We'll send you updates via SMS about your order status
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Order More Food
            </motion.button>
          </Link>
          
          <Link href="/orders" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-blue-600 border-2 border-blue-600 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Track Order
            </motion.button>
          </Link>
        </motion.div>

        {/* Estimated Time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 mb-2">Estimated Preparation Time</p>
          <div className="inline-flex items-center gap-2 bg-orange-100 px-6 py-3 rounded-full">
            <span className="text-2xl">⏰</span>
            <span className="text-xl font-bold text-orange-600">15-20 mins</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
