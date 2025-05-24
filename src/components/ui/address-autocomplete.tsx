"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AddressAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onAddressSelected: (address: string, coordinates: { lat: number, lng: number }) => void
  defaultValue?: string
  apiKey?: string
}

/**
 * AddressAutocomplete Component
 * 
 * A component that provides address autocomplete functionality using Mapbox Geocoding API.
 * 
 * @param onAddressSelected - Callback function when an address is selected
 * @param defaultValue - Optional default address value
 * @param apiKey - Optional Mapbox API key (falls back to env variable)
 */
export function AddressAutocomplete({
  onAddressSelected,
  defaultValue = "",
  apiKey,
  className,
  ...props
}: AddressAutocompleteProps) {
  const [input, setInput] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Array<{ text: string, place_name: string, center: [number, number] }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch suggestions from Mapbox Geocoding API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!input || input.length < 3) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const mapboxToken = apiKey || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        if (!mapboxToken) {
          console.error("Mapbox access token is required")
          return
        }

        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          input
        )}.json?access_token=${mapboxToken}&autocomplete=true&types=address,place,locality,neighborhood`

        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.features) {
          setSuggestions(data.features)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [input, apiKey])

  const handleSelectAddress = (suggestion: { place_name: string, center: [number, number] }) => {
    setInput(suggestion.place_name)
    setShowSuggestions(false)
    onAddressSelected(suggestion.place_name, { lat: suggestion.center[1], lng: suggestion.center[0] })
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => input.length >= 3 && setShowSuggestions(true)}
          className={cn(
            "pl-10", // Space for the icon
            className
          )}
          {...props}
        />
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-popover shadow-md"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.place_name}-${index}`}
                className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelectAddress(suggestion)}
              >
                {suggestion.place_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
