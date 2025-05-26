/**
 * Test Data Factories
 * 
 * This file provides factory functions for creating test data objects
 * with sensible defaults and the ability to override specific properties.
 */

import { Role } from '@/generated/prisma';

// Base factory interface
interface FactoryOptions<T> {
  overrides?: Partial<T>;
  count?: number;
}

// User factory
export interface TestUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createTestUser(options: FactoryOptions<TestUser> = {}): TestUser {
  const defaults: TestUser = {
    id: `test-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Test User',
    email: 'test@example.com',
    role: Role.USER,
    image: 'https://via.placeholder.com/150',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { ...defaults, ...options.overrides };
}

export function createTestOrganizer(options: FactoryOptions<TestUser> = {}): TestUser {
  return createTestUser({
    ...options,
    overrides: {
      role: Role.ORGANIZER,
      name: 'Test Organizer',
      email: 'organizer@example.com',
      ...options.overrides,
    },
  });
}

export function createTestAdmin(options: FactoryOptions<TestUser> = {}): TestUser {
  return createTestUser({
    ...options,
    overrides: {
      role: Role.ADMIN,
      name: 'Test Admin',
      email: 'admin@example.com',
      ...options.overrides,
    },
  });
}

// Run factory
export interface TestRun {
  id: string;
  number: number;
  descriptor: string;
  dateTime: Date;
  address: string;
  lat: number;
  lng: number;
  introLink?: string;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createTestRun(options: FactoryOptions<TestRun> = {}): TestRun {
  const runNumber = Math.floor(Math.random() * 1000) + 1;
  const defaults: TestRun = {
    id: `test-run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    number: runNumber,
    descriptor: `Test Run #${runNumber}`,
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    address: '123 Test Street, Lawrence, KS 66044',
    lat: 38.9592,
    lng: -95.3281,
    introLink: 'https://example.com/intro',
    organizerId: 'test-organizer-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { ...defaults, ...options.overrides };
}

// RSVP factory
export interface TestRSVP {
  id: string;
  userId: string;
  runId: string;
  status: 'YES' | 'NO' | 'MAYBE';
  createdAt: Date;
  updatedAt: Date;
}

export function createTestRSVP(options: FactoryOptions<TestRSVP> = {}): TestRSVP {
  const defaults: TestRSVP = {
    id: `test-rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    runId: 'test-run-id',
    status: 'YES',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { ...defaults, ...options.overrides };
}

// Photo factory
export interface TestPhoto {
  id: string;
  runId: string;
  uploaderId: string;
  storageKey: string;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createTestPhoto(options: FactoryOptions<TestPhoto> = {}): TestPhoto {
  const photoId = `test-photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const defaults: TestPhoto = {
    id: photoId,
    runId: 'test-run-id',
    uploaderId: 'test-user-id',
    storageKey: `runs/test-run-id/photos/${photoId}/test-image.jpg`,
    caption: 'Test photo caption',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { ...defaults, ...options.overrides };
}

// Attendance factory
export interface TestAttendance {
  id: string;
  userId: string;
  runId: string;
  markedById: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createTestAttendance(options: FactoryOptions<TestAttendance> = {}): TestAttendance {
  const defaults: TestAttendance = {
    id: `test-attendance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    runId: 'test-run-id',
    markedById: 'test-organizer-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { ...defaults, ...options.overrides };
}

// Utility functions for creating multiple items
export function createTestUsers(count: number, options: FactoryOptions<TestUser> = {}): TestUser[] {
  return Array.from({ length: count }, (_, index) =>
    createTestUser({
      ...options,
      overrides: {
        email: `test${index + 1}@example.com`,
        name: `Test User ${index + 1}`,
        ...options.overrides,
      },
    })
  );
}

export function createTestRuns(count: number, options: FactoryOptions<TestRun> = {}): TestRun[] {
  return Array.from({ length: count }, (_, index) =>
    createTestRun({
      ...options,
      overrides: {
        number: (options.overrides?.number || 1) + index,
        descriptor: `Test Run #${(options.overrides?.number || 1) + index}`,
        ...options.overrides,
      },
    })
  );
}

// Mock API response factory
export interface MockApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export function createMockApiResponse<T>(
  data: T,
  success: boolean = true,
  message?: string
): MockApiResponse<T> {
  return {
    data,
    success,
    message,
  };
}

// Paginated response factory
export interface MockPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function createMockPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): MockPaginatedResponse<T> {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
