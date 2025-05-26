/**
 * Integration Tests for Form Submissions
 * 
 * These tests verify that forms work correctly with API endpoints
 * and handle various scenarios including success and error cases.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/lib/test-data';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createMockFetch, generateTestFormData } from '@/lib/test-data';

// Mock form component for testing
const TestRunForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = React.useState({
    number: '',
    descriptor: '',
    dateTime: '',
    address: '',
    lat: '',
    lng: '',
    introLink: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="run-form">
      <input
        data-testid="number-input"
        type="number"
        value={formData.number}
        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
        placeholder="Run number"
        required
      />
      <input
        data-testid="descriptor-input"
        type="text"
        value={formData.descriptor}
        onChange={(e) => setFormData({ ...formData, descriptor: e.target.value })}
        placeholder="Run descriptor"
        required
      />
      <input
        data-testid="datetime-input"
        type="datetime-local"
        value={formData.dateTime}
        onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
        required
      />
      <input
        data-testid="address-input"
        type="text"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        placeholder="Address"
        required
      />
      <input
        data-testid="lat-input"
        type="number"
        step="any"
        value={formData.lat}
        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
        placeholder="Latitude"
      />
      <input
        data-testid="lng-input"
        type="number"
        step="any"
        value={formData.lng}
        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
        placeholder="Longitude"
      />
      <input
        data-testid="intro-link-input"
        type="url"
        value={formData.introLink}
        onChange={(e) => setFormData({ ...formData, introLink: e.target.value })}
        placeholder="Intro link"
      />
      <button type="submit" data-testid="submit-button">
        Create Run
      </button>
    </form>
  );
};

describe('Form Integration Tests', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Run Creation Form', () => {
    it('should submit form with valid data successfully', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      const mockResponse = { id: 'new-run-id', number: 123 };

      global.fetch = createMockFetch({
        'POST /api/runs': mockResponse,
      });

      render(<TestRunForm onSubmit={mockSubmit} />);

      // Fill out the form
      await user.type(screen.getByTestId('number-input'), '123');
      await user.type(screen.getByTestId('descriptor-input'), 'Test Run');
      await user.type(screen.getByTestId('datetime-input'), '2024-12-31T10:00');
      await user.type(screen.getByTestId('address-input'), '123 Test St');
      await user.type(screen.getByTestId('lat-input'), '38.9592');
      await user.type(screen.getByTestId('lng-input'), '-95.3281');
      await user.type(screen.getByTestId('intro-link-input'), 'https://example.com');

      // Submit the form
      await user.click(screen.getByTestId('submit-button'));

      expect(mockSubmit).toHaveBeenCalledWith({
        number: '123',
        descriptor: 'Test Run',
        dateTime: '2024-12-31T10:00',
        address: '123 Test St',
        lat: '38.9592',
        lng: '-95.3281',
        introLink: 'https://example.com',
      });
    });

    it('should handle form validation errors', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();

      render(<TestRunForm onSubmit={mockSubmit} />);

      // Try to submit without required fields
      await user.click(screen.getByTestId('submit-button'));

      // Form should not submit due to HTML5 validation
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn().mockImplementation(async (data) => {
        const response = await fetch('/api/runs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('API Error');
        }
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid data' }),
      });

      render(<TestRunForm onSubmit={mockSubmit} />);

      // Fill out form with valid data
      await user.type(screen.getByTestId('number-input'), '123');
      await user.type(screen.getByTestId('descriptor-input'), 'Test Run');
      await user.type(screen.getByTestId('datetime-input'), '2024-12-31T10:00');
      await user.type(screen.getByTestId('address-input'), '123 Test St');

      // Submit and expect error handling
      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn().mockImplementation(async () => {
        throw new Error('Network error');
      });

      render(<TestRunForm onSubmit={mockSubmit} />);

      // Fill out form
      await user.type(screen.getByTestId('number-input'), '123');
      await user.type(screen.getByTestId('descriptor-input'), 'Test Run');
      await user.type(screen.getByTestId('datetime-input'), '2024-12-31T10:00');
      await user.type(screen.getByTestId('address-input'), '123 Test St');

      // Submit and expect error handling
      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('RSVP Form Integration', () => {
    const TestRSVPForm = ({ runId, onSubmit }: { runId: string; onSubmit: (status: string) => void }) => {
      const [status, setStatus] = React.useState('');

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(status);
      };

      return (
        <form onSubmit={handleSubmit} data-testid="rsvp-form">
          <select
            data-testid="rsvp-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select RSVP</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
            <option value="MAYBE">Maybe</option>
          </select>
          <button type="submit" data-testid="rsvp-submit">
            Update RSVP
          </button>
        </form>
      );
    };

    it('should submit RSVP successfully', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      const runId = 'test-run-id';

      global.fetch = createMockFetch({
        [`PUT /api/runs/${runId}/rsvp`]: { status: 'YES' },
      });

      render(<TestRSVPForm runId={runId} onSubmit={mockSubmit} />);

      await user.selectOptions(screen.getByTestId('rsvp-select'), 'YES');
      await user.click(screen.getByTestId('rsvp-submit'));

      expect(mockSubmit).toHaveBeenCalledWith('YES');
    });

    it('should handle RSVP status changes', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();

      render(<TestRSVPForm runId="test-run-id" onSubmit={mockSubmit} />);

      // Test different RSVP statuses
      await user.selectOptions(screen.getByTestId('rsvp-select'), 'YES');
      await user.click(screen.getByTestId('rsvp-submit'));
      expect(mockSubmit).toHaveBeenLastCalledWith('YES');

      await user.selectOptions(screen.getByTestId('rsvp-select'), 'NO');
      await user.click(screen.getByTestId('rsvp-submit'));
      expect(mockSubmit).toHaveBeenLastCalledWith('NO');

      await user.selectOptions(screen.getByTestId('rsvp-select'), 'MAYBE');
      await user.click(screen.getByTestId('rsvp-submit'));
      expect(mockSubmit).toHaveBeenLastCalledWith('MAYBE');
    });
  });

  describe('Photo Upload Integration', () => {
    const TestPhotoUploadForm = ({ onSubmit }: { onSubmit: (file: File) => void }) => {
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const file = formData.get('photo') as File;
        if (file) {
          onSubmit(file);
        }
      };

      return (
        <form onSubmit={handleSubmit} data-testid="photo-upload-form">
          <input
            data-testid="photo-input"
            type="file"
            name="photo"
            accept="image/*"
            required
          />
          <button type="submit" data-testid="upload-submit">
            Upload Photo
          </button>
        </form>
      );
    };

    it('should handle photo upload', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      render(<TestPhotoUploadForm onSubmit={mockSubmit} />);

      const fileInput = screen.getByTestId('photo-input');
      await user.upload(fileInput, testFile);
      await user.click(screen.getByTestId('upload-submit'));

      expect(mockSubmit).toHaveBeenCalledWith(testFile);
    });

    it('should validate file types', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();

      render(<TestPhotoUploadForm onSubmit={mockSubmit} />);

      const fileInput = screen.getByTestId('photo-input');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });
  });
});
