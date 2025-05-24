"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AddressAutocomplete } from "@/components/ui/address-autocomplete"
import { MapPicker } from "@/components/ui/map-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface RunFormData {
  number: number | ""
  descriptor: string
  dateTime: string
  address: string
  lat: number
  lng: number
  introLink: string
}

export default function NewRunPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<RunFormData>({
    number: "",
    descriptor: "",
    dateTime: "",
    address: "",
    lat: 38.9592, // Default to Lawrence, KS
    lng: -95.3281,
    introLink: "",
  })

  const handleAddressSelected = (address: string, coords: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address,
      lat: coords.lat,
      lng: coords.lng,
    }))
  }

  const handlePositionChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
    }))
  }

  const handleInputChange = (field: keyof RunFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: Number(formData.number),
          descriptor: formData.descriptor,
          dateTime: new Date(formData.dateTime).toISOString(),
          address: formData.address,
          lat: formData.lat,
          lng: formData.lng,
          introLink: formData.introLink || null,
        }),
      })

      if (response.ok) {
        const newRun = await response.json()
        router.push(`/runs/${newRun.id}`)
      } else {
        const error = await response.json()
        console.error("Error creating run:", error)
        alert("Error creating run: " + (error.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Error submitting form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Create New Run</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Run Details</CardTitle>
              <CardDescription>Basic information about the run</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="number">Run Number</Label>
                <Input
                  id="number"
                  type="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  placeholder="e.g., 1234"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="descriptor">Description</Label>
                <Textarea
                  id="descriptor"
                  value={formData.descriptor}
                  onChange={(e) => handleInputChange("descriptor", e.target.value)}
                  placeholder="Describe the run..."
                  required
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="dateTime">Date & Time</Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleInputChange("dateTime", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="introLink">Intro Link (Optional)</Label>
                <Input
                  id="introLink"
                  type="url"
                  value={formData.introLink}
                  onChange={(e) => handleInputChange("introLink", e.target.value)}
                  placeholder="https://example.com/intro"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Set the run location using address search and map</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <AddressAutocomplete
                  id="address"
                  placeholder="Search for an address..."
                  value={formData.address}
                  onAddressSelected={handleAddressSelected}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                Coordinates: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle>Fine-tune Location</CardTitle>
            <CardDescription>Drag the marker to adjust the exact location</CardDescription>
          </CardHeader>
          <CardContent>
            <MapPicker
              initialLat={formData.lat}
              initialLng={formData.lng}
              onPositionChange={handlePositionChange}
              height="400px"
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Run"}
          </Button>
        </div>
      </form>
    </div>
  )
}
