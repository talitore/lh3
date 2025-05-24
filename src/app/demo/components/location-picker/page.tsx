"use client"

import { useState } from "react"
import { AddressAutocomplete } from "@/components/ui/address-autocomplete"
import { MapPicker } from "@/components/ui/map-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Import constants
import { DEFAULT_COORDINATES } from "@/lib/constants/ui"

export default function LocationPickerDemoPage() {
  const [address, setAddress] = useState("")
  const [position, setPosition] = useState({ lat: DEFAULT_COORDINATES.LAT, lng: DEFAULT_COORDINATES.LNG }) // Lawrence, KS
  const [isMapSynced, setIsMapSynced] = useState(true)

  const handleAddressSelected = (selectedAddress: string, coords: { lat: number; lng: number }) => {
    setAddress(selectedAddress)
    if (isMapSynced) {
      setPosition(coords)
    }
  }

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition({ lat, lng })
  }

  const handleReset = () => {
    setAddress("")
    setPosition({ lat: DEFAULT_COORDINATES.LAT, lng: DEFAULT_COORDINATES.LNG })
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Location Picker Demo</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        This demo shows how the AddressAutocomplete and MapPicker components work together
        to provide a complete location selection experience.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address Input Section */}
        <div className="space-y-6">
          <section className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Address Search</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Search for an address to automatically update the map location.
            </p>
            <AddressAutocomplete
              placeholder="Enter an address..."
              value={address}
              onAddressSelected={handleAddressSelected}
            />

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="sync-map"
                checked={isMapSynced}
                onChange={(e) => setIsMapSynced(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="sync-map" className="text-sm">
                Sync map with address selection
              </label>
            </div>
          </section>

          <section className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Selection</h2>
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>Current address and coordinates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <strong>Address:</strong> {address || "No address selected"}
                  </div>
                  <div>
                    <strong>Coordinates:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                  </div>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Reset Location
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Map Section */}
        <div className="space-y-6">
          <section className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Map Selection</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Drag the marker to fine-tune the exact location.
            </p>
            <MapPicker
              initialLat={position.lat}
              initialLng={position.lng}
              onPositionChange={handlePositionChange}
              height="400px"
            />
          </section>
        </div>
      </div>

      <section className="mt-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          This is how you might use these components together in a form:
        </p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Example usage in a form
const [formData, setFormData] = useState({
  address: '',
  lat: ${DEFAULT_COORDINATES.LAT},
  lng: ${DEFAULT_COORDINATES.LNG}
});

const handleAddressSelected = (address, coords) => {
  setFormData(prev => ({
    ...prev,
    address,
    lat: coords.lat,
    lng: coords.lng
  }));
};

const handlePositionChange = (lat, lng) => {
  setFormData(prev => ({
    ...prev,
    lat,
    lng
  }));
};`}
        </pre>
      </section>

      <div className="mt-8 text-xs text-gray-500">
        <p>
          <strong>Note:</strong> These components require a valid Mapbox access token to be set in your environment variables.
          Make sure to set <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> in your <code>.env.local</code> file.
        </p>
      </div>
    </div>
  )
}
