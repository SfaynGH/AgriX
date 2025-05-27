"use client"

import { useState, useEffect } from "react"
import TemperatureChart from "./temperature-chart"
import HumidityChart from "./humidity-chart"
import WindSpeedChart from "./wind-speed-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  time: string
}

export default function Chart() {
  const [isMounted, setIsMounted] = useState(false)
  const [weather, setWeather] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current date for 1-day forecast
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const startDate = today.toISOString().split('T')[0]
        const endDate = tomorrow.toISOString().split('T')[0]

        const latitude = 36.8914
        const longitude = 10.1849

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&start_date=${startDate}&end_date=${endDate}&timezone=auto`

        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch weather data: ${response.status}`)
        }

        const data = await response.json()

        // Transform the API response to match our WeatherData interface
        const weatherData: WeatherData[] = data.hourly.time.map((time: string, index: number) => ({
          time: new Date(time).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          temperature: Math.round(data.hourly.temperature_2m[index] || 0),
          humidity: Math.round(data.hourly.relative_humidity_2m[index] || 0),
          windSpeed: Math.round(data.hourly.wind_speed_10m[index] || 0),
        }))

        // Filter to get only today's data (next 24 hours)
        const next24Hours = weatherData.slice(0, 24)
        setWeather(next24Hours)

      } catch (err) {
        console.error('Error fetching weather data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
      } finally {
        setLoading(false)
      }
    }

    if (isMounted) {
      fetchWeatherData()
    }
  }, [isMounted])

  if (!isMounted) {
    return <div className="h-[50vh] min-h-[200px] max-h-[350px] max-w-full overflow-hidden flex items-center justify-center">Loading charts...</div>
  }

  if (loading) {
    return <div className="h-[50vh] min-h-[200px] max-h-[350px] max-w-full overflow-hidden flex items-center justify-center">Loading weather data...</div>
  }

  if (error) {
    return <div className="h-[50vh] min-h-[200px] max-h-[350px] max-w-full overflow-hidden flex items-center justify-center text-red-500">Error: {error}</div>
  }

  if (weather.length === 0) {
    return <div className="h-[50vh] min-h-[200px] max-h-[350px] max-w-full overflow-hidden flex items-center justify-center">No weather data available</div>
  }

  // Prepare data for charts
  const weatherData = weather.map((data) => ({
    time: data.time,
    humidity: data.humidity,
    windSpeed: data.windSpeed,
    temperature: data.temperature,
  }))

  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="temperature" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="humidity">Humidity</TabsTrigger>
          <TabsTrigger value="wind">Wind Speed</TabsTrigger>
        </TabsList>

        <TabsContent value="temperature" className="mt-6">
          <div>
            <CardHeader>
              <CardTitle>Temperature (°C) - Next 24 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[40vh] max-w-full overflow-hidden">
                <TemperatureChart data={weatherData} />
              </div>
            </CardContent>
          </div>
        </TabsContent>

        <TabsContent value="humidity" className="mt-6">
          <div>
            <CardHeader>
              <CardTitle>Humidity (%) - Next 24 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[40vh] max-w-full overflow-hidden">
                <HumidityChart data={weatherData} />
              </div>
            </CardContent>
          </div>
        </TabsContent>

        <TabsContent value="wind" className="mt-6">
          <div>
            <CardHeader>
              <CardTitle>Wind Speed (km/h) - Next 24 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[40vh] max-w-full overflow-hidden">
                <WindSpeedChart data={weatherData} />
              </div>
            </CardContent>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}