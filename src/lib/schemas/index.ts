/**
 * Centralized schema exports
 * 
 * This file provides a single point of import for all validation
 * schemas in the application.
 */

// Run schemas
export {
  runIdParamsSchema,
  createRunSchema,
  updateRunSchema,
  getRunsQuerySchema,
  type RunIdParams,
  type CreateRunData,
  type UpdateRunData,
  type GetRunsQuery,
} from './run-schemas';

// RSVP schemas
export {
  rsvpBodySchema,
  rsvpParamsSchema,
  type RSVPBody,
  type RSVPParams,
} from './rsvp-schemas';

// Attendance schemas
export {
  attendanceBodySchema,
  attendanceParamsSchema,
  type AttendanceBody,
  type AttendanceParams,
} from './attendance-schemas';

// Photo schemas
export {
  generateUrlBodySchema,
  confirmUploadBodySchema,
  photoParamsSchema,
  type GenerateUrlBody,
  type ConfirmUploadBody,
  type PhotoParams,
} from './photo-schemas';

// Geocoding schemas
export {
  geocodingBodySchema,
  type GeocodingBody,
} from './geocoding-schemas';
