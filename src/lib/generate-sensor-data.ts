import type { SensorNotification } from "@/components/chart-blocks/charts/ticket-by-channels/sensor-notification"

const sensorTypes = ["temperature", "humidity", "pressure", "motion", "light", "air-quality"]
const locations = [
  { longitude: -74.5, latitude: 40, name: "New York Area" },
  { longitude: -74.3, latitude: 40.1, name: "Jersey City" },
  { longitude: -74.7, latitude: 39.9, name: "Atlantic City" },
  { longitude: -73.9, latitude: 40.7, name: "Manhattan" },
  { longitude: -73.8, latitude: 40.6, name: "Brooklyn" },
]

const alertMessages = [
  "Critical threshold exceeded",
  "Sensor malfunction detected",
  "Emergency shutdown initiated",
  "Power supply failure",
  "Connection lost",
]

const warningMessages = [
  "Approaching upper threshold",
  "Battery level low",
  "Calibration needed",
  "Intermittent connection issues",
  "Unusual reading pattern detected",
]

const infoMessages = [
  "Routine maintenance completed",
  "Firmware updated successfully",
  "Normal operation resumed",
  "Sensor readings within normal range",
  "Scheduled diagnostic completed",
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomSensorId(): string {
  const type = getRandomElement(sensorTypes)
  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${type}-${number}`
}

function getRandomLocation() {
  const baseLocation = getRandomElement(locations)
  // Add a small random offset to create variety
  return {
    longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.1,
    latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.1,
    name: baseLocation.name,
  }
}

function getRandomMessage(type: "alert" | "warning" | "info"): string {
  let messages: string[]

  switch (type) {
    case "alert":
      messages = alertMessages
      break
    case "warning":
      messages = warningMessages
      break
    case "info":
    default:
      messages = infoMessages
      break
  }

  const sensorType = getRandomElement(sensorTypes)
  return `${getRandomElement(messages)} for ${sensorType} sensor`
}

export function generateSensorNotification(): SensorNotification {
  const types: Array<"alert" | "warning" | "info"> = ["alert", "warning", "info"]
  const weights = [0.2, 0.3, 0.5] // 20% alerts, 30% warnings, 50% info

  // Weighted random selection of notification type
  const random = Math.random()
  let cumulativeWeight = 0
  let selectedType: "alert" | "warning" | "info" = "info"

  for (let i = 0; i < types.length; i++) {
    cumulativeWeight += weights[i]
    if (random <= cumulativeWeight) {
      selectedType = types[i]
      break
    }
  }

  const location = getRandomLocation()

  return {
    id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    sensorId: getRandomSensorId(),
    type: selectedType,
    message: getRandomMessage(selectedType),
    timestamp: new Date(),
    location: {
      longitude: location.longitude,
      latitude: location.latitude,
    },
    read: false,
  }
}

export function generateMultipleSensorNotifications(count: number): SensorNotification[] {
  const notifications: SensorNotification[] = []

  // Generate notifications with timestamps spread over the last 24 hours
  for (let i = 0; i < count; i++) {
    const notification = generateSensorNotification()

    // Set timestamp to be between now and 24 hours ago
    const hoursAgo = Math.random() * 24
    notification.timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)

    // Mark some as read
    notification.read = Math.random() > 0.7

    notifications.push(notification)
  }

  // Sort by timestamp, newest first
  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
