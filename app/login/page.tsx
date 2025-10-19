'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getDefaultDashboard } from '@/lib/auth/roles'
import { motion } from 'framer-motion'
import { DuoButton } from '@/components/ui/duo-button'
import { DuoInput } from '@/components/ui/duo-input'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { signin, isLoading, error, clearError } = useAuthStore()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await signin(identifier, password)
      
      // Get the current user from store after signin
      const currentUser = useAuthStore.getState().user
      const userRole = currentUser?.role as any
      
      // Redirect based on role
      const redirectPath = getDefaultDashboard(userRole)
      router.push(redirectPath)
    } catch (err) {
      // Error handled by store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-duo-gray">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full mx-4"
      >
        {/* Logo/Mascot */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-8xl mb-4">🍽️</div>
          <h1 className="text-4xl font-extrabold text-duo-darkGray mb-2">
            Restaurant OS
          </h1>
          <p className="text-lg text-gray-600 font-semibold">
            Order, Earn XP, Level Up! 🚀
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 shadow-duo"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-duo-error/10 border-2 border-duo-error text-duo-error px-4 py-3 rounded-2xl font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <DuoInput
              label="Email or Phone"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="chef@restaurant.com"
            />

            <DuoInput
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <DuoButton
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Start Cooking! 🔥'
              )}
            </DuoButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New here?{' '}
              <Link href="/signup" className="text-duo-blue font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center"
        >
          <div className="bg-white rounded-2xl p-4 shadow-duo">
            <div className="text-2xl mb-1">👨‍🍳</div>
            <div className="text-xs font-bold text-duo-darkGray">1.2K+ Chefs</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-duo">
            <div className="text-2xl mb-1">🍕</div>
            <div className="text-xs font-bold text-duo-darkGray">50K+ Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-duo">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xs font-bold text-duo-darkGray">4.9 Rating</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
