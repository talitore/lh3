/**
 * Centralized error exports
 * 
 * This file provides a single point of import for all error-related
 * classes and utilities in the application.
 */

// Base error classes
export {
  BaseError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from './base';

// Service-specific error classes
export {
  RunNotFoundError,
  RunNumberExistsError,
  PhotoServiceError,
  S3ConfigurationError,
  PhotoUploadError,
  AttendanceError,
  UserNotFoundError,
  UserAlreadyAttendedError,
  RSVPError,
  GeocodingError,
  NoGeocodingResultsError,
  MapboxTokenError,
} from './service-errors';

// Error handling utilities
export {
  logError,
  formatErrorResponse,
  createErrorResponse,
  withErrorHandler,
  type ErrorResponse,
} from './error-handler';
