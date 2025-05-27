import { PrismaClient } from '@/generated/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto'; // For generating unique identifiers
import { getServiceProvider } from './serviceProvider';

// Import constants
import { TIMING } from '@/lib/constants/ui';
import { TEST_MODE, FILE_UPLOAD } from '@/lib/constants/app';
import { getS3Config } from '@/lib/config/env';

// Import error classes
import {
  PhotoServiceError,
  S3ConfigurationError,
  PhotoUploadError,
  RunNotFoundError
} from '@/lib/errors';

// Get S3 configuration
const s3Config = getS3Config();

// Create S3 client with region, or use a mock region in test mode
const s3Client = new S3Client({
  region: s3Config.region || 'us-east-1',
  // In test mode, we can use fake credentials that will be ignored
  ...(process.env.NODE_ENV === 'test' && {
    credentials: {
      accessKeyId: 'test-access-key',
      secretAccessKey: 'test-secret-key',
    },
  }),
});

// PhotoServiceError is now imported from @/lib/errors

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
    throw new S3ConfigurationError();
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
      throw new RunNotFoundError();
    }

    const randomBytes = crypto.randomBytes(FILE_UPLOAD.RANDOM_BYTES_LENGTH).toString('hex');
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
    if (error instanceof PhotoServiceError || error instanceof RunNotFoundError) {
      throw error;
    }
    console.error('Error in generateSignedUrlForUpload:', error);
    throw new PhotoUploadError();
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

  // Get S3 configuration
  const s3Config = getS3Config();
  const bucketName = s3Config.bucketName || 'test-bucket';
  const region = s3Config.region || 'us-east-1';

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
