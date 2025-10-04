import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )

    // Load token from localStorage on init
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // ==================== AUTH ENDPOINTS ====================
  
  auth = {
    requestOTP: (phoneNumber: string, deviceId: string) =>
      this.client.post('/api/v1/auth/request-otp', { phone_number: phoneNumber, device_id: deviceId }),

    verifyOTP: (phoneNumber: string, code: string, deviceId: string) =>
      this.client.post('/api/v1/auth/verify-otp', { phone_number: phoneNumber, code, device_id: deviceId }),

    refresh: (refreshToken: string) =>
      this.client.post('/api/v1/auth/refresh', { refresh_token: refreshToken }),

    logout: () =>
      this.client.post('/api/v1/auth/logout'),

    signup: (data: { name?: string; email?: string; phone?: string; password: string; restaurant_name?: string }) =>
      this.client.post('/api/v1/auth/signup', data),

    signin: (identifier: string, password: string) =>
      this.client.post('/api/v1/auth/signin', { identifier, password }),
  }

  // ==================== ORDER ENDPOINTS ====================
  
  orders = {
    create: (orderData: any) =>
      this.client.post('/api/v1/orders', orderData),

    sync: (orders: any[]) =>
      this.client.post('/api/v1/orders/sync', { orders }),

    get: (id: string) =>
      this.client.get(`/api/v1/orders/${id}`),

    list: (params?: { customer_id?: string; status?: string; page?: number }) =>
      this.client.get('/api/v1/orders', { params }),

    listByCustomer: (customerId: string) =>
      this.client.get(`/api/v1/orders/customer/${customerId}`),

    reorder: (id: string) =>
      this.client.post(`/api/v1/orders/${id}/reorder`),

    updateStatus: (id: string, status: string) =>
      this.client.put(`/api/v1/orders/${id}/status`, { status }),

    setETA: (id: string, eta: string) =>
      this.client.put(`/api/v1/orders/${id}/eta`, { eta }),

    split: (id: string, splitData: any) =>
      this.client.post(`/api/v1/orders/${id}/split`, splitData),

    merge: (orderIds: string[]) =>
      this.client.post('/api/v1/orders/merge', { order_ids: orderIds }),
  }

  // ==================== MENU ENDPOINTS ====================
  
  menu = {
    getQRMenu: (restaurantId: string, tableId: string) =>
      this.client.get(`/api/v1/restaurant/${restaurantId}/table/${tableId}/menu`),

    categories: {
      create: (data: any) =>
        this.client.post('/api/v1/menu/categories', data),

      get: (id: string) =>
        this.client.get(`/api/v1/menu/categories/${id}`),

      list: () =>
        this.client.get('/api/v1/menu/categories'),

      update: (id: string, data: any) =>
        this.client.put(`/api/v1/menu/categories/${id}`, data),

      delete: (id: string) =>
        this.client.delete(`/api/v1/menu/categories/${id}`),
    },

    items: {
      create: (data: any) =>
        this.client.post('/api/v1/menu/items', data),

      get: (id: string) =>
        this.client.get(`/api/v1/menu/items/${id}`),

      list: (params?: { category?: string; available?: boolean }) =>
        this.client.get('/api/v1/menu/items', { params }),

      update: (id: string, data: any) =>
        this.client.put(`/api/v1/menu/items/${id}`, data),

      updateAvailability: (id: string, available: boolean) =>
        this.client.patch(`/api/v1/menu/items/${id}/availability`, { available }),

      delete: (id: string) =>
        this.client.delete(`/api/v1/menu/items/${id}`),
    },

    variants: {
      create: (itemId: string, data: any) =>
        this.client.post(`/api/v1/menu/items/${itemId}/variants`, data),

      update: (id: string, data: any) =>
        this.client.put(`/api/v1/menu/variants/${id}`, data),

      delete: (id: string) =>
        this.client.delete(`/api/v1/menu/variants/${id}`),
    },

    addons: {
      create: (itemId: string, data: any) =>
        this.client.post(`/api/v1/menu/items/${itemId}/addons`, data),

      update: (id: string, data: any) =>
        this.client.put(`/api/v1/menu/addons/${id}`, data),

      delete: (id: string) =>
        this.client.delete(`/api/v1/menu/addons/${id}`),
    },
  }

  // ==================== TABLE & SESSION ENDPOINTS ====================
  
  tables = {
    create: (data: any) =>
      this.client.post('/api/v1/tables', data),

    list: () =>
      this.client.get('/api/v1/tables'),

    get: (id: string) =>
      this.client.get(`/api/v1/tables/${id}`),

    updateState: (id: string, state: string) =>
      this.client.patch(`/api/v1/tables/${id}/state`, { state }),

    assignWaiter: (tableId: string, waiterId: string) =>
      this.client.post(`/api/v1/tables/${tableId}/assign-waiter`, { waiter_id: waiterId }),
  }

  sessions = {
    start: (tableId: string) =>
      this.client.post('/api/v1/sessions', { table_id: tableId }),

    get: (id: string) =>
      this.client.get(`/api/v1/sessions/${id}`),

    close: (id: string) =>
      this.client.put(`/api/v1/sessions/${id}/close`),
  }

  // ==================== RESERVATION ENDPOINTS ====================
  
  reservations = {
    create: (data: any) =>
      this.client.post('/api/v1/reservations', data),

    list: (params?: { date?: string; status?: string }) =>
      this.client.get('/api/v1/reservations', { params }),

    update: (id: string, data: any) =>
      this.client.put(`/api/v1/reservations/${id}`, data),

    cancel: (id: string) =>
      this.client.delete(`/api/v1/reservations/${id}`),
  }

  // ==================== CUSTOMER ENDPOINTS ====================
  
  customer = {
    me: () =>
      this.client.get('/api/v1/me'),

    updateMe: (data: any) =>
      this.client.patch('/api/v1/me', data),

    loyalty: {
      get: () =>
        this.client.get('/api/v1/loyalty'),

      redeem: (points: number) =>
        this.client.post('/api/v1/loyalty/redeem', { points }),
    },

    promo: {
      apply: (code: string, orderId: string) =>
        this.client.post('/api/v1/promo/apply', { code, order_id: orderId }),
    },

    waitlist: {
      join: (branchId: string, data: any) =>
        this.client.post(`/api/v1/branches/${branchId}/waitlist`, data),

      update: (branchId: string, entryId: string, data: any) =>
        this.client.patch(`/api/v1/branches/${branchId}/waitlist/${entryId}`, data),
    },
  }

  // ==================== FAVORITES & REVIEWS ====================
  
  favorites = {
    add: (menuItemId: string) =>
      this.client.post('/api/v1/favorites', { menu_item_id: menuItemId }),

    remove: (menuItemId: string) =>
      this.client.delete(`/api/v1/favorites/${menuItemId}`),
  }

  reviews = {
    create: (data: any) =>
      this.client.post('/api/v1/reviews', data),
  }

  // ==================== NOTIFICATIONS ====================
  
  notifications = {
    subscribe: (data: any) =>
      this.client.post('/api/v1/notifications/subscribe', data),

    unsubscribe: (id: string) =>
      this.client.delete(`/api/v1/notifications/${id}`),

    listForAccount: (accountId: string) =>
      this.client.get(`/api/v1/notifications/account/${accountId}`),

    send: (data: any) =>
      this.client.post('/api/v1/kitchen/notifications/send', data),
  }

  // ==================== STAFF ENDPOINTS ====================
  
  staff = {
    updateTableState: (branchId: string, tableId: string, state: string) =>
      this.client.patch(`/api/v1/staff/branches/${branchId}/tables/${tableId}/state`, { state }),

    assignWaiterToTable: (branchId: string, tableId: string, waiterId: string) =>
      this.client.post(`/api/v1/staff/branches/${branchId}/tables/${tableId}/assign`, { waiter_id: waiterId }),

    assignChefToOrder: (branchId: string, orderId: string, chefId: string) =>
      this.client.post(`/api/v1/staff/branches/${branchId}/orders/${orderId}/assign-chef`, { chef_id: chefId }),

    splitOrder: (branchId: string, orderId: string, splitData: any) =>
      this.client.post(`/api/v1/staff/branches/${branchId}/orders/${orderId}/split`, splitData),

    mergeOrders: (branchId: string, orderIds: string[]) =>
      this.client.post(`/api/v1/staff/branches/${branchId}/orders/merge`, { order_ids: orderIds }),

    addTip: (branchId: string, orderId: string, amount: number) =>
      this.client.post(`/api/v1/staff/branches/${branchId}/orders/${orderId}/tip`, { amount }),
  }

  // ==================== KITCHEN ENDPOINTS ====================
  
  kitchen = {
    listPendingOrders: () =>
      this.client.get('/api/v1/kitchen/orders'),

    updateOrderStatus: (id: string, status: string) =>
      this.client.put(`/api/v1/kitchen/orders/${id}/status`, { status }),
  }

  // ==================== PAYMENT ENDPOINTS ====================
  
  payments = {
    create: (data: any) =>
      this.client.post('/api/v1/payments', data),

    get: (id: string) =>
      this.client.get(`/api/v1/payments/${id}`),

    refund: (id: string, amount?: number) =>
      this.client.post(`/api/v1/payments/${id}/refund`, { amount }),

    partial: (data: any) =>
      this.client.post('/api/v1/payments/partial', data),

    addTip: (id: string, amount: number) =>
      this.client.post(`/api/v1/payments/${id}/tip`, { amount }),

    telebirr: {
      b2b: {
        create: (data: any) =>
          this.client.post('/api/v1/payments/telebirr/b2b/create', data),

        getStatus: (prepayId: string) =>
          this.client.get(`/api/v1/payments/telebirr/b2b/status/${prepayId}`),

        getOrderPayments: (orderId: string) =>
          this.client.get(`/api/v1/payments/telebirr/b2b/orders/${orderId}`),

        refund: (data: any) =>
          this.client.post('/api/v1/payments/telebirr/b2b/refund', data),
      },

      c2b: {
        create: (data: any) =>
          this.client.post('/api/v1/payments/telebirr/c2b/create', data),

        getStatus: (outTradeNo: string) =>
          this.client.get(`/api/v1/payments/telebirr/c2b/status/${outTradeNo}`),

        getOrderPayments: (orderId: string) =>
          this.client.get(`/api/v1/payments/telebirr/c2b/orders/${orderId}`),

        query: (outTradeNo: string) =>
          this.client.get(`/api/v1/payments/telebirr/c2b/query/${outTradeNo}`),

        refund: (data: any) =>
          this.client.post('/api/v1/payments/telebirr/c2b/refund', data),
      },
    },
  }

  // ==================== ACCOUNT ENDPOINTS ====================
  
  accounts = {
    getBalance: (id: string) =>
      this.client.get(`/api/v1/accounts/${id}/balance`),

    create: (data: any) =>
      this.client.post('/api/v1/accounts', data),

    get: (id: string) =>
      this.client.get(`/api/v1/accounts/${id}`),

    update: (id: string, data: any) =>
      this.client.put(`/api/v1/accounts/${id}`, data),

    assignRole: (id: string, role: string) =>
      this.client.post(`/api/v1/accounts/${id}/roles`, { role }),

    removeRole: (id: string, role: string) =>
      this.client.delete(`/api/v1/accounts/${id}/roles/${role}`),

    loyalty: {
      get: (id: string) =>
        this.client.get(`/api/v1/accounts/${id}/loyalty`),

      earn: (id: string, points: number) =>
        this.client.post(`/api/v1/accounts/${id}/loyalty/earn`, { points }),
    },
  }

  // ==================== ENTERPRISE/ADMIN ENDPOINTS ====================
  
  enterprise = {
    inventory: {
      list: () =>
        this.client.get('/api/v1/inventory'),

      create: (data: any) =>
        this.client.post('/api/v1/inventory', data),

      update: (id: string, data: any) =>
        this.client.put(`/api/v1/inventory/${id}`, data),

      adjust: (id: string, quantity: number) =>
        this.client.patch(`/api/v1/inventory/${id}/adjust`, { quantity }),
    },

    staffAssignments: {
      list: () =>
        this.client.get('/api/v1/staff/assignments'),
    },

    discounts: {
      create: (data: any) =>
        this.client.post('/api/v1/discounts', data),

      apply: (code: string, orderId: string) =>
        this.client.post('/api/v1/discounts/apply', { code, order_id: orderId }),
    },

    reports: {
      sales: (params?: { start_date?: string; end_date?: string }) =>
        this.client.get('/api/v1/reports/sales', { params }),

      popularItems: (params?: { limit?: number }) =>
        this.client.get('/api/v1/reports/popular-items', { params }),

      topCustomers: (params?: { limit?: number }) =>
        this.client.get('/api/v1/reports/customers/top', { params }),
    },

    restaurants: {
      list: () =>
        this.client.get('/api/v1/restaurants'),

      create: (data: any) =>
        this.client.post('/api/v1/restaurants', data),

      update: (id: string, data: any) =>
        this.client.put(`/api/v1/restaurants/${id}`, data),
    },

    waitlist: {
      join: (data: any) =>
        this.client.post('/api/v1/waitlist', data),

      list: () =>
        this.client.get('/api/v1/waitlist'),
    },
  }

  // ==================== CATEGORIES (Standalone) ====================
  
  categories = {
    create: (data: any) =>
      this.client.post('/api/v1/categories', data),

    list: () =>
      this.client.get('/api/v1/categories'),

    update: (id: string, data: any) =>
      this.client.put(`/api/v1/categories/${id}`, data),

    delete: (id: string) =>
      this.client.delete(`/api/v1/categories/${id}`),
  }
}

export const apiClient = new ApiClient()
