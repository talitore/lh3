import { PrismaClient, Prisma } from '@/generated/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto'; // For generating unique identifiers

const prisma = new PrismaClient();

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
// AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are typically picked up automatically by the SDK from env vars

if (!S3_BUCKET_NAME || !AWS_REGION) {
  console.error(
    'S3_BUCKET_NAME or AWS_REGION environment variable is not set.'
  );
  // Depending on your error handling strategy, you might throw here or handle it differently
}

const s3Client = new S3Client({ region: AWS_REGION });

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

export async function generateSignedUrlForUpload(data: GenerateSignedUrlData) {
  if (!S3_BUCKET_NAME) {
    throw new PhotoServiceError('S3 bucket name is not configured.', 500);
  }

  try {
    // Check if the run exists
    const runExists = await prisma.run.findUnique({
      where: { id: data.runId },
    });
    if (!runExists) {
      throw new PhotoServiceError(
        'Run not found to associate photo with.',
        404
      );
    }

    const randomBytes = crypto.randomBytes(16).toString('hex');
    const fileExtension = data.fileName.split('.').pop() || 'bin';
    const storageKey = `runs/${
      data.runId
    }/photos/${randomBytes}-${data.fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

    // Create a preliminary photo record in the database
    // The actual 'url' field might be null or point to a placeholder until confirmed
    const preliminaryPhoto = await prisma.photo.create({
      data: {
        runId: data.runId,
        uploaderId: data.uploaderId,
        storageKey: storageKey, // This is the key for S3
        // caption will be added upon confirmation
        // url could be null initially or a placeholder
      },
    });

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
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

    const expiresIn = 3600; // URL expires in 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      signedUrl,
      photoId: preliminaryPhoto.id, // ID of the preliminary photo record
      storageKey, // The key where the file will be stored in S3
    };
  } catch (error) {
    if (error instanceof PhotoServiceError) throw error;
    console.error('Error in generateSignedUrlForUpload:', error);
    throw new PhotoServiceError(
      'Failed to generate signed URL for photo upload.',
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

export async function confirmPhotoUpload(data: ConfirmPhotoUploadData) {
  if (!S3_BUCKET_NAME) {
    throw new PhotoServiceError('S3 bucket name is not configured.', 500);
  }

  try {
    const { photoId, caption } = data;

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new PhotoServiceError('Photo record not found to confirm.', 404);
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
    const finalUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${photo.storageKey}`;

    const updatedPhoto = await prisma.photo.update({
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
