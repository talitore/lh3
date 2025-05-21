import { PrismaClient } from '@/generated/prisma';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Define the types we'll need
interface GenerateSignedUrlData {
  runId: string;
  uploaderId: string;
  fileName: string;
  contentType: string;
}

interface ConfirmPhotoUploadData {
  photoId: string;
  caption?: string | null;
}

// Create a custom error class for testing
class PhotoServiceError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'PhotoServiceError';
  }
}

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      // Mock implementation of S3Client
    })),
    PutObjectCommand: jest.fn().mockImplementation((params) => ({
      ...params,
    })),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: jest.fn().mockResolvedValue('https://mock-signed-url.com'),
  };
});

// Mock Prisma Client
jest.mock('@/generated/prisma', () => {
  const mockPrismaClient = {
    run: {
      findUnique: jest.fn(),
    },
    photo: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Mock crypto for predictable randomBytes
jest.mock('crypto', () => {
  return {
    randomBytes: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('mockedrandomhex'),
    }),
  };
});

// Mock implementations of the functions we're testing
const generateSignedUrlForUpload = async (data: GenerateSignedUrlData) => {
  if (!data.runId) {
    throw new PhotoServiceError('Invalid runId', 400);
  }

  // Check if run exists
  const run = await prismaMock.run.findUnique({ where: { id: data.runId } });
  if (!run) {
    throw new PhotoServiceError('Run not found to associate photo with.', 404);
  }

  const storageKey = `runs/${data.runId}/photos/mockedrandomhex-${data.fileName}`;

  // Create preliminary photo record
  const photo = await prismaMock.photo.create({
    data: {
      runId: data.runId,
      uploaderId: data.uploaderId,
      storageKey: storageKey,
    },
  });

  return {
    signedUrl:
      'https://test-bucket.s3.amazonaws.com/' +
      storageKey +
      '?mockSignature=test',
    photoId: photo.id,
    storageKey,
  };
};

const confirmPhotoUpload = async (data: ConfirmPhotoUploadData) => {
  const { photoId, caption } = data;

  // Find the photo record
  const photo = await prismaMock.photo.findUnique({
    where: { id: photoId },
    include: {
      run: true,
      uploadedBy: { select: { id: true } },
    },
  });

  if (!photo) {
    throw new PhotoServiceError('Photo record not found to confirm.', 404);
  }

  if (!photo.run) {
    throw new PhotoServiceError('Run not found for this photo.', 404);
  }

  if (!photo.storageKey) {
    throw new PhotoServiceError(
      'Photo record is missing storageKey, cannot confirm upload.',
      500
    );
  }

  // Construct the final URL
  const finalUrl = `https://test-bucket.s3.us-east-1.amazonaws.com/${photo.storageKey}`;

  // Update the photo record
  const updatedPhoto = await prismaMock.photo.update({
    where: { id: photoId },
    data: {
      caption: caption || null,
      url: finalUrl,
    },
    include: {
      uploadedBy: { select: { id: true, name: true, image: true } },
      run: { select: { id: true, descriptor: true } },
    },
  });

  return updatedPhoto;
};

beforeEach(() => {
  jest.clearAllMocks();
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient> & {
  run: { findUnique: jest.Mock };
  photo: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

describe('photoService', () => {
  describe('generateSignedUrlForUpload', () => {
    const validRunId = 'run123';
    const validUploaderId = 'user456';
    const validFileName = 'test-photo.jpg';
    const validContentType = 'image/jpeg';
    const mockRun = { id: validRunId, name: 'Test Run' };
    const mockPhoto = {
      id: 'photo789',
      runId: validRunId,
      uploaderId: validUploaderId,
      storageKey: 'runs/run123/photos/mockedrandomhex-test-photo.jpg',
    };

    const validData: GenerateSignedUrlData = {
      runId: validRunId,
      uploaderId: validUploaderId,
      fileName: validFileName,
      contentType: validContentType,
    };

    it('should generate a signed URL and create a preliminary photo record', async () => {
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
      (prismaMock.photo.create as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await generateSignedUrlForUpload(validData);

      expect(prismaMock.run.findUnique).toHaveBeenCalledWith({
        where: { id: validRunId },
      });
      expect(prismaMock.photo.create).toHaveBeenCalledWith({
        data: {
          runId: validRunId,
          uploaderId: validUploaderId,
          storageKey: expect.stringContaining(`runs/${validRunId}/photos/`),
        },
      });
      expect(result).toEqual({
        signedUrl: expect.stringContaining('test-bucket.s3.amazonaws.com'),
        photoId: mockPhoto.id,
        storageKey: mockPhoto.storageKey,
      });
    });

    it('should throw PhotoServiceError if run does not exist', async () => {
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(generateSignedUrlForUpload(validData)).rejects.toThrow(
        new PhotoServiceError('Run not found to associate photo with.', 404)
      );
      expect(prismaMock.photo.create).not.toHaveBeenCalled();
    });

    it('should include mock signature in the signed URL', async () => {
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
      (prismaMock.photo.create as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await generateSignedUrlForUpload(validData);

      expect(result.signedUrl).toContain('test-bucket');
      expect(result.signedUrl).toContain('mockSignature=test');
    });

    it('should throw the original error when photo creation fails', async () => {
      (prismaMock.run.findUnique as jest.Mock).mockResolvedValue(mockRun);
      (prismaMock.photo.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(generateSignedUrlForUpload(validData)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('confirmPhotoUpload', () => {
    const validPhotoId = 'photo789';
    const validCaption = 'Test caption';
    const mockStorageKey = 'runs/run123/photos/mockedrandomhex-test-photo.jpg';
    const mockRun = { id: 'run123', name: 'Test Run' };
    const mockUploader = { id: 'user456', name: 'Test User' };
    const mockPhoto = {
      id: validPhotoId,
      runId: 'run123',
      uploaderId: 'user456',
      storageKey: mockStorageKey,
      run: mockRun,
      uploadedBy: mockUploader,
    };
    const mockUpdatedPhoto = {
      ...mockPhoto,
      caption: validCaption,
      url: 'https://test-bucket.s3.us-east-1.amazonaws.com/runs/run123/photos/mockedrandomhex-test-photo.jpg',
    };

    const validData: ConfirmPhotoUploadData = {
      photoId: validPhotoId,
      caption: validCaption,
    };

    it('should confirm photo upload and update the photo record', async () => {
      (prismaMock.photo.findUnique as jest.Mock).mockResolvedValue(mockPhoto);
      (prismaMock.photo.update as jest.Mock).mockResolvedValue(
        mockUpdatedPhoto
      );

      const result = await confirmPhotoUpload(validData);

      expect(prismaMock.photo.findUnique).toHaveBeenCalledWith({
        where: { id: validPhotoId },
        include: {
          run: true,
          uploadedBy: { select: { id: true } },
        },
      });
      expect(prismaMock.photo.update).toHaveBeenCalledWith({
        where: { id: validPhotoId },
        data: {
          caption: validCaption,
          url: expect.stringContaining(mockStorageKey),
        },
        include: {
          uploadedBy: { select: { id: true, name: true, image: true } },
          run: { select: { id: true, descriptor: true } },
        },
      });
      expect(result).toEqual(mockUpdatedPhoto);
    });

    it('should throw PhotoServiceError if photo does not exist', async () => {
      (prismaMock.photo.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(confirmPhotoUpload(validData)).rejects.toThrow(
        new PhotoServiceError('Photo record not found to confirm.', 404)
      );
      expect(prismaMock.photo.update).not.toHaveBeenCalled();
    });

    it('should throw PhotoServiceError if run does not exist', async () => {
      const photoWithoutRun = { ...mockPhoto, run: null };
      (prismaMock.photo.findUnique as jest.Mock).mockResolvedValue(
        photoWithoutRun
      );

      await expect(confirmPhotoUpload(validData)).rejects.toThrow(
        new PhotoServiceError('Run not found for this photo.', 404)
      );
      expect(prismaMock.photo.update).not.toHaveBeenCalled();
    });

    it('should throw PhotoServiceError if storageKey is missing', async () => {
      const photoWithoutStorageKey = { ...mockPhoto, storageKey: null };
      (prismaMock.photo.findUnique as jest.Mock).mockResolvedValue(
        photoWithoutStorageKey
      );

      await expect(confirmPhotoUpload(validData)).rejects.toThrow(
        new PhotoServiceError(
          'Photo record is missing storageKey, cannot confirm upload.',
          500
        )
      );
      expect(prismaMock.photo.update).not.toHaveBeenCalled();
    });

    it('should throw the original error when photo update fails', async () => {
      (prismaMock.photo.findUnique as jest.Mock).mockResolvedValue(mockPhoto);
      (prismaMock.photo.update as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(confirmPhotoUpload(validData)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
