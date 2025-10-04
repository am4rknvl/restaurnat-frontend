'use client'

import { useOrders } from '@/lib/hooks/use-orders'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import Link from 'next/link'

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const { data: orders, isLoading } = useOrders({ 
    status: statusFilter || undefined 
  })

  const statuses = [
    { value: 'pending', label: 'Pending', emoji: '📝', color: 'bg-duo-yellow' },
    { value: 'confirmed', label: 'Confirmed', emoji: '✅', color: 'bg-duo-blue' },
    { value: 'preparing', label: 'Preparing', emoji: '👨‍🍳', color: 'bg-duo-blue' },
    { value: 'ready', label: 'Ready', emoji: '🔔', color: 'bg-duo-success' },
    { value: 'completed', label: 'Completed', emoji: '✨', color: 'bg-duo-success' },
  ]

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">📊</div>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">All Orders</h1>
              <p className="text-lg text-gray-600">Track and manage everything</p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter('')}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap ${
                statusFilter === '' ? 'bg-duo-green text-white shadow-duo' : 'bg-white text-duo-darkGray'
              }`}
            >
              🍽️ All
            </motion.button>
            {statuses.map((status) => (
              <motion.button
                key={status.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusFilter(status.value)}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap ${
                  statusFilter === status.value ? `${status.color} text-white shadow-duo` : 'bg-white text-duo-darkGray'
                }`}
              >
                {status.emoji} {status.label}
              </motion.button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 font-bold text-gray-600">Loading orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any, index: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DuoCard>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-4xl">
                        {order.status === 'completed' ? '✅' : 
                         order.status === 'preparing' ? '👨‍🍳' : 
                         order.status === 'ready' ? '🔔' : '📝'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-extrabold text-duo-darkGray">
                          Order #{order.id.slice(-6)}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">
                            {order.table_number ? `Table ${order.table_number}` : 'Takeout'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'completed' ? 'bg-duo-success text-white' :
                            order.status === 'preparing' ? 'bg-duo-blue text-white' :
                            'bg-duo-yellow text-duo-darkGray'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-duo-green mb-2">
                        ${order.total?.toFixed(2) || '0.00'}
                      </div>
                      <div className="flex gap-2">
                        <DuoButton variant="secondary" size="sm">👁️ View</DuoButton>
                        <DuoButton variant="primary" size="sm">🔄 Reorder</DuoButton>
                      </div>
                    </div>
                  </div>
                </DuoCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <DuoCard hover={false}>
            <div className="text-center py-12">
              <div className="text-8xl mb-4">📦</div>
              <h3 className="text-2xl font-extrabold text-duo-darkGray mb-2">No orders found</h3>
              <p className="text-gray-600">Start taking orders to see them here!</p>
            </div>
          </DuoCard>
        )}
      </div>
    </div>
  )
}
