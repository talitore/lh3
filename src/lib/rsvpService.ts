import { PrismaClient, RSVPStatus, Prisma } from '@/generated/prisma';

const prisma = new PrismaClient();

export interface UpsertRsvpData {
  runId: string;
  userId: string;
  status: RSVPStatus;
}

export async function upsertRsvp(data: UpsertRsvpData) {
  try {
    // Check if the run exists
    const runExists = await prisma.run.findUnique({
      where: { id: data.runId },
    });
    if (!runExists) {
      throw new Error('Run not found'); // Or a custom error class
    }

    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!userExists) {
      throw new Error('User not found'); // Or a custom error class
    }

    const rsvp = await prisma.rSVP.upsert({
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
