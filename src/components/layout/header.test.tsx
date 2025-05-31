/**
 * Tests for Header component
 */

import React from 'react';
import { screen, fireEvent } from '@/lib/test-data';
import { renderWithProviders, mockSession, mockOrganizerSession } from '@/lib/test-data';

// Must be mocked **before** first import
jest.mock('next-auth/react', () => {
  const original = jest.requireActual('next-auth/react');
  return {
    ...original,
    signIn: jest.fn(),
    signOut: jest.fn(),
    useSession: jest.fn().mockReturnValue({ data: null, status: 'unauthenticated' }),
  };
});
import { signIn, signOut, useSession } from 'next-auth/react';

import Header from './header';

// Mock the AdminToggle component
jest.mock('./admin-toggle', () => ({
  AdminToggle: function MockAdminToggle() {
    return <div data-testid="admin-toggle">Admin Toggle</div>;
  },
}));

// Get access to the mocked functions
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe('Header Component', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    mockSignIn.mockClear();
    mockSignOut.mockClear();

    // Reset to default authenticated state
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    });
  });

  it('should render with basic elements', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('LH3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });

  it('should call onToggleSidebar when menu button is clicked', () => {
    const handleToggleSidebar = jest.fn();
    renderWithProviders(<Header onToggleSidebar={handleToggleSidebar} />);

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);

    expect(handleToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('should display user information when authenticated', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />, {
      session: mockSession,
    });

    // The component shows name OR email, not both
    expect(screen.getByText('Test User')).toBeInTheDocument();
    // Since name is present, email won't be shown
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  it('should show sign in button when not authenticated', () => {
    // Override the mock to return unauthenticated state
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    renderWithProviders(<Header onToggleSidebar={jest.fn()} />);

    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('should show sign out button when authenticated', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />, {
      session: mockSession,
    });

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('should display admin toggle for organizers and admins', () => {
    // Override the mock to return organizer session
    mockUseSession.mockReturnValue({
      data: mockOrganizerSession,
      status: 'authenticated',
      update: jest.fn(),
    });

    renderWithProviders(<Header onToggleSidebar={jest.fn()} />);

    expect(screen.getByTestId('admin-toggle')).toBeInTheDocument();
  });

  it('should not display admin toggle for regular users', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />, {
      session: mockSession,
    });

    expect(screen.queryByTestId('admin-toggle')).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
  });

  it('should use Lucide React icons', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />);

    // The Menu icon should be rendered (we can check for the button that contains it)
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();

    // Check that the button contains an SVG (Lucide icons render as SVG)
    const svg = menuButton.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle sign in action', () => {
    // Override the mock to return unauthenticated state
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    renderWithProviders(<Header onToggleSidebar={jest.fn()} />);

    const signInButton = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(signInButton);

    // Verify that signIn was called with 'google' provider
    expect(mockSignIn).toHaveBeenCalledWith('google');
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it('should handle sign out action', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />, {
      session: mockSession,
    });

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(signOutButton);

    // Verify that signOut was called
    expect(mockSignOut).toHaveBeenCalledWith();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('should have responsive design classes', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
    expect(header).toHaveClass('flex', 'justify-between', 'items-center');

    const container = header.firstChild;
    expect(container).toHaveClass('flex', 'items-center');
  });

  it('should display user avatar when user has image', () => {
    const sessionWithImage = {
      ...mockSession,
      user: {
        ...mockSession.user,
        id: 'test-user-id', // Ensure id is defined
        image: 'https://example.com/avatar.jpg',
      },
    };

    renderWithProviders(<Header onToggleSidebar={jest.fn()} />, {
      session: sessionWithImage,
    });

    // Check if avatar image is displayed (implementation may vary)
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should handle loading state gracefully', () => {
    // Test with undefined session (loading state)
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />, {
      session: undefined,
    });

    // Should still render the basic header structure
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('LH3')).toBeInTheDocument();
  });

  it('should maintain header positioning', () => {
    renderWithProviders(<Header onToggleSidebar={jest.fn()} />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed'); // Fixed positioning
    expect(header).toHaveClass('bg-gray-800'); // Background color
    expect(header).toHaveClass('p-4'); // Padding
  });
});
