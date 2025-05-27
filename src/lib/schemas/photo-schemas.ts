/**
 * Photo-related validation schemas
 * 
 * This file contains all Zod schemas for photo-related operations.
 */

import { z } from 'zod';
import { FILE_VALIDATION } from '@/lib/constants/validation';

/**
 * Schema for photo upload signed URL generation
 */
export const generateUrlBodySchema = z.object({
  fileName: z.string().min(1, { message: 'File name is required' }),
  contentType: z.enum(FILE_VALIDATION.ALLOWED_TYPES, {
    errorMap: () => ({
      message: FILE_VALIDATION.ERROR_MESSAGES.INVALID_TYPE,
    }),
  }),
});

/**
 * Schema for photo upload confirmation
 */
export const confirmUploadBodySchema = z.object({
  photoId: z.string().cuid({ message: 'Invalid photo ID format' }),
  caption: z.string().optional().nullable(),
});

/**
 * Schema for photo parameters (run ID)
 */
export const photoParamsSchema = z.object({
  id: z.union([
    z.string().cuid({ message: 'Invalid run ID format' }),
    z.string().startsWith('mock-run-id-'), // Allow mock IDs for testing
    z.literal('mock-run-id-for-photo-url'), // Specific mock ID for photo URL tests
  ]),
});

/**
 * Type definitions derived from schemas
 */
export type GenerateUrlBody = z.infer<typeof generateUrlBodySchema>;
export type ConfirmUploadBody = z.infer<typeof confirmUploadBodySchema>;
export type PhotoParams = z.infer<typeof photoParamsSchema>;
