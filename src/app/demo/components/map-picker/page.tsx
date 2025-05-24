"use client"

import { useState } from "react"
import { MapPicker } from "@/components/ui/map-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MapPickerDemoPage() {
  const [position, setPosition] = useState({ lat: 38.9592, lng: -95.3281 }) // Lawrence, KS
  const [customPosition, setCustomPosition] = useState({ lat: 39.0458, lng: -76.6413 }) // Baltimore, MD

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition({ lat, lng })
  }

  const handleCustomPositionChange = (lat: number, lng: number) => {
    setCustomPosition({ lat, lng })
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">MapPicker Component Demo</h1>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Basic Map Picker</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Drag the marker to select a precise location. The coordinates will update in real-time.
        </p>
        <MapPicker
          initialLat={position.lat}
          initialLng={position.lng}
          onPositionChange={handlePositionChange}
        />
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Current Position Information</h2>
        <Card>
          <CardHeader>
            <CardTitle>Selected Location</CardTitle>
            <CardDescription>Coordinates from the draggable marker</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Latitude:</strong> {position.lat.toFixed(6)}
              </div>
              <div>
                <strong>Longitude:</strong> {position.lng.toFixed(6)}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Custom Size Map</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          This map has custom dimensions (300px height) and starts at a different location.
        </p>
        <MapPicker
          initialLat={customPosition.lat}
          initialLng={customPosition.lng}
          onPositionChange={handleCustomPositionChange}
          height="300px"
          zoom={10}
        />
        <div className="mt-2 text-sm text-muted-foreground">
          Current position: {customPosition.lat.toFixed(6)}, {customPosition.lng.toFixed(6)}
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Disabled Map</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          This map is in a disabled state - the marker cannot be dragged and map interactions are limited.
        </p>
        <MapPicker
          initialLat={38.9592}
          initialLng={-95.3281}
          onPositionChange={() => {}}
          height="250px"
          disabled
        />
      </section>

      <div className="mt-8 text-xs text-gray-500">
        <p>
          <strong>Note:</strong> This component requires a valid Mapbox access token to be set in your environment variables.
          Make sure to set <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> in your <code>.env.local</code> file.
        </p>
      </div>
    </div>
  )
}
