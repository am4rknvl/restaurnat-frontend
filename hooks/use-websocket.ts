"use client"

import { useEffect, useRef, useState } from "react"
import type { WebSocketMessage } from "@/lib/types"

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/api/v1/ws"
    const token = localStorage.getItem("auth_token")

    if (!token) {
      console.warn("No auth token found for WebSocket connection")
      return
    }

    try {
      wsRef.current = new WebSocket(`${wsUrl}?token=${token}`)

      wsRef.current.onopen = () => {
        console.log("[v0] WebSocket connected")
        setIsConnected(true)
        options.onConnect?.()
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log("[v0] WebSocket message received:", message)
          setLastMessage(message)
          options.onMessage?.(message)
        } catch (error) {
          console.error("[v0] Failed to parse WebSocket message:", error)
        }
      }

      wsRef.current.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        setIsConnected(false)
        options.onDisconnect?.()

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 3000)
      }

      wsRef.current.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        options.onError?.(error)
      }
    } catch (error) {
      console.error("[v0] Failed to create WebSocket connection:", error)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
  }

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn("[v0] WebSocket not connected, cannot send message")
    }
  }

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  return {
    isConnected,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
  }
}
