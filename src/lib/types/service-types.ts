/**
 * Service layer type definitions
 *
 * This file contains standardized interfaces and types for
 * service layer operations and responses.
 */

/**
 * Standard service response format
 */
export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

/**
 * Service operation result
 */
export type ServiceResult<T> = Promise<ServiceResponse<T>>;

/**
 * Database operation options
 */
export interface DatabaseOptions {
  transaction?: unknown; // Prisma transaction type
  skipValidation?: boolean;
}

/**
 * Service method options
 */
export interface ServiceOptions extends DatabaseOptions {
  userId?: string;
  skipAuth?: boolean;
}

/**
 * File upload information
 */
export interface FileUploadInfo {
  fileName: string;
  contentType: string;
  size?: number;
  url?: string;
}

/**
 * Geocoding result
 */
export interface GeocodingResult {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  confidence: number;
  components?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

/**
 * Service health check result
 */
export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  details?: Record<string, unknown>;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  timestamp: Date;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
