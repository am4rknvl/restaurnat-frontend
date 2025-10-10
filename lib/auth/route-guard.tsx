'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { UserRole } from './roles'

interface RouteGuardProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  fallbackPath?: string
}

export function RouteGuard({ children, requiredRoles, fallbackPath = '/dashboard' }: RouteGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = user?.role as UserRole | undefined
      const hasAccess = requiredRoles.includes(userRole!)

      if (!hasAccess) {
        router.push(fallbackPath)
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, fallbackPath, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-gray">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-duo-darkGray">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
