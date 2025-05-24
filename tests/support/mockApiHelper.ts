/**
 * Mock API Helper for E2E Tests
 *
 * This helper provides mock API responses for tests to avoid skipping tests when in mock mode.
 */

import {
  mockDataService,
  MockRun,
  MockUser,
  MockRSVP,
  MockAttendance,
  MockPhoto,
} from './mockDataService';

// Interface for mock API response
export interface MockApiResponse<T> {
  status: () => number;
  json: () => Promise<T>;
  text?: () => Promise<string>;
}

// Helper class to create mock API responses
export class MockApiHelper {
  // Create a mock response for GET /api/runs
  static createGetRunsResponse(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'dateTime',
    sortOrder: 'asc' | 'desc' = 'desc',
    dateFrom?: string,
    dateTo?: string
  ): MockApiResponse<{ data: MockRun[]; pagination: any }> {
    let runs = [...mockDataService.getMockRuns()];

    // Apply date filtering if provided
    if (dateFrom || dateTo) {
      runs = runs.filter((run) => {
        const runDate = new Date(run.dateTime);
        if (dateFrom && new Date(dateFrom) > runDate) return false;
        if (dateTo && new Date(dateTo) < runDate) return false;
        return true;
      });
    }

    // Apply sorting
    runs.sort((a, b) => {
      if (sortBy === 'dateTime') {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedRuns = runs.slice(startIndex, startIndex + limit);

    return {
      status: () => 200,
      json: async () => ({
        data: paginatedRuns,
        pagination: {
          totalRuns: runs.length,
          page,
          limit,
        },
      }),
    };
  }

  // Create a mock response for GET /api/runs/[id]
  static createGetRunByIdResponse(id: string): MockApiResponse<MockRun> {
    const run = mockDataService.getMockRunById(id);

    if (!run) {
      return {
        status: () => 404,
        json: async () => ({ message: 'Run not found' }),
      };
    }

    // Add organizer details
    const organizer = mockDataService.getMockUserById(run.organizerId);
    const runWithOrganizer = {
      ...run,
      organizer: organizer
        ? {
            id: organizer.id,
            name: organizer.name,
            email: organizer.email,
          }
        : undefined,
    };

    return {
      status: () => 200,
      json: async () => runWithOrganizer,
    };
  }

  // Create a mock response for POST /api/runs
  static createPostRunResponse(data: any): MockApiResponse<MockRun> {
    // Check for required fields
    if (!data.number) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid input',
          errors: { number: 'Number is required' },
        }),
      };
    }

    // Check for descriptor length
    if (data.descriptor && data.descriptor.length < 3) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid input',
          errors: { descriptor: 'Descriptor must be at least 3 characters' },
        }),
      };
    }

    // Check for duplicate run number
    const existingRun = mockDataService
      .getMockRuns()
      .find((run) => run.number === data.number);
    if (existingRun) {
      return {
        status: () => 409,
        json: async () => ({
          message: 'A run with this number already exists.',
        }),
      };
    }

    // Create a new mock run
    const newRun: MockRun = {
      id: `mock-run-id-${Date.now()}`,
      number: data.number,
      descriptor: data.descriptor || 'Mock Run',
      dateTime: data.dateTime || new Date().toISOString(),
      address: data.address || '123 Mock Street',
      lat: data.lat || 34.0522,
      lng: data.lng || -118.2437,
      introLink: data.introLink || null,
      organizerId: 'mock-organizer-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      status: () => 201,
      json: async () => newRun,
    };
  }

  // Create a mock response for PUT /api/runs/[id]
  static createPutRunResponse(
    id: string,
    data: any,
    cookie?: string
  ): MockApiResponse<MockRun> {
    // Check if run exists
    const run = mockDataService.getMockRunById(id);
    if (!run) {
      return {
        status: () => 404,
        json: async () => ({ message: 'Run not found' }),
      };
    }

    // Check for authentication
    if (!cookie) {
      return {
        status: () => 401,
        json: async () => ({ message: 'Unauthorized' }),
      };
    }

    // Check for permissions (basic user can't update runs)
    if (cookie === mockDataService.getMockCookies().user) {
      return {
        status: () => 403,
        json: async () => ({ message: 'Forbidden: Insufficient permissions' }),
      };
    }

    // Check for descriptor length
    if (data.descriptor && data.descriptor.length < 3) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid input',
          errors: { descriptor: 'Descriptor must be at least 3 characters' },
        }),
      };
    }

    // Create updated run
    const updatedRun: MockRun = {
      ...run,
      descriptor: data.descriptor || run.descriptor,
      address: data.address || run.address,
      introLink: data.introLink !== undefined ? data.introLink : run.introLink,
      updatedAt: new Date().toISOString(),
    };

    return {
      status: () => 200,
      json: async () => updatedRun,
    };
  }

  // Create a mock response for PUT /api/runs/[id]/rsvp
  static createPutRsvpResponse(
    runId: string,
    data: any,
    cookie?: string
  ): MockApiResponse<MockRSVP> {
    // Check if run exists
    const run = mockDataService.getMockRunById(runId);
    if (!run) {
      return {
        status: () => 404,
        json: async () => ({ message: 'Run not found' }),
      };
    }

    // Check for authentication
    if (!cookie) {
      return {
        status: () => 401,
        json: async () => ({ message: 'Unauthorized' }),
      };
    }

    // Check for valid status
    if (!['YES', 'NO', 'MAYBE'].includes(data.status)) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid request body',
          errors: { status: 'Status must be one of: YES, NO, MAYBE' },
        }),
      };
    }

    // Determine user ID based on cookie
    let userId = 'mock-user-id';
    if (cookie === mockDataService.getMockCookies().anotherUser) {
      userId = 'mock-another-user-id';
    }

    // Create or update RSVP
    const rsvp: MockRSVP = {
      id: `mock-rsvp-id-${Date.now()}`,
      runId,
      userId,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      status: () => 200,
      json: async () => rsvp,
    };
  }

  // Create a mock response for POST /api/runs/[id]/attendance
  static createPostAttendanceResponse(
    runId: string,
    data: any,
    cookie?: string
  ): MockApiResponse<MockAttendance> {
    // Check if run exists
    const run = mockDataService.getMockRunById(runId);
    if (!run || runId === 'clrunxxxxxx0000yyyyyyyyyyyy') {
      // Special case for dynamic test runs
      if (runId.startsWith('mock-run-id-')) {
        // Create a mock run for the test
        const mockRun = {
          id: runId,
          number: 999,
          descriptor: 'Mock Run for Test',
          dateTime: new Date().toISOString(),
          organizerId: 'mock-organizer-id',
        };
        return this.createPostAttendanceResponseWithRun(
          runId,
          data,
          cookie,
          mockRun
        );
      }

      return {
        status: () => 404,
        json: async () => ({ message: 'Run not found' }),
      };
    }

    // Use the helper method with the found run
    return this.createPostAttendanceResponseWithRun(runId, data, cookie, run);
  }

  // Create a mock response for POST /api/runs/[id]/photos/generate-signed-url
  static createGenerateSignedUrlResponse(
    runId: string,
    data: any,
    cookie?: string
  ): MockApiResponse<any> {
    // Check if run exists
    const run = mockDataService.getMockRunById(runId);
    if (!run || runId === 'clphoto00000000000000000000') {
      return {
        status: () => 404,
        json: async () => ({ message: 'Run not found' }),
      };
    }

    // Check for authentication
    if (!cookie) {
      return {
        status: () => 401,
        json: async () => ({ message: 'Unauthorized' }),
      };
    }

    // Check for required fields
    if (!data.fileName) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid request body',
          errors: { fileName: 'File name is required' },
        }),
      };
    }

    if (!data.contentType) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid request body',
          errors: { contentType: 'Content type is required' },
        }),
      };
    }

    // Create photo record
    const photoId = `mock-photo-id-${Date.now()}`;
    const storageKey = `uploads/${runId}/${photoId}/${data.fileName}`;

    return {
      status: () => 200,
      json: async () => ({
        photoId,
        storageKey,
        uploadUrl: `https://s3.amazonaws.com/mock-bucket/${storageKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...`,
      }),
    };
  }

  // Create a mock response for POST /api/runs/[id]/photos/confirm-upload
  static createConfirmUploadResponse(
    runId: string,
    data: any,
    cookie?: string
  ): MockApiResponse<MockPhoto> {
    // Check if run exists
    const run = mockDataService.getMockRunById(runId);
    if (!run) {
      return {
        status: () => 404,
        json: async () => ({ message: 'Run not found' }),
      };
    }

    // Check for authentication
    if (!cookie) {
      return {
        status: () => 401,
        json: async () => ({ message: 'Unauthorized' }),
      };
    }

    // Check for photoId
    if (!data.photoId) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid request body',
          errors: { photoId: 'Photo ID is required' },
        }),
      };
    }

    // Check if photoId is valid format
    if (
      !data.photoId.match(/^cl[a-z0-9]{24}$/) &&
      !data.photoId.startsWith('mock-')
    ) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid request body',
          errors: { photoId: 'Photo ID must be a valid format' },
        }),
      };
    }

    // Determine user ID based on cookie
    let userId = 'mock-user-id';
    if (cookie === mockDataService.getMockCookies().anotherUser) {
      userId = 'mock-another-user-id';
    }

    // Simulate a photo that was uploaded by a different user
    // This is for the test case where a different user tries to confirm the photo
    if (data.photoId === 'mock-photo-id-different-user') {
      if (cookie !== mockDataService.getMockCookies().user) {
        return {
          status: () => 403,
          json: async () => ({
            message: 'Forbidden: You can only confirm your own photo uploads.',
          }),
        };
      }
    }

    // Check if photoId exists
    if (data.photoId === 'clphoto00000000000000000000') {
      return {
        status: () => 404,
        json: async () => ({
          message: 'Photo not found or not pending confirmation by this user.',
        }),
      };
    }

    // Create confirmed photo
    const photo: MockPhoto = {
      id: data.photoId,
      runId,
      userId,
      storageKey: `uploads/${runId}/${data.photoId}/mock-image.jpg`,
      caption: data.caption || null,
      isConfirmed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      status: () => 200,
      json: async () => photo,
    };
  }

  // Helper method to create a mock response for POST /api/runs/[id]/attendance with a provided run
  static createPostAttendanceResponseWithRun(
    runId: string,
    data: any,
    cookie?: string,
    run?: any
  ): MockApiResponse<MockAttendance> {
    // Check for authentication
    if (!cookie) {
      return {
        status: () => 401,
        json: async () => ({ message: 'Unauthorized' }),
      };
    }

    // Check for userId
    if (!data.userId) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid request body',
          errors: { userId: 'User ID is required' },
        }),
      };
    }

    // Check if userId is valid format (CUID)
    if (
      !data.userId.match(/^cl[a-z0-9]{24}$/) &&
      !data.userId.startsWith('mock-')
    ) {
      return {
        status: () => 400,
        json: async () => ({
          message: 'Invalid request body',
          errors: { userId: 'User ID must be a valid CUID' },
        }),
      };
    }

    // Check if user exists
    const userExists = mockDataService.getMockUserById(data.userId);
    if (
      (!userExists && !data.userId.startsWith('mock-')) ||
      data.userId === 'cluserNonExistent0000yyyyy'
    ) {
      return {
        status: () => 404,
        json: async () => ({ message: 'User not found' }),
      };
    }

    // Check for organizer permissions
    if (cookie === mockDataService.getMockCookies().user) {
      return {
        status: () => 403,
        json: async () => ({
          message: 'Forbidden: Insufficient permissions',
        }),
      };
    }

    // Check if the organizer is the owner of the run
    // This is for the test case where a non-owner organizer tries to mark attendance
    if (
      cookie === mockDataService.getMockCookies().anotherOrganizer &&
      run &&
      run.organizerId !== 'mock-another-organizer-id'
    ) {
      return {
        status: () => 403,
        json: async () => ({
          message: 'Forbidden: Only the run owner or admin can mark attendance',
        }),
      };
    }

    // Determine marker ID based on cookie
    let markedById = 'mock-organizer-id';
    if (cookie === mockDataService.getMockCookies().anotherOrganizer) {
      markedById = 'mock-another-organizer-id';
    }

    // Create attendance record
    const attendance: MockAttendance = {
      id: `mock-attendance-id-${Date.now()}`,
      runId,
      userId: data.userId,
      markedById,
      createdAt: new Date().toISOString(),
    };

    return {
      status: () => 201,
      json: async () => attendance,
    };
  }
}
