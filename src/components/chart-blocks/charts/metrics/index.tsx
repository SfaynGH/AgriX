"use client"

import { MetricCard } from "./components/metric-card"
import { MetricData } from "@/data/metrics"
export default function Metrics({ metrics }: { metrics: MetricData[] }) {
  // Format current date
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "long",
    day: "numeric",
    year: "numeric",
  })


  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 text-sm text-muted-foreground">Last Reading as of {formattedDate}</div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            icon={metric.icon}
          />
        ))}
      </div>
    </div>
  )
}

