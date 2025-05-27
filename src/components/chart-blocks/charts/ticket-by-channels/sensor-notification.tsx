"use client"

import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export type NotificationType = "alert" | "warning" | "info"

export interface SensorNotification {
  id: string
  sensorId: string
  type: NotificationType
  message: string
  timestamp: Date
  location: {
    longitude: number
    latitude: number
  }
  read: boolean
}

interface SensorNotificationProps {
  notification: SensorNotification
  onClick?: (notification: SensorNotification) => void
}

export function SensorNotificationItem({ notification, onClick }: SensorNotificationProps) {
  const { type, message, timestamp, sensorId, read } = notification

  const handleClick = () => {
    if (onClick) {
      onClick(notification)
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
        read ? "bg-background hover:bg-muted/50" : "bg-muted/50 hover:bg-muted",
        "border-l-4",
        type === "alert" ? "border-l-red-500" : type === "warning" ? "border-l-amber-500" : "border-l-blue-500",
      )}
      onClick={handleClick}
    >
      <div className="mt-1">
        {type === "alert" ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : type === "warning" ? (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        ) : (
          <Info className="h-5 w-5 text-blue-500" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm">Sensor {sensorId}</p>
          <span className="text-xs text-muted-foreground">{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
        </div>
        <p className="text-sm text-foreground">{message}</p>
      </div>
    </div>
  )
}
