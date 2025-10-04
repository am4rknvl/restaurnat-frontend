'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { motion } from 'framer-motion'
import { DuoButton } from '@/components/ui/duo-button'
import { DuoInput } from '@/components/ui/duo-input'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    restaurant_name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await signup({
        name: formData.name,
        identifier: formData.email || formData.phone,
        password: formData.password,
        restaurantName: formData.restaurant_name,
      })
      router.push('/dashboard')
    } catch (err) {
      // Error handled by store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-duo-gray p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-8xl mb-4">🍽️</div>
          <h1 className="text-4xl font-extrabold text-duo-darkGray mb-2">
            Join Restaurant OS
          </h1>
          <p className="text-lg text-gray-600 font-semibold">
            Start earning XP today! 🚀
          </p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 shadow-duo"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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
              label="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Chef John"
            />

            <DuoInput
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="chef@restaurant.com"
            />

            <DuoInput
              label="Phone (Optional)"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+1234567890"
            />

            <DuoInput
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />

            <DuoInput
              label="Restaurant Name (Optional)"
              value={formData.restaurant_name}
              onChange={(e) => setFormData({...formData, restaurant_name: e.target.value})}
              placeholder="My Amazing Restaurant"
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
                  Creating account...
                </div>
              ) : (
                '🎉 Create Account'
              )}
            </DuoButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-duo-blue font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center"
        >
          <div className="bg-white rounded-2xl p-4 shadow-duo">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xs font-bold text-duo-darkGray">Earn XP</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-duo">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xs font-bold text-duo-darkGray">Level Up</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-duo">
            <div className="text-2xl mb-1">🎁</div>
            <div className="text-xs font-bold text-duo-darkGray">Get Rewards</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
