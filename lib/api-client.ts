const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl
    // Load token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    // Build headers as a plain object to avoid HeadersInit index typing issues
    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    }

    if (this.token) {
      baseHeaders["Authorization"] = `Bearer ${this.token}`
    }
    const headers: HeadersInit = baseHeaders

    console.log(`[v0] API Request: ${options.method || "GET"} ${url}`)

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`[v0] API Error: ${response.status} - ${errorData.error || "Request failed"}`)
      throw new ApiError(response.status, errorData.error || "Request failed")
    }

    const data = await response.json()
    console.log(`[v0] API Response:`, data)
    return data
  }

  // Auth endpoints
  async requestOTP(phoneNumber: string, deviceId: string) {
    return this.request<{ message: string }>("/api/v1/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber, device_id: deviceId }),
    })
  }

  async verifyOTP(phoneNumber: string, code: string, deviceId: string) {
    const response = await this.request<{ token: string }>("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber, code, device_id: deviceId }),
    })
    this.setToken(response.token)
    return response
  }

  // Traditional email/phone + password auth (bypass OTP if desired)
  async login(identifier: string, password: string) {
    const response = await this.request<{ token: string }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    })
    this.setToken(response.token)
    return response
  }

  async signup(data: { name?: string; identifier: string; password: string; restaurant_name?: string }) {
    const response = await this.request<any>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
    // If backend returns token on signup, set it
    if (response?.token) {
      this.setToken(response.token)
    }
    return response
  }

  // Order endpoints
  async createOrder(orderData: any) {
    return this.request<any>("/api/v1/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async getOrder(id: string) {
    return this.request<any>(`/api/v1/orders/${id}`)
  }

  async getOrders() {
    return this.request<any[]>("/api/v1/orders")
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<any>(`/api/v1/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  // Payment endpoints
  async createPayment(paymentData: any) {
    return this.request<any>("/api/v1/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    })
  }

  async getPayment(id: string) {
    return this.request<any>(`/api/v1/payments/${id}`)
  }

  // Account endpoints
  async getAccountBalance(id: string) {
    return this.request<any>(`/api/v1/accounts/${id}/balance`)
  }

  async createAccount(phoneNumber: string) {
    return this.request<any>("/api/v1/accounts", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber }),
    })
  }

  // Kitchen endpoints
  async getKitchenOrders() {
    return this.request<any[]>("/api/v1/kitchen/orders")
  }

  async updateKitchenOrderStatus(id: string, status: string) {
    return this.request<any>(`/api/v1/kitchen/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  // Products
  async getProducts(params?: { page?: number; q?: string; category?: string }) {
    const qs = new URLSearchParams()
    if (params?.page) qs.set('page', String(params.page))
    if (params?.q) qs.set('q', params.q)
    if (params?.category) qs.set('category', params.category)
    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    return this.request<any[]>(`/api/v1/products${suffix}`)
  }

  async getProduct(id: string) {
    return this.request<any>(`/api/v1/products/${id}`)
  }

  // Reservations
  async getReservations() {
    return this.request<any[]>('/api/v1/reservations')
  }

  async getReservation(id: string) {
    return this.request<any>(`/api/v1/reservations/${id}`)
  }

  async createReservation(payload: any) {
    return this.request<any>('/api/v1/reservations', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async updateReservation(id: string, payload: any) {
    return this.request<any>(`/api/v1/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  // Staff
  async getStaff() {
    return this.request<any[]>('/api/v1/staff')
  }

  async getStaffMember(id: string) {
    return this.request<any>(`/api/v1/staff/${id}`)
  }
}

export const apiClient = new ApiClient()
