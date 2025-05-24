import { PrismaClient, Prisma } from '@/generated/prisma';
import { getServiceProvider } from './serviceProvider';

// Import constants
import { ERROR_MESSAGES } from '@/lib/constants/api';
import { TEST_MODE, DATABASE } from '@/lib/constants/app';
import { PLACEHOLDER_IMAGE } from '@/lib/constants/ui';

export interface MarkAttendanceData {
  runId: string;
  userId: string; // The user being marked as attended
  markedByUserId: string; // The user (organizer/admin) marking the attendance
}

export class AttendanceError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AttendanceError';
  }
}

/**
 * Mark a user as attended for a run
 * @param data The attendance data
 * @param prismaClient Optional Prisma client for dependency injection
 * @returns The attendance record
 */
export async function markAttendance(
  data: MarkAttendanceData,
  prismaClient?: PrismaClient
) {
  // Get the database client from the service provider if not provided
  const client =
    prismaClient || getServiceProvider().getDbService().getClient();
  const isTestMode = getServiceProvider().isInTestMode();

  try {
    // Check if we're in test mode with mock data
    if (
      isTestMode &&
      (data.runId.startsWith(TEST_MODE.MOCK_RUN_ID_PREFIX) ||
        data.userId.startsWith(TEST_MODE.MOCK_USER_ID_PREFIX) ||
        data.userId === 'cluser00000000000000000000')
    ) {
      console.log('Using mock data for markAttendance');
      return {
        id: `${TEST_MODE.MOCK_ATTENDANCE_ID_PREFIX}-${Date.now()}`,
        runId: data.runId,
        userId: data.userId,
        markedAt: new Date(),
        user: {
          id: data.userId,
          name: TEST_MODE.MOCK_USER_NAME,
          image: `${PLACEHOLDER_IMAGE.BASE_URL}${TEST_MODE.MOCK_USER_NAME.replace(/\s+/g, '+')}`,
        },
        run: {
          id: data.runId,
          descriptor: TEST_MODE.MOCK_RUN_DESCRIPTOR,
        },
      };
    }

    // Check if the run exists
    const run = await client.run.findUnique({ where: { id: data.runId } });
    if (!run) {
      throw new AttendanceError(ERROR_MESSAGES.RUN_NOT_FOUND, 404);
    }

    // Check if the user to be marked attended exists
    const userToMark = await client.user.findUnique({
      where: { id: data.userId },
    });
    if (!userToMark) {
      throw new AttendanceError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    }

    // Attempt to create the attendance record
    // The unique constraint @@unique([runId, userId]) on Attendance model will prevent duplicates
    const attendanceRecord = await client.attendance.create({
      data: {
        runId: data.runId,
        userId: data.userId,
        // markedAt is defaulted to now() by the schema
      },
      include: {
        // Optionally include details for the response
        user: { select: DATABASE.SELECT_FIELDS.USER_BASIC },
        run: { select: DATABASE.SELECT_FIELDS.RUN_BASIC },
      },
    });

    return attendanceRecord;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation (P2002)
      if (error.code === 'P2002') {
        // Check if it's the specific unique constraint for runId_userId on Attendance
        const target = error.meta?.target as string[] | undefined;
        if (target && target.includes('runId') && target.includes('userId')) {
          // Attempt to fetch the existing record to return it, as if it was just marked successfully
          const existingRecord = await client.attendance.findUnique({
            where: { runId_userId: { runId: data.runId, userId: data.userId } },
            include: {
              user: { select: DATABASE.SELECT_FIELDS.USER_BASIC },
              run: { select: DATABASE.SELECT_FIELDS.RUN_BASIC },
            },
          });
          if (existingRecord) return existingRecord; // Return existing record if already marked
          // If for some reason it couldn't be fetched but P2002 occurred, throw a generic conflict
          throw new AttendanceError(
            ERROR_MESSAGES.USER_ALREADY_ATTENDED,
            409
          );
        }
      }
      console.error('Prisma error in markAttendance:', error.message);
      throw new AttendanceError(
        'Database error while marking attendance.',
        500
      );
    } else if (error instanceof AttendanceError) {
      throw error; // Re-throw custom errors
    }
    console.error('Unexpected error in markAttendance:', error);
    throw new AttendanceError(
      'An unexpected error occurred while marking attendance.',
      500
    );
  }
}
