/**
 * Test Data Index
 * 
 * Centralized exports for all test data utilities, factories, and helpers.
 */

// Export all factories
export * from './factories';

// Export test utilities
export * from './test-utils';

// Re-export commonly used testing libraries
export { render, screen, fireEvent, waitFor } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
