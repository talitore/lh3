/**
 * Base error classes for the application
 * 
 * This file contains the base error classes that provide a consistent
 * error handling pattern across the application.
 */

import { HTTP_STATUS } from '@/lib/constants/api';

/**
 * Base application error class
 * All custom errors should extend this class
 */
export abstract class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON format for API responses
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * Validation error for input validation failures
 */
export class ValidationError extends BaseError {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.errors = errors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

/**
 * Authentication error for unauthorized access
 */
export class AuthenticationError extends BaseError {
  constructor(message: string = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

/**
 * Authorization error for forbidden access
 */
export class AuthorizationError extends BaseError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends BaseError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND);
  }
}

/**
 * Conflict error for resource conflicts
 */
export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

/**
 * Internal server error for unexpected errors
 */
export class InternalServerError extends BaseError {
  constructor(message: string = 'Internal server error') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
  }
}
