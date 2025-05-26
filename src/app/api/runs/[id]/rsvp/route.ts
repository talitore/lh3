import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { upsertRsvp } from '@/lib/rsvpService';

// Import schemas
import { rsvpParamsSchema, rsvpBodySchema } from '@/lib/schemas';

// Import error handling
import { createErrorResponse } from '@/lib/errors';

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

  const body = await request.json();
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

  const rsvp = await upsertRsvp({ runId, userId, status });
  return NextResponse.json(rsvp, { status: 200 });
}

// Export handler with error handling
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    return await handlePUT(request, context);
  } catch (error) {
    return createErrorResponse(error as Error, 'PUT /api/runs/[id]/rsvp');
  }
}
