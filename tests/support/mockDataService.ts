/**
 * Mock Data Service for E2E Tests
 * 
 * This service provides mock data for tests to avoid skipping tests when in mock mode.
 * It uses dependency injection to provide mock data for various test scenarios.
 */

import { APIRequestContext } from '@playwright/test';

// Types for mock data
export interface MockRun {
  id: string;
  number: number;
  descriptor: string;
  dateTime: string;
  address: string;
  lat: number;
  lng: number;
  introLink: string | null;
  organizerId: string;
  organizer?: MockUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
}

export interface MockRSVP {
  id: string;
  runId: string;
  userId: string;
  status: 'YES' | 'NO' | 'MAYBE';
  createdAt: string;
  updatedAt: string;
}

export interface MockAttendance {
  id: string;
  runId: string;
  userId: string;
  markedById: string;
  createdAt: string;
}

export interface MockPhoto {
  id: string;
  runId: string;
  userId: string;
  storageKey: string;
  caption: string | null;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data service class
export class MockDataService {
  private mockRuns: MockRun[] = [];
  private mockUsers: MockUser[] = [];
  private mockRSVPs: MockRSVP[] = [];
  private mockAttendances: MockAttendance[] = [];
  private mockPhotos: MockPhoto[] = [];
  
  // Mock cookies for authentication
  private mockCookies = {
    organizer: 'mock-cookie=mock-organizer-session; role=ORGANIZER',
    anotherOrganizer: 'mock-cookie=mock-another-organizer-session; role=ORGANIZER',
    user: 'mock-cookie=mock-user-session; role=USER',
    anotherUser: 'mock-cookie=mock-another-user-session; role=USER',
  };

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock users
    this.mockUsers = [
      {
        id: 'mock-organizer-id',
        name: 'Mock Organizer',
        email: 'organizer@example.com',
        role: 'ORGANIZER'
      },
      {
        id: 'mock-another-organizer-id',
        name: 'Another Organizer',
        email: 'another-organizer@example.com',
        role: 'ORGANIZER'
      },
      {
        id: 'mock-user-id',
        name: 'Mock User',
        email: 'user@example.com',
        role: 'USER'
      },
      {
        id: 'mock-another-user-id',
        name: 'Another User',
        email: 'another-user@example.com',
        role: 'USER'
      }
    ];

    // Initialize mock runs
    const now = new Date();
    this.mockRuns = [
      {
        id: 'mock-run-id-1',
        number: 101,
        descriptor: 'Past Run',
        dateTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        address: '123 Test Street, Testville',
        lat: 34.0522,
        lng: -118.2437,
        introLink: 'https://example.com/intro',
        organizerId: 'mock-organizer-id',
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-run-id-2',
        number: 102,
        descriptor: 'Present Run',
        dateTime: now.toISOString(),
        address: '456 Test Avenue, Testopolis',
        lat: 34.0522,
        lng: -118.2437,
        introLink: 'https://example.com/intro2',
        organizerId: 'mock-organizer-id',
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-run-id-3',
        number: 103,
        descriptor: 'Future Run',
        dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        address: '789 Test Boulevard, Testington',
        lat: 34.0522,
        lng: -118.2437,
        introLink: 'https://example.com/intro3',
        organizerId: 'mock-organizer-id',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-run-id-4',
        number: 104,
        descriptor: 'Run For Update Test',
        dateTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        address: '101 Update Street, Updateville',
        lat: 34.0522,
        lng: -118.2437,
        introLink: 'https://example.com/intro4',
        organizerId: 'mock-organizer-id',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-run-id-5',
        number: 105,
        descriptor: 'Run For RSVP Test',
        dateTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        address: '202 RSVP Avenue, RSVPtown',
        lat: 34.0522,
        lng: -118.2437,
        introLink: 'https://example.com/intro5',
        organizerId: 'mock-organizer-id',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    // Initialize mock RSVPs
    this.mockRSVPs = [
      {
        id: 'mock-rsvp-id-1',
        runId: 'mock-run-id-5',
        userId: 'mock-user-id',
        status: 'YES',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // Initialize mock attendances
    this.mockAttendances = [
      {
        id: 'mock-attendance-id-1',
        runId: 'mock-run-id-1',
        userId: 'mock-user-id',
        markedById: 'mock-organizer-id',
        createdAt: new Date().toISOString(),
      }
    ];

    // Initialize mock photos
    this.mockPhotos = [
      {
        id: 'mock-photo-id-1',
        runId: 'mock-run-id-1',
        userId: 'mock-user-id',
        storageKey: 'mock-storage-key-1.jpg',
        caption: 'Mock photo caption',
        isConfirmed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mock-photo-id-2',
        runId: 'mock-run-id-1',
        userId: 'mock-user-id',
        storageKey: 'mock-storage-key-2.jpg',
        caption: null,
        isConfirmed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }

  // Getters for mock data
  getMockRuns(): MockRun[] {
    return this.mockRuns;
  }

  getMockUsers(): MockUser[] {
    return this.mockUsers;
  }

  getMockRSVPs(): MockRSVP[] {
    return this.mockRSVPs;
  }

  getMockAttendances(): MockAttendance[] {
    return this.mockAttendances;
  }

  getMockPhotos(): MockPhoto[] {
    return this.mockPhotos;
  }

  // Get mock cookies
  getMockCookies() {
    return this.mockCookies;
  }

  // Get a specific run by ID
  getMockRunById(id: string): MockRun | undefined {
    return this.mockRuns.find(run => run.id === id);
  }

  // Get a specific user by ID
  getMockUserById(id: string): MockUser | undefined {
    return this.mockUsers.find(user => user.id === id);
  }

  // Get RSVPs for a specific run
  getMockRSVPsForRun(runId: string): MockRSVP[] {
    return this.mockRSVPs.filter(rsvp => rsvp.runId === runId);
  }

  // Get attendances for a specific run
  getMockAttendancesForRun(runId: string): MockAttendance[] {
    return this.mockAttendances.filter(attendance => attendance.runId === runId);
  }

  // Get photos for a specific run
  getMockPhotosForRun(runId: string): MockPhoto[] {
    return this.mockPhotos.filter(photo => photo.runId === runId);
  }
}

// Create and export a singleton instance
export const mockDataService = new MockDataService();
