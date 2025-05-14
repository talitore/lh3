import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path if necessary
import { z } from 'zod';
import { createRun, getAllRuns, GetAllRunsOptions } from '@/lib/runService'; // Updated import
import { Prisma } from '@/generated/prisma'; // Changed import for PrismaClientKnownRequestError
import { NextRequest } from 'next/server'; // Import NextRequest

// Define the schema for input validation using Zod
const createRunSchema = z.object({
  number: z.number().int().positive(),
  descriptor: z
    .string()
    .min(3, { message: 'Descriptor must be at least 3 characters long' }),
  dateTime: z
    .string()
    .datetime({ message: 'Invalid datetime string. Must be ISO8601' }),
  address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters long' }),
  lat: z.number().optional(),
  lng: z.number().optional(),
  introLink: z
    .string()
    .url({ message: 'Invalid URL for intro link' })
    .optional()
    .or(z.literal('')),
});

// Zod schema for GET query parameters
const getRunsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  sortBy: z
    .enum(['dateTime', 'number', 'descriptor'])
    .optional()
    .default('dateTime'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  filterStatus: z.enum(['upcoming', 'past', 'all']).optional().default('all'),
  dateFrom: z
    .string()
    .datetime({ message: 'Invalid dateFrom string. Must be ISO8601' })
    .optional(),
  dateTo: z
    .string()
    .datetime({ message: 'Invalid dateTo string. Must be ISO8601' })
    .optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const organizerId = session.user.id;

  try {
    const body = await request.json();
    const validatedData = createRunSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: 'Invalid input',
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
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

    return NextResponse.json(newRun, { status: 201 });
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
            { message: 'A run with this number already exists.' },
            { status: 409 }
          );
        }
      }
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
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
        message: 'Invalid query parameters',
        errors: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const options: GetAllRunsOptions = validationResult.data;

  try {
    const result = await getAllRuns(options);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching runs:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
