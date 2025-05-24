import { PrismaClient, Prisma } from '@/generated/prisma';
import { getServiceProvider } from './serviceProvider';

// Import constants
import { DATABASE, RSVP_STATUS } from '@/lib/constants/app';

export interface CreateRunData {
  number: number;
  descriptor: string;
  dateTime: Date;
  address: string;
  lat?: number;
  lng?: number;
  introLink?: string | null;
  organizerId: string;
}

/**
 * Create a new run
 * @param data The run data
 * @param prismaClient Optional Prisma client for dependency injection
 * @returns The created run
 */
export async function createRun(
  data: CreateRunData,
  prismaClient?: PrismaClient
) {
  // Get the database client from the service provider if not provided
  const client =
    prismaClient || getServiceProvider().getDbService().getClient();

  try {
    const newRun = await client.run.create({
      data: {
        number: data.number,
        descriptor: data.descriptor,
        dateTime: data.dateTime,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        introLink: data.introLink,
        organizer: {
          connect: { id: data.organizerId },
        },
      },
    });
    return newRun;
  } catch (error) {
    // Log the error or handle specific Prisma errors if needed
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Example: Unique constraint violation for run number
      if (error.code === 'P2002' && error.meta?.target === 'Run_number_key') {
        // This specific error is better handled in the API route for a user-friendly response
        // Re-throw to be caught by the API route handler
        throw error;
      }
      // Log other Prisma errors
      console.error('Prisma error in createRun:', error);
    }
    // Re-throw other errors to be caught by the API route handler
    throw error;
  }
}

export interface GetAllRunsOptions {
  page?: number;
  limit?: number;
  sortBy?: 'dateTime' | 'number' | 'descriptor';
  sortOrder?: 'asc' | 'desc';
  filterStatus?: 'upcoming' | 'past' | 'all';
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
  // Potentially add more filters like organizerId, etc. in the future
}

/**
 * Get all runs with pagination and filtering
 * @param options Options for filtering and pagination
 * @param prismaClient Optional Prisma client for dependency injection
 * @returns The runs and pagination information
 */
export async function getAllRuns(
  options: GetAllRunsOptions = {},
  prismaClient?: PrismaClient
) {
  // Get the database client from the service provider if not provided
  const client =
    prismaClient || getServiceProvider().getDbService().getClient();

  const {
    page = 1,
    limit = 10,
    sortBy = 'dateTime',
    sortOrder = 'desc',
    filterStatus = 'all',
    dateFrom,
    dateTo,
  } = options;

  const whereClause: Prisma.RunWhereInput = {};
  const now = new Date();

  if (filterStatus === 'upcoming') {
    whereClause.dateTime = { gt: now };
  } else if (filterStatus === 'past') {
    whereClause.dateTime = { lte: now };
  }

  // Initialize dateTime filter if it doesn't exist yet
  if (!whereClause.dateTime) {
    whereClause.dateTime = {};
  }

  if (dateFrom) {
    whereClause.dateTime = {
      ...(whereClause.dateTime as Prisma.DateTimeFilter), // Keep existing gt/lte if filterStatus is set
      gte: new Date(dateFrom),
    };
  }
  if (dateTo) {
    whereClause.dateTime = {
      ...(whereClause.dateTime as Prisma.DateTimeFilter),
      lte: new Date(dateTo),
    };
  }

  // Debug logging
  console.log('getAllRuns whereClause:', JSON.stringify(whereClause));

  const orderByClause: Prisma.RunOrderByWithRelationInput = {};
  if (sortBy && sortOrder) {
    orderByClause[sortBy] = sortOrder;
  }

  const skip = (page - 1) * limit;

  try {
    const runs = await client.run.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip: skip,
      take: limit,
      include: {
        organizer: {
          select: DATABASE.SELECT_FIELDS.USER_BASIC, // Select only necessary organizer fields
        },
        _count: {
          select: {
            rsvps: { where: { status: RSVP_STATUS.YES } }, // Count only 'YES' RSVPs
          },
        },
      },
    });

    const totalRuns = await client.run.count({
      where: whereClause,
    });

    return {
      data: runs.map((run) => ({
        ...run,
        rsvpYesCount: run._count?.rsvps ?? 0, // Make count more accessible
      })),
      pagination: {
        page,
        limit,
        totalRuns,
        totalPages: Math.ceil(totalRuns / limit),
      },
    };
  } catch (error) {
    console.error('Error in getAllRuns:', error);
    // Re-throw to be caught by the API route handler or a global error handler
    throw error;
  }
}

/**
 * Get a run by ID
 * @param id The run ID
 * @param prismaClient Optional Prisma client for dependency injection
 * @returns The run or null if not found
 */
export async function getRunById(id: string, prismaClient?: PrismaClient) {
  // Get the database client from the service provider if not provided
  const client =
    prismaClient || getServiceProvider().getDbService().getClient();

  try {
    const run = await client.run.findUnique({
      where: { id },
      include: {
        organizer: {
          select: DATABASE.SELECT_FIELDS.USER_DETAILED,
        },
        rsvps: {
          include: {
            user: {
              select: DATABASE.SELECT_FIELDS.USER_BASIC,
            },
          },
          orderBy: DATABASE.ORDER_BY.CREATED_AT_ASC,
        },
        attendees: {
          include: {
            user: {
              select: DATABASE.SELECT_FIELDS.USER_BASIC,
            },
          },
          orderBy: DATABASE.ORDER_BY.MARKED_AT_ASC,
        },
        photos: {
          select: {
            ...DATABASE.SELECT_FIELDS.PHOTO_BASIC,
            uploadedBy: {
              select: DATABASE.SELECT_FIELDS.USER_BASIC,
            },
          },
          orderBy: DATABASE.ORDER_BY.CREATED_AT_DESC,
        },
      },
    });

    if (!run) {
      return null;
    }

    // Process RSVPs into a more structured format if desired, or count them
    const rsvpCounts = {
      yes: run.rsvps.filter((r) => r.status === RSVP_STATUS.YES).length,
      no: run.rsvps.filter((r) => r.status === RSVP_STATUS.NO).length,
      maybe: run.rsvps.filter((r) => r.status === RSVP_STATUS.MAYBE).length,
    };

    return {
      ...run,
      rsvpCounts,
      // attendees and photos are already in the desired structure from the include
    };
  } catch (error) {
    console.error(`Error in getRunById for id ${id}:`, error);
    throw error; // Re-throw to be caught by the API route handler
  }
}

export interface UpdateRunData {
  number?: number;
  descriptor?: string;
  dateTime?: Date;
  address?: string;
  lat?: number | null; // Allow null to unset
  lng?: number | null; // Allow null to unset
  introLink?: string | null; // Allow null to unset
}

/**
 * Update a run
 * @param id The run ID
 * @param data The data to update
 * @param prismaClient Optional Prisma client for dependency injection
 * @returns The updated run or null if not found
 */
export async function updateRun(
  id: string,
  data: UpdateRunData,
  prismaClient?: PrismaClient
) {
  // Get the database client from the service provider if not provided
  const client =
    prismaClient || getServiceProvider().getDbService().getClient();

  try {
    // Check if the run exists first (optional, but good for a clear 404)
    const existingRun = await client.run.findUnique({ where: { id } });
    if (!existingRun) {
      return null; // Or throw a custom NotFoundError
    }

    const updatedRun = await client.run.update({
      where: { id },
      data: {
        ...data,
        // Ensure optional fields are handled correctly (e.g., undefined means no change)
        // If a field is explicitly set to null in data, it will be set to null in DB if schema allows
        lat: data.lat === null ? null : data.lat,
        lng: data.lng === null ? null : data.lng,
        introLink: data.introLink === null ? null : data.introLink,
      },
      // Optionally include relations if needed in the response, similar to getRunById
      include: {
        organizer: {
          select: DATABASE.SELECT_FIELDS.USER_BASIC,
        },
      },
    });
    return updatedRun;
  } catch (error) {
    // Log the error or handle specific Prisma errors if needed
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Example: Unique constraint violation for run number if it's being updated
      if (error.code === 'P2002' && error.meta?.target === 'Run_number_key') {
        // This specific error is better handled in the API route for a user-friendly response
        throw error;
      }
      console.error(`Prisma error updating run ${id}:`, error.message);
    }
    throw error; // Re-throw to be caught by the API route handler
  }
}

// Future functions for Run CRUD can be added here:
// export async function getRunById(id: string) { ... }
// export async function updateRun(id: string, data: Partial<CreateRunData>) { ... }
// export async function deleteRun(id: string) { ... }
