/**
 * Integration tests for Run Details Page
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/lib/test-data';
import RunDetailsPage from './page';

// Mock the PhotoGallery component since it's lazy loaded
jest.mock('@/components/ui/photo-gallery', () => ({
  PhotoGallery: ({ photos, onPhotosChange }: any) => (
    <div data-testid="photo-gallery">
      <div>Photo Gallery with {photos.length} photos</div>
      <button onClick={() => onPhotosChange([...photos, { id: 'new-photo' }])}>
        Add Photo
      </button>
    </div>
  ),
}));

// Mock the router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-run-id' }),
  useRouter: () => ({ push: mockPush }),
}));

// Mock API calls
global.fetch = jest.fn();

describe('Run Details Page Integration', () => {
  const mockRun = {
    id: 'test-run-id',
    runNumber: 1234,
    descriptor: 'Test Run',
    date: new Date('2024-01-15T18:00:00Z'),
    location: {
      address: '123 Test St, Lawrence, KS',
      coordinates: { lat: 38.9592, lng: -95.3281 },
    },
    introLink: 'https://example.com/intro',
    description: 'A test run for the hash',
    organizer: {
      id: 'organizer-id',
      name: 'Test Organizer',
      email: 'organizer@example.com',
    },
    rsvps: [
      {
        id: 'rsvp-1',
        status: 'YES',
        user: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
      },
      {
        id: 'rsvp-2',
        status: 'MAYBE',
        user: { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
      },
    ],
    photos: [
      {
        id: 'photo-1',
        url: 'https://example.com/photo1.jpg',
        caption: 'Test photo',
        uploadedBy: { id: 'user-1', name: 'John Doe' },
        uploadedAt: new Date(),
      },
    ],
    checkIns: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockRun,
    });

    // Mock authenticated user
    (global as any).mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'current-user-id',
          name: 'Current User',
          email: 'current@example.com',
          role: 'USER',
        },
      },
      status: 'authenticated',
    });
  });

  describe('Page rendering', () => {
    it('should render run details correctly', async () => {
      render(<RunDetailsPage />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Run #1234: Test Run')).toBeInTheDocument();
      });

      expect(screen.getByText('123 Test St, Lawrence, KS')).toBeInTheDocument();
      expect(screen.getByText('January 15, 2024 at 6:00 PM')).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      render(<RunDetailsPage />);

      expect(screen.getByText('Loading run details...')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/error loading run details/i)).toBeInTheDocument();
      });
    });
  });

  describe('RSVP functionality', () => {
    it('should display RSVP buttons and counts', async () => {
      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /rsvp yes - 1 people attending/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /rsvp maybe - 1 people might attend/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /rsvp no - 0 people not attending/i })).toBeInTheDocument();
      });
    });

    it('should handle RSVP updates', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockRun })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /rsvp yes/i })).toBeInTheDocument();
      });

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });
      fireEvent.click(yesButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/runs/test-run-id/rsvp', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'YES' }),
        });
      });
    });
  });

  describe('Attendee list', () => {
    it('should display attendees organized by RSVP status', async () => {
      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Attendees (2)')).toBeInTheDocument();
      });

      expect(screen.getByText('Going (1)')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      expect(screen.getByText('Maybe (1)')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Photo gallery', () => {
    it('should render photo gallery with photos', async () => {
      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByTestId('photo-gallery')).toBeInTheDocument();
      });

      expect(screen.getByText('Photo Gallery with 1 photos')).toBeInTheDocument();
    });

    it('should handle photo uploads', async () => {
      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByTestId('photo-gallery')).toBeInTheDocument();
      });

      const addPhotoButton = screen.getByText('Add Photo');
      fireEvent.click(addPhotoButton);

      // Should update the photos count
      expect(screen.getByText('Photo Gallery with 2 photos')).toBeInTheDocument();
    });
  });

  describe('Check-in functionality', () => {
    it('should show check-in button on event day', async () => {
      // Mock current date to be the same as run date
      const mockDate = new Date('2024-01-15T19:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
      });

      jest.restoreAllMocks();
    });

    it('should not show check-in button before event day', async () => {
      // Mock current date to be before run date
      const mockDate = new Date('2024-01-14T19:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /check in/i })).not.toBeInTheDocument();
      });

      jest.restoreAllMocks();
    });
  });

  describe('Run editing', () => {
    it('should show edit button for organizers', async () => {
      // Mock user as organizer
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'organizer-id',
            name: 'Test Organizer',
            email: 'organizer@example.com',
            role: 'USER',
          },
        },
        status: 'authenticated',
      });

      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit run/i })).toBeInTheDocument();
      });
    });

    it('should not show edit button for non-organizers', async () => {
      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /edit run/i })).not.toBeInTheDocument();
      });
    });

    it('should toggle edit mode when edit button is clicked', async () => {
      // Mock user as organizer
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'organizer-id',
            name: 'Test Organizer',
            email: 'organizer@example.com',
            role: 'USER',
          },
        },
        status: 'authenticated',
      });

      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit run/i })).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit run/i });
      fireEvent.click(editButton);

      // Should show save and cancel buttons
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should have back button that navigates to runs list', async () => {
      render(<RunDetailsPage />);

      const backButton = screen.getByRole('button', { name: /back to runs/i });
      expect(backButton).toBeInTheDocument();

      fireEvent.click(backButton);
      expect(mockPush).toHaveBeenCalledWith('/runs');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', async () => {
      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(1);
    });

    it('should have proper landmark regions', async () => {
      render(<RunDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });
});
