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
import { Waves, Thermometer, Droplet, Grid2X2, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { MetricData } from "@/data/metrics"; // Adjust the import path as necessary

function get_ph(float_soil_moisture: number): string {
  return ((8 - ((float_soil_moisture - 200) / 200) * 2).toPrecision(2));
}

// Mock data for when API is unavailable
const MOCK_DATA = {
  soil_moisture: 450,
  temperature: 24.5,
  humidity: 65,
  timestamp: new Date().toISOString()
};

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
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Test API connectivity
  const testApiConnection = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('https://monitor-plant.loca.lt/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "bypass-tunnel-reminder": "true"
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log("API not available, switching to demo mode");
      return false;
    }
  };

  // Generate realistic mock data that changes over time
  const generateMockData = () => {
    const baseTime = Date.now();
    const variation = Math.sin(baseTime / 60000) * 50; // Slow variation over time
    
    return {
      soil_moisture: Math.max(200, Math.min(800, 450 + variation + (Math.random() - 0.5) * 20)),
      temperature: Math.max(15, Math.min(35, 24.5 + (Math.sin(baseTime / 120000) * 5) + (Math.random() - 0.5) * 2)),
      humidity: Math.max(30, Math.min(90, 65 + (Math.cos(baseTime / 180000) * 15) + (Math.random() - 0.5) * 5)),
      timestamp: new Date().toISOString()
    };
  };

  const fetchMetrics = async (forceDemo: boolean = false) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // Test connection first unless forcing demo
      let connected = false;
      if (!forceDemo) {
        connected = await testApiConnection();
        setApiConnected(connected);
      }
      
      let data;
      
      if (connected && !forceDemo) {
        // Try to fetch real data
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch('https://monitor-plant.loca.lt/capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "bypass-tunnel-reminder": "true"
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        setIsDemoMode(false);
      } else {
        // Use mock data
        data = generateMockData();
        setApiConnected(false);
        setIsDemoMode(true);
      }
      
      // Map the data to the metrics format
      const mappedMetrics: MetricData[] = [
        { 
          title: "Soil Moisture", 
          value: `${Math.round(data.soil_moisture)}`, 
          subtitle: "Current Level", 
          icon: Waves,
        },
        { 
          title: "Temperature", 
          value: `${data.temperature.toFixed(1)}°C`, 
          subtitle: "Current Temp", 
          icon: Thermometer
        },
        { 
          title: "Humidity", 
          value: `${Math.round(data.humidity)}%`, 
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
      setApiConnected(false);
      
      // Fallback to mock data on error
      const mockData = generateMockData();
      setIsDemoMode(true);
      
      const fallbackMetrics: MetricData[] = [
        { 
          title: "Soil Moisture", 
          value: `${Math.round(mockData.soil_moisture)}`, 
          subtitle: "Current Level", 
          icon: Waves,
        },
        { 
          title: "Temperature", 
          value: `${mockData.temperature.toFixed(1)}°C`, 
          subtitle: "Current Temp", 
          icon: Thermometer
        },
        { 
          title: "Humidity", 
          value: `${Math.round(mockData.humidity)}%`, 
          subtitle: "Air Moisture", 
          icon: Droplet
        },
        { 
          title: "pH Level", 
          value: `${get_ph(mockData.soil_moisture)}`, 
          subtitle: "Soil pH", 
          icon: Grid2X2
        },
      ];
      
      setMetrics(fallbackMetrics);
      setLastUpdated(new Date());
    } finally {
      setIsUpdating(false);
    }
  };

  // Force demo mode for testing
  const switchToDemoMode = () => {
    fetchMetrics(true);
  };

  // Try to reconnect to real API
  const attemptReconnection = async () => {
    const connected = await testApiConnection();
    if (connected) {
      setApiConnected(true);
      setIsDemoMode(false);
      fetchMetrics(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMetrics();
    
    // Set up intervals
    const updateInterval = setInterval(() => fetchMetrics(), 10000); // Update every 10 seconds
    const reconnectInterval = setInterval(attemptReconnection, 30000); // Try to reconnect every 30 seconds if in demo mode
    
    return () => {
      clearInterval(updateInterval);
      clearInterval(reconnectInterval);
    };
  }, []);

  return (
    <div>
      {/* Connection Status Header */}
      <Container className="py-2">
        <div className="flex justify-between items-center text-sm">
          {/* Connection Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {apiConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-red-600 font-medium">Disconnected</span>
                </>
              )}
            </div>
            
            {isDemoMode && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md">
                <AlertCircle className="h-3 w-3" />
                <span className="text-xs font-medium">Demo Mode</span>
              </div>
            )}
          </div>

          {/* Status and Controls */}
          <div className="flex items-center gap-3">
            {/* Update Status */}
            <div className="text-gray-600">
              {isUpdating && (
                <div className="flex items-center gap-1">
                  <div className="animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full"></div>
                  <span>Updating...</span>
                </div>
              )}
              {error && !isDemoMode && (
                <div className="text-red-500 text-xs">
                  ⚠️ {error}
                </div>
              )}
              {!isUpdating && !error && lastUpdated && (
                <div className={`text-xs ${apiConnected ? 'text-green-600' : 'text-yellow-600'}`}>
                  ✓ Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              {!apiConnected && (
                <button 
                  onClick={attemptReconnection}
                  disabled={isUpdating}
                  className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Reconnect
                </button>
              )}
              
              <button 
                onClick={() => fetchMetrics()}
                disabled={isUpdating}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Refresh'}
              </button>
              
              {apiConnected && (
                <button 
                  onClick={switchToDemoMode}
                  className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Demo
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Demo Mode Warning */}
      {isDemoMode && (
        <Container className="py-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Demo Mode: Showing simulated data. Real Raspberry Pi sensor data unavailable.
              </span>
            </div>
          </div>
        </Container>
      )}
      
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