# UX Pilot Prompts for Geocoding & Maps Feature

## 1. Address Autocomplete Input

### Prompt 1: Basic Address Autocomplete

```
Create a modern address input field with autocomplete functionality. The component should include:
- A text input field with a placeholder "Enter an address"
- A dropdown menu that appears below the input showing 3-5 address suggestions
- Each suggestion should show the full address with main components (street, city, state) visually distinguished
- A location/pin icon on the left side of the input
- A clear/reset button that appears when text is entered
- A subtle border around the input that highlights when focused
- The component should use a clean, minimal design with adequate spacing
- Color scheme should use neutral grays with a blue accent for the focused state
```

### Prompt 2: Address Input with Map Preview

```
Design an address input component with integrated map preview for a run creation form. Include:
- A text input field at the top with placeholder "Search for a location"
- A dropdown showing 3-4 address suggestions when typing
- A small map preview that appears below the input once an address is selected
- A draggable pin on the map that updates latitude/longitude values
- Small text below the map showing the current coordinates (e.g., "Lat: 38.9592, Lng: -95.3281")
- A "Reset" button to clear the selection
- The component should have a clean white background with subtle shadows
- Use a responsive design that works well on both desktop and mobile
- Include a loading state for when the map or suggestions are being fetched
```

## 2. Map Picker Component

### Prompt 1: Interactive Map with Draggable Pin

```
Create an interactive map component for selecting a precise location. The design should include:
- A full-width map display with 400px height
- A prominent, draggable pin/marker in the center of the map
- Zoom in/out controls in the top-right corner
- A "Center Map" button that resets the view to the current pin position
- A small card overlay in the bottom-left showing the current address and coordinates
- The card should update in real-time as the pin is dragged
- A subtle pulsing effect around the base of the pin to indicate it's draggable
- The map should have a clean, light style with clear street labels
- Include a loading state for when the map is initializing
```

### Prompt 2: Map Picker with Address Form Integration

```
Design a location picker interface that combines a map with address form fields. Include:
- A split layout with address form fields on the left and a map on the right
- Form fields should include: Street Address, City, State/Province, Postal Code, Country
- A prominent map taking up 60% of the width with a draggable pin
- As the pin is moved, the address fields should update automatically
- Include a "Use My Location" button near the top of the form
- Add a "Confirm Location" button at the bottom that pulses when the location has changed
- The map should include basic controls (zoom, fullscreen)
- Use a clean interface with clear visual hierarchy
- Include a mobile-responsive version where the map appears above the form fields
- Add subtle animations for pin drops and address updates
```

## 3. Combined Address and Map Interface

### Prompt 1: Run Location Setup Interface

```
Create a comprehensive location setup interface for a run creation form. The design should include:
- A section header "Run Location" with a brief instruction text
- An address search bar at the top with autocomplete functionality
- A prominent map display (500px height) below the search bar
- A draggable pin on the map that can be used to fine-tune the location
- A card showing the selected address and coordinates below the map
- An "Edit Manually" toggle that reveals individual address field inputs
- A "Verify Location" button that performs a validation check
- Visual indicators showing whether the location is valid/verified
- The interface should use a clean, accessible design with clear visual hierarchy
- Include both light and dark mode versions
- Show responsive layouts for desktop, tablet, and mobile views
```

### Prompt 2: Location Selection Wizard

```
Design a step-by-step wizard interface for selecting a run location. Include:
- A progress indicator showing 3 steps: "Search Address", "Refine on Map", "Confirm Details"
- Step 1: A large search input with autocomplete and recent/saved locations
- Step 2: A full-width map with a draggable pin and address confirmation
- Step 3: A summary view showing the final location with options to add notes
- Navigation buttons (Previous, Next) at the bottom of each step
- A sidebar showing the currently selected information as it's being built
- Use a clean, modern design with clear visual hierarchy
- Include micro-interactions like smooth transitions between steps
- Add helpful tooltips explaining how to drag the pin for precise location
- Design should be fully responsive and accessible
- Use a color scheme that matches the application's branding
```
