/**
 * Tests for AdminToggle component
 */

import React from 'react';
import { render, screen } from '@/lib/test-data';
import userEvent from '@testing-library/user-event';
import { AdminToggle } from './admin-toggle';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants/app';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('AdminToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should render with default state (admin mode off)', () => {
    render(<AdminToggle />);

    expect(screen.getByText('Admin Mode')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('should load initial state from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('true');

    render(<AdminToggle />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.ADMIN_MODE);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('should toggle admin mode when clicked', async () => {
    const user = userEvent.setup();
    render(<AdminToggle />);

    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();

    await user.click(toggle);

    expect(toggle).toBeChecked();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.ADMIN_MODE, 'true');
  });

  it('should toggle off when clicked again', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue('true');

    render(<AdminToggle />);

    const toggle = screen.getByRole('switch');
    expect(toggle).toBeChecked();

    await user.click(toggle);

    expect(toggle).not.toBeChecked();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.ADMIN_MODE, 'false');
  });

  it('should handle keyboard interaction', async () => {
    const user = userEvent.setup();
    render(<AdminToggle />);

    const toggle = screen.getByRole('switch');

    // Focus the toggle
    await user.tab();
    expect(toggle).toHaveFocus();

    // Press space to toggle
    await user.keyboard(' ');
    expect(toggle).toBeChecked();

    // Press enter to toggle
    await user.keyboard('{Enter}');
    expect(toggle).not.toBeChecked();
  });

  it('should have proper accessibility attributes', () => {
    render(<AdminToggle />);

    const toggle = screen.getByRole('switch');
    const label = screen.getByText('Admin Mode');

    expect(toggle).toHaveAttribute('aria-checked');
    expect(label).toBeInTheDocument();

    // Check if label is properly associated with the switch
    const labelElement = label.closest('label');
    expect(labelElement).toBeInTheDocument();
  });

  it('should use shadcn/ui Switch component', () => {
    render(<AdminToggle />);

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('data-slot', 'switch');
  });

  it('should use shadcn/ui Label component', () => {
    render(<AdminToggle />);

    const label = screen.getByText('Admin Mode');
    const labelElement = label.closest('label');
    expect(labelElement).toHaveAttribute('data-slot', 'label');
  });

  it('should handle invalid localStorage values gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-value');

    render(<AdminToggle />);

    // Should default to false for invalid values
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Should not throw and should render with default state
    expect(() => render(<AdminToggle />)).not.toThrow();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('should handle setItem errors gracefully', async () => {
    const user = userEvent.setup();
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error');
    });

    render(<AdminToggle />);

    const toggle = screen.getByRole('switch');

    // Should not throw when trying to save state
    await expect(user.click(toggle)).resolves.not.toThrow();
  });

  it('should maintain state consistency', async () => {
    const user = userEvent.setup();
    render(<AdminToggle />);

    const toggle = screen.getByRole('switch');

    // Toggle multiple times and verify state consistency
    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(LOCAL_STORAGE_KEYS.ADMIN_MODE, 'true');

    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(LOCAL_STORAGE_KEYS.ADMIN_MODE, 'false');

    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(LOCAL_STORAGE_KEYS.ADMIN_MODE, 'true');
  });

  it('should have proper styling classes', () => {
    render(<AdminToggle />);

    const container = screen.getByText('Admin Mode').closest('div');
    expect(container).toHaveClass('flex', 'items-center', 'space-x-2');
  });

  it('should be focusable and have proper focus management', async () => {
    const user = userEvent.setup();
    render(<AdminToggle />);

    const toggle = screen.getByRole('switch');

    await user.tab();
    expect(toggle).toHaveFocus();

    // Should be able to blur
    await user.tab();
    expect(toggle).not.toHaveFocus();
  });
});
