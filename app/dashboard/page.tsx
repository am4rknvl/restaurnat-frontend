'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { useOrders } from '@/lib/hooks/use-orders'
import { useMenuItems } from '@/lib/hooks/use-menu'
import { useLoyalty } from '@/lib/hooks/use-loyalty'
import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { XPBadge } from '@/components/ui/xp-badge'
import { StreakCounter } from '@/components/ui/streak-counter'
import { ProgressBar } from '@/components/ui/progress-bar'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { data: menuItems, isLoading: menuLoading } = useMenuItems()
  const { data: loyaltyData } = useLoyalty()

  // Gamification calculations - use loyalty data if available, otherwise calculate from orders
  const totalOrders = orders?.length || 0
  const xp = loyaltyData?.points || (totalOrders * 10) // 10 XP per order
  const level = loyaltyData?.level || (Math.floor(xp / 100) + 1)
  const streak = loyaltyData?.streak || 0
  const xpToNextLevel = ((level * 100) - xp)
  const progressToNextLevel = ((xp % 100) / 100) * 100

  const todayOrders = orders?.filter((order: any) => {
    const orderDate = new Date(order.created_at)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  }) || []

  return (
    <div className="min-h-screen bg-duo-gray">
      {/* Top Nav */}
      <nav className="bg-white shadow-duo">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🍽️</div>
              <div>
                <h1 className="text-xl font-extrabold text-duo-darkGray">Restaurant OS</h1>
                <p className="text-sm text-gray-600">Welcome back, Chef!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <XPBadge xp={xp} level={level} />
              <DuoButton onClick={logout} variant="error" size="sm">
                Logout
              </DuoButton>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Streak & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <StreakCounter streak={streak} />
            <div className="text-sm font-bold text-duo-darkGray">
              {xpToNextLevel} XP to Level {level + 1}
            </div>
          </div>
          <ProgressBar progress={progressToNextLevel} color="green" />
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DuoCard>
            <div className="text-4xl mb-2">📦</div>
            <h3 className="text-sm font-bold text-gray-600 mb-1">Total Orders</h3>
            <p className="text-3xl font-extrabold text-duo-green">
              {ordersLoading ? '...' : totalOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">+{todayOrders.length} today</p>
          </DuoCard>

          <DuoCard>
            <div className="text-4xl mb-2">🍕</div>
            <h3 className="text-sm font-bold text-gray-600 mb-1">Menu Items</h3>
            <p className="text-3xl font-extrabold text-duo-yellow">
              {menuLoading ? '...' : menuItems?.length || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active items</p>
          </DuoCard>

          <DuoCard>
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="text-sm font-bold text-gray-600 mb-1">Your XP</h3>
            <p className="text-3xl font-extrabold text-duo-blue">
              {xp}
            </p>
            <p className="text-xs text-gray-500 mt-1">Keep cooking!</p>
          </DuoCard>

          <DuoCard>
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-sm font-bold text-gray-600 mb-1">Level</h3>
            <p className="text-3xl font-extrabold text-duo-success">
              {level}
            </p>
            <p className="text-xs text-gray-500 mt-1">Master Chef</p>
          </DuoCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/kitchen">
            <DuoCard className="cursor-pointer">
              <div className="text-5xl mb-3">👨‍🍳</div>
              <h3 className="text-lg font-extrabold text-duo-darkGray mb-2">Kitchen Display</h3>
              <p className="text-sm text-gray-600">View live orders</p>
            </DuoCard>
          </Link>

          <Link href="/dashboard/menu">
            <DuoCard className="cursor-pointer">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="text-lg font-extrabold text-duo-darkGray mb-2">Menu Manager</h3>
              <p className="text-sm text-gray-600">Edit your menu</p>
            </DuoCard>
          </Link>

          <Link href="/dashboard/orders">
            <DuoCard className="cursor-pointer">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="text-lg font-extrabold text-duo-darkGray mb-2">All Orders</h3>
              <p className="text-sm text-gray-600">Track everything</p>
            </DuoCard>
          </Link>
        </div>

        {/* Recent Orders */}
        <DuoCard hover={false}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-duo-darkGray">Recent Orders 🔥</h2>
            <Link href="/dashboard/orders">
              <DuoButton variant="secondary" size="sm">View All</DuoButton>
            </Link>
          </div>

          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 font-bold text-gray-600">Loading orders...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order: any, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-4 bg-duo-gray rounded-2xl hover:bg-duo-lightGray transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {order.status === 'completed' ? '✅' : 
                       order.status === 'preparing' ? '👨‍🍳' : 
                       order.status === 'ready' ? '🔔' : '📝'}
                    </div>
                    <div>
                      <p className="font-bold text-duo-darkGray">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-duo-green text-lg">
                      ${order.total?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-500">+10 XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍳</div>
              <p className="text-lg font-bold text-gray-600">No orders yet!</p>
              <p className="text-sm text-gray-500 mt-2">Start taking orders to earn XP</p>
            </div>
          )}
        </DuoCard>
      </div>
    </div>
  )
}
