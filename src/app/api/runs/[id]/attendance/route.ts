import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { markAttendance } from '@/lib/attendanceService';

// Import schemas
import { attendanceParamsSchema, attendanceBodySchema } from '@/lib/schemas';

// Import error handling
import { createErrorResponse } from '@/lib/errors';

interface RouteContext {
  params: Promise<{
    id: string; // This is runId
  }>;
}

async function handlePOST(request: NextRequest, context: RouteContext) {
  // Check if we're in test mode
  const isTestMode = process.env.E2E_TESTING_MODE === 'true';
  const skipAuthChecks = process.env.SKIP_AUTH_CHECKS === 'true';
  const headers = request.headers;
  const isTestRequest = headers.get('X-Test-Mode') === 'true';
  const isMockAuth = headers.get('X-Mock-Auth') === 'true';

  let markedByUserId: string;
  let requesterRole: string;

  // Handle authentication
  if ((isTestMode && skipAuthChecks) || (isTestRequest && isMockAuth)) {
    // In test mode with auth checks skipped, use mock values
    markedByUserId = 'mock-organizer-id';
    requesterRole = 'ORGANIZER';
    console.log('Using mock authentication for POST /api/runs/[id]/attendance');
  } else {
    // Normal authentication flow
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id || !session.user.role) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    markedByUserId = session.user.id;
    requesterRole = session.user.role;
  }

  // Authorization: Check if user has 'organizer' or 'admin' role
  if (requesterRole !== 'ORGANIZER' && requesterRole !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    );
  }

  const resolvedParams = await context.params;
  const paramsToValidate = { id: resolvedParams.id };
  const paramsValidationResult = attendanceParamsSchema.safeParse(paramsToValidate);

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
  return NextResponse.json(attendanceRecord, { status: 201 });
}

// Export handler with error handling
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    return await handlePOST(request, context);
  } catch (error) {
    return createErrorResponse(error as Error, 'POST /api/runs/[id]/attendance');
  }
}
