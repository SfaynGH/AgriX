"use client"

import { useState, useEffect } from "react"
import { SensorNotificationItem, type SensorNotification } from "./sensor-notification"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, RefreshCw } from "lucide-react"
import { generateSensorNotification } from "@/lib/generate-sensor-data"

interface SensorNotificationsListProps {
  initialNotifications?: SensorNotification[]
  onNotificationClick?: (notification: SensorNotification) => void
  autoRefresh?: boolean
  refreshInterval?: number
}

export function SensorNotificationsList({
  initialNotifications = [],
  onNotificationClick,
  autoRefresh = true,
  refreshInterval = 10000, // 10 seconds
}: SensorNotificationsListProps) {
  const [notifications, setNotifications] = useState<SensorNotification[]>(initialNotifications)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(autoRefresh)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Function to add a new notification
  const addNewNotification = () => {
    const newNotification = generateSensorNotification()
    setNotifications((prev) => [newNotification, ...prev])
  }

  // Mark a notification as read
  const handleNotificationClick = (notification: SensorNotification) => {
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))

    if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  // Auto-refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isAutoRefreshEnabled) {
      intervalId = setInterval(() => {
        // 30% chance of getting a new notification on each interval
        if (Math.random() < 0.3) {
          addNewNotification()
        }
      }, refreshInterval)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isAutoRefreshEnabled, refreshInterval])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Sensor Notifications</h3>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount} new</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}>
            {isAutoRefreshEnabled ? <BellOff className="h-4 w-4 mr-1" /> : <Bell className="h-4 w-4 mr-1" />}
            {isAutoRefreshEnabled ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" size="sm" onClick={addNewNotification}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Set fixed height to show exactly 4 notifications */}
      <div 
        className="space-y-2 overflow-y-auto" 
        style={{
          height: "calc(4 * (3rem + 8px + 8px))", /* 4 notifications of approx 3rem height + padding + gap */
          msOverflowStyle: "none",  /* IE and Edge */
          scrollbarWidth: "none",   /* Firefox */
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }
        `}</style>
        
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <SensorNotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No notifications yet</div>
        )}
      </div>
    </div>
  )
}
