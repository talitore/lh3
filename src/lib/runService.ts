import { PrismaClient, Prisma } from '@/generated/prisma';

const prisma = new PrismaClient();

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

export async function createRun(data: CreateRunData) {
  try {
    const newRun = await prisma.run.create({
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
      console.error('Prisma error in createRun:', error.message);
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

export async function getAllRuns(options: GetAllRunsOptions = {}) {
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

  const orderByClause: Prisma.RunOrderByWithRelationInput = {};
  if (sortBy && sortOrder) {
    orderByClause[sortBy] = sortOrder;
  }

  const skip = (page - 1) * limit;

  try {
    const runs = await prisma.run.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip: skip,
      take: limit,
      include: {
        organizer: {
          select: { id: true, name: true, image: true }, // Select only necessary organizer fields
        },
        _count: {
          select: {
            rsvps: { where: { status: 'YES' } }, // Count only 'YES' RSVPs
          },
        },
      },
    });

    const totalRuns = await prisma.run.count({
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

export async function getRunById(id: string) {
  try {
    const run = await prisma.run.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, email: true, image: true },
        },
        rsvps: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        attendees: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: {
            markedAt: 'asc',
          },
        },
        photos: {
          select: {
            id: true,
            storageKey: true,
            url: true,
            caption: true,
            createdAt: true,
            uploadedBy: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!run) {
      return null;
    }

    // Process RSVPs into a more structured format if desired, or count them
    const rsvpCounts = {
      yes: run.rsvps.filter((r) => r.status === 'YES').length,
      no: run.rsvps.filter((r) => r.status === 'NO').length,
      maybe: run.rsvps.filter((r) => r.status === 'MAYBE').length,
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

export async function updateRun(id: string, data: UpdateRunData) {
  try {
    // Check if the run exists first (optional, but good for a clear 404)
    const existingRun = await prisma.run.findUnique({ where: { id } });
    if (!existingRun) {
      return null; // Or throw a custom NotFoundError
    }

    const updatedRun = await prisma.run.update({
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
          select: { id: true, name: true, image: true },
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
