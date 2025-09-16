"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useWebSocket } from "@/hooks/use-websocket"
import { useAuth } from "@/hooks/use-auth"
import type { WebSocketMessage } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface WebSocketContextType {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  const { isConnected, lastMessage, connect, disconnect, sendMessage } = useWebSocket({
    onMessage: (message: WebSocketMessage) => {
      console.log("[v0] WebSocket message received:", message)

      // Show toast notifications for important updates
      switch (message.type) {
        case "order_update":
          toast({
            title: "Order Update",
            description: `Order #${message.data.id?.slice(-4)} status changed to ${message.data.status}`,
          })
          break
        case "payment_update":
          toast({
            title: "Payment Update",
            description: `Payment ${message.data.status} for order #${message.data.order_id?.slice(-4)}`,
          })
          break
        case "reservation_update":
          toast({
            title: "Reservation Update",
            description: `New reservation for ${message.data.customer_name}`,
          })
          break
      }
    },
    onConnect: () => {
      console.log("[v0] WebSocket connected successfully")
      toast({
        title: "Connected",
        description: "Real-time updates are now active",
      })
    },
    onDisconnect: () => {
      console.log("[v0] WebSocket disconnected")
      toast({
        title: "Disconnected",
        description: "Real-time updates are temporarily unavailable",
        variant: "destructive",
      })
    },
    onError: (error) => {
      console.error("[v0] WebSocket error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to establish real-time connection",
        variant: "destructive",
      })
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      console.log("[v0] User authenticated, connecting WebSocket")
      connect()
    } else {
      console.log("[v0] User not authenticated, disconnecting WebSocket")
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [isAuthenticated, connect, disconnect])

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>{children}</WebSocketContext.Provider>
  )
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider")
  }
  return context
}
