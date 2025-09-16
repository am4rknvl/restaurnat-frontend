export interface Account {
  id: string
  phone_number: string
  balance: number
  created_at: string
  updated_at: string
}

export interface CreateAccountRequest {
  phone_number: string
}

export interface AccountBalanceResponse {
  account_id: string
  balance: number
  currency: string
}

export interface RequestOTPRequest {
  phone_number: string
  device_id: string
}

export interface VerifyOTPRequest {
  phone_number: string
  code: string
  device_id: string
}

export interface Order {
  id: string
  account_id: string
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  table_number?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

export interface CreateOrderRequest {
  account_id: string
  items: Omit<OrderItem, "id">[]
  table_number?: number
  notes?: string
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  transaction_id?: string
  created_at: string
  updated_at: string
}

export interface CreatePaymentRequest {
  order_id: string
  amount: number
  method: PaymentMethod
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  TELEBIRR = "telebirr",
  MOBILE = "mobile",
}

export interface Reservation {
  id: string
  customer_name: string
  customer_phone: string
  party_size: number
  date: string
  time: string
  table_number?: number
  status: ReservationStatus
  notes?: string
  created_at: string
  updated_at: string
}

export enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SEATED = "seated",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export interface Staff {
  id: string
  name: string
  phone: string
  role: StaffRole
  shift_start: string
  shift_end: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export enum StaffRole {
  MANAGER = "manager",
  WAITER = "waiter",
  CHEF = "chef",
  CASHIER = "cashier",
  HOST = "host",
}

export interface DashboardStats {
  total_revenue: number
  orders_today: number
  active_staff: number
  reservations_today: number
  revenue_change: number
  orders_change: number
}

export interface WebSocketMessage {
  type: "order_update" | "payment_update" | "reservation_update" | "staff_update"
  data: any
  timestamp: string
}
