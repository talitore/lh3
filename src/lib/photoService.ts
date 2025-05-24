import { PrismaClient, Prisma } from '@/generated/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto'; // For generating unique identifiers
import { getServiceProvider } from './serviceProvider';

// Import constants
import { ERROR_MESSAGES } from '@/lib/constants/api';
import { TIMING, FILE_UPLOAD } from '@/lib/constants/ui';
import { TEST_MODE } from '@/lib/constants/app';
import { getS3Config, isTestMode } from '@/lib/config/env';

// Legacy environment variable access - will be replaced with config functions
const AWS_REGION = process.env.AWS_REGION;

// In test mode, we'll use mock values if real ones aren't available
if (!S3_BUCKET_NAME || !AWS_REGION) {
  if (isTestEnvironment) {
    console.log('Using mock S3 configuration for tests');
  } else {
    console.error(
      'S3_BUCKET_NAME or AWS_REGION environment variable is not set.'
    );
  }
}

// Create S3 client with region, or use a mock region in test mode
const s3Client = new S3Client({
  region: AWS_REGION || (isTestEnvironment ? 'us-east-1' : undefined),
  // In test mode, we can use fake credentials that will be ignored
  ...(isTestEnvironment && {
    credentials: {
      accessKeyId: 'test-access-key',
      secretAccessKey: 'test-secret-key',
    },
  }),
});

export class PhotoServiceError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'PhotoServiceError';
  }
}

export interface GenerateSignedUrlData {
  runId: string;
  uploaderId: string;
  fileName: string; // e.g., my-awesome-photo.jpg
  contentType: string; // e.g., image/jpeg
}

/**
 * Generate a signed URL for uploading a photo
 * @param data The photo data
 * @param prismaClient Optional Prisma client for dependency injection
 * @returns The signed URL and photo details
 */
export async function generateSignedUrlForUpload(
  data: GenerateSignedUrlData,
  prismaClient?: PrismaClient
) {
  // Get the database client from the service provider if not provided
  const client =
    prismaClient || getServiceProvider().getDbService().getClient();
  const isTestMode = getServiceProvider().isInTestMode();

  // Get S3 configuration with test mode fallback
  const s3Config = getS3Config();
  const bucketName = s3Config.bucketName;

  if (!bucketName) {
    throw new PhotoServiceError(ERROR_MESSAGES.S3_BUCKET_NOT_CONFIGURED, 500);
  }

  try {
    // Check if we're in test mode with mock data
    if (isTestMode && data.runId.startsWith(TEST_MODE.MOCK_RUN_ID_PREFIX)) {
      console.log('Using mock data for generateSignedUrlForUpload');
      const mockPhotoId = `mock-photo-id-${Date.now()}`;
      const mockStorageKey = `runs/${
        data.runId
      }/photos/mock-${data.fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

      return {
        uploadUrl: `https://test-bucket.s3.amazonaws.com/${mockStorageKey}?mockSignature=test`,
        photoId: mockPhotoId,
        storageKey: mockStorageKey,
      };
    }

    // Check if the run exists
    const runExists = await client.run.findUnique({
      where: { id: data.runId },
    });
    if (!runExists) {
      throw new PhotoServiceError(
        'Run not found to associate photo with.',
        404
      );
    }

    const randomBytes = crypto.randomBytes(FILE_UPLOAD.RANDOM_BYTES_LENGTH).toString('hex');
    const fileExtension = data.fileName.split('.').pop() || FILE_UPLOAD.DEFAULT_EXTENSION;
    const storageKey = `${FILE_UPLOAD.STORAGE_PATH_PREFIX}/${
      data.runId
    }/${FILE_UPLOAD.PHOTOS_SUBFOLDER}/${randomBytes}-${data.fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

    // Create a preliminary photo record in the database
    // The actual 'url' field might be null or point to a placeholder until confirmed
    const preliminaryPhoto = await client.photo.create({
      data: {
        runId: data.runId,
        uploaderId: data.uploaderId,
        storageKey: storageKey, // This is the key for S3
        // caption will be added upon confirmation
        // url could be null initially or a placeholder
      },
    });

    // In test mode, we might want to skip the actual S3 interaction
    let signedUrl: string;

    if (isTestMode) {
      // For tests, just create a mock signed URL
      signedUrl = `https://${bucketName}.s3.amazonaws.com/${storageKey}?mockSignature=test`;
    } else {
      // Normal production flow
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: storageKey,
        ContentType: data.contentType,
        // ACL: 'public-read', // Uncomment if you want objects to be public by default
        Metadata: {
          // Optional: add any metadata you want to store with the S3 object
          uploaderId: data.uploaderId,
          runId: data.runId,
          originalFileName: data.fileName,
        },
      });

      const expiresIn = TIMING.S3_URL_EXPIRATION; // URL expires in 1 hour
      signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    }

    return {
      uploadUrl: signedUrl,
      photoId: preliminaryPhoto.id, // ID of the preliminary photo record
      storageKey, // The key where the file will be stored in S3
    };
  } catch (error) {
    if (error instanceof PhotoServiceError) throw error;
    console.error('Error in generateSignedUrlForUpload:', error);
    throw new PhotoServiceError(
      ERROR_MESSAGES.PHOTO_UPLOAD_FAILED,
      500
    );
  }
}

// Placeholder for confirmPhotoUpload function
export interface ConfirmPhotoUploadData {
  photoId: string;
  caption?: string | null;
  // storageKey might also be passed from client to confirm it matches, or derived from photoId
}

/**
 * Confirm a photo upload
 * @param data The confirmation data
 * @param prismaClient Optional Prisma client for dependency injection
 * @returns The updated photo
 */
export async function confirmPhotoUpload(
  data: ConfirmPhotoUploadData,
  prismaClient?: PrismaClient
) {
  // Get the database client from the service provider if not provided
  const client =
    prismaClient || getServiceProvider().getDbService().getClient();
  const isTestMode = getServiceProvider().isInTestMode();

  // In test mode, we'll use a mock bucket name if not provided
  const bucketName =
    S3_BUCKET_NAME || (isTestEnvironment ? 'test-bucket' : undefined);
  const region = AWS_REGION || (isTestEnvironment ? 'us-east-1' : undefined);

  if (!bucketName) {
    throw new PhotoServiceError('S3 bucket name is not configured.', 500);
  }

  try {
    const { photoId, caption } = data;

    // Check if we're in test mode with mock data
    if (isTestMode && photoId.startsWith('mock-photo-id')) {
      console.log('Using mock data for confirmPhotoUpload');
      return {
        id: photoId,
        runId: 'mock-run-id-1',
        uploaderId: 'mock-user-id',
        storageKey: `runs/mock-run-id-1/photos/mock-photo.jpg`,
        caption: caption || null,
        url: `https://test-bucket.s3.amazonaws.com/runs/mock-run-id-1/photos/mock-photo.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploadedBy: {
          id: 'mock-user-id',
          name: 'Mock User',
          image: 'https://via.placeholder.com/150?text=Mock+User',
        },
        run: {
          id: 'mock-run-id-1',
          descriptor: 'Mock Run For Testing',
        },
      };
    }

    const photo = await client.photo.findUnique({
      where: { id: photoId },
      include: {
        run: true, // Include run to check if it exists
        uploadedBy: { select: { id: true } }, // Include uploader for permission checks
      },
    });

    if (!photo) {
      throw new PhotoServiceError('Photo record not found to confirm.', 404);
    }

    if (!photo.run) {
      throw new PhotoServiceError('Run not found for this photo.', 404);
    }

    if (!photo.storageKey) {
      // This case should ideally not happen if generateSignedUrl always creates a storageKey
      throw new PhotoServiceError(
        'Photo record is missing storageKey, cannot confirm upload.',
        500
      );
    }

    // Construct the final URL (this might vary based on your S3 setup/CDN)
    // For a simple S3 bucket URL:
    const finalUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${photo.storageKey}`;

    const updatedPhoto = await client.photo.update({
      where: { id: photoId },
      data: {
        caption: caption || null, // Set caption, or null if not provided
        url: finalUrl, // Save the constructed final URL
        // Potentially update a status field here if you have one e.g. status: 'CONFIRMED'
      },
      include: {
        // Return useful data, similar to getRunById photo details
        uploadedBy: { select: { id: true, name: true, image: true } },
        run: { select: { id: true, descriptor: true } },
      },
    });

    return updatedPhoto;
  } catch (error) {
    if (error instanceof PhotoServiceError) throw error;
    console.error('Error in confirmPhotoUpload:', error);
    throw new PhotoServiceError('Failed to confirm photo upload.', 500);
  }
}
