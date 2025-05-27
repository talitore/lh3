/**
 * Validation rules and limits
 *
 * This file contains all validation-related constants including
 * minimum/maximum lengths, validation rules, and error messages
 * for form validation.
 */

// String length validation
export const STRING_VALIDATION = {
  DESCRIPTOR: {
    MIN_LENGTH: 3,
    ERROR_MESSAGE: "Descriptor must be at least 3 characters long",
  },
  ADDRESS: {
    MIN_LENGTH: 5,
    ERROR_MESSAGE: "Address must be at least 5 characters long",
  },
} as const;

// Number validation
export const NUMBER_VALIDATION = {
  RUN_NUMBER: {
    MIN: 1,
    ERROR_MESSAGE: "Run number must be a positive integer",
  },
  PAGE: {
    MIN: 1,
    ERROR_MESSAGE: "Page must be a positive integer",
  },
  LIMIT: {
    MIN: 1,
    MAX: 100,
    ERROR_MESSAGE: "Limit must be between 1 and 100",
  },
} as const;

// Date validation
export const DATE_VALIDATION = {
  DATETIME: {
    ERROR_MESSAGE: "Invalid datetime string. Must be ISO8601",
  },
  DATE_FROM: {
    ERROR_MESSAGE: "Invalid dateFrom string. Must be ISO8601",
  },
  DATE_TO: {
    ERROR_MESSAGE: "Invalid dateTo string. Must be ISO8601",
  },
} as const;

// URL validation
export const URL_VALIDATION = {
  INTRO_LINK: {
    ERROR_MESSAGE: "Invalid URL for intro link",
  },
} as const;

// Enum validation options
export const ENUM_OPTIONS = {
  SORT_BY: ["dateTime", "number", "descriptor"] as const,
  SORT_ORDER: ["asc", "desc"] as const,
  FILTER_STATUS: ["upcoming", "past", "all"] as const,
  RSVP_STATUS: ["YES", "NO", "MAYBE"] as const,
} as const;

// Validation error types
export const VALIDATION_ERROR_TYPES = {
  REQUIRED: "required",
  MIN_LENGTH: "min_length",
  MAX_LENGTH: "max_length",
  INVALID_FORMAT: "invalid_format",
  INVALID_TYPE: "invalid_type",
  OUT_OF_RANGE: "out_of_range",
} as const;

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  DATETIME_ISO: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/,
} as const;

// File validation
export const FILE_VALIDATION = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"] as const,
  ERROR_MESSAGES: {
    TOO_LARGE: "File size must be less than 10MB",
    INVALID_TYPE: "File must be an image (JPEG, PNG, GIF, or WebP)",
  },
} as const;

// Geocoding validation
export const GEOCODING_VALIDATION = {
  MIN_QUERY_LENGTH: 3,
  MAX_RESULTS: 10,
  ERROR_MESSAGES: {
    QUERY_TOO_SHORT: "Search query must be at least 3 characters long",
    NO_RESULTS: "No results found for the provided address",
  },
} as const;
