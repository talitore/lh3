import { PrismaClient, Prisma } from '@/generated/prisma';

const prisma = new PrismaClient();

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

export async function markAttendance(data: MarkAttendanceData) {
  try {
    // Check if the run exists
    const run = await prisma.run.findUnique({ where: { id: data.runId } });
    if (!run) {
      throw new AttendanceError('Run not found', 404);
    }

    // Check if the user to be marked attended exists
    const userToMark = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!userToMark) {
      throw new AttendanceError('User to mark attended not found', 404);
    }

    // Attempt to create the attendance record
    // The unique constraint @@unique([runId, userId]) on Attendance model will prevent duplicates
    const attendanceRecord = await prisma.attendance.create({
      data: {
        runId: data.runId,
        userId: data.userId,
        // markedAt is defaulted to now() by the schema
      },
      include: {
        // Optionally include details for the response
        user: { select: { id: true, name: true, image: true } },
        run: { select: { id: true, descriptor: true } },
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
          const existingRecord = await prisma.attendance.findUnique({
            where: { runId_userId: { runId: data.runId, userId: data.userId } },
            include: {
              user: { select: { id: true, name: true, image: true } },
              run: { select: { id: true, descriptor: true } },
            },
          });
          if (existingRecord) return existingRecord; // Return existing record if already marked
          // If for some reason it couldn't be fetched but P2002 occurred, throw a generic conflict
          throw new AttendanceError(
            'User already marked as attended for this run.',
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
