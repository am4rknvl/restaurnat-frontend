'use client'

import { useKitchenOrders, useUpdateKitchenOrderStatus } from '@/lib/hooks/use-kitchen'
import { useEffect } from 'react'
import { OrderWebSocket } from '@/lib/websocket/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'

export default function KitchenPage() {
  const { data: orders, isLoading, refetch } = useKitchenOrders()
  const updateStatus = useUpdateKitchenOrderStatus()
  const { token } = useAuthStore()

  useEffect(() => {
    if (!token) return

    const orderWS = new OrderWebSocket()
    orderWS.connect(token, () => {
      refetch()
    })

    return () => orderWS.disconnect()
  }, [token, refetch])

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status })
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const pendingOrders = orders?.filter((o: any) => o.status === 'pending') || []
  const preparingOrders = orders?.filter((o: any) => o.status === 'preparing') || []
  const readyOrders = orders?.filter((o: any) => o.status === 'ready') || []

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">👨‍🍳</div>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Kitchen Display</h1>
              <p className="text-lg text-gray-600">Live order updates • Real-time sync</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-duo-yellow rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-duo-darkGray">{pendingOrders.length}</div>
              <div className="text-sm font-bold text-duo-darkGray">Pending</div>
            </div>
            <div className="bg-duo-blue rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-white">{preparingOrders.length}</div>
              <div className="text-sm font-bold text-white">Preparing</div>
            </div>
            <div className="bg-duo-success rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-white">{readyOrders.length}</div>
              <div className="text-sm font-bold text-white">Ready</div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 font-bold text-gray-600">Loading kitchen orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order: any, index: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <DuoCard className={`
                  ${order.status === 'pending' ? 'border-duo-yellow border-4' : ''}
                  ${order.status === 'preparing' ? 'border-duo-blue border-4' : ''}
                  ${order.status === 'ready' ? 'border-duo-success border-4' : ''}
                `}>
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-extrabold text-duo-darkGray">
                        #{order.id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.table_number ? `Table ${order.table_number}` : 'Takeout'}
                      </p>
                    </div>
                    <div className={`
                      px-3 py-1 rounded-full text-sm font-bold
                      ${order.status === 'pending' ? 'bg-duo-yellow text-duo-darkGray' : ''}
                      ${order.status === 'preparing' ? 'bg-duo-blue text-white' : ''}
                      ${order.status === 'ready' ? 'bg-duo-success text-white' : ''}
                    `}>
                      {order.status === 'pending' && '⏳ New'}
                      {order.status === 'preparing' && '👨‍🍳 Cooking'}
                      {order.status === 'ready' && '✅ Ready'}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between bg-duo-gray p-3 rounded-xl">
                        <div>
                          <span className="font-bold text-duo-darkGray">
                            {item.quantity}x
                          </span>
                          <span className="ml-2 text-duo-darkGray">
                            {item.product_name || item.name}
                          </span>
                          {item.notes && (
                            <p className="text-xs text-gray-600 italic mt-1">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {order.status === 'pending' && (
                      <DuoButton
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        variant="primary"
                        size="md"
                        className="w-full"
                      >
                        🔥 Start Cooking
                      </DuoButton>
                    )}
                    {order.status === 'preparing' && (
                      <DuoButton
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        variant="success"
                        size="md"
                        className="w-full"
                      >
                        ✅ Mark Ready
                      </DuoButton>
                    )}
                    {order.status === 'ready' && (
                      <DuoButton
                        onClick={() => handleStatusUpdate(order.id, 'served')}
                        variant="secondary"
                        size="md"
                        className="w-full"
                      >
                        🍽️ Served
                      </DuoButton>
                    )}
                  </div>
                </DuoCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <DuoCard hover={false}>
            <div className="text-center py-12">
              <div className="text-8xl mb-4">🎉</div>
              <h3 className="text-2xl font-extrabold text-duo-darkGray mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-600">No pending orders in the kitchen</p>
            </div>
          </DuoCard>
        )}
      </div>
    </div>
  )
}
