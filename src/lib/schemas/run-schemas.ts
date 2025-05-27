/**
 * Run-related validation schemas
 * 
 * This file contains all Zod schemas for run-related operations
 * including creation, updates, and queries.
 */

import { z } from 'zod';
import { 
  STRING_VALIDATION, 
  NUMBER_VALIDATION, 
  DATE_VALIDATION, 
  URL_VALIDATION, 
  ENUM_OPTIONS 
} from '@/lib/constants/validation';

/**
 * Schema for run ID parameter validation
 */
export const runIdParamsSchema = z.object({
  id: z.union([
    z.string().cuid({ message: 'Invalid run ID format' }),
    z.string().startsWith('mock-run-id-'), // Allow mock IDs for testing
  ]),
});

/**
 * Schema for creating a new run
 */
export const createRunSchema = z.object({
  number: z.number().int().positive({
    message: NUMBER_VALIDATION.RUN_NUMBER.ERROR_MESSAGE,
  }),
  descriptor: z
    .string()
    .min(STRING_VALIDATION.DESCRIPTOR.MIN_LENGTH, {
      message: STRING_VALIDATION.DESCRIPTOR.ERROR_MESSAGE,
    }),
  dateTime: z
    .string()
    .datetime({ message: DATE_VALIDATION.DATETIME.ERROR_MESSAGE }),
  address: z
    .string()
    .min(STRING_VALIDATION.ADDRESS.MIN_LENGTH, {
      message: STRING_VALIDATION.ADDRESS.ERROR_MESSAGE,
    }),
  lat: z.number().optional(),
  lng: z.number().optional(),
  introLink: z
    .string()
    .url({ message: URL_VALIDATION.INTRO_LINK.ERROR_MESSAGE })
    .optional()
    .or(z.literal('')),
});

/**
 * Schema for updating a run
 */
export const updateRunSchema = z.object({
  number: z.number().int().positive({
    message: NUMBER_VALIDATION.RUN_NUMBER.ERROR_MESSAGE,
  }).optional(),
  descriptor: z
    .string()
    .min(STRING_VALIDATION.DESCRIPTOR.MIN_LENGTH, {
      message: STRING_VALIDATION.DESCRIPTOR.ERROR_MESSAGE,
    })
    .optional(),
  dateTime: z
    .string()
    .datetime({ message: DATE_VALIDATION.DATETIME.ERROR_MESSAGE })
    .optional(),
  address: z
    .string()
    .min(STRING_VALIDATION.ADDRESS.MIN_LENGTH, {
      message: STRING_VALIDATION.ADDRESS.ERROR_MESSAGE,
    })
    .optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  introLink: z
    .string()
    .url({ message: URL_VALIDATION.INTRO_LINK.ERROR_MESSAGE })
    .optional()
    .or(z.literal(''))
    .or(z.null()),
});

/**
 * Schema for run query parameters
 */
export const getRunsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= NUMBER_VALIDATION.PAGE.MIN, {
      message: NUMBER_VALIDATION.PAGE.ERROR_MESSAGE,
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine(
      (val) => val >= NUMBER_VALIDATION.LIMIT.MIN && val <= NUMBER_VALIDATION.LIMIT.MAX,
      {
        message: NUMBER_VALIDATION.LIMIT.ERROR_MESSAGE,
      }
    ),
  sortBy: z
    .enum(ENUM_OPTIONS.SORT_BY, {
      errorMap: () => ({
        message: `Sort by must be one of: ${ENUM_OPTIONS.SORT_BY.join(', ')}`,
      }),
    })
    .optional(),
  sortOrder: z
    .enum(ENUM_OPTIONS.SORT_ORDER, {
      errorMap: () => ({
        message: `Sort order must be one of: ${ENUM_OPTIONS.SORT_ORDER.join(', ')}`,
      }),
    })
    .optional(),
  filterStatus: z
    .enum(ENUM_OPTIONS.FILTER_STATUS, {
      errorMap: () => ({
        message: `Filter status must be one of: ${ENUM_OPTIONS.FILTER_STATUS.join(', ')}`,
      }),
    })
    .optional(),
  dateFrom: z
    .string()
    .datetime({ message: DATE_VALIDATION.DATE_FROM.ERROR_MESSAGE })
    .optional(),
  dateTo: z
    .string()
    .datetime({ message: DATE_VALIDATION.DATE_TO.ERROR_MESSAGE })
    .optional(),
});

/**
 * Type definitions derived from schemas
 */
export type RunIdParams = z.infer<typeof runIdParamsSchema>;
export type CreateRunData = z.infer<typeof createRunSchema>;
export type UpdateRunData = z.infer<typeof updateRunSchema>;
export type GetRunsQuery = z.infer<typeof getRunsQuerySchema>;
