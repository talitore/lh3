/**
 * Test Utilities
 *
 * This file provides utility functions and components for testing React components
 * with proper providers and context setup.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

// Mock session data
export const mockSession: Session = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
};

export const mockOrganizerSession: Session = {
  user: {
    id: 'test-organizer-id',
    name: 'Test Organizer',
    email: 'organizer@example.com',
    role: 'ORGANIZER',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockAdminSession: Session = {
  user: {
    id: 'test-admin-id',
    name: 'Test Admin',
    email: 'admin@example.com',
    role: 'ADMIN',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Test wrapper component
interface TestWrapperProps {
  children: React.ReactNode;
  session?: Session | null;
}

function TestWrapper({ children, session = mockSession }: TestWrapperProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: Session | null;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { session, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestWrapper session={session}>{children}</TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock fetch function
export function createMockFetch(responses: Record<string, any>) {
  return jest.fn().mockImplementation((url: string, options?: RequestInit) => {
    const method = options?.method || 'GET';
    const key = `${method} ${url}`;

    if (responses[key]) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(responses[key]),
        text: () => Promise.resolve(JSON.stringify(responses[key])),
      });
    }

    // Default response for unmatched requests
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
      text: () => Promise.resolve('Not found'),
    });
  });
}

// Mock API handlers
export const mockApiHandlers = {
  getRuns: jest.fn(),
  createRun: jest.fn(),
  updateRun: jest.fn(),
  deleteRun: jest.fn(),
  getRSVPs: jest.fn(),
  updateRSVP: jest.fn(),
  getPhotos: jest.fn(),
  uploadPhoto: jest.fn(),
  markAttendance: jest.fn(),
};

// Test data generators
export function generateTestFormData(overrides: Record<string, any> = {}) {
  return {
    number: 123,
    descriptor: 'Test Run',
    dateTime: '2024-12-31T10:00:00.000Z',
    address: '123 Test Street, Lawrence, KS',
    lat: 38.9592,
    lng: -95.3281,
    introLink: 'https://example.com/intro',
    ...overrides,
  };
}

// Mock file for testing file uploads
export function createMockFile(
  name: string = 'test-image.jpg',
  type: string = 'image/jpeg',
  size: number = 1024
): File {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

// Mock geolocation
export function mockGeolocation() {
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  };

  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  });

  return mockGeolocation;
}

// Mock local storage
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  const mockStorage = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: 0,
    key: jest.fn(),
  };

  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  });

  return mockStorage;
}

// Wait for async operations
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock console methods for testing
export function mockConsole() {
  const originalConsole = { ...console };

  const mockMethods = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };

  Object.assign(console, mockMethods);

  return {
    mockMethods,
    restore: () => Object.assign(console, originalConsole),
  };
}

// Test error boundary
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Accessibility testing helpers
export async function checkA11y(container: HTMLElement) {
  const { axe } = await import('jest-axe');
  // Note: This is a placeholder for axe integration
  // In actual tests, you would use @testing-library/jest-axe
  return Promise.resolve();
}

// Re-export commonly used testing utilities
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { renderWithProviders as render };
