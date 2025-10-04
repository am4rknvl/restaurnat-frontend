import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../api/client'
import { wsClient } from '../websocket/client'

interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  signin: (identifier: string, password: string) => Promise<void>
  signup: (data: any) => Promise<void>
  requestOTP: (phoneNumber: string) => Promise<void>
  verifyOTP: (phoneNumber: string, code: string) => Promise<void>
  logout: () => void
  clearError: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signin: async (identifier: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.auth.signin(identifier, password)
          const { token, user } = response.data

          apiClient.setToken(token)
          wsClient.connect(token)

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Sign in failed',
            isLoading: false,
          })
          throw error
        }
      },

      signup: async (data: any) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.auth.signup(data)
          const { token, user } = response.data

          if (token) {
            apiClient.setToken(token)
            wsClient.connect(token)

            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({ isLoading: false })
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Sign up failed',
            isLoading: false,
          })
          throw error
        }
      },

      requestOTP: async (phoneNumber: string) => {
        set({ isLoading: true, error: null })
        try {
          const deviceId = localStorage.getItem('device_id') || crypto.randomUUID()
          localStorage.setItem('device_id', deviceId)

          await apiClient.auth.requestOTP(phoneNumber, deviceId)
          set({ isLoading: false })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to request OTP',
            isLoading: false,
          })
          throw error
        }
      },

      verifyOTP: async (phoneNumber: string, code: string) => {
        set({ isLoading: true, error: null })
        try {
          const deviceId = localStorage.getItem('device_id') || crypto.randomUUID()
          const response = await apiClient.auth.verifyOTP(phoneNumber, code, deviceId)
          const { token, user } = response.data

          apiClient.setToken(token)
          wsClient.connect(token)

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'OTP verification failed',
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        apiClient.clearToken()
        wsClient.disconnect()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),

      fetchUser: async () => {
        try {
          const response = await apiClient.customer.me()
          set({ user: response.data })
        } catch (error) {
          console.error('Failed to fetch user:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
