/**
 * Tests for RSVPButtons component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@/lib/test-data';
import { RSVPButtons } from './rsvp-buttons';

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the API endpoints
global.fetch = jest.fn();

describe('RSVPButtons Component', () => {
  const mockProps = {
    runId: 'test-run-id',
    currentUserRsvp: null,
    rsvpCounts: { yes: 5, maybe: 2, no: 1 },
    onRsvpChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('Default variant', () => {
    it('should render all RSVP buttons with correct counts', () => {
      render(<RSVPButtons {...mockProps} />);

      expect(screen.getByRole('button', { name: /rsvp yes - 5 people attending/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /rsvp maybe - 2 people might attend/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /rsvp no - 1 people not attending/i })).toBeInTheDocument();
    });

    it('should show current user RSVP status', () => {
      render(<RSVPButtons {...mockProps} currentUserRsvp="YES" />);

      expect(screen.getByText('Your current RSVP:')).toBeInTheDocument();
      expect(screen.getByText('yes')).toBeInTheDocument();
    });

    it('should show sign-in message when not authenticated', () => {
      // Mock unauthenticated state
      (global as any).mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(<RSVPButtons {...mockProps} />);

      expect(screen.getByText(/sign in to rsvp for this run/i)).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      render(<RSVPButtons {...mockProps} />);

      const group = screen.getByRole('group', { name: /rsvp options/i });
      expect(group).toBeInTheDocument();

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });
      expect(yesButton).toHaveAttribute('aria-pressed', 'false');
      expect(yesButton).toHaveClass('min-h-[44px]', 'touch-manipulation');
    });

    it('should show pressed state for current user RSVP', () => {
      render(<RSVPButtons {...mockProps} currentUserRsvp="YES" />);

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });
      expect(yesButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Compact variant', () => {
    it('should render compact buttons with symbols', () => {
      render(<RSVPButtons {...mockProps} variant="compact" />);

      expect(screen.getByRole('button', { name: /quick rsvp yes - 5 attending/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /quick rsvp maybe - 2 might attend/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /quick rsvp no - 1 not attending/i })).toBeInTheDocument();

      // Check for symbols in button text
      expect(screen.getByText('✓ 5')).toBeInTheDocument();
      expect(screen.getByText('? 2')).toBeInTheDocument();
      expect(screen.getByText('✗ 1')).toBeInTheDocument();
    });

    it('should show total RSVP count badge', () => {
      render(<RSVPButtons {...mockProps} variant="compact" />);

      const badge = screen.getByLabelText(/total rsvps: 8/i);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('8');
    });
  });

  describe('RSVP interactions', () => {
    beforeEach(() => {
      // Mock authenticated state
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com',
            role: 'USER',
          },
        },
        status: 'authenticated',
      });
    });

    it('should handle successful RSVP update', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<RSVPButtons {...mockProps} />);

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });

      await act(async () => {
        fireEvent.click(yesButton);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/runs/test-run-id/rsvp', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'YES' }),
        });
      });
    });

    it('should handle RSVP error and rollback', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<RSVPButtons {...mockProps} />);

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });

      await act(async () => {
        fireEvent.click(yesButton);
      });

      await waitFor(() => {
        // Should call onRsvpChange twice: once for optimistic update, once for rollback
        expect(mockProps.onRsvpChange).toHaveBeenCalledTimes(2);
        // The last call should be the rollback
        expect(mockProps.onRsvpChange).toHaveBeenLastCalledWith('NO', mockProps.rsvpCounts);
      });
    });

    it('should show success animation after successful RSVP', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<RSVPButtons {...mockProps} />);

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });
      fireEvent.click(yesButton);

      await waitFor(() => {
        expect(screen.queryByText(/your current rsvp/i)).not.toBeInTheDocument();
      });
    });

    it('should disable buttons when disabled prop is true', () => {
      render(<RSVPButtons {...mockProps} disabled />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should prevent RSVP when not authenticated', () => {
      (global as any).mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(<RSVPButtons {...mockProps} />);

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });
      expect(yesButton).toBeDisabled();
    });
  });

  describe('Optimistic updates', () => {
    beforeEach(() => {
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com', role: 'USER' },
        },
        status: 'authenticated',
      });
    });

    it('should update counts optimistically', async () => {
      (fetch as jest.Mock).mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ ok: true, json: async () => ({ success: true }) }), 100);
      }));

      render(<RSVPButtons {...mockProps} />);

      const yesButton = screen.getByRole('button', { name: /rsvp yes - 5 people attending/i });

      await act(async () => {
        fireEvent.click(yesButton);
      });

      // Should immediately show updated count
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /rsvp yes - 6 people attending/i })).toBeInTheDocument();
      });
    });
  });
});
