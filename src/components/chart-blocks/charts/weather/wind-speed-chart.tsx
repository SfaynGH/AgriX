"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DataPoint {
  time: string
  temperature: number
  humidity: number
  windSpeed: number
}

interface WindSpeedChartProps {
  data: DataPoint[]
}

export default function WindSpeedChart({ data }: WindSpeedChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
        <YAxis tickFormatter={(value) => `${value} km/h`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value} km/h`, "Wind Speed"]} labelFormatter={(label) => `Time: ${label}`} contentStyle={{color : "black"}}/>
        <Bar dataKey="windSpeed" fill="#22c55e" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

