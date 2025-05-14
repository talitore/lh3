import {
  markAttendance,
  MarkAttendanceData,
  AttendanceError,
} from './attendanceService';
import { PrismaClient, Prisma } from '@/generated/prisma';

// Mock Prisma Client
jest.mock('@/generated/prisma', () => {
  const actualPrisma = jest.requireActual('@/generated/prisma');
  const mockPrismaClient = {
    run: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    attendance: {
      create: jest.fn(),
      findUnique: jest.fn(), // For handling P2002
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientKnownRequestError:
        actualPrisma.Prisma.PrismaClientKnownRequestError,
    },
  };
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient> & {
  run: { findUnique: jest.Mock };
  user: { findUnique: jest.Mock };
  attendance: { create: jest.Mock; findUnique: jest.Mock };
};

describe('markAttendance', () => {
  beforeEach(() => {
    (prismaMock.run.findUnique as jest.Mock).mockReset();
    (prismaMock.user.findUnique as jest.Mock).mockReset();
    (prismaMock.attendance.create as jest.Mock).mockReset();
    (prismaMock.attendance.findUnique as jest.Mock).mockReset();
  });

  const validRunId = 'run123';
  const validUserId = 'user123';
  const validMarkerId = 'marker789';
  const mockRun = { id: validRunId, name: 'Test Run' };
  const mockUser = { id: validUserId, name: 'Test User' };
  const attendanceInput: MarkAttendanceData = {
    runId: validRunId,
    userId: validUserId,
    markedByUserId: validMarkerId,
  };

  it('should successfully mark attendance for a user', async () => {
    const expectedAttendance = {
      ...attendanceInput,
      id: 'att123',
      markedAt: new Date(),
    };
    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.attendance.create as jest.Mock).mockResolvedValue(
      expectedAttendance
    );

    const result = await markAttendance(attendanceInput);

    expect(prismaMock.run.findUnique).toHaveBeenCalledWith({
      where: { id: validRunId },
    });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: validUserId },
    });
    expect(prismaMock.attendance.create).toHaveBeenCalledWith({
      data: {
        runId: validRunId,
        userId: validUserId,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        run: { select: { id: true, descriptor: true } },
      },
    });
    expect(result).toEqual(expectedAttendance);
  });

  it('should throw AttendanceError with status 404 if the run does not exist', async () => {
    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await expect(markAttendance(attendanceInput)).rejects.toThrowError(
      new AttendanceError('Run not found', 404)
    );
    expect(prismaMock.attendance.create).not.toHaveBeenCalled();
  });

  it('should throw AttendanceError with status 404 if the user to be marked does not exist', async () => {
    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(markAttendance(attendanceInput)).rejects.toThrowError(
      new AttendanceError('User to mark attended not found', 404)
    );
    expect(prismaMock.attendance.create).not.toHaveBeenCalled();
  });

  it('should return existing attendance record if user is already marked (P2002 on runId_userId)', async () => {
    const existingAttendance = {
      ...attendanceInput,
      id: 'att456',
      markedAt: new Date(),
    };
    const p2002Error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: 'dummy',
        meta: { target: ['runId', 'userId'] },
      }
    );

    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.attendance.create as jest.Mock).mockRejectedValue(p2002Error);
    (prismaMock.attendance.findUnique as jest.Mock).mockResolvedValue(
      existingAttendance
    );

    const result = await markAttendance(attendanceInput);

    expect(prismaMock.attendance.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.attendance.findUnique).toHaveBeenCalledWith({
      where: { runId_userId: { runId: validRunId, userId: validUserId } },
      include: {
        user: { select: { id: true, name: true, image: true } },
        run: { select: { id: true, descriptor: true } },
      },
    });
    expect(result).toEqual(existingAttendance);
  });

  it('should throw AttendanceError 409 if P2002 on runId_userId occurs but fetching existing record fails', async () => {
    const p2002Error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: 'dummy',
        meta: { target: ['runId', 'userId'] },
      }
    );

    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.attendance.create as jest.Mock).mockRejectedValue(p2002Error);
    (prismaMock.attendance.findUnique as jest.Mock).mockResolvedValue(null); // Simulate existing record not found

    await expect(markAttendance(attendanceInput)).rejects.toThrowError(
      new AttendanceError('User already marked as attended for this run.', 409)
    );
  });

  it('should throw AttendanceError 500 for P2002 error not on runId_userId target', async () => {
    const p2002ErrorOtherTarget = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed on other fields',
      {
        code: 'P2002',
        clientVersion: 'dummy',
        meta: { target: ['otherField'] },
      }
    );
    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.attendance.create as jest.Mock).mockRejectedValue(
      p2002ErrorOtherTarget
    );

    await expect(markAttendance(attendanceInput)).rejects.toThrowError(
      new AttendanceError('Database error while marking attendance.', 500)
    );
    expect(prismaMock.attendance.findUnique).not.toHaveBeenCalled();
  });

  it('should throw AttendanceError 500 for other PrismaClientKnownRequestError codes', async () => {
    const otherPrismaError = new Prisma.PrismaClientKnownRequestError(
      'Some other DB error',
      { code: 'P1000', clientVersion: 'dummy' }
    );
    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.attendance.create as jest.Mock).mockRejectedValue(
      otherPrismaError
    );

    await expect(markAttendance(attendanceInput)).rejects.toThrowError(
      new AttendanceError('Database error while marking attendance.', 500)
    );
  });

  it('should re-throw AttendanceError if it is already an AttendanceError', async () => {
    const specificError = new AttendanceError('A very specific issue', 400);
    (prismaMock.run.findUnique as jest.Mock).mockRejectedValue(specificError);
    // No need to mock user.findUnique if run.findUnique already throws

    await expect(markAttendance(attendanceInput)).rejects.toThrow(
      specificError
    );
  });

  it('should throw generic AttendanceError 500 for unexpected errors', async () => {
    const unexpectedError = new Error('Something totally unexpected');
    (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.attendance.create as jest.Mock).mockRejectedValue(
      unexpectedError
    );

    await expect(markAttendance(attendanceInput)).rejects.toThrowError(
      new AttendanceError(
        'An unexpected error occurred while marking attendance.',
        500
      )
    );
  });
});
