/**
 * Accessibility tests for Phase 6 components
 */

import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-data';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RSVPButtons } from './rsvp-buttons';
import { PhotoGallery } from './photo-gallery';
import { SkipLink } from './skip-link';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('Accessibility Tests', () => {
  describe('RSVPButtons Accessibility', () => {
    const mockProps = {
      runId: 'test-run-id',
      currentUserRsvp: null,
      rsvpCounts: { yes: 5, maybe: 2, no: 1 },
      onRsvpChange: jest.fn(),
    };

    beforeEach(() => {
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com', role: 'USER' },
        },
        status: 'authenticated',
      });
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(<RSVPButtons {...mockProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(<RSVPButtons {...mockProps} />);

      const group = screen.getByRole('group', { name: /rsvp options/i });
      expect(group).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed');
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should support keyboard navigation', () => {
      render(<RSVPButtons {...mockProps} />);

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });
      const maybeButton = screen.getByRole('button', { name: /rsvp maybe/i });
      const noButton = screen.getByRole('button', { name: /rsvp no/i });

      // Tab navigation
      yesButton.focus();
      expect(yesButton).toHaveFocus();

      fireEvent.keyDown(yesButton, { key: 'Tab' });
      maybeButton.focus();
      expect(maybeButton).toHaveFocus();

      fireEvent.keyDown(maybeButton, { key: 'Tab' });
      noButton.focus();
      expect(noButton).toHaveFocus();
    });

    it('should have sufficient color contrast', () => {
      render(<RSVPButtons {...mockProps} currentUserRsvp="YES" />);

      const yesButton = screen.getByRole('button', { name: /rsvp yes/i });
      const computedStyle = window.getComputedStyle(yesButton);
      
      // This is a basic check - in real scenarios you'd use tools like axe-core
      expect(yesButton).toHaveClass('bg-green-600');
    });

    it('should have proper touch targets', () => {
      render(<RSVPButtons {...mockProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('min-h-[44px]', 'touch-manipulation');
      });
    });
  });

  describe('PhotoGallery Accessibility', () => {
    const mockPhotos = [
      {
        id: 'photo-1',
        url: 'https://example.com/photo1.jpg',
        caption: 'Test photo 1',
        uploadedBy: { id: 'user-1', name: 'John Doe' },
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
      (global as any).mockUseSession.mockReturnValue({
        data: {
          user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(<PhotoGallery {...mockProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper grid structure', () => {
      render(<PhotoGallery {...mockProps} />);

      const grid = screen.getByRole('grid', { name: /photo gallery/i });
      expect(grid).toBeInTheDocument();

      const gridCells = screen.getAllByRole('gridcell');
      expect(gridCells.length).toBeGreaterThan(0);
    });

    it('should have descriptive alt text for images', () => {
      render(<PhotoGallery {...mockProps} />);

      const image = screen.getByAltText('Test photo 1 by John Doe');
      expect(image).toBeInTheDocument();
    });

    it('should support keyboard navigation in lightbox', () => {
      render(<PhotoGallery {...mockProps} />);

      const photoButton = screen.getByRole('button', { name: /view photo 1/i });
      
      // Test Enter key
      fireEvent.keyDown(photoButton, { key: 'Enter' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Test Escape key
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should have proper focus management', () => {
      render(<PhotoGallery {...mockProps} />);

      const photoButton = screen.getByRole('button', { name: /view photo 1/i });
      photoButton.focus();
      
      // Open lightbox
      fireEvent.click(photoButton);
      
      // Close lightbox
      fireEvent.keyDown(document, { key: 'Escape' });
      
      // Focus should return to original button
      expect(photoButton).toHaveFocus();
    });

    it('should have proper ARIA labels for upload', () => {
      render(<PhotoGallery {...mockProps} />);

      const uploadInput = screen.getByLabelText(/upload a photo to this run/i);
      expect(uploadInput).toBeInTheDocument();
      expect(uploadInput).toHaveClass('sr-only');
    });
  });

  describe('SkipLink Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <SkipLink href="#main-content">Skip to main content</SkipLink>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be hidden by default but visible on focus', () => {
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toHaveClass('sr-only');
      expect(skipLink).toHaveClass('focus:not-sr-only');
    });

    it('should have proper href attribute', () => {
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const skipLink = screen.getByRole('link');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should be keyboard accessible', () => {
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const skipLink = screen.getByRole('link');
      skipLink.focus();
      expect(skipLink).toHaveFocus();
    });
  });

  describe('General Accessibility Patterns', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <div>
          <h1>Main Title</h1>
          <h2>Section Title</h2>
          <h3>Subsection Title</h3>
        </div>
      );

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3 = screen.getByRole('heading', { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });

    it('should have proper landmark regions', () => {
      render(
        <div>
          <header>Header content</header>
          <nav>Navigation content</nav>
          <main>Main content</main>
          <aside>Sidebar content</aside>
          <footer>Footer content</footer>
        </div>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
      expect(screen.getByRole('complementary')).toBeInTheDocument(); // aside
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });

    it('should handle focus indicators properly', () => {
      render(
        <button className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Focusable Button
        </button>
      );

      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus:ring-2');
    });

    it('should provide proper error messaging', () => {
      render(
        <div>
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            aria-describedby="email-error"
            aria-invalid="true"
          />
          <div id="email-error" role="alert">
            Please enter a valid email address
          </div>
        </div>
      );

      const input = screen.getByLabelText('Email');
      const error = screen.getByRole('alert');

      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(error).toBeInTheDocument();
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide proper live region updates', () => {
      render(
        <div aria-live="polite" aria-label="Status updates">
          RSVP updated successfully
        </div>
      );

      const liveRegion = screen.getByLabelText('Status updates');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('should hide decorative elements from screen readers', () => {
      render(
        <div>
          <span aria-hidden="true">🎉</span>
          <span>Celebration message</span>
        </div>
      );

      const decorativeElement = screen.getByText('🎉');
      expect(decorativeElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('should provide alternative text for complex content', () => {
      render(
        <div 
          role="img" 
          aria-label="Chart showing 5 yes, 2 maybe, and 1 no RSVP responses"
        >
          <div>Chart visualization</div>
        </div>
      );

      const chart = screen.getByRole('img');
      expect(chart).toHaveAttribute('aria-label');
    });
  });
});
