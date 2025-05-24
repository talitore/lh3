import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { upsertRsvp } from '@/lib/rsvpService';
import { RSVPStatus } from '@/generated/prisma'; // Import the enum

// Schema to validate the ID from the path
const paramsSchema = z.object({
  id: z.string().cuid({ message: 'Invalid run ID format' }),
});

// Schema for the request body
const rsvpBodySchema = z.object({
  status: z.nativeEnum(RSVPStatus, {
    errorMap: () => ({
      message: 'Invalid RSVP status. Must be YES, NO, or MAYBE.',
    }),
  }),
});

interface RouteContext {
  params: {
    id: string; // This is runId
  };
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const resolvedParams = await context.params; // Await context.params
  const paramsToValidate = { id: resolvedParams.id }; // Use resolvedParams.id
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
    return NextResponse.json(rsvp, { status: 200 }); // 200 OK for upsert, or 201 if always creates new representation
  } catch (error: any) {
    console.error(
      `Error processing RSVP for run ${runId} by user ${userId}:`,
      error
    );
    if (
      error.message === 'Run not found' ||
      error.message === 'User not found'
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
