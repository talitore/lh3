/**
 * Centralized error handling utilities
 *
 * This file contains utilities for handling errors consistently
 * across the application, including logging and response formatting.
 */

import { NextResponse } from 'next/server';
import { BaseError, ValidationError } from './base';
import { HTTP_STATUS, API_RESPONSE_KEYS } from '@/lib/constants/api';
import { Prisma } from '@/generated/prisma';

/**
 * Standard error response format
 */
export interface ErrorResponse {
  message: string;
  statusCode: number;
  timestamp: string;
  errors?: Record<string, string[]>;
}

/**
 * Log error with appropriate level based on error type
 */
export function logError(error: Error, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';

  if (error instanceof BaseError) {
    if (error.isOperational) {
      // Operational errors (expected) - log as warning
      console.warn(`${timestamp}${contextStr} Operational Error:`, {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
      });
    } else {
      // Programming errors - log as error
      console.error(`${timestamp}${contextStr} Programming Error:`, {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
      });
    }
  } else {
    // Unknown errors - log as error
    console.error(`${timestamp}${contextStr} Unknown Error:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
}

/**
 * Convert error to standardized response format
 */
export function formatErrorResponse(error: Error): ErrorResponse {
  if (error instanceof BaseError) {
    const response: ErrorResponse = {
      message: error.message,
      statusCode: error.statusCode,
      timestamp: error.timestamp.toISOString(),
    };

    // Add validation errors if present
    if (error instanceof ValidationError && Object.keys(error.errors).length > 0) {
      response.errors = error.errors;
    }

    return response;
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return formatPrismaError(error);
  }

  // Handle unknown errors
  return {
    message: 'An unexpected error occurred',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format Prisma errors into standardized format
 */
function formatPrismaError(error: Prisma.PrismaClientKnownRequestError): ErrorResponse {
  const timestamp = new Date().toISOString();

  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = error.meta?.target as string[] | undefined;
      const field = target?.[0] || 'field';
      return {
        message: `A record with this ${field} already exists`,
        statusCode: HTTP_STATUS.CONFLICT,
        timestamp,
      };

    case 'P2025':
      // Record not found
      return {
        message: 'Record not found',
        statusCode: HTTP_STATUS.NOT_FOUND,
        timestamp,
      };

    case 'P2003':
      // Foreign key constraint violation
      return {
        message: 'Referenced record does not exist',
        statusCode: HTTP_STATUS.BAD_REQUEST,
        timestamp,
      };

    default:
      return {
        message: 'Database operation failed',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        timestamp,
      };
  }
}

/**
 * Create NextResponse from error
 */
export function createErrorResponse(error: Error, context?: string): NextResponse {
  // Log the error
  logError(error, context);

  // Format the response
  const errorResponse = formatErrorResponse(error);

  // Return NextResponse
  return NextResponse.json(
    {
      [API_RESPONSE_KEYS.MESSAGE]: errorResponse.message,
      ...(errorResponse.errors && { [API_RESPONSE_KEYS.ERRORS]: errorResponse.errors }),
    },
    { status: errorResponse.statusCode }
  );
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return createErrorResponse(error as Error, context);
    }
  };
}
