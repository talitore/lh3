import { upsertRsvp, UpsertRsvpData } from './rsvpService';
import { PrismaClient, RSVPStatus, Prisma } from '@/generated/prisma';

// Mock Prisma Client
jest.mock('@/generated/prisma', () => {
  const actualPrisma = jest.requireActual('@/generated/prisma'); // Get actual enum and error types
  const mockPrismaClient = {
    run: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    rSVP: {
      upsert: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    RSVPStatus: actualPrisma.RSVPStatus,
    Prisma: {
      PrismaClientKnownRequestError:
        actualPrisma.Prisma.PrismaClientKnownRequestError,
    },
  };
});

// Helper to get the mocked prisma instance for assertions/setup per test
const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient> & {
  run: { findUnique: jest.Mock };
  user: { findUnique: jest.Mock };
  rSVP: { upsert: jest.Mock };
}; // More specific type for prismaMock

describe('upsertRsvp', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (prismaMock.run.findUnique as jest.Mock).mockReset();
    (prismaMock.user.findUnique as jest.Mock).mockReset();
    (prismaMock.rSVP.upsert as jest.Mock).mockReset();
  });

  const validRunId = 'clrun123';
  const validUserId = 'cluser456';
  const mockRun = { id: validRunId, name: 'Test Run' };
  const mockUser = { id: validUserId, name: 'Test User' };

  it('should create a new RSVP if one does not exist', async () => {
    const rsvpData: UpsertRsvpData = {
      runId: validRunId,
      userId: validUserId,
      status: RSVPStatus.YES,
    };
    const expectedRsvp = {
      ...rsvpData,
      id: 'clrsvp789',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.rSVP.upsert as jest.Mock).mockResolvedValue(expectedRsvp);

    const result = await upsertRsvp(rsvpData);

    expect(prismaMock.run.findUnique).toHaveBeenCalledWith({
      where: { id: rsvpData.runId },
    });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: rsvpData.userId },
    });
    expect(prismaMock.rSVP.upsert).toHaveBeenCalledWith({
      where: {
        runId_userId: { runId: rsvpData.runId, userId: rsvpData.userId },
      },
      update: { status: rsvpData.status },
      create: {
        runId: rsvpData.runId,
        userId: rsvpData.userId,
        status: rsvpData.status,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        run: { select: { id: true, descriptor: true } },
      },
    });
    expect(result).toEqual(expectedRsvp);
  });

  it('should update an existing RSVP if one exists', async () => {
    const rsvpData: UpsertRsvpData = {
      runId: validRunId,
      userId: validUserId,
      status: RSVPStatus.NO,
    };
    const updatedRsvp = {
      ...rsvpData,
      id: 'clrsvp789',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.rSVP.upsert as jest.Mock).mockResolvedValue(updatedRsvp); // upsert handles create/update

    const result = await upsertRsvp(rsvpData);

    expect(prismaMock.rSVP.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          runId_userId: { runId: rsvpData.runId, userId: rsvpData.userId },
        },
        update: { status: rsvpData.status },
        create: {
          runId: rsvpData.runId,
          userId: rsvpData.userId,
          status: rsvpData.status,
        },
      })
    );
    expect(result).toEqual(updatedRsvp);
  });

  it('should throw an error if the run does not exist', async () => {
    const rsvpData: UpsertRsvpData = {
      runId: 'invalidRunId',
      userId: validUserId,
      status: RSVPStatus.YES,
    };

    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser); // Still need to mock this

    await expect(upsertRsvp(rsvpData)).rejects.toThrow('Run not found');
    expect(prismaMock.rSVP.upsert).not.toHaveBeenCalled();
  });

  it('should throw an error if the user does not exist', async () => {
    const rsvpData: UpsertRsvpData = {
      runId: validRunId,
      userId: 'invalidUserId',
      status: RSVPStatus.YES,
    };

    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(upsertRsvp(rsvpData)).rejects.toThrow('User not found');
    expect(prismaMock.rSVP.upsert).not.toHaveBeenCalled();
  });

  it('should re-throw Prisma errors if rSVP.upsert fails', async () => {
    const rsvpData: UpsertRsvpData = {
      runId: validRunId,
      userId: validUserId,
      status: RSVPStatus.YES,
    };
    const prismaError = new Prisma.PrismaClientKnownRequestError('DB error', {
      code: 'P2002',
      clientVersion: 'dummy-version',
    });

    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.rSVP.upsert as jest.Mock).mockRejectedValue(prismaError);

    await expect(upsertRsvp(rsvpData)).rejects.toThrow(prismaError);
  });

  it('should correctly pass through include object to prisma.rSVP.upsert', async () => {
    const rsvpData: UpsertRsvpData = {
      runId: validRunId,
      userId: validUserId,
      status: RSVPStatus.MAYBE,
    };
    const expectedRsvp = { ...rsvpData, id: 'clrsvp789' };

    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.rSVP.upsert as jest.Mock).mockResolvedValue(expectedRsvp);

    await upsertRsvp(rsvpData);

    expect(prismaMock.rSVP.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          user: { select: { id: true, name: true, image: true } },
          run: { select: { id: true, descriptor: true } },
        },
      })
    );
  });
});
