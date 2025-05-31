/**
 * Custom error classes for the application
 */

export class AttendanceError extends Error {
  public statusCode: number;

  constructor(message: string = 'Attendance error occurred', statusCode: number = 500) {
    super(message);
    this.name = 'AttendanceError';
    this.statusCode = statusCode;
  }
}

export class UserNotFoundError extends Error {
  public statusCode: number;

  constructor(message: string = 'User not found', statusCode: number = 404) {
    super(message);
    this.name = 'UserNotFoundError';
    this.statusCode = statusCode;
  }
}

export class UserAlreadyAttendedError extends Error {
  public statusCode: number;

  constructor(message: string = 'User has already been marked as attended', statusCode: number = 409) {
    super(message);
    this.name = 'UserAlreadyAttendedError';
    this.statusCode = statusCode;
  }
}

export class RunNotFoundError extends Error {
  public statusCode: number;

  constructor(message: string = 'Run not found', statusCode: number = 404) {
    super(message);
    this.name = 'RunNotFoundError';
    this.statusCode = statusCode;
  }
}

export class PhotoServiceError extends Error {
  public statusCode: number;

  constructor(message: string = 'Photo service error occurred', statusCode: number = 500) {
    super(message);
    this.name = 'PhotoServiceError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  public statusCode: number;

  constructor(message: string = 'Validation error occurred', statusCode: number = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

export class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message: string = 'Authorization error occurred', statusCode: number = 403) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;
  }
}

export class DatabaseError extends Error {
  public statusCode: number;

  constructor(message: string = 'Database error occurred', statusCode: number = 500) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = statusCode;
  }
}

export class S3ConfigurationError extends Error {
  public statusCode: number;

  constructor(message: string = 'S3 configuration error', statusCode: number = 500) {
    super(message);
    this.name = 'S3ConfigurationError';
    this.statusCode = statusCode;
  }
}

export class PhotoUploadError extends Error {
  public statusCode: number;

  constructor(message: string = 'Photo upload error', statusCode: number = 500) {
    super(message);
    this.name = 'PhotoUploadError';
    this.statusCode = statusCode;
  }
}

export class RunNumberExistsError extends Error {
  public statusCode: number;

  constructor(message: string = 'Run number already exists', statusCode: number = 409) {
    super(message);
    this.name = 'RunNumberExistsError';
    this.statusCode = statusCode;
  }
}

export class NoGeocodingResultsError extends Error {
  public statusCode: number;

  constructor(message: string = 'No geocoding results found', statusCode: number = 404) {
    super(message);
    this.name = 'NoGeocodingResultsError';
    this.statusCode = statusCode;
  }
}

export class MapboxTokenError extends Error {
  public statusCode: number;

  constructor(message: string = 'Mapbox token error', statusCode: number = 500) {
    super(message);
    this.name = 'MapboxTokenError';
    this.statusCode = statusCode;
  }
}

/**
 * Helper function to create standardized error responses
 */
export function createErrorResponse(error: Error, defaultMessage: string = 'An error occurred') {
  if (error instanceof AttendanceError ||
      error instanceof UserNotFoundError ||
      error instanceof UserAlreadyAttendedError ||
      error instanceof RunNotFoundError ||
      error instanceof PhotoServiceError ||
      error instanceof ValidationError ||
      error instanceof AuthorizationError ||
      error instanceof DatabaseError ||
      error instanceof S3ConfigurationError ||
      error instanceof PhotoUploadError ||
      error instanceof RunNumberExistsError ||
      error instanceof NoGeocodingResultsError ||
      error instanceof MapboxTokenError) {
    return Response.json(
      { message: error.message },
      { status: error.statusCode }
    );
  }

  // For unknown errors, return a generic 500 response
  console.error('Unexpected error:', error);
  return Response.json(
    { message: defaultMessage },
    { status: 500 }
  );
}

/**
 * Helper function to format error responses with validation details
 */
export function formatErrorResponse(message: string, errors?: Record<string, string>, statusCode: number = 400) {
  const response: any = { message };
  if (errors) {
    response.errors = errors;
  }
  return Response.json(response, { status: statusCode });
}
