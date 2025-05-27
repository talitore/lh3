/**
 * Service-specific error classes
 *
 * This file contains error classes specific to different services
 * in the application (runs, photos, attendance, etc.).
 */

import { BaseError, NotFoundError, ConflictError } from './base';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants/api';

/**
 * Run service errors
 */
export class RunNotFoundError extends NotFoundError {
  constructor() {
    super('Run');
  }
}

export class RunNumberExistsError extends ConflictError {
  constructor() {
    super(ERROR_MESSAGES.RUN_NUMBER_EXISTS);
  }
}

/**
 * Photo service errors
 */
export class PhotoServiceError extends BaseError {
  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}

export class S3ConfigurationError extends PhotoServiceError {
  constructor() {
    super(ERROR_MESSAGES.S3_BUCKET_NOT_CONFIGURED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export class PhotoUploadError extends PhotoServiceError {
  constructor() {
    super(ERROR_MESSAGES.PHOTO_UPLOAD_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Attendance service errors
 */
export class AttendanceError extends BaseError {
  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User');
  }
}

export class UserAlreadyAttendedError extends ConflictError {
  constructor() {
    super(ERROR_MESSAGES.USER_ALREADY_ATTENDED);
  }
}

/**
 * RSVP service errors
 */
export class RSVPError extends BaseError {
  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}

/**
 * Geocoding service errors
 */
export class GeocodingError extends BaseError {
  constructor(message: string, statusCode: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class NoGeocodingResultsError extends GeocodingError {
  constructor() {
    super(ERROR_MESSAGES.NO_GEOCODING_RESULTS);
  }
}

export class MapboxTokenError extends GeocodingError {
  constructor(isSecret: boolean = false) {
    const message = isSecret
      ? ERROR_MESSAGES.MAPBOX_SECRET_TOKEN_REQUIRED
      : ERROR_MESSAGES.MAPBOX_TOKEN_REQUIRED;
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
