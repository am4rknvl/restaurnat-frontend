'use client'

import { useRole } from '@/lib/auth/use-role'
import { UserRole, RolePermissions } from '@/lib/auth/roles'

interface RoleGateProps {
  children: React.ReactNode
  roles?: UserRole[]
  permission?: keyof typeof RolePermissions
  fallback?: React.ReactNode
}

export function RoleGate({ children, roles, permission, fallback = null }: RoleGateProps) {
  const { role, hasPermission: checkPermission, hasAnyRole } = useRole()

  let hasAccess = false

  if (permission) {
    hasAccess = checkPermission(permission)
  } else if (roles && roles.length > 0) {
    hasAccess = hasAnyRole(roles)
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
