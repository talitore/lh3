import {
  createRun,
  getAllRuns,
  getRunById,
  updateRun,
  CreateRunData,
  GetAllRunsOptions,
  UpdateRunData,
} from './runService';
import { PrismaClient, Prisma, RSVPStatus } from '@/generated/prisma';

// Mock Prisma Client
jest.mock('@/generated/prisma', () => {
  const actualPrisma = jest.requireActual('@/generated/prisma');
  const mockPrismaClient = {
    run: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    // Mock other models if needed by runService logic indirectly, though not directly used in runService itself
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientKnownRequestError:
        actualPrisma.Prisma.PrismaClientKnownRequestError,
    },
    RSVPStatus: actualPrisma.RSVPStatus, // For getRunById RSVP counting
  };
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient> & {
  run: {
    create: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('runService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset date mocks for each describe block if they are set up there
  });

  describe('createRun', () => {
    it('should successfully create a new run with valid data', async () => {
      const runData: CreateRunData = {
        number: 1,
        descriptor: 'Test Run',
        dateTime: new Date('2024-01-01T10:00:00Z'),
        address: '123 Main St',
        organizerId: 'org123',
        lat: 40.7128,
        lng: -74.006,
        introLink: 'http://example.com/intro',
      };
      const expectedRun = { id: 'runGeneratedId', ...runData };
      (prismaMock.run.create as jest.Mock).mockResolvedValue(expectedRun);

      const result = await createRun(runData);

      expect(prismaMock.run.create).toHaveBeenCalledWith({
        data: {
          number: runData.number,
          descriptor: runData.descriptor,
          dateTime: runData.dateTime,
          address: runData.address,
          lat: runData.lat,
          lng: runData.lng,
          introLink: runData.introLink,
          organizer: {
            connect: { id: runData.organizerId },
          },
        },
      });
      expect(result).toEqual(expectedRun);
    });

    it('should re-throw PrismaClientKnownRequestError on create failure', async () => {
      const runData: CreateRunData = {
        number: 1,
        descriptor: 'Test Run',
        dateTime: new Date(),
        address: '123 Main St',
        organizerId: 'org123',
      };
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: 'dummy',
          meta: { target: 'Run_number_key' },
        }
      );
      (prismaMock.run.create as jest.Mock).mockRejectedValue(error);

      await expect(createRun(runData)).rejects.toThrow(error);
    });
  });

  describe('getAllRuns', () => {
    const MOCK_DATE = '2023-10-26T12:00:00Z';
    const mockNow = new Date(MOCK_DATE);

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(mockNow);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call with default options if none provided', async () => {
      (prismaMock.run.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.run.count as jest.Mock).mockResolvedValue(0);

      await getAllRuns({});

      expect(prismaMock.run.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          orderBy: { dateTime: 'desc' },
          skip: 0,
          take: 10,
          include: expect.any(Object),
        })
      );
      expect(prismaMock.run.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      );
    });

    it('should calculate skip correctly for pagination', async () => {
      (prismaMock.run.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.run.count as jest.Mock).mockResolvedValue(0);
      const options: GetAllRunsOptions = { page: 3, limit: 5 };
      await getAllRuns(options);
      expect(prismaMock.run.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (3-1) * 5
          take: 5,
        })
      );
    });

    it('should apply sorting options', async () => {
      (prismaMock.run.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.run.count as jest.Mock).mockResolvedValue(0);
      const options: GetAllRunsOptions = { sortBy: 'number', sortOrder: 'asc' };
      await getAllRuns(options);
      expect(prismaMock.run.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { number: 'asc' },
        })
      );
    });

    it('should filter by filterStatus: upcoming', async () => {
      (prismaMock.run.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.run.count as jest.Mock).mockResolvedValue(0);
      const options: GetAllRunsOptions = { filterStatus: 'upcoming' };
      await getAllRuns(options);
      expect(prismaMock.run.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { dateTime: { gt: mockNow } },
        })
      );
    });

    it('should filter by filterStatus: past', async () => {
      (prismaMock.run.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.run.count as jest.Mock).mockResolvedValue(0);
      const options: GetAllRunsOptions = { filterStatus: 'past' };
      await getAllRuns(options);
      expect(prismaMock.run.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { dateTime: { lte: mockNow } },
        })
      );
    });

    it('should filter by dateFrom and dateTo', async () => {
      (prismaMock.run.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.run.count as jest.Mock).mockResolvedValue(0);
      const dateFrom = '2023-01-01T00:00:00Z';
      const dateTo = '2023-12-31T23:59:59Z';
      const options: GetAllRunsOptions = { dateFrom, dateTo };
      await getAllRuns(options);
      expect(prismaMock.run.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            dateTime: {
              gte: new Date(dateFrom),
              lte: new Date(dateTo),
            },
          },
        })
      );
    });

    it('should combine filterStatus and dateFrom/dateTo filters', async () => {
      (prismaMock.run.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.run.count as jest.Mock).mockResolvedValue(0);
      const dateFrom = '2023-10-27T00:00:00Z'; // After mockNow
      const options: GetAllRunsOptions = { filterStatus: 'upcoming', dateFrom };
      await getAllRuns(options);
      // For 'upcoming', gt: mockNow is primary. If dateFrom is also there, it should be merged.
      // Prisma specific DateTimeFilter means it becomes an object with multiple conditions.
      expect(prismaMock.run.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            dateTime: {
              gt: mockNow,
              gte: new Date(dateFrom),
            },
          },
        })
      );
    });

    it('should return correct response structure with rsvpYesCount', async () => {
      const mockRuns = [
        { id: 'run1', _count: { rsvps: 5 }, otherData: 'foo' },
        { id: 'run2', _count: { rsvps: 0 }, otherData: 'bar' },
        { id: 'run3', _count: null, otherData: 'baz' }, // Simulate no _count relation
      ];
      (prismaMock.run.findMany as jest.Mock).mockResolvedValue(mockRuns);
      (prismaMock.run.count as jest.Mock).mockResolvedValue(3);

      const result = await getAllRuns({ limit: 3 });

      expect(result.data).toEqual([
        { id: 'run1', _count: { rsvps: 5 }, otherData: 'foo', rsvpYesCount: 5 },
        { id: 'run2', _count: { rsvps: 0 }, otherData: 'bar', rsvpYesCount: 0 },
        { id: 'run3', _count: null, otherData: 'baz', rsvpYesCount: 0 },
      ]);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 3,
        totalRuns: 3,
        totalPages: 1,
      });
    });

    it('should re-throw errors from prisma calls', async () => {
      const error = new Error('DB Query Failed');
      (prismaMock.run.findMany as jest.Mock).mockRejectedValue(error);
      await expect(getAllRuns({})).rejects.toThrow(error);
    });
  });

  describe('getRunById', () => {
    it('should return run with rsvpCounts if found', async () => {
      const runId = 'run123';
      const mockRunData = {
        id: runId,
        descriptor: 'Fetched Run',
        rsvps: [
          { status: RSVPStatus.YES, userId: 'u1' },
          { status: RSVPStatus.YES, userId: 'u2' },
          { status: RSVPStatus.NO, userId: 'u3' },
          { status: RSVPStatus.MAYBE, userId: 'u4' },
        ],
        // ... other fields ...
      };
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRunData);

      const result = await getRunById(runId);

      expect(prismaMock.run.findUnique).toHaveBeenCalledWith({
        where: { id: runId },
        include: expect.any(Object), // verify actual includes if necessary
      });
      expect(result).toEqual({
        ...mockRunData,
        rsvpCounts: {
          yes: 2,
          no: 1,
          maybe: 1,
        },
      });
    });

    it('should return null if run not found', async () => {
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await getRunById('nonexistent');
      expect(result).toBeNull();
    });

    it('should re-throw errors from prisma call', async () => {
      const error = new Error('DB findUnique Failed');
      (prismaMock.run.findUnique as jest.Mock).mockRejectedValue(error);
      await expect(getRunById('anyId')).rejects.toThrow(error);
    });
  });

  describe('updateRun', () => {
    const runId = 'runToUpdate';
    const mockExistingRun = { id: runId, descriptor: 'Old Descriptor' };

    it('should successfully update a run', async () => {
      const updateData: UpdateRunData = {
        descriptor: 'New Descriptor',
        number: 101,
      };
      const expectedUpdatedRun = { ...mockExistingRun, ...updateData };

      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(
        mockExistingRun
      );
      (prismaMock.run.update as jest.Mock).mockResolvedValue(
        expectedUpdatedRun
      );

      const result = await updateRun(runId, updateData);

      expect(prismaMock.run.findUnique).toHaveBeenCalledWith({
        where: { id: runId },
      });
      expect(prismaMock.run.update).toHaveBeenCalledWith({
        where: { id: runId },
        data: {
          ...updateData,
          lat: undefined, // because not in updateData
          lng: undefined,
          introLink: undefined,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(expectedUpdatedRun);
    });

    it('should correctly pass null for nullable fields during update', async () => {
      const updateData: UpdateRunData = {
        introLink: null,
        lat: null,
        lng: null,
      };
      const expectedUpdatedRun = { ...mockExistingRun, ...updateData };
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(
        mockExistingRun
      );
      (prismaMock.run.update as jest.Mock).mockResolvedValue(
        expectedUpdatedRun
      );

      await updateRun(runId, updateData);

      expect(prismaMock.run.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            introLink: null,
            lat: null,
            lng: null,
          },
        })
      );
    });

    it('should return null if run to update is not found', async () => {
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await updateRun(runId, { descriptor: 'No matter' });
      expect(result).toBeNull();
      expect(prismaMock.run.update).not.toHaveBeenCalled();
    });

    it('should re-throw PrismaClientKnownRequestError on update failure', async () => {
      const updateData: UpdateRunData = { number: 1 }; // Potential P2002 trigger
      const error = new Prisma.PrismaClientKnownRequestError('Update failed', {
        code: 'P2002',
        clientVersion: 'dummy',
      });
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(
        mockExistingRun
      );
      (prismaMock.run.update as jest.Mock).mockRejectedValue(error);

      await expect(updateRun(runId, updateData)).rejects.toThrow(error);
    });
  });
});
