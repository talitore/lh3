import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { confirmPhotoUpload, PhotoServiceError } from '@/lib/photoService';

// Schema to validate the run ID from the path - though not strictly needed for this endpoint
// as photoId is the primary identifier. Included for consistency or future use.
const paramsSchema = z.object({
  id: z.string().cuid({ message: 'Invalid run ID format' }),
});

// Schema for the request body
const confirmUploadBodySchema = z.object({
  photoId: z.string().cuid({ message: 'Invalid photo ID format' }),
  caption: z
    .string()
    .max(500, { message: 'Caption cannot exceed 500 characters' })
    .optional()
    .nullable(),
});

interface RouteContext {
  params: {
    id: string; // This is runId, used for namespacing the route but photoId is key
  };
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  // const uploaderId = session.user.id; // Could be used to verify ownership if needed

  // Validate runId from path, though not directly used by confirmPhotoUpload if photoId is globally unique
  const resolvedParams = await context.params; // Await context.params
  const paramsToValidate = { id: resolvedParams.id }; // Use resolvedParams.id
  const paramsValidationResult = paramsSchema.safeParse(paramsToValidate);

  if (!paramsValidationResult.success) {
    return NextResponse.json(
      {
        message: 'Invalid run ID format in path',
        errors: paramsValidationResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  // const runId = paramsValidationResult.data.id;

  try {
    const body = await request.json();
    const bodyValidationResult = confirmUploadBodySchema.safeParse(body);

    if (!bodyValidationResult.success) {
      return NextResponse.json(
        {
          message: 'Invalid request body',
          errors: bodyValidationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { photoId, caption } = bodyValidationResult.data;

    // Optional: Add logic here to verify that session.user.id matches the uploaderId on the Photo record
    // for photoId, before confirming. This adds an ownership check.
    // For now, any authenticated user can confirm any photo if they have its ID.

    const result = await confirmPhotoUpload({ photoId, caption });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`Error confirming photo upload:`, error);
    if (error instanceof PhotoServiceError) {
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
