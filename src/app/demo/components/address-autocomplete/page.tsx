"use client"

import { useState } from "react"
import { AddressAutocomplete } from "@/components/ui/address-autocomplete"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddressAutocompleteDemoPage() {
  const [selectedAddress, setSelectedAddress] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const handleAddressSelected = (address: string, coords: { lat: number; lng: number }) => {
    setSelectedAddress(address)
    setCoordinates(coords)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">AddressAutocomplete Component Demo</h1>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Basic Address Autocomplete</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Start typing an address to see autocomplete suggestions powered by Mapbox.
        </p>
        <div className="max-w-md">
          <AddressAutocomplete
            placeholder="Enter an address..."
            onAddressSelected={handleAddressSelected}
          />
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Selected Address Information</h2>
        {selectedAddress ? (
          <Card>
            <CardHeader>
              <CardTitle>Selected Address</CardTitle>
              <CardDescription>Address and coordinates from the autocomplete selection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Address:</strong> {selectedAddress}
                </div>
                {coordinates && (
                  <div>
                    <strong>Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-muted-foreground">No address selected yet. Try typing in the input above.</p>
        )}
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">With Default Value</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          This example shows the component with a default value.
        </p>
        <div className="max-w-md">
          <AddressAutocomplete
            placeholder="Enter an address..."
            defaultValue="Lawrence, KS"
            onAddressSelected={(address, coords) => {
              console.log("Address selected:", address, coords)
            }}
          />
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Disabled State</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          This example shows the component in a disabled state.
        </p>
        <div className="max-w-md">
          <AddressAutocomplete
            placeholder="Enter an address..."
            defaultValue="123 Main St, Lawrence, KS"
            onAddressSelected={() => {}}
            disabled
          />
        </div>
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
