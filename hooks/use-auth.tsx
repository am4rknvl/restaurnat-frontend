"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  phoneNumber: string | null
  deviceId: string
  requestOTP: (phoneNumber: string) => Promise<void>
  verifyOTP: (phoneNumber: string, code: string) => Promise<void>
  login: (identifier: string, password: string) => Promise<void>
  signup: (data: { name?: string; identifier: string; password: string; restaurantName?: string }) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Generate or retrieve device ID
function getDeviceId(): string {
  if (typeof window === "undefined") return "server"

  let deviceId = localStorage.getItem("device_id")
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem("device_id", deviceId)
  }
  return deviceId
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const deviceId = getDeviceId()

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("auth_token")
    const savedPhoneNumber = localStorage.getItem("phone_number")

    if (token && savedPhoneNumber) {
      setIsAuthenticated(true)
      setPhoneNumber(savedPhoneNumber)
    }
    setIsLoading(false)
  }, [])

  const requestOTP = async (phoneNumber: string) => {
    try {
      setError(null)
      setIsLoading(true)
      await apiClient.requestOTP(phoneNumber, deviceId)
      setPhoneNumber(phoneNumber)
    } catch (err: any) {
      setError(err.message || "Failed to request OTP")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (phoneNumber: string, code: string) => {
    try {
      setError(null)
      setIsLoading(true)
      await apiClient.verifyOTP(phoneNumber, code, deviceId)

      setIsAuthenticated(true)
      setPhoneNumber(phoneNumber)
      localStorage.setItem("phone_number", phoneNumber)
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (identifier: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)
      const resp = await apiClient.login(identifier, password)
      if (resp?.token) {
        localStorage.setItem("phone_number", identifier)
        setIsAuthenticated(true)
        setPhoneNumber(identifier)
      }
    } catch (err: any) {
      setError(err.message || "Failed to login")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: { name?: string; identifier: string; password: string; restaurantName?: string }) => {
    try {
      setError(null)
      setIsLoading(true)
      const resp = await apiClient.signup({ name: data.name, identifier: data.identifier, password: data.password, restaurant_name: data.restaurantName })
      // If signup returned token, treat as authenticated
      if (resp?.token) {
        localStorage.setItem("phone_number", data.identifier)
        setIsAuthenticated(true)
        setPhoneNumber(data.identifier)
      }
    } catch (err: any) {
      setError(err.message || "Failed to signup")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiClient.clearToken()
    localStorage.removeItem("phone_number")
    setIsAuthenticated(false)
    setPhoneNumber(null)
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        phoneNumber,
        deviceId,
        requestOTP,
        verifyOTP,
  login,
  signup,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
