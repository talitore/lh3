import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { upsertRsvp } from '@/lib/rsvpService';

// Import schemas
import { rsvpParamsSchema, rsvpBodySchema } from '@/lib/schemas';

// Import error handling
import { createErrorResponse, formatErrorResponse } from '@/lib/errors';

interface RouteContext {
  params: {
    id: string; // This is runId
  };
}

async function handlePUT(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const resolvedParams = context.params;
  const paramsToValidate = { id: resolvedParams.id }; // Use resolvedParams.id
  const paramsValidationResult = rsvpParamsSchema.safeParse(paramsToValidate);

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

  let body;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    throw error;
  }

  const bodyValidationResult = rsvpBodySchema.safeParse(body);

  if (!bodyValidationResult.success) {
    return NextResponse.json(
      {
        message: 'Invalid request body',
        errors: bodyValidationResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  const { status } = bodyValidationResult.data;

  try {
    const rsvp = await upsertRsvp({ runId, userId, status });
    return NextResponse.json(rsvp, { status: 200 });
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    if (errorResponse.statusCode !== 500) {
      return NextResponse.json(
        { message: errorResponse.message },
        { status: errorResponse.statusCode }
      );
    }
    // Re-throw other errors to be handled by the outer error handler
    throw error;
  }
}

// Export handler with error handling
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    return await handlePUT(request, context);
  } catch (error) {
    return createErrorResponse(error as Error, 'PUT /api/runs/[id]/rsvp');
  }
}
