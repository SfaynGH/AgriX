"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Cpu } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Define types for our sensors and cameras
interface DevicePosition {
  id: string
  type: "sensor" | "camera"
  position: {
    lat: number
    lng: number
  }
  name: string
  status: "online" | "offline" | "warning"
}

// Sample data with real coordinates (example: San Francisco area)
const devicePositions: DevicePosition[] = [
  {
    id: "s1",
    type: "sensor",
    position: { lat: 37.7749, lng: -122.4194 },
    name: "Soil Sensor 1",
    status: "online",
  },
  {
    id: "s2",
    type: "sensor",
    position: { lat: 37.7833, lng: -122.4167 },
    name: "Soil Sensor 2",
    status: "online",
  },
  {
    id: "s3",
    type: "sensor",
    position: { lat: 37.7694, lng: -122.4862 },
    name: "Temperature Sensor Sensor 1",
    status: "warning",
  },
  {
    id: "s4",
    type: "sensor",
    position: { lat: 37.7835, lng: -122.4256 },
    name: "Humidity Sensor 1",
    status: "online",
  },
  {
    id: "s5",
    type: "sensor",
    position: { lat: 37.7648, lng: -122.433 },
    name: "pH Sensor 1",
    status: "offline",
  },
  {
    id: "c1",
    type: "camera",
    position: { lat: 37.7739, lng: -122.4312 },
    name: "Camera 1",
    status: "online",
  },
  {
    id: "c2",
    type: "camera",
    position: { lat: 37.7719, lng: -122.4085 },
    name: "Camera 2",
    status: "online",
  },
  {
    id: "c3",
    type: "camera",
    position: { lat: 37.7855, lng: -122.4071 },
    name: "Camera 3",
    status: "offline",
  },
]

// Center of the map (average of all device positions)
const center = {
  lng: -122.4194,
  lat: 37.7749,
}

// Mapbox styles
const mapStyles = [
  {
    name: "emerald",
    style: "mapbox://styles/mapbox/light-v11",
    description: "Light theme with emerald accents",
  },
  {
    name: "satellite",
    style: "mapbox://styles/mapbox/satellite-v9",
    description: "Satellite imagery",
  },
  {
    name: "dark",
    style: "mapbox://styles/mapbox/dark-v11",
    description: "Dark theme",
  },
  {
    name: "outdoors",
    style: "mapbox://styles/mapbox/outdoors-v12",
    description: "Outdoor theme with terrain",
  },
]

function SensorMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const popupsRef = useRef<mapboxgl.Popup[]>([])
  const [selectedDevice, setSelectedDevice] = useState<DevicePosition | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapStyle, setMapStyle] = useState("emerald")
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state on client side only
  useEffect(() => {
    setIsMounted(true)

    // Set Mapbox access token
    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
      "pk.eyJ1IjoiYXNzaW5lZmF5bjg3IiwiYSI6ImNtOTJyenp0MjA4aWkycnIwMWVkdjJkdnoifQ.Huj1BLB5wEs3BhM-He46DA"

    return () => {
      // Clean up map and markers on unmount
      if (mapInstanceRef.current) {
        markersRef.current.forEach((marker) => marker.remove())
        popupsRef.current.forEach((popup) => popup.remove())
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = []
        popupsRef.current = []
      }
    }
  }, [])

  // Initialize map
  useEffect(() => {
    // Only run on client and when component is mounted
    if (!isMounted || !mapRef.current) return

    // Clean up existing map instance if it exists
    if (mapInstanceRef.current) {
      markersRef.current.forEach((marker) => marker.remove())
      popupsRef.current.forEach((popup) => popup.remove())
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
      markersRef.current = []
      popupsRef.current = []
    }

    try {
      // Find the selected style
      const selectedMapStyle = mapStyles.find((s) => s.name === mapStyle) || mapStyles[0]

      // Create map instance
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: selectedMapStyle.style,
        center: [center.lng, center.lat],
        zoom: 13,
        attributionControl: true,
      })

      mapInstanceRef.current = map

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Wait for map to load
      map.on("load", () => {
        // Add custom layer for emerald theme if needed
        if (mapStyle === "emerald") {
          // Adjust the map colors to match emerald theme
          map.setPaintProperty("water", "fill-color", "#a7f3d0")
          map.setPaintProperty("land", "background-color", "#f0fdf4")
        }

        // Add markers for each device
        devicePositions.forEach((device) => {
          // Create custom HTML element for the marker
          const el = document.createElement("div")
          el.className = "custom-marker"
          el.style.width = "30px"
          el.style.height = "30px"
          el.style.borderRadius = "50%"
          el.style.display = "flex"
          el.style.alignItems = "center"
          el.style.justifyContent = "center"
          el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"
          el.style.border = "2px solid white"
          el.style.cursor = "pointer"

          // Set background color based on status
          if (device.status === "online") {
            el.style.backgroundColor = "#10b981" // emerald-500
          } else if (device.status === "warning") {
            el.style.backgroundColor = "#f59e0b" // amber-500
          } else {
            el.style.backgroundColor = "#f87171" // red-400
          }

          // Add icon based on device type
          const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
          iconSvg.setAttribute("width", "16")
          iconSvg.setAttribute("height", "16")
          iconSvg.setAttribute("viewBox", "0 0 24 24")
          iconSvg.setAttribute("fill", "none")
          iconSvg.setAttribute("stroke", "white")
          iconSvg.setAttribute("stroke-width", "2")
          iconSvg.setAttribute("stroke-linecap", "round")
          iconSvg.setAttribute("stroke-linejoin", "round")

          if (device.type === "sensor") {
            // CPU icon for sensors
            const rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect")
            rect1.setAttribute("x", "4")
            rect1.setAttribute("y", "4")
            rect1.setAttribute("width", "16")
            rect1.setAttribute("height", "16")
            rect1.setAttribute("rx", "2")
            rect1.setAttribute("ry", "2")

            const rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect")
            rect2.setAttribute("x", "9")
            rect2.setAttribute("y", "9")
            rect2.setAttribute("width", "6")
            rect2.setAttribute("height", "6")

            iconSvg.appendChild(rect1)
            iconSvg.appendChild(rect2)
          } else {
            // Camera icon for cameras
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
            path.setAttribute("d", "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z")

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            circle.setAttribute("cx", "12")
            circle.setAttribute("cy", "13")
            circle.setAttribute("r", "4")

            iconSvg.appendChild(path)
            iconSvg.appendChild(circle)
          }

          el.appendChild(iconSvg)

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <div class="flex items-center gap-2 mb-1">
                  <div style="color: ${device.status === "online" ? "#10b981" : device.status === "warning" ? "#f59e0b" : "#9ca3af"}">
                    ${
                      device.type === "sensor"
                        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>'
                    }
                  </div>
                  <span style="font-weight: 500;">${device.name}</span>
                </div>
                <div style="font-size: 0.75rem; display: flex; align-items: center; gap: 0.25rem;">
                  <span>Status:</span>
                  <span style="color: ${device.status === "online" ? "#10b981" : device.status === "warning" ? "#f59e0b" : "#9ca3af"}; text-transform: capitalize;">
                    ${device.status}
                  </span>
                </div>
                <div style="font-size: 0.75rem; margin-top: 0.25rem;">
                  <span>Coordinates: ${device.position.lat.toFixed(4)}, ${device.position.lng.toFixed(4)}</span>
                </div>
              </div>
            `)

          popupsRef.current.push(popup)

          // Create marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([device.position.lng, device.position.lat])
            .setPopup(popup)
            .addTo(map)

          markersRef.current.push(marker)

          // Add click event
          el.addEventListener("click", () => {
            setSelectedDevice(device)
          })
        })

        setMapLoaded(true)
      })
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }, [mapStyle, isMounted])

  // Handle map style change
  const handleMapStyleChange = (value: string) => {
    setMapStyle(value)
  }

  if (!isMounted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sensor & Camera Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center bg-slate-50 rounded-md border">
            <div className="text-muted-foreground">Loading map...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Sensor & Camera Map</span>
          <div className="flex items-center gap-4">
            <Select value={mapStyle} onValueChange={handleMapStyleChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select map style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emerald">Emerald Theme</SelectItem>
                <SelectItem value="satellite">Satellite</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="outdoors">Outdoors</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Cpu className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-normal">Sensors</span>
            </div>
            <div className="flex items-center gap-1">
              <Camera className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-normal">Cameras</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md overflow-hidden border">
          <div ref={mapRef} className="h-[400px] w-full" />
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span>Online</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-amber-500"></span>
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-gray-400"></span>
              <span>Offline</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Total Devices: {devicePositions.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SensorMap

