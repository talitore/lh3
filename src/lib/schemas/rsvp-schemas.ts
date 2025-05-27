/**
 * RSVP-related validation schemas
 * 
 * This file contains all Zod schemas for RSVP-related operations.
 */

import { z } from 'zod';
import { RSVPStatus } from '@/generated/prisma';

/**
 * Schema for RSVP request body
 */
export const rsvpBodySchema = z.object({
  status: z.nativeEnum(RSVPStatus, {
    errorMap: () => ({
      message: 'Invalid RSVP status. Must be YES, NO, or MAYBE.',
    }),
  }),
});

/**
 * Schema for RSVP parameters (run ID)
 */
export const rsvpParamsSchema = z.object({
  id: z.union([
    z.string().cuid({ message: 'Invalid run ID format' }),
    z.string().startsWith('mock-run-id-'), // Allow mock IDs for testing
  ]),
});

/**
 * Type definitions derived from schemas
 */
export type RSVPBody = z.infer<typeof rsvpBodySchema>;
export type RSVPParams = z.infer<typeof rsvpParamsSchema>;
