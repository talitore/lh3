import { PrismaClient, RSVPStatus } from '@/generated/prisma';
import { IDbService } from './dbService';

/**
 * Mock database service for testing
 * This provides mock implementations of database operations
 */
export class MockDbService implements IDbService {
  private static instance: MockDbService;
  private mockClient: any;
  private mockData: {
    runs: any[];
    rsvps: any[];
    attendances: any[];
    photos: any[];
    users: any[];
    pendingPhotos: any[];
  };

  private constructor() {
    // Initialize mock data store
    this.mockData = {
      runs: [],
      rsvps: [],
      attendances: [],
      photos: [],
      pendingPhotos: [],
      users: [
        {
          id: 'mock-organizer-id',
          name: 'Mock Organizer',
          email: 'mock@example.com',
          image: 'https://via.placeholder.com/150?text=Mock+Organizer',
          role: 'ORGANIZER',
        },
        {
          id: 'mock-user-id',
          name: 'Mock User',
          email: 'mockuser@example.com',
          image: 'https://via.placeholder.com/150?text=Mock+User',
          role: 'USER',
        },
        {
          id: 'mock-another-user-id',
          name: 'Another Mock User',
          email: 'another-mockuser@example.com',
          image: 'https://via.placeholder.com/150?text=Another+Mock+User',
          role: 'USER',
        },
        {
          id: 'mock-another-organizer-id',
          name: 'Another Mock Organizer',
          email: 'another-org-for-attendance@example.com',
          image: 'https://via.placeholder.com/150?text=Another+Mock+Organizer',
          role: 'ORGANIZER',
        },
        {
          id: 'cluser00000000000000000000',
          name: 'Test User',
          email: 'testuser@example.com',
          image: 'https://via.placeholder.com/150?text=Test+User',
          role: 'USER',
        },
      ],
    };

    // Add some initial mock runs
    this.mockData.runs.push({
      id: 'mock-run-id-1',
      number: 1,
      descriptor: 'Mock Run 1',
      dateTime: new Date(),
      address: '123 Test Street, Testville',
      lat: 34.0522,
      lng: -118.2437,
      introLink: 'https://example.com/intro',
      organizerId: 'mock-organizer-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.mockData.runs.push({
      id: 'mock-run-id-for-attendance',
      number: 123,
      descriptor: 'Mock Run For Attendance Test',
      dateTime: new Date(),
      address: '123 Test Street, Testville',
      lat: 34.0522,
      lng: -118.2437,
      introLink: 'https://example.com/intro',
      organizerId: 'mock-organizer-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.mockData.runs.push({
      id: 'mock-run-id-for-photo-url',
      number: 456,
      descriptor: 'Mock Run For Photo URL Gen Test',
      dateTime: new Date(),
      address: '123 Test Street, Testville',
      lat: 34.0522,
      lng: -118.2437,
      introLink: 'https://example.com/intro',
      organizerId: 'mock-organizer-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create a mock client with the same interface as PrismaClient
    // but with mock implementations
    this.mockClient = {
      run: {
        create: (args: any) => {
          console.log('Mock create run:', args.data);

          try {
            // Check if a run with this ID already exists
            if (args.data.id) {
              const existingRun = this.mockData.runs.find(
                (run) => run.id === args.data.id
              );

              if (existingRun) {
                // Return the existing run to avoid duplicates
                console.log(
                  'Run with ID already exists, returning existing run:',
                  existingRun
                );
                return existingRun;
              }
            }

            // Check if a run with the same number already exists
            const existingRunWithSameNumber = this.mockData.runs.find(
              (run) => run.number === args.data.number
            );

            if (existingRunWithSameNumber) {
              // Simulate a Prisma unique constraint error
              const error: any = new Error('Unique constraint violation');
              error.code = 'P2002';
              error.meta = { target: 'Run_number_key' };
              throw error;
            }

            const newRun = {
              id: args.data.id || `mock-run-id-${Date.now()}`,
              ...args.data,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            // Handle the organizer connect
            if (args.data.organizer?.connect?.id) {
              newRun.organizerId = args.data.organizer.connect.id;
              delete newRun.organizer;
            }

            this.mockData.runs.push(newRun);
            return newRun;
          } catch (error) {
            console.error('Error in mock run.create:', error);
            throw error; // Re-throw the error to be caught by the API route handler
          }
        },
        findMany: (args: any) => {
          console.log('Mock findMany runs');
          let runs = [...this.mockData.runs];

          // Apply where clause if provided
          if (args?.where) {
            // Filter by dateTime if provided
            if (args.where.dateTime) {
              const now = new Date();
              if (args.where.dateTime.gt) {
                runs = runs.filter(
                  (run) =>
                    new Date(run.dateTime) > new Date(args.where.dateTime.gt)
                );
              }
              if (args.where.dateTime.lte) {
                runs = runs.filter(
                  (run) =>
                    new Date(run.dateTime) <= new Date(args.where.dateTime.lte)
                );
              }
              if (args.where.dateTime.gte) {
                runs = runs.filter(
                  (run) =>
                    new Date(run.dateTime) >= new Date(args.where.dateTime.gte)
                );
              }
            }
          }

          // Add debug logging for date filtering
          console.log('Mock findMany runs - filtered count:', runs.length);

          // Apply orderBy if provided
          if (args?.orderBy) {
            const sortField = Object.keys(args.orderBy)[0];
            const sortOrder = args.orderBy[sortField];

            runs.sort((a, b) => {
              if (sortOrder === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1;
              } else {
                return a[sortField] < b[sortField] ? 1 : -1;
              }
            });
          }

          // Apply pagination if provided
          if (args?.skip !== undefined && args?.take !== undefined) {
            runs = runs.slice(args.skip, args.skip + args.take);
          }

          // Add organizer and _count
          return runs.map((run) => ({
            ...run,
            organizer: this.mockData.users.find(
              (user) => user.id === run.organizerId
            ),
            _count: {
              rsvps: this.mockData.rsvps.filter(
                (rsvp) => rsvp.runId === run.id && rsvp.status === 'YES'
              ).length,
            },
          }));
        },
        count: (args: any) => {
          console.log('Mock count runs');
          let count = this.mockData.runs.length;

          // Apply where clause if provided
          if (args?.where) {
            // Filter by dateTime if provided
            if (args.where.dateTime) {
              let filteredRuns = [...this.mockData.runs];
              const now = new Date();
              if (args.where.dateTime.gt) {
                filteredRuns = filteredRuns.filter(
                  (run) =>
                    new Date(run.dateTime) > new Date(args.where.dateTime.gt)
                );
              }
              if (args.where.dateTime.lte) {
                filteredRuns = filteredRuns.filter(
                  (run) =>
                    new Date(run.dateTime) <= new Date(args.where.dateTime.lte)
                );
              }
              if (args.where.dateTime.gte) {
                filteredRuns = filteredRuns.filter(
                  (run) =>
                    new Date(run.dateTime) >= new Date(args.where.dateTime.gte)
                );
              }
              count = filteredRuns.length;
            }
          }

          return count;
        },
        findUnique: (args: any) => {
          console.log('Mock findUnique run:', args.where.id);
          const run = this.mockData.runs.find((r) => r.id === args.where.id);

          if (run) {
            const result = { ...run };

            // Add related data if include is specified
            if (args.include) {
              if (args.include.organizer) {
                result.organizer = this.mockData.users.find(
                  (user) => user.id === run.organizerId
                );
              }

              if (args.include.rsvps) {
                result.rsvps = this.mockData.rsvps
                  .filter((rsvp) => rsvp.runId === run.id)
                  .map((rsvp) => ({
                    ...rsvp,
                    user: args.include.rsvps.include?.user
                      ? this.mockData.users.find(
                          (user) => user.id === rsvp.userId
                        )
                      : undefined,
                  }));
              }

              if (args.include.attendees) {
                result.attendees = this.mockData.attendances
                  .filter((att) => att.runId === run.id)
                  .map((att) => ({
                    ...att,
                    user: args.include.attendees.include?.user
                      ? this.mockData.users.find(
                          (user) => user.id === att.userId
                        )
                      : undefined,
                  }));
              }

              if (args.include.photos) {
                result.photos = this.mockData.photos
                  .filter((photo) => photo.runId === run.id)
                  .map((photo) => ({
                    ...photo,
                    uploadedBy: args.include.photos.select?.uploadedBy
                      ? this.mockData.users.find(
                          (user) => user.id === photo.uploaderId
                        )
                      : undefined,
                  }));
              }
            }

            return result;
          }

          // Special case for mock IDs
          if (
            args.where.id.startsWith('mock-run-id') ||
            args.where.id === 'clphoto00000000000000000000'
          ) {
            const mockRun = {
              id: args.where.id,
              number: 999,
              descriptor: 'Mock Run For Testing',
              dateTime: new Date(),
              address: '123 Test Street, Testville',
              lat: 34.0522,
              lng: -118.2437,
              introLink: 'https://example.com/intro',
              organizerId: 'mock-organizer-id',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            const result = { ...mockRun };

            // Add related data if include is specified
            if (args.include) {
              if (args.include.organizer) {
                result.organizer = this.mockData.users.find(
                  (user) => user.id === 'mock-organizer-id'
                );
              }

              if (args.include.rsvps) {
                result.rsvps = [];
              }

              if (args.include.attendees) {
                result.attendees = [];
              }

              if (args.include.photos) {
                result.photos = [];
              }
            }

            return result;
          }

          return null;
        },
        update: (args: any) => {
          console.log('Mock update run:', args.where.id, args.data);
          const runIndex = this.mockData.runs.findIndex(
            (r) => r.id === args.where.id
          );

          if (runIndex !== -1) {
            const updatedRun = {
              ...this.mockData.runs[runIndex],
              ...args.data,
              updatedAt: new Date(),
            };

            this.mockData.runs[runIndex] = updatedRun;

            // Add organizer if include is specified
            if (args.include?.organizer) {
              updatedRun.organizer = this.mockData.users.find(
                (user) => user.id === updatedRun.organizerId
              );
            }

            return updatedRun;
          }

          // If run not found, return a mock updated run
          return {
            id: args.where.id,
            ...args.data,
            updatedAt: new Date(),
          };
        },
        deleteMany: (args: any) => {
          console.log('Mock deleteMany runs:', args.where);
          if (args.where?.id?.in) {
            const idsToDelete = args.where.id.in;
            this.mockData.runs = this.mockData.runs.filter(
              (run) => !idsToDelete.includes(run.id)
            );
          }
          return { count: 1 };
        },
      },
      // Add RSVP model
      rSVP: {
        create: (args: any) => {
          console.log('Mock create RSVP:', args.data);
          const newRsvp = {
            id: `mock-rsvp-id-${Date.now()}`,
            ...args.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          this.mockData.rsvps.push(newRsvp);
          return newRsvp;
        },
        findFirst: (args: any) => {
          console.log('Mock findFirst RSVP:', args.where);
          return this.mockData.rsvps.find(
            (rsvp) =>
              rsvp.runId === args.where.runId &&
              rsvp.userId === args.where.userId
          );
        },
        findUnique: (args: any) => {
          console.log('Mock findUnique RSVP:', args.where);
          if (args.where.runId_userId) {
            return this.mockData.rsvps.find(
              (rsvp) =>
                rsvp.runId === args.where.runId_userId.runId &&
                rsvp.userId === args.where.runId_userId.userId
            );
          }
          return null;
        },
        upsert: (args: any) => {
          console.log(
            'Mock upsert RSVP:',
            args.where,
            args.create,
            args.update
          );
          const existingRsvp = this.mockData.rsvps.find(
            (rsvp) =>
              rsvp.runId === args.where.runId_userId.runId &&
              rsvp.userId === args.where.runId_userId.userId
          );

          if (existingRsvp) {
            // Update
            const updatedRsvp = {
              ...existingRsvp,
              ...args.update,
              updatedAt: new Date(),
            };
            const index = this.mockData.rsvps.indexOf(existingRsvp);
            this.mockData.rsvps[index] = updatedRsvp;
            return updatedRsvp;
          } else {
            // Create
            const newRsvp = {
              id: `mock-rsvp-id-${Date.now()}`,
              ...args.create,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            this.mockData.rsvps.push(newRsvp);
            return newRsvp;
          }
        },
        deleteMany: (args: any) => {
          console.log('Mock deleteMany RSVPs:', args.where);
          if (args.where?.runId) {
            this.mockData.rsvps = this.mockData.rsvps.filter(
              (rsvp) => rsvp.runId !== args.where.runId
            );
          }
          return { count: 1 };
        },
      },
      // Add Attendance model
      attendance: {
        create: (args: any) => {
          console.log('Mock create Attendance:', args.data);
          const newAttendance = {
            id: `mock-attendance-id-${Date.now()}`,
            ...args.data,
            markedAt: new Date(),
          };
          this.mockData.attendances.push(newAttendance);
          return newAttendance;
        },
        findUnique: (args: any) => {
          console.log('Mock findUnique Attendance:', args.where);
          if (args.where.runId_userId) {
            return this.mockData.attendances.find(
              (att) =>
                att.runId === args.where.runId_userId.runId &&
                att.userId === args.where.runId_userId.userId
            );
          }
          return null;
        },
        findMany: (args: any) => {
          console.log('Mock findMany Attendances:', args.where);
          let attendances = [...this.mockData.attendances];

          if (args?.where?.runId) {
            attendances = attendances.filter(
              (att) => att.runId === args.where.runId
            );
          }

          if (args?.where?.userId) {
            attendances = attendances.filter(
              (att) => att.userId === args.where.userId
            );
          }

          return attendances;
        },
        deleteMany: (args: any) => {
          console.log('Mock deleteMany Attendances:', args.where);
          if (args.where?.runId) {
            this.mockData.attendances = this.mockData.attendances.filter(
              (att) => att.runId !== args.where.runId
            );
          }
          return { count: 1 };
        },
        upsert: (args: any) => {
          console.log(
            'Mock upsert Attendance:',
            args.where,
            args.create,
            args.update
          );
          const existingAttendance = this.mockData.attendances.find(
            (att) =>
              att.runId === args.where.runId_userId.runId &&
              att.userId === args.where.runId_userId.userId
          );

          if (existingAttendance) {
            // Update - for idempotency test
            return existingAttendance;
          } else {
            // Create
            const newAttendance = {
              id: `mock-attendance-id-${Date.now()}`,
              ...args.create,
              markedAt: new Date(),
            };
            this.mockData.attendances.push(newAttendance);
            return newAttendance;
          }
        },
      },
      // Add Photo model
      photo: {
        create: (args: any) => {
          console.log('Mock create Photo:', args.data);
          const newPhoto = {
            id: args.data.id || `mock-photo-id-${Date.now()}`,
            ...args.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // If this is a pending photo (no URL yet), add to pendingPhotos
          if (!args.data.url) {
            this.mockData.pendingPhotos.push(newPhoto);
          } else {
            // Otherwise add to confirmed photos
            this.mockData.photos.push(newPhoto);
          }

          return newPhoto;
        },
        findUnique: (args: any) => {
          console.log('Mock findUnique Photo:', args.where);

          // First check in photos
          let photo = this.mockData.photos.find(
            (photo) => photo.id === args.where.id
          );

          // If not found, check in pendingPhotos
          if (!photo) {
            photo = this.mockData.pendingPhotos.find(
              (photo) => photo.id === args.where.id
            );
          }

          return photo;
        },
        findMany: (args: any) => {
          console.log('Mock findMany Photos:', args.where);
          let photos = [...this.mockData.photos];

          if (args?.where?.runId) {
            photos = photos.filter((photo) => photo.runId === args.where.runId);
          }

          if (args?.where?.uploaderId) {
            photos = photos.filter(
              (photo) => photo.uploaderId === args.where.uploaderId
            );
          }

          return photos;
        },
        update: (args: any) => {
          console.log('Mock update Photo:', args.where.id, args.data);

          // First check in pendingPhotos
          const pendingIndex = this.mockData.pendingPhotos.findIndex(
            (photo) => photo.id === args.where.id
          );

          if (pendingIndex !== -1) {
            // If found in pendingPhotos, update it
            const updatedPhoto = {
              ...this.mockData.pendingPhotos[pendingIndex],
              ...args.data,
              updatedAt: new Date(),
            };

            // If URL is now set, move from pending to confirmed
            if (updatedPhoto.url) {
              this.mockData.pendingPhotos.splice(pendingIndex, 1);
              this.mockData.photos.push(updatedPhoto);
            } else {
              this.mockData.pendingPhotos[pendingIndex] = updatedPhoto;
            }

            return updatedPhoto;
          }

          // If not in pendingPhotos, check in photos
          const photoIndex = this.mockData.photos.findIndex(
            (photo) => photo.id === args.where.id
          );

          if (photoIndex !== -1) {
            // If found in photos, update it
            const updatedPhoto = {
              ...this.mockData.photos[photoIndex],
              ...args.data,
              updatedAt: new Date(),
            };

            this.mockData.photos[photoIndex] = updatedPhoto;
            return updatedPhoto;
          }

          // If not found anywhere, create a new one
          const newPhoto = {
            id: args.where.id,
            ...args.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          this.mockData.photos.push(newPhoto);
          return newPhoto;
        },
        deleteMany: (args: any) => {
          console.log('Mock deleteMany Photos:', args.where);
          if (args.where?.runId) {
            this.mockData.photos = this.mockData.photos.filter(
              (photo) => photo.runId !== args.where.runId
            );
            this.mockData.pendingPhotos = this.mockData.pendingPhotos.filter(
              (photo) => photo.runId !== args.where.runId
            );
          }
          return { count: 1 };
        },
      },
      // Add User model for completeness
      user: {
        findUnique: (args: any) => {
          console.log('Mock findUnique User:', args.where);
          return this.mockData.users.find((user) => user.id === args.where.id);
        },
      },
      $disconnect: () => {
        console.log('Mock disconnect');
        return Promise.resolve();
      },
    };
  }

  /**
   * Get the singleton instance of the mock database service
   */
  public static getInstance(): MockDbService {
    if (!MockDbService.instance) {
      MockDbService.instance = new MockDbService();
    }
    return MockDbService.instance;
  }

  /**
   * Get the mock database client
   */
  public getClient(): PrismaClient {
    return this.mockClient as unknown as PrismaClient;
  }
}
