import type { LucideIcon } from "lucide-react"

export interface MetricData {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  iconColor?: string
}