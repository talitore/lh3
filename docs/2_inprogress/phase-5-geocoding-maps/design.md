# Geocoding & Maps Feature Design

## Architectural Considerations

### Component Architecture

The geocoding and maps feature will consist of three main components that work together:

1. **AddressAutocomplete Component**
   - A client-side React component that extends shadcn/ui's Combobox
   - Integrates with a geocoding service API (Google Places or Mapbox)
   - Returns both formatted address and coordinates
   - Emits events when an address is selected

2. **MapPicker Component**
   - A client-side React component that embeds an interactive map
   - Allows for marker placement and dragging
   - Synchronizes with address input
   - Updates latitude and longitude values

3. **GeocodeService**
   - A server-side service for geocoding addresses
   - Acts as a fallback when client-side geocoding fails
   - Handles API key management and rate limiting
   - Provides consistent response format regardless of provider

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Address Input  │────▶│   Map Display   │────▶│  Form Submit    │
│  (Autocomplete) │     │  (Draggable Pin)│     │ (Save Location) │
│                 │     │                 │     │                 │
└────────▲────────┘     └────────▲────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┘                       │
                     ▲                                   │
                     │                                   │
                     │                                   ▼
              ┌──────┴──────┐                   ┌─────────────────┐
              │             │                   │                 │
              │  Geocoding  │◀──────────────────│  Server-side    │
              │    API      │                   │  Geocoding      │
              │             │                   │  (Fallback)     │
              └─────────────┘                   │                 │
                                                └─────────────────┘
```

### Integration with Existing Codebase

- The AddressAutocomplete component will extend the existing Input component from shadcn/ui
- The MapPicker component will build upon the existing MapEmbed component
- Both components will be used in the Run creation and editing forms
- The GeocodeService will be integrated with the existing runService for server-side processing

## Visual Design Sketches

### Address Autocomplete Component

```
┌────────────────────────────────────────┐
│ Enter address                          │ ← Input field
├────────────────────────────────────────┤
│ 123 Main St, Anytown, CA               │ ← Suggestion 1
│ 123 Main St, Othertown, NY             │ ← Suggestion 2
│ 123 Main Rd, Somewhere, TX             │ ← Suggestion 3
└────────────────────────────────────────┘
```

### Map Picker Component

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│                                        │
│                 ┌───┐                  │
│                 │ X │ ← Draggable Pin  │
│                 └───┘                  │
│                                        │
│                                        │
│                                        │
└────────────────────────────────────────┘
  Lat: 38.9592, Lng: -95.3281 ← Coordinates display
```

### Combined Form Implementation

```
┌────────────────────────────────────────┐
│ Create New Run                         │
├────────────────────────────────────────┤
│ Run #: [    ]                          │
│ Descriptor: [                        ] │
│ Date/Time: [                         ] │
│                                        │
│ Address:                               │
│ ┌────────────────────────────────────┐ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │                                    │ │
│ │                                    │ │
│ │             Map Display            │ │
│ │                                    │ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Intro Link: [                        ] │
│                                        │
│ [Cancel]                    [Save Run] │
└────────────────────────────────────────┘
```

## Implementation Principles

### Simple, Lovable, Complete (SLC)

- **Simple**: The interface should be intuitive and easy to use, with clear visual cues for dragging the map pin and selecting from address suggestions.
- **Lovable**: The map interaction should feel responsive and satisfying, with smooth animations and immediate feedback.
- **Complete**: The solution should handle all common use cases, including address entry, map-based selection, and fallback mechanisms.

### Progressive Enhancement

1. **Base Functionality**: Simple text input for address that works without JavaScript
2. **Enhanced Experience**: Address autocomplete when JavaScript is available
3. **Full Experience**: Interactive map with draggable pin when all APIs are available

### Error Handling

- Clear error messages for API failures
- Graceful degradation when geocoding services are unavailable
- Fallback to server-side geocoding when client-side fails
- Option for manual coordinate entry as a last resort

## API Design

### Client Components

```typescript
// AddressAutocomplete Component
interface AddressAutocompleteProps {
  defaultValue?: string;
  onAddressSelected: (address: string, coordinates: {lat: number, lng: number}) => void;
  placeholder?: string;
  disabled?: boolean;
}

// MapPicker Component
interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onPositionChange: (lat: number, lng: number) => void;
  height?: string;
  width?: string;
  zoom?: number;
  disabled?: boolean;
}
```

### Server API

```typescript
// GeocodeService
interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
  provider: 'google' | 'mapbox' | 'manual';
}

async function geocodeAddress(address: string): Promise<GeocodeResult>;
```
