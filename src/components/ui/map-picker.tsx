"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Import Mapbox CSS
import "mapbox-gl/dist/mapbox-gl.css"

interface MapPickerProps {
  initialLat?: number
  initialLng?: number
  onPositionChange: (lat: number, lng: number) => void
  height?: string
  width?: string
  zoom?: number
  apiKey?: string
  className?: string
  disabled?: boolean
}

/**
 * MapPicker Component
 * 
 * An interactive map component with a draggable marker for selecting precise locations.
 * 
 * @param initialLat - Initial latitude for the marker
 * @param initialLng - Initial longitude for the marker
 * @param onPositionChange - Callback function when the marker position changes
 * @param height - Optional height of the map container (default: "400px")
 * @param width - Optional width of the map container (default: "100%")
 * @param zoom - Optional initial zoom level (default: 13)
 * @param apiKey - Optional Mapbox API key (falls back to env variable)
 * @param className - Optional additional classes
 * @param disabled - Optional disabled state
 */
export function MapPicker({
  initialLat = 38.9592,
  initialLng = -95.3281, // Default to Lawrence, KS
  onPositionChange,
  height = "400px",
  width = "100%",
  zoom = 13,
  apiKey,
  className,
  disabled = false,
}: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng })
  const [isLoading, setIsLoading] = useState(true)

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return

    const mapboxToken = apiKey || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!mapboxToken) {
      console.error("Mapbox access token is required")
      return
    }

    // Set the access token
    mapboxgl.accessToken = mapboxToken

    // Create the map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [position.lng, position.lat],
      zoom: zoom,
      interactive: !disabled,
    })

    // Add navigation controls (zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Create a draggable marker
    marker.current = new mapboxgl.Marker({
      draggable: !disabled,
      color: "#3b82f6", // Blue color
    })
      .setLngLat([position.lng, position.lat])
      .addTo(map.current)

    // Handle marker drag events
    if (!disabled) {
      marker.current.on("dragend", () => {
        if (marker.current) {
          const { lng, lat } = marker.current.getLngLat()
          setPosition({ lat, lng })
          onPositionChange(lat, lng)
        }
      })
    }

    // Handle map load complete
    map.current.on("load", () => {
      setIsLoading(false)
    })

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [apiKey, disabled, initialLat, initialLng, onPositionChange, zoom])

  // Update marker position when initialLat/initialLng props change
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat([initialLng, initialLat])
      map.current.flyTo({
        center: [initialLng, initialLat],
        zoom: zoom,
      })
      setPosition({ lat: initialLat, lng: initialLng })
    }
  }, [initialLat, initialLng, zoom])

  // Center map on marker
  const handleCenterMap = () => {
    if (map.current) {
      map.current.flyTo({
        center: [position.lng, position.lat],
        zoom: zoom,
      })
    }
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div
        ref={mapContainer}
        style={{ width, height }}
        className="rounded-md border border-input"
      />
      <div className="mt-2 flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCenterMap}
          disabled={disabled}
        >
          Center Map
        </Button>
      </div>
    </div>
  )
}
