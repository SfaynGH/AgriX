"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SensorNotificationsList } from "@/components/chart-blocks/charts/ticket-by-channels/sensor-notifications-list"
import type { SensorNotification } from "@/components/chart-blocks/charts/ticket-by-channels/sensor-notification"
import { generateMultipleSensorNotifications } from "@/lib/generate-sensor-data"

export default function NotificationsPage() {
  const [initialNotifications, setInitialNotifications] = useState<SensorNotification[]>([])

  // Generate initial notifications on component mount
  useEffect(() => {
    setInitialNotifications(generateMultipleSensorNotifications(15))
  }, [])

  return (
    <div className="container mx-auto py-8">
      <Card className="max-h-[500px]">
        <CardHeader>
          <CardTitle>Sensor Notifications</CardTitle>
          <CardDescription>Real-time sensor alerts and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <SensorNotificationsList
            initialNotifications={initialNotifications}
            autoRefresh={true}
            refreshInterval={10000}
          />
        </CardContent>
      </Card>
    </div>
  )
}
