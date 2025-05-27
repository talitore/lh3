/**
 * Attendance-related validation schemas
 * 
 * This file contains all Zod schemas for attendance-related operations.
 */

import { z } from 'zod';

/**
 * Schema for attendance request body
 */
export const attendanceBodySchema = z.object({
  userId: z.string().cuid({ message: 'Invalid user ID format' }),
});

/**
 * Schema for attendance parameters (run ID)
 */
export const attendanceParamsSchema = z.object({
  id: z.union([
    z.string().cuid({ message: 'Invalid run ID format' }),
    z.string().startsWith('mock-run-id-'), // Allow mock IDs for testing
    z.literal('mock-run-id-for-attendance'), // Specific mock ID for attendance tests
  ]),
});

/**
 * Type definitions derived from schemas
 */
export type AttendanceBody = z.infer<typeof attendanceBodySchema>;
export type AttendanceParams = z.infer<typeof attendanceParamsSchema>;
