"use client";
import React, { useState, useEffect } from "react";
import {
  AverageSoilMoisture,
  Weather,
  CustomerSatisfication,
  Metrics,
  TicketByChannels,
} from "@/components/chart-blocks";
import Container from "@/components/container";
import { Waves, Thermometer, Droplet, Grid2X2 } from "lucide-react"
import { MetricData } from "@/data/metrics"; // Adjust the import path as necessary

function get_ph(float_soil_moisture: number): string {
  return ((8 - ((float_soil_moisture - 200) / 200) * 2).toPrecision(2));
}

export default function Home() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { 
      title: "Soil Moisture", 
      value: "Loading...", 
      subtitle: "Current Level", 
      icon: Waves,
    },
    { 
      title: "Temperature", 
      value: "Loading...", 
      subtitle: "Current Temp", 
      icon: Thermometer
    },
    { 
      title: "Humidity", 
      value: "Loading...", 
      subtitle: "Air Moisture", 
      icon: Droplet
    },
    { 
      title: "pH Level", 
      value: "Loading...", 
      subtitle: "Soil pH", 
      icon: Grid2X2
    },
  ]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await fetch('https://monitor-plant.loca.lt/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "bypass-tunnel-reminder": "true"
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map the API response to the metrics format
      const mappedMetrics: MetricData[] = [
        { 
          title: "Soil Moisture", 
          value: `${data.soil_moisture}`, 
          subtitle: "Current Level", 
          icon: Waves,
        },
        { 
          title: "Temperature", 
          value: `${data.temperature}°C`, 
          subtitle: "Current Temp", 
          icon: Thermometer
        },
        { 
          title: "Humidity", 
          value: `${data.humidity}%`, 
          subtitle: "Air Moisture", 
          icon: Droplet
        },
        { 
          title: "pH Level", 
          value: `${get_ph(data.soil_moisture)}`, 
          subtitle: "Soil pH", 
          icon: Grid2X2
        },
      ];
      
      setMetrics(mappedMetrics);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
      
      // Update metrics to show error state
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          value: "Error"
        }))
      );
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Add a status indicator */}
      <Container className="py-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-2">
            {isUpdating && (
              <div className="flex items-center gap-1">
                <div className="animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full"></div>
                <span>Updating metrics...</span>
              </div>
            )}
            {error && (
              <div className="text-red-500">
                ⚠️ Update failed: {error}
              </div>
            )}
            {!isUpdating && !error && lastUpdated && (
              <div className="text-green-600">
                ✓ Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
          <button 
            onClick={fetchMetrics}
            disabled={isUpdating}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Refresh Now'}
          </button>
        </div>
      </Container>
      
      <Metrics metrics={metrics} />
      
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-5 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-2">
          <AverageSoilMoisture />
        </Container>
        <Container className="py-4 laptop:col-span-3">
          <Weather />
        </Container>
      </div>
      <div className="grid grid-cols-1 border-b border-border laptop:grid-cols-2 laptop:divide-x laptop:divide-y-0 laptop:divide-border max-h-[600px]">
        <Container className="py-4 laptop:col-span-1 overflow-y-auto">
          <TicketByChannels />
        </Container>
        <Container className="py-4 laptop:col-span-1 overflow-y-auto">
          <CustomerSatisfication />
        </Container>
      </div>
    </div>
  );
}