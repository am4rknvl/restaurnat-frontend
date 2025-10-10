import { useAuthStore } from '@/lib/stores/auth-store'
import { UserRole, hasPermission, hasAnyRole, belongsToGroup, RolePermissions, RoleGroups } from './roles'

export function useRole() {
  const { user } = useAuthStore()
  const role = user?.role as UserRole | undefined

  return {
    role,
    hasPermission: (permission: keyof typeof RolePermissions) => hasPermission(role, permission),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(role, roles),
    belongsToGroup: (group: keyof typeof RoleGroups) => belongsToGroup(role, group),
    isCustomer: role === 'customer',
    isWaiter: role === 'waiter',
    isChef: role === 'chef',
    isCashier: role === 'cashier',
    isManager: role === 'manager',
    isAdmin: role === 'admin',
  }
}
