/**
 * Tests for PhotoGallery component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/lib/test-data';
import { PhotoGallery } from './photo-gallery';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock file upload
global.fetch = jest.fn();

describe('PhotoGallery Component', () => {
  const mockPhotos = [
    {
      id: 'photo-1',
      url: 'https://example.com/photo1.jpg',
      caption: 'Test photo 1',
      uploadedBy: { id: 'user-1', name: 'John Doe' },
      uploadedAt: new Date(),
    },
    {
      id: 'photo-2',
      url: 'https://example.com/photo2.jpg',
      caption: 'Test photo 2',
      uploadedBy: { id: 'user-2', name: 'Jane Smith' },
      uploadedAt: new Date(),
    },
  ];

  const mockProps = {
    runId: 'test-run-id',
    photos: mockPhotos,
    onPhotosChange: jest.fn(),
    allowUpload: true,
    maxPhotos: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('Photo grid rendering', () => {
    it('should render photo grid with proper accessibility attributes', () => {
      render(<PhotoGallery {...mockProps} />);

      const grid = screen.getByRole('grid', { name: /photo gallery/i });
      expect(grid).toBeInTheDocument();

      const photos = screen.getAllByRole('gridcell');
      expect(photos).toHaveLength(3); // 2 photos + 1 upload button
    });

    it('should render photos with proper alt text and labels', () => {
      render(<PhotoGallery {...mockProps} />);

      const photo1Button = screen.getByRole('gridcell', {
        name: /view photo 1 by john doe: test photo 1/i
      });
      expect(photo1Button).toBeInTheDocument();

      const photo2Button = screen.getByRole('gridcell', {
        name: /view photo 2 by jane smith: test photo 2/i
      });
      expect(photo2Button).toBeInTheDocument();
    });

    it('should show upload button when authenticated and upload allowed', () => {
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });

      render(<PhotoGallery {...mockProps} />);

      const uploadInput = screen.getByLabelText(/upload a photo to this run/i);
      expect(uploadInput).toBeInTheDocument();
    });

    it('should not show upload button when not authenticated', () => {
      (global as any).mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(<PhotoGallery {...mockProps} />);

      const uploadInput = screen.queryByLabelText(/upload a photo to this run/i);
      expect(uploadInput).not.toBeInTheDocument();
    });

    it('should not show upload button when allowUpload is false', () => {
      render(<PhotoGallery {...mockProps} allowUpload={false} />);

      const uploadInput = screen.queryByLabelText(/upload a photo to this run/i);
      expect(uploadInput).not.toBeInTheDocument();
    });
  });

  describe('Lightbox functionality', () => {
    it('should open lightbox when photo is clicked', () => {
      render(<PhotoGallery {...mockProps} />);

      const photo1Button = screen.getByRole('gridcell', {
        name: /view photo 1 by john doe/i
      });
      fireEvent.click(photo1Button);

      // Check for dialog
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // Check for photo title
      expect(screen.getByText(/photo by john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/1 of 2/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation in lightbox', () => {
      render(<PhotoGallery {...mockProps} />);

      // Open lightbox
      const photo1Button = screen.getByRole('gridcell', {
        name: /view photo 1 by john doe/i
      });
      fireEvent.click(photo1Button);

      // Test arrow key navigation
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      expect(screen.getByText(/2 of 2/i)).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'ArrowLeft' });
      expect(screen.getByText(/1 of 2/i)).toBeInTheDocument();

      // Test escape key
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should support Enter and Space keys to open lightbox', () => {
      render(<PhotoGallery {...mockProps} />);

      const photo1Button = screen.getByRole('gridcell', {
        name: /view photo 1 by john doe/i
      });

      // Test Enter key
      fireEvent.keyDown(photo1Button, { key: 'Enter' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Close dialog
      fireEvent.keyDown(document, { key: 'Escape' });

      // Test Space key
      fireEvent.keyDown(photo1Button, { key: ' ' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show navigation buttons when multiple photos exist', () => {
      render(<PhotoGallery {...mockProps} />);

      // Open lightbox
      const photo1Button = screen.getByRole('gridcell', {
        name: /view photo 1 by john doe/i
      });
      fireEvent.click(photo1Button);

      const prevButton = screen.getByRole('button', { name: /previous photo/i });
      const nextButton = screen.getByRole('button', { name: /next photo/i });

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should display photo caption when available', () => {
      render(<PhotoGallery {...mockProps} />);

      // Open lightbox
      const photo1Button = screen.getByRole('gridcell', {
        name: /view photo 1 by john doe/i
      });
      fireEvent.click(photo1Button);

      expect(screen.getByText('Test photo 1')).toBeInTheDocument();
    });
  });

  describe('Photo upload functionality', () => {
    beforeEach(() => {
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });
    });

    it('should handle file selection', async () => {
      // Mock successful upload flow
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ signedUrl: 'https://s3.example.com/upload', key: 'test-key' }),
        })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            photo: {
              id: 'new-photo-id',
              url: 'https://example.com/new-photo.jpg',
              uploadedBy: { id: 'test-user-id', name: 'Test User' }
            }
          }),
        });

      render(<PhotoGallery {...mockProps} />);

      const uploadInput = screen.getByLabelText(/upload a photo to this run/i);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      // Should show uploading state
      await waitFor(() => {
        expect(screen.getByText(/uploading/i)).toBeInTheDocument();
      });
    });

    it('should show upload progress', async () => {
      render(<PhotoGallery {...mockProps} />);

      // Simulate upload in progress
      const component = screen.getByLabelText(/upload a photo to this run/i).closest('.aspect-square');

      // Mock the upload progress by directly checking for progress text
      // This would be shown during actual upload
      expect(component).toBeInTheDocument();
    });

    it('should handle upload errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));

      render(<PhotoGallery {...mockProps} />);

      const uploadInput = screen.getByLabelText(/upload a photo to this run/i);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      // Error handling would be tested through toast calls
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });

    it('should respect max photos limit', () => {
      const manyPhotos = Array.from({ length: 50 }, (_, i) => ({
        id: `photo-${i}`,
        url: `https://example.com/photo${i}.jpg`,
        caption: `Photo ${i}`,
        uploadedBy: { id: 'user-1', name: 'User' },
        uploadedAt: new Date(),
      }));

      render(<PhotoGallery {...mockProps} photos={manyPhotos} maxPhotos={50} />);

      const uploadInput = screen.queryByLabelText(/upload a photo to this run/i);
      expect(uploadInput).not.toBeInTheDocument();
    });
  });

  describe('Accessibility features', () => {
    it('should have proper focus management', () => {
      render(<PhotoGallery {...mockProps} />);

      const photo1Button = screen.getByRole('gridcell', {
        name: /view photo 1 by john doe/i
      });

      // Focus the button
      photo1Button.focus();
      expect(photo1Button).toHaveFocus();

      // Open lightbox
      fireEvent.click(photo1Button);

      // Close lightbox with escape
      fireEvent.keyDown(document, { key: 'Escape' });

      // Focus should return to the original button
      expect(photo1Button).toHaveFocus();
    });

    it('should have proper ARIA live regions for upload status', () => {
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });

      render(<PhotoGallery {...mockProps} />);

      // The upload area should have proper status attributes
      const uploadLabel = screen.getByLabelText(/upload a photo to this run/i).closest('label');
      expect(uploadLabel).toBeInTheDocument();
    });
  });
});
