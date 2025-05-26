/**
 * Application-wide constants
 *
 * This file contains general application constants including
 * test mode configurations, pagination defaults, and other
 * application-wide settings.
 */

// Test mode constants
export const TEST_MODE = {
  MOCK_RUN_ID_PREFIX: "mock-run-id",
  MOCK_USER_ID_PREFIX: "mock-user-id",
  MOCK_ORGANIZER_ID: "mock-organizer-id",
  MOCK_ATTENDANCE_ID_PREFIX: "mock-attendance-id",
  TEST_BUCKET: "test-bucket",
  MOCK_USER_NAME: "Mock User",
  MOCK_RUN_DESCRIPTOR: "Mock Run For Testing",
} as const;

// Environment variable keys
export const ENV_VARS = {
  E2E_TESTING_MODE: "E2E_TESTING_MODE",
  SKIP_AUTH_CHECKS: "SKIP_AUTH_CHECKS",
  MOCK_AUTH_FOR_TESTS: "MOCK_AUTH_FOR_TESTS",
  USE_MOCK_DATA: "USE_MOCK_DATA",
  MAPBOX_ACCESS_TOKEN: "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN",
  MAPBOX_SECRET_TOKEN: "MAPBOX_SECRET_TOKEN",
  S3_BUCKET_NAME: "S3_BUCKET_NAME",
  AWS_REGION: "AWS_REGION",
} as const;

// Cookie names and values
export const COOKIES = {
  MOCK_ORGANIZER_SESSION: "mock-organizer-session",
  ROLE_ORGANIZER: "role=ORGANIZER",
} as const;

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
  ADMIN_MODE: "adminMode",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Sorting options
export const SORT_OPTIONS = {
  FIELDS: {
    DATE_TIME: "dateTime",
    NUMBER: "number",
    DESCRIPTOR: "descriptor",
  },
  ORDERS: {
    ASC: "asc",
    DESC: "desc",
  },
  DEFAULTS: {
    FIELD: "dateTime",
    ORDER: "desc",
  },
} as const;

// Filter options
export const FILTER_OPTIONS = {
  STATUS: {
    UPCOMING: "upcoming",
    PAST: "past",
    ALL: "all",
  },
  DEFAULT_STATUS: "all",
} as const;

// RSVP status options
export const RSVP_STATUS = {
  YES: "YES",
  NO: "NO",
  MAYBE: "MAYBE",
} as const;

// Authentication providers
export const AUTH_PROVIDERS = {
  GOOGLE: "google",
  TEST_CREDENTIALS: "test-credentials",
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: "ADMIN",
  ORGANIZER: "ORGANIZER",
  USER: "USER",
} as const;

// File upload constants
export const FILE_UPLOAD = {
  RANDOM_BYTES_LENGTH: 16,
  DEFAULT_EXTENSION: "bin",
  STORAGE_PATH_PREFIX: "runs",
  PHOTOS_SUBFOLDER: "photos",
} as const;

// Database constants
export const DATABASE = {
  SELECT_FIELDS: {
    USER_BASIC: { id: true, name: true, image: true },
    USER_DETAILED: { id: true, name: true, email: true, image: true },
    RUN_BASIC: { id: true, descriptor: true },
    PHOTO_BASIC: { id: true, storageKey: true, url: true, caption: true, createdAt: true },
  },
  ORDER_BY: {
    CREATED_AT_ASC: { createdAt: "asc" },
    CREATED_AT_DESC: { createdAt: "desc" },
    MARKED_AT_ASC: { markedAt: "asc" },
  },
} as const;
