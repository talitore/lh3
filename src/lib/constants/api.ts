/**
 * API-related constants
 * 
 * This file contains all API-related constants including endpoints,
 * HTTP status codes, error messages, and external service URLs.
 */

// API endpoints
export const API_ENDPOINTS = {
  RUNS: "/api/runs",
  GEOCODE: "/api/geocode",
  AUTH: "/api/auth",
  PROTECTED_EXAMPLE: "/api/protected-example",
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Mapbox configuration
export const MAPBOX = {
  STYLE_URL: "mapbox://styles/mapbox/streets-v12",
  GEOCODING_BASE_URL: "https://api.mapbox.com/geocoding/v5/mapbox.places",
  GEOCODING_PARAMS: "autocomplete=true&types=address,place,locality,neighborhood",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  INVALID_INPUT: "Invalid input",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  INVALID_QUERY_PARAMETERS: "Invalid query parameters",
  MAPBOX_TOKEN_REQUIRED: "Mapbox access token is required",
  MAPBOX_SECRET_TOKEN_REQUIRED: "Mapbox secret token is required for server-side geocoding",
  NO_GEOCODING_RESULTS: "No results found for the provided address",
  RUN_NOT_FOUND: "Run not found",
  USER_NOT_FOUND: "User to mark attended not found",
  USER_ALREADY_ATTENDED: "User already marked as attended for this run.",
  RUN_NUMBER_EXISTS: "A run with this number already exists.",
  S3_BUCKET_NOT_CONFIGURED: "S3 bucket name is not configured.",
  PHOTO_UPLOAD_FAILED: "Failed to generate signed URL for photo upload.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  RUN_CREATED: "Run created successfully",
  ATTENDANCE_MARKED: "Attendance marked successfully",
  PHOTO_UPLOADED: "Photo uploaded successfully",
} as const;

// API response formats
export const API_RESPONSE_KEYS = {
  MESSAGE: "message",
  ERRORS: "errors",
  DATA: "data",
  PAGINATION: "pagination",
  STATUS: "status",
} as const;

// Request headers
export const REQUEST_HEADERS = {
  TEST_MODE: "X-Test-Mode",
  MOCK_AUTH: "X-Mock-Auth",
  CONTENT_TYPE: "Content-Type",
  COOKIE: "Cookie",
} as const;

// Content types
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
} as const;
