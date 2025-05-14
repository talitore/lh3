import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { markAttendance, AttendanceError } from '@/lib/attendanceService';

// Schema to validate the run ID from the path
const paramsSchema = z.object({
  id: z.string().cuid({ message: 'Invalid run ID format' }), // This is runId
});

// Schema for the request body
const attendanceBodySchema = z.object({
  userId: z.string().cuid({ message: 'Invalid user ID format for attendance' }), // User to be marked as attended
});

interface RouteContext {
  params: {
    id: string; // This is runId
  };
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id || !session.user.role) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const markedByUserId = session.user.id;
  const requesterRole = session.user.role;

  // Authorization: Check if user has 'organizer' or 'admin' role
  if (requesterRole !== 'ORGANIZER' && requesterRole !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    );
  }

  const resolvedParams = await context.params;
  const paramsToValidate = { id: resolvedParams.id };
  const paramsValidationResult = paramsSchema.safeParse(paramsToValidate);

  if (!paramsValidationResult.success) {
    return NextResponse.json(
      {
        message: 'Invalid run ID format',
        errors: paramsValidationResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  const runId = paramsValidationResult.data.id;

  try {
    const body = await request.json();
    const bodyValidationResult = attendanceBodySchema.safeParse(body);

    if (!bodyValidationResult.success) {
      return NextResponse.json(
        {
          message: 'Invalid request body',
          errors: bodyValidationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { userId } = bodyValidationResult.data; // User to be marked attended

    const attendanceRecord = await markAttendance({
      runId,
      userId,
      markedByUserId,
    });
    return NextResponse.json(attendanceRecord, { status: 201 }); // 201 Created for new record
  } catch (error) {
    console.error(`Error marking attendance for run ${runId}:`, error);
    if (error instanceof AttendanceError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
