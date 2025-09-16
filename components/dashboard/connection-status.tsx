"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { useWebSocketContext } from "./websocket-provider"

export function ConnectionStatus() {
  const { isConnected } = useWebSocketContext()

  return (
    <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center space-x-1">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </>
      )}
    </Badge>
  )
}
