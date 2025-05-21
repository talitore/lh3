import { PrismaClient } from '@/generated/prisma';

/**
 * Database service interface
 * This provides a layer of abstraction over the database client
 * allowing for easier testing and mocking
 */
export interface IDbService {
  /**
   * Get the database client
   */
  getClient(): PrismaClient;
}

/**
 * Default database service implementation using Prisma
 */
export class DbService implements IDbService {
  private static instance: DbService;
  private client: PrismaClient;

  private constructor() {
    this.client = new PrismaClient();
  }

  /**
   * Get the singleton instance of the database service
   */
  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  /**
   * Get the database client
   */
  public getClient(): PrismaClient {
    return this.client;
  }
}

/**
 * Get the default database service instance
 */
export function getDbService(): IDbService {
  return DbService.getInstance();
}
