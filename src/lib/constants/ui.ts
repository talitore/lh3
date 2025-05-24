/**
 * UI-related constants
 *
 * This file contains all UI-related constants including dimensions,
 * timeouts, colors, and other visual configuration values.
 */

// Map component dimensions
export const MAP_DIMENSIONS = {
  DEFAULT_HEIGHT: "400px",
  EMBED_HEIGHT: "450px",
  DEFAULT_WIDTH: "100%",
} as const;

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 13,
  MARKER_COLOR: "#3b82f6", // Blue color
  NAVIGATION_CONTROL_POSITION: "top-right",
} as const;

// Default coordinates (Lawrence, KS)
export const DEFAULT_COORDINATES = {
  LAT: 38.9592,
  LNG: -95.3281,
} as const;

// Timing constants
export const TIMING = {
  DEBOUNCE_DELAY: 300, // milliseconds
  S3_URL_EXPIRATION: 3600, // seconds (1 hour)
} as const;

// Input validation UI constants
export const INPUT_VALIDATION = {
  MIN_ADDRESS_SEARCH_LENGTH: 3,
} as const;

// Placeholder image configuration
export const PLACEHOLDER_IMAGE = {
  BASE_URL: "https://via.placeholder.com/150?text=",
  DEFAULT_SIZE: "150",
} as const;

// CSS class constants for consistency
export const CSS_CLASSES = {
  MAP_CONTAINER: "border-0 rounded-md",
  INPUT_ICON_SPACING: "pl-10",
  LOADING_SPINNER: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground",
  MAP_PIN_ICON: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
} as const;

// Animation and transition constants
export const ANIMATIONS = {
  SPINNER_CLASS: "animate-spin",
  TRANSITION_DURATION: "300ms",
} as const;

// Sidebar configuration
export const SIDEBAR_CONFIG = {
  SECTIONS: [
    {
      id: 'upcoming-events',
      title: 'Upcoming Events',
      icon: 'calendar',
      items: [
        { label: 'Event 1', href: '#' },
        { label: 'Event 2', href: '#' },
      ],
    },
    {
      id: 'quick-stats',
      title: 'Quick Stats',
      icon: 'bar-chart',
      items: [
        { label: 'Active Members', href: '#' },
        { label: 'Hash Cash Pool', href: '#' },
      ],
    },
    {
      id: 'admin-tools',
      title: 'Admin Tools',
      icon: 'settings',
      items: [
        { label: 'Attendance Tracking', href: '#' },
        { label: 'User Management', href: '#' },
      ],
    },
  ],
} as const;
