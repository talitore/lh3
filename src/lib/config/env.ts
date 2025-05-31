/**
 * Environment configuration
 *
 * This file provides centralized access to environment variables
 * with validation and type safety.
 */

import { ENV_VARS } from "../constants/app";

// Environment variable validation
interface EnvironmentConfig {
  // Testing
  isE2ETestingMode: boolean;
  skipAuthChecks: boolean;
  mockAuthForTests: boolean;
  useMockData: boolean;

  // Mapbox
  mapboxAccessToken?: string;
  mapboxSecretToken?: string;

  // AWS S3
  s3BucketName?: string;
  awsRegion?: string;

  // Node environment
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Get environment configuration with validation
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const nodeEnv = process.env.NODE_ENV || "development";

  return {
    // Testing flags
    isE2ETestingMode: process.env[ENV_VARS.E2E_TESTING_MODE] === "true",
    skipAuthChecks: process.env[ENV_VARS.SKIP_AUTH_CHECKS] === "true",
    mockAuthForTests: process.env[ENV_VARS.MOCK_AUTH_FOR_TESTS] === "true",
    useMockData: process.env[ENV_VARS.USE_MOCK_DATA] === "true",

    // Mapbox configuration
    mapboxAccessToken: process.env[ENV_VARS.MAPBOX_ACCESS_TOKEN],
    mapboxSecretToken: process.env[ENV_VARS.MAPBOX_SECRET_TOKEN],

    // AWS configuration
    s3BucketName: process.env[ENV_VARS.S3_BUCKET_NAME],
    awsRegion: process.env[ENV_VARS.AWS_REGION],

    // Node environment
    nodeEnv,
    isDevelopment: nodeEnv === "development",
    isProduction: nodeEnv === "production",
    isTest: nodeEnv === "test",
  };
}

/**
 * Validate required environment variables
 */
export function validateEnvironmentConfig(): void {
  const config = getEnvironmentConfig();
  const errors: string[] = [];

  // Only validate in production
  if (config.isProduction) {
    if (!config.mapboxAccessToken) {
      errors.push(`${ENV_VARS.MAPBOX_ACCESS_TOKEN} is required in production`);
    }

    if (!config.mapboxSecretToken) {
      errors.push(`${ENV_VARS.MAPBOX_SECRET_TOKEN} is required in production`);
    }

    if (!config.s3BucketName) {
      errors.push(`${ENV_VARS.S3_BUCKET_NAME} is required in production`);
    }

    if (!config.awsRegion) {
      errors.push(`${ENV_VARS.AWS_REGION} is required in production`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
  }
}

/**
 * Get Mapbox access token with fallback
 */
export function getMapboxAccessToken(): string | undefined {
  const config = getEnvironmentConfig();

  // Debug logging in development
  if (config.isDevelopment) {
    console.log('Debug: Mapbox token check:', {
      hasToken: !!config.mapboxAccessToken,
      tokenLength: config.mapboxAccessToken?.length || 0,
      tokenPrefix: config.mapboxAccessToken?.substring(0, 10) || 'undefined',
      envVar: ENV_VARS.MAPBOX_ACCESS_TOKEN,
      processEnvValue: !!process.env[ENV_VARS.MAPBOX_ACCESS_TOKEN],
      directProcessEnv: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.substring(0, 10) || 'undefined',
      configMapboxToken: config.mapboxAccessToken,
      processEnvMapboxToken: process.env[ENV_VARS.MAPBOX_ACCESS_TOKEN],
      envVarConstant: ENV_VARS.MAPBOX_ACCESS_TOKEN
    });
  }

  // Temporary fix: return the environment variable directly if config doesn't have it
  return config.mapboxAccessToken || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

/**
 * Get Mapbox secret token with validation
 */
export function getMapboxSecretToken(): string {
  const config = getEnvironmentConfig();

  if (!config.mapboxSecretToken) {
    throw new Error("Mapbox secret token is required for server-side operations");
  }

  return config.mapboxSecretToken;
}

/**
 * Get S3 configuration with fallback for testing
 */
export function getS3Config(): { bucketName: string; region?: string } {
  const config = getEnvironmentConfig();

  // In test mode, use test bucket if no bucket is configured
  const bucketName = config.s3BucketName ||
    (config.isE2ETestingMode ? "test-bucket" : "");

  if (!bucketName) {
    throw new Error("S3 bucket name is not configured");
  }

  return {
    bucketName,
    region: config.awsRegion,
  };
}

/**
 * Check if we're in test mode
 */
export function isTestMode(): boolean {
  const config = getEnvironmentConfig();
  return config.isE2ETestingMode || config.isTest;
}

/**
 * Check if authentication should be bypassed
 */
export function shouldBypassAuth(): boolean {
  const config = getEnvironmentConfig();
  return config.skipAuthChecks && (config.isE2ETestingMode || config.mockAuthForTests);
}
