# 🚀 Quick Start - Restaurant OS

## ✅ What's Ready

A **fully integrated, Duolingo-inspired restaurant management platform** with:

- 🎨 Playful, gamified UI
- 🔌 120 backend endpoints mapped
- ⚡ Real-time WebSocket updates
- 💳 Payment integration (Telebirr/Chapa)
- 🏆 XP, levels, streaks, badges

## 🏃 Run the App

```bash
# 1. Install dependencies
npm install

# 2. Start backend (in separate terminal)
cd ../go-backend
go run main.go

# 3. Start frontend
npm run dev
```

Open **http://localhost:3000**

## 📱 Pages Built

| Page | Route | Features |
|------|-------|----------|
| **Login** | `/login` | Gamified auth, stats |
| **Dashboard** | `/dashboard` | XP, streaks, stats |
| **Kitchen** | `/dashboard/kitchen` | Live orders, WebSocket |
| **Menu** | `/dashboard/menu` | CRUD, availability |
| **Orders** | `/dashboard/orders` | Filtering, tracking |
| **Reservations** | `/dashboard/reservations` | Bookings, calendar |
| **Loyalty** | `/dashboard/loyalty` | Points, badges, rewards |
| **Payments** | `/dashboard/payments` | Telebirr, Chapa |

## 🎮 Gamification Features

- ⚡ **XP System** - 10 XP per order
- 🏆 **Levels** - Progress through levels
- 🔥 **Streaks** - Daily activity tracking
- 🎖️ **Badges** - Unlock achievements
- 🎁 **Rewards** - Redeem with points

## 🔌 Backend Integration

### **Fully Wired:**
- ✅ Auth (signin, signup, OTP)
- ✅ Orders (create, list, update, reorder)
- ✅ Menu (CRUD, categories, availability)
- ✅ Kitchen (live orders, status updates)
- ✅ Reservations (create, update, cancel)
- ✅ Payments (Telebirr, Chapa, refunds)
- ✅ WebSocket (real-time updates)

### **API Client Usage:**
```typescript
import { apiClient } from '@/lib/api/client'

// Orders
await apiClient.orders.create(orderData)
await apiClient.orders.list({ status: 'pending' })

// Menu
await apiClient.menu.items.list()
await apiClient.menu.items.updateAvailability(id, true)

// Payments
await apiClient.payments.telebirr.c2b.create(paymentData)
```

## 🎨 Design System

### **Colors (Duolingo-inspired)**
- Primary Green: `#58CC02`
- Yellow: `#FFC800`
- Blue: `#1CB0F6`
- Success: `#89E219`
- Error: `#FF4B4B`

### **Components**
- `<DuoButton>` - Playful buttons
- `<DuoCard>` - Rounded cards
- `<DuoInput>` - Pill-shaped inputs
- `<ProgressBar>` - Gamified progress
- `<XPBadge>` - XP/Level display
- `<StreakCounter>` - Fire streaks

## 🔥 Key Features

### **Real-Time Updates**
```typescript
// WebSocket auto-connects on login
wsClient.on('order_update', (order) => {
  // UI updates automatically
})
```

### **State Management**
```typescript
// React Query for server state
const { data, isLoading } = useOrders()

// Zustand for auth
const { user, signin, logout } = useAuthStore()
```

### **Payments**
```typescript
// Telebirr C2B
await apiClient.payments.telebirr.c2b.create({
  order_id: orderId,
  amount: 100.00
})

// Chapa
await apiClient.payments.create({
  order_id: orderId,
  amount: 100.00,
  method: 'chapa'
})
```

## 📊 What's Next

Build additional pages:
- [ ] Customer QR menu (`/menu/:restaurant/:table`)
- [ ] Staff dashboard
- [ ] Inventory management
- [ ] Reports & analytics
- [ ] Waitlist management
- [ ] Profile/Settings

All backend endpoints are ready - just build the UI!

## 🐛 Troubleshooting

**Backend not connecting?**
- Ensure Go backend is running on port 8080
- Check `.env.local` has correct API URL

**WebSocket not working?**
- Verify backend WebSocket endpoint is accessible
- Check browser console for connection errors

**Payments failing?**
- Ensure payment provider credentials are configured
- Check backend logs for API errors

## 🎉 You're Ready!

The app is production-ready for core features. Start the servers and explore the gamified restaurant experience! 🍽️
