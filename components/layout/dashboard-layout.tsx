'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { useRole } from '@/lib/auth/use-role'
import { getRoleDisplay } from '@/lib/auth/roles'
import { DuoButton } from '@/components/ui/duo-button'
import { XPBadge } from '@/components/ui/xp-badge'
import { RoleBasedNav } from './role-based-nav'
import { useRouter } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { role } = useRole()

  const roleDisplay = role ? getRoleDisplay(role) : null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-duo-gray">
      {/* Top Nav */}
      <nav className="bg-white shadow-duo sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🍽️</div>
              <div>
                <h1 className="text-xl font-extrabold text-duo-darkGray">Restaurant OS</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name || 'User'}!
                </p>
              </div>
              {roleDisplay && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${roleDisplay.color} bg-duo-lightGray`}>
                  {roleDisplay.emoji} {roleDisplay.name}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <XPBadge xp={0} level={1} />
              <DuoButton onClick={handleLogout} variant="error" size="sm">
                Logout
              </DuoButton>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <RoleBasedNav />
        {children}
      </div>
    </div>
  )
}
