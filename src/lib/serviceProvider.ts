import { IDbService, DbService, getDbService } from './db/dbService';
import { MockDbService } from './db/mockDbService';

/**
 * Service provider for the application
 * This manages all service instances and provides dependency injection
 */
export class ServiceProvider {
  private static instance: ServiceProvider;
  private dbService: IDbService;
  private isTestMode: boolean;

  private constructor() {
    this.isTestMode = process.env.E2E_TESTING_MODE === 'true' && process.env.USE_MOCK_DATA === 'true';
    
    // Initialize services based on environment
    if (this.isTestMode) {
      console.log('Using mock database service for tests');
      this.dbService = MockDbService.getInstance();
    } else {
      this.dbService = getDbService();
    }
  }

  /**
   * Get the singleton instance of the service provider
   */
  public static getInstance(): ServiceProvider {
    if (!ServiceProvider.instance) {
      ServiceProvider.instance = new ServiceProvider();
    }
    return ServiceProvider.instance;
  }

  /**
   * Get the database service
   */
  public getDbService(): IDbService {
    return this.dbService;
  }

  /**
   * Check if the application is running in test mode
   */
  public isInTestMode(): boolean {
    return this.isTestMode;
  }

  /**
   * Set the database service (useful for testing)
   */
  public setDbService(dbService: IDbService): void {
    this.dbService = dbService;
  }
}

/**
 * Get the service provider instance
 */
export function getServiceProvider(): ServiceProvider {
  return ServiceProvider.getInstance();
}
