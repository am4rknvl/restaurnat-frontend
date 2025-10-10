'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/lib/auth/use-role'
import { RoleGate } from '@/components/auth/role-gate'
import { motion } from 'framer-motion'

interface NavItem {
  label: string
  href: string
  icon: string
  permission?: string
  roles?: string[]
}

export function RoleBasedNav() {
  const pathname = usePathname()
  const { role, hasPermission } = useRole()

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'Orders', href: '/dashboard/orders', icon: '📦' },
    { label: 'Kitchen', href: '/dashboard/kitchen', icon: '👨‍🍳', roles: ['chef', 'manager', 'admin'] },
    { label: 'Staff', href: '/dashboard/staff', icon: '👥', roles: ['waiter', 'chef', 'host', 'cashier', 'manager', 'admin'] },
    { label: 'Menu', href: '/dashboard/menu', icon: '📋', roles: ['manager', 'admin'] },
    { label: 'Payments', href: '/dashboard/payments', icon: '💰', roles: ['cashier', 'manager', 'admin'] },
    { label: 'Loyalty', href: '/dashboard/loyalty', icon: '⭐' },
    { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
  ]

  return (
    <nav className="bg-white shadow-duo mb-6 rounded-2xl p-2">
      <div className="flex gap-2 overflow-x-auto">
        {navItems.map((item) => {
          // Check if user has access to this nav item
          if (item.roles && role && !item.roles.includes(role)) {
            return null
          }

          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 rounded-xl font-bold text-sm transition-colors
                  flex items-center gap-2 whitespace-nowrap
                  ${isActive 
                    ? 'bg-duo-green text-white' 
                    : 'bg-duo-gray text-duo-darkGray hover:bg-duo-lightGray'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
