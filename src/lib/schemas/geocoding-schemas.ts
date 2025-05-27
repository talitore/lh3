/**
 * Geocoding-related validation schemas
 * 
 * This file contains all Zod schemas for geocoding operations.
 */

import { z } from 'zod';
import { GEOCODING_VALIDATION } from '@/lib/constants/validation';

/**
 * Schema for geocoding request body
 */
export const geocodingBodySchema = z.object({
  query: z
    .string()
    .min(GEOCODING_VALIDATION.MIN_QUERY_LENGTH, {
      message: GEOCODING_VALIDATION.ERROR_MESSAGES.QUERY_TOO_SHORT,
    }),
  limit: z
    .number()
    .int()
    .positive()
    .max(GEOCODING_VALIDATION.MAX_RESULTS)
    .optional()
    .default(5),
});

/**
 * Type definitions derived from schemas
 */
export type GeocodingBody = z.infer<typeof geocodingBodySchema>;
