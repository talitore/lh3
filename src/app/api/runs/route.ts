import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path if necessary
import { z } from 'zod';
import { createRun, getAllRuns, GetAllRunsOptions } from '@/lib/runService'; // Updated import
import { Prisma } from '@/generated/prisma'; // Changed import for PrismaClientKnownRequestError
import { NextRequest } from 'next/server'; // Import NextRequest
import { getServiceProvider } from '@/lib/serviceProvider';

// Import constants
import { HTTP_STATUS, ERROR_MESSAGES, REQUEST_HEADERS } from '@/lib/constants/api';
import { PAGINATION, SORT_OPTIONS, FILTER_OPTIONS, COOKIES, TEST_MODE } from '@/lib/constants/app';
import { STRING_VALIDATION, NUMBER_VALIDATION, DATE_VALIDATION, URL_VALIDATION, ENUM_OPTIONS } from '@/lib/constants/validation';
import { shouldBypassAuth } from '@/lib/config/env';

// Define the schema for input validation using Zod
const createRunSchema = z.object({
  number: z.number().int().positive(),
  descriptor: z
    .string()
    .min(STRING_VALIDATION.DESCRIPTOR.MIN_LENGTH, {
      message: STRING_VALIDATION.DESCRIPTOR.ERROR_MESSAGE
    }),
  dateTime: z
    .string()
    .datetime({ message: DATE_VALIDATION.DATETIME.ERROR_MESSAGE }),
  address: z
    .string()
    .min(STRING_VALIDATION.ADDRESS.MIN_LENGTH, {
      message: STRING_VALIDATION.ADDRESS.ERROR_MESSAGE
    }),
  lat: z.number().optional(),
  lng: z.number().optional(),
  introLink: z
    .string()
    .url({ message: URL_VALIDATION.INTRO_LINK.ERROR_MESSAGE })
    .optional()
    .or(z.literal('')),
});

// Zod schema for GET query parameters
const getRunsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().optional().default(PAGINATION.DEFAULT_LIMIT),
  sortBy: z
    .enum(ENUM_OPTIONS.SORT_BY)
    .optional()
    .default(SORT_OPTIONS.DEFAULTS.FIELD as any),
  sortOrder: z.enum(ENUM_OPTIONS.SORT_ORDER).optional().default(SORT_OPTIONS.DEFAULTS.ORDER as any),
  filterStatus: z.enum(ENUM_OPTIONS.FILTER_STATUS).optional().default(FILTER_OPTIONS.DEFAULT_STATUS as any),
  dateFrom: z
    .string()
    .datetime({ message: DATE_VALIDATION.DATE_FROM.ERROR_MESSAGE })
    .optional(),
  dateTo: z
    .string()
    .datetime({ message: DATE_VALIDATION.DATE_TO.ERROR_MESSAGE })
    .optional(),
});

export async function POST(request: Request) {
  const headers = request.headers;
  const isTestRequest = headers.get(REQUEST_HEADERS.TEST_MODE) === 'true';
  const isMockAuth = headers.get(REQUEST_HEADERS.MOCK_AUTH) === 'true';
  const cookieHeader = headers.get(REQUEST_HEADERS.COOKIE) || '';

  let organizerId: string;
  let isAuthenticated = false;

  // Handle authentication
  if (shouldBypassAuth() || (isTestRequest && isMockAuth)) {
    // In test mode with auth checks skipped, use mock values
    // Check if the cookie header contains the mock organizer cookie
    if (
      cookieHeader.includes(COOKIES.MOCK_ORGANIZER_SESSION) ||
      cookieHeader.includes(COOKIES.ROLE_ORGANIZER)
    ) {
      organizerId = TEST_MODE.MOCK_ORGANIZER_ID;
      isAuthenticated = true;
      console.log('Using mock authentication for POST /api/runs');
    } else {
      // No mock cookie provided, return 401
      return NextResponse.json(
        { message: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
  } else {
    // Normal authentication flow
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    organizerId = session.user.id;
    isAuthenticated = true;
  }

  // If not authenticated, return 401
  if (!isAuthenticated) {
    return NextResponse.json(
      { message: ERROR_MESSAGES.UNAUTHORIZED },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }

  try {
    const body = await request.json();
    const validatedData = createRunSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: ERROR_MESSAGES.INVALID_INPUT,
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { number, descriptor, dateTime, address, lat, lng, introLink } =
      validatedData.data;

    const newRun = await createRun({
      number,
      descriptor,
      dateTime: new Date(dateTime), // Convert string to Date object
      address,
      lat,
      lng,
      introLink: introLink || null, // Store as null if empty string
      organizerId,
    });

    return NextResponse.json(newRun, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Error creating run:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.error('P2002 Error Meta:', error.meta);
        if (
          error.meta?.target === 'Run_number_key' ||
          (Array.isArray(error.meta?.target) &&
            error.meta.target.includes('number'))
        ) {
          return NextResponse.json(
            { message: ERROR_MESSAGES.RUN_NUMBER_EXISTS },
            { status: HTTP_STATUS.CONFLICT }
          );
        }
      }
    }
    return NextResponse.json(
      { message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET(request: NextRequest) {
  // No session check needed for listing runs as per current requirements (publicly viewable)
  // If authentication is required later, add session check here.

  const { searchParams } = new URL(request.url);
  const queryParams = Object.fromEntries(searchParams.entries());

  const validationResult = getRunsQuerySchema.safeParse(queryParams);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        message: ERROR_MESSAGES.INVALID_QUERY_PARAMETERS,
        errors: validationResult.error.flatten().fieldErrors,
      },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  const options: GetAllRunsOptions = validationResult.data;

  try {
    const result = await getAllRuns(options);
    return NextResponse.json(result, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Error fetching runs:', error);
    return NextResponse.json(
      { message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
