/**
 * Role-Based Access Control (RBAC) Utilities
 * Matches backend role groups defined in middleware
 */

// Define all user roles
export type UserRole = 
  | 'customer'
  | 'waiter'
  | 'chef'
  | 'host'
  | 'cashier'
  | 'manager'
  | 'admin'

// Role groups matching backend middleware
export const RoleGroups = {
  CUSTOMER: ['customer', 'waiter', 'chef', 'cashier', 'admin'] as UserRole[],
  STAFF: ['waiter', 'chef', 'host', 'cashier', 'manager', 'admin'] as UserRole[],
  KITCHEN: ['chef', 'manager', 'admin'] as UserRole[],
  MANAGEMENT: ['manager', 'admin'] as UserRole[],
  ADMIN: ['admin'] as UserRole[],
} as const

// Role permissions for UI features
export const RolePermissions = {
  // Customer features
  canOrderFood: ['customer', 'waiter', 'chef', 'cashier', 'admin'] as UserRole[],
  canViewLoyalty: ['customer', 'waiter', 'chef', 'cashier', 'admin'] as UserRole[],
  canMakeFavorites: ['customer', 'waiter', 'chef', 'cashier', 'admin'] as UserRole[],
  canWriteReviews: ['customer', 'waiter', 'chef', 'cashier', 'admin'] as UserRole[],
  
  // Staff features
  canManageTables: ['waiter', 'host', 'manager', 'admin'] as UserRole[],
  canAssignWaiters: ['manager', 'admin'] as UserRole[],
  canSplitOrders: ['waiter', 'cashier', 'manager', 'admin'] as UserRole[],
  canMergeOrders: ['waiter', 'cashier', 'manager', 'admin'] as UserRole[],
  canHandlePayments: ['waiter', 'cashier', 'manager', 'admin'] as UserRole[],
  
  // Kitchen features
  canViewKitchenDisplay: ['chef', 'manager', 'admin'] as UserRole[],
  canUpdateOrderStatus: ['chef', 'manager', 'admin'] as UserRole[],
  
  // Management features
  canManageMenu: ['manager', 'admin'] as UserRole[],
  canViewReports: ['manager', 'admin'] as UserRole[],
  canManageStaff: ['manager', 'admin'] as UserRole[],
  canManageInventory: ['manager', 'admin'] as UserRole[],
  
  // Admin features
  canManageRestaurants: ['admin'] as UserRole[],
  canAssignRoles: ['admin'] as UserRole[],
  canAccessAdminPanel: ['admin'] as UserRole[],
} as const

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  return userRole === requiredRole
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

/**
 * Check if user belongs to a role group
 */
export function belongsToGroup(userRole: UserRole | undefined, group: keyof typeof RoleGroups): boolean {
  if (!userRole) return false
  return RoleGroups[group].includes(userRole)
}

/**
 * Check if user has permission for a specific feature
 */
export function hasPermission(userRole: UserRole | undefined, permission: keyof typeof RolePermissions): boolean {
  if (!userRole) return false
  return RolePermissions[permission].includes(userRole)
}

/**
 * Get user's accessible routes based on role
 */
export function getAccessibleRoutes(userRole: UserRole | undefined): string[] {
  if (!userRole) return ['/login']

  const routes: string[] = []

  // Customer routes
  if (hasAnyRole(userRole, RoleGroups.CUSTOMER)) {
    routes.push('/dashboard', '/dashboard/profile', '/dashboard/loyalty', '/dashboard/orders')
  }

  // Staff routes
  if (hasAnyRole(userRole, RoleGroups.STAFF)) {
    routes.push('/dashboard/staff', '/dashboard/reservations')
  }

  // Kitchen routes
  if (hasAnyRole(userRole, RoleGroups.KITCHEN)) {
    routes.push('/dashboard/kitchen')
  }

  // Management routes
  if (hasAnyRole(userRole, RoleGroups.MANAGEMENT)) {
    routes.push('/dashboard/menu', '/dashboard/menu/add', '/dashboard/reports', '/dashboard/inventory')
  }

  // Payment routes
  if (hasPermission(userRole, 'canHandlePayments')) {
    routes.push('/dashboard/payments')
  }

  return routes
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(userRole: UserRole | undefined, route: string): boolean {
  const accessibleRoutes = getAccessibleRoutes(userRole)
  
  // Check exact match
  if (accessibleRoutes.includes(route)) return true
  
  // Check if route starts with any accessible route (for nested routes)
  return accessibleRoutes.some(r => route.startsWith(r))
}

/**
 * Get role display name and emoji
 */
export function getRoleDisplay(role: UserRole): { name: string; emoji: string; color: string } {
  const displays = {
    customer: { name: 'Customer', emoji: '👤', color: 'text-duo-blue' },
    waiter: { name: 'Waiter', emoji: '🤵', color: 'text-duo-green' },
    chef: { name: 'Chef', emoji: '👨‍🍳', color: 'text-duo-yellow' },
    host: { name: 'Host', emoji: '👋', color: 'text-duo-purple' },
    cashier: { name: 'Cashier', emoji: '💰', color: 'text-duo-success' },
    manager: { name: 'Manager', emoji: '💼', color: 'text-duo-orange' },
    admin: { name: 'Admin', emoji: '⚡', color: 'text-duo-error' },
  }
  return displays[role]
}

/**
 * Get default dashboard route for role
 */
export function getDefaultDashboard(role: UserRole | undefined): string {
  if (!role) return '/login'

  if (hasRole(role, 'chef')) return '/dashboard/kitchen'
  if (hasRole(role, 'waiter')) return '/dashboard/staff'
  if (hasRole(role, 'manager') || hasRole(role, 'admin')) return '/dashboard'
  
  return '/dashboard'
}
