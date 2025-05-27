"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DataPoint {
  time: string
  temperature: number
  humidity: number
  windSpeed: number
}

interface HumidityChartProps {
  data: DataPoint[]
}

export default function HumidityChart({ data }: HumidityChartProps) {
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
        <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value}%`, "Humidity"]} labelFormatter={(label) => `Time: ${label}`} contentStyle={{color : "black"}}/>
        <Area
          type="monotone"
          dataKey="humidity"
          stroke="#0ea5e9"
          fill="#0ea5e9"
          fillOpacity={0.2}
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

