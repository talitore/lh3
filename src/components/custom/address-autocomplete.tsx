'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Import constants
import { TIMING, INPUT_VALIDATION, CSS_CLASSES } from '@/lib/constants/ui';
import { MAPBOX, ERROR_MESSAGES } from '@/lib/constants/api';
import { getMapboxAccessToken } from '@/lib/config/env';

interface AddressAutocompleteProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onAddressSelected: (
    address: string,
    coordinates: { lat: number; lng: number }
  ) => void;
  onInputChange?: (value: string) => void;
  defaultValue?: string;
  apiKey?: string;
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
  onInputChange,
  defaultValue = '',
  apiKey,
  className,
  value,
  ...props
}: AddressAutocompleteProps) {
  const [input, setInput] = useState(String(value || defaultValue));
  const [suggestions, setSuggestions] = useState<
    Array<{ text: string; place_name: string; center: [number, number] }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with parent value prop
  useEffect(() => {
    if (value !== undefined) {
      setInput(String(value));
    }
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions from Mapbox Geocoding API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!input || input.length < INPUT_VALIDATION.MIN_ADDRESS_SEARCH_LENGTH) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const mapboxToken = apiKey || getMapboxAccessToken();
        if (!mapboxToken) {
          console.error(ERROR_MESSAGES.MAPBOX_TOKEN_REQUIRED);
          return;
        }

        const endpoint = `${MAPBOX.GEOCODING_BASE_URL}/${encodeURIComponent(
          input
        )}.json?access_token=${mapboxToken}&${MAPBOX.GEOCODING_PARAMS}`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.features) {
          setSuggestions(data.features);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, TIMING.DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
  }, [input, apiKey]);

  const handleInputChange = (newValue: string) => {
    setInput(newValue);
    onInputChange?.(newValue);
  };

  const handleSelectAddress = (suggestion: {
    place_name: string;
    center: [number, number];
  }) => {
    setInput(suggestion.place_name);
    setShowSuggestions(false);
    onInputChange?.(suggestion.place_name);
    onAddressSelected(suggestion.place_name, {
      lat: suggestion.center[1],
      lng: suggestion.center[0],
    });
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => input.length >= INPUT_VALIDATION.MIN_ADDRESS_SEARCH_LENGTH && setShowSuggestions(true)}
          className={cn(
            CSS_CLASSES.INPUT_ICON_SPACING, // Space for the icon
            className
          )}
          {...props}
        />
        <MapPin className={CSS_CLASSES.MAP_PIN_ICON} />
        {isLoading && (
          <Loader2 className={CSS_CLASSES.LOADING_SPINNER} />
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
  );
}
