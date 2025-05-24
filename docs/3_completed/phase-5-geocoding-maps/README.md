# Geocoding & Maps Feature

## Goal

The goal of this feature is to enhance the application with robust location-based functionality by implementing address autocomplete, interactive map selection, and server-side geocoding capabilities. This will improve the user experience when entering and visualizing location data for runs.

## Key Requirements

1. **Address Autocomplete Input**

   - Implement an input field with autocomplete functionality for addresses
   - Integrate with Google Places Autocomplete API on the client side
   - Provide a seamless user experience for entering location information

2. **Map Picker Component**

   - Create an interactive map component with a draggable pin
   - Allow users to fine-tune latitude and longitude coordinates
   - Support both Mapbox and Google Maps as potential mapping providers

3. **Server-side Geocoding Fallback**
   - Implement a server-side geocoding service as a fallback mechanism
   - Convert addresses to coordinates if client-side autocomplete fails
   - Ensure location data is properly stored in the database

## Target Audience

- **Run Organizers**: Users who create and manage run events and need to specify accurate locations
- **Participants**: Users who need to view and understand run locations
- **Administrators**: Users who manage the application and may need to edit or verify location data

## Open Questions

1. Which mapping provider should be prioritized - Google Maps or Mapbox? Mapbox
2. What API key management strategy should be implemented for the chosen mapping service? keep 12 factor, use environment variables, note that as a decision point for the whole app
3. How should we handle rate limiting for the geocoding services? standard rate limiting strategy, we'll cache in the future
4. What fallback mechanisms should be in place if both client and server geocoding fail? manual entry
5. How should we handle address validation and normalization? use mapbox sdk
