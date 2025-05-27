"use client"

import { Color } from "@visactor/vchart/esm/util"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface DataPoint {
  time: string
  temperature: number
  humidity: number
  windSpeed: number
}

interface TemperatureChartProps {
  data: DataPoint[]
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="time" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `${value}°C`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value}°C`, "Temperature"]} labelFormatter={(label) => `Time: ${label}`} contentStyle={{color : "black"}}/>
        <Area
          type="monotone"
          dataKey="temperature"
          stroke="#f97316"
          fill="#f97316"
          fillOpacity={0.2}
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

