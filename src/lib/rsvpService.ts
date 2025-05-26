import { PrismaClient, RSVPStatus, Prisma } from '@/generated/prisma';
import { getServiceProvider } from './serviceProvider';

// Import error classes
import { RunNotFoundError, UserNotFoundError } from '@/lib/errors';

export interface UpsertRsvpData {
  runId: string;
  userId: string;
  status: RSVPStatus;
}

export async function upsertRsvp(
  data: UpsertRsvpData,
  prismaClient?: PrismaClient
) {
  // Get the database client from the service provider if not provided
  const client =
    prismaClient || getServiceProvider().getDbService().getClient();

  try {
    // Check if the run exists
    const runExists = await client.run.findUnique({
      where: { id: data.runId },
    });
    if (!runExists) {
      throw new RunNotFoundError();
    }

    // Check if the user exists
    const userExists = await client.user.findUnique({
      where: { id: data.userId },
    });
    if (!userExists) {
      throw new UserNotFoundError();
    }

    const rsvp = await client.rSVP.upsert({
      where: {
        runId_userId: {
          // Referencing the @@unique([runId, userId]) constraint
          runId: data.runId,
          userId: data.userId,
        },
      },
      update: {
        status: data.status,
      },
      create: {
        runId: data.runId,
        userId: data.userId,
        status: data.status,
      },
      include: {
        // Optionally include related data if needed by the frontend
        user: { select: { id: true, name: true, image: true } },
        run: { select: { id: true, descriptor: true } },
      },
    });
    return rsvp;
  } catch (error) {
    console.error('Error in upsertRsvp:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors if necessary
      console.error('Prisma error in upsertRsvp:', error.message);
    }
    throw error; // Re-throw to be caught by the API route handler
  }
}
