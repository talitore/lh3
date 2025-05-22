# Geocoding & Maps Feature Specification

## Overview

This document outlines the technical specifications for implementing the Geocoding & Maps feature, which includes address autocomplete, map picker functionality, and server-side geocoding fallback.

## Technical Requirements

### 1. Address Autocomplete Input

#### Implementation Options

**Option 1: Google Places Autocomplete with shadcn/ui Combobox**

- Integrate Google Places Autocomplete API with shadcn's Combobox component
- Display address suggestions as the user types
- Extract and store both the formatted address and the geographic coordinates
- Requires Google Maps JavaScript API key with Places API enabled

```tsx
// Example implementation concept
import { Combobox } from '@/components/ui/combobox';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

export function AddressAutocomplete({ onAddressSelected }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Load Google Places API and initialize autocomplete
    // Update suggestions as user types
  }, [input]);

  return (
    <Combobox
      items={suggestions}
      onSelect={(address) => {
        // Get coordinates from selected address
        // Call onAddressSelected with address and coordinates
      }}
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter an address"
      />
    </Combobox>
  );
}
```

**Option 2: Mapbox Geocoding API with Custom Dropdown**

- Use Mapbox's Geocoding API for address suggestions
- Implement a custom dropdown component for displaying suggestions
- Extract and store both the formatted address and the geographic coordinates
- Requires Mapbox access token

#### Trade-offs

| Aspect      | Google Places                                  | Mapbox Geocoding                         |
| ----------- | ---------------------------------------------- | ---------------------------------------- |
| Coverage    | Excellent global coverage                      | Good global coverage                     |
| Accuracy    | High accuracy with business listings           | Good accuracy, strong in certain regions |
| Cost        | Free tier with credit card, then pay-as-you-go | Free tier available, then pay-as-you-go  |
| Integration | More complex API, well-documented              | Simpler API, good documentation          |
| UI Control  | Less customizable UI                           | More customizable UI                     |

**Decision**: [To be filled by user]

### 2. Map Picker Component

#### Implementation Options

**Option 1: Google Maps with Draggable Marker**

- Embed Google Maps with a draggable marker
- Allow users to fine-tune location by dragging the marker
- Update latitude and longitude values in real-time
- Requires Google Maps JavaScript API key

```tsx
// Example implementation concept
import { useEffect, useRef, useState } from 'react';

export function GoogleMapPicker({ initialLat, initialLng, onPositionChange }) {
  const mapRef = useRef(null);
  const [position, setPosition] = useState({
    lat: initialLat,
    lng: initialLng,
  });

  useEffect(() => {
    // Initialize Google Map
    // Add draggable marker
    // Set up event listener for marker drag end
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
      <div>
        Latitude: {position.lat.toFixed(6)}, Longitude:{' '}
        {position.lng.toFixed(6)}
      </div>
    </div>
  );
}
```

**Option 2: Mapbox GL JS with Draggable Marker**

- Implement Mapbox GL JS with a draggable marker
- Allow users to fine-tune location by dragging the marker
- Update latitude and longitude values in real-time
- Requires Mapbox access token

#### Trade-offs

| Aspect         | Google Maps                                    | Mapbox GL JS                            |
| -------------- | ---------------------------------------------- | --------------------------------------- |
| Performance    | Good performance                               | Excellent performance with WebGL        |
| Customization  | Limited styling options                        | Highly customizable styling             |
| Mobile Support | Good mobile support                            | Excellent mobile support                |
| Cost           | Free tier with credit card, then pay-as-you-go | Free tier available, then pay-as-you-go |
| Integration    | Well-documented, more complex API              | Modern API, good documentation          |

**Decision**: Option 2, Mapbox GL JS

### 3. Server-side Geocoding Fallback

#### Implementation Options

**Option 1: Google Maps Geocoding API**

- Use Google's Geocoding API on the server
- Implement in API routes to convert addresses to coordinates
- Store results in the database
- Requires server-side API key management

**Option 2: Mapbox Geocoding API**

- Use Mapbox's Geocoding API on the server
- Implement in API routes to convert addresses to coordinates
- Store results in the database
- Requires server-side API key management

#### Trade-offs

| Aspect          | Google Geocoding     | Mapbox Geocoding    |
| --------------- | -------------------- | ------------------- |
| Accuracy        | High accuracy        | Good accuracy       |
| Rate Limits     | More restrictive     | More generous       |
| Cost            | Higher cost at scale | Lower cost at scale |
| Response Format | More complex         | Simpler JSON format |

**Decision**: Option 2, Mapbox Geocoding API
