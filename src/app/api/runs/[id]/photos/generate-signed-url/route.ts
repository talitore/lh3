import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import {
  generateSignedUrlForUpload,
  PhotoServiceError,
} from '@/lib/photoService';

// Schema to validate the run ID from the path
const paramsSchema = z.object({
  id: z.string().cuid({ message: 'Invalid run ID format' }), // This is runId
});

// Schema for the request body
const generateUrlBodySchema = z.object({
  fileName: z.string().min(1, { message: 'fileName is required' }),
  contentType: z.string().regex(/^image\/(jpeg|png|gif|webp)$/, {
    // Basic image types, adjust as needed
    message:
      'Invalid contentType. Supported types: image/jpeg, image/png, image/gif, image/webp',
  }),
});

interface RouteContext {
  params: {
    id: string; // This is runId
  };
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const uploaderId = session.user.id;

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
    const bodyValidationResult = generateUrlBodySchema.safeParse(body);

    if (!bodyValidationResult.success) {
      return NextResponse.json(
        {
          message: 'Invalid request body',
          errors: bodyValidationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { fileName, contentType } = bodyValidationResult.data;

    const result = await generateSignedUrlForUpload({
      runId,
      uploaderId,
      fileName,
      contentType,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(
      `Error generating signed URL for photo upload for run ${runId}:`,
      error
    );
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
