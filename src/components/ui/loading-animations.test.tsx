/**
 * Tests for Loading Animations components
 */

import React from 'react';
import { render, screen } from '@/lib/test-data';
import {
  Spinner,
  Pulse,
  FadeIn,
  SlideIn,
  SuccessAnimation,
  LoadingDots
} from './loading-animations';

describe('Loading Animations Components', () => {
  describe('Spinner', () => {
    it('should render with default size', () => {
      render(<Spinner />);

      const spinner = screen.getByRole('status', { name: /loading/i });
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('h-6', 'w-6', 'animate-spin');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Spinner size="sm" />);
      let spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-4', 'w-4');

      rerender(<Spinner size="lg" />);
      spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-8', 'w-8');
    });

    it('should accept custom className', () => {
      render(<Spinner className="text-blue-500" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-blue-500');
    });

    it('should have proper accessibility attributes', () => {
      render(<Spinner />);

      const spinner = screen.getByRole('status', { name: /loading/i });
      expect(spinner).toHaveAttribute('aria-label', 'Loading');

      const srText = screen.getByText('Loading...');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Pulse', () => {
    it('should render with pulse animation', () => {
      render(
        <Pulse>
          <div>Pulsing content</div>
        </Pulse>
      );

      const pulseContainer = screen.getByText('Pulsing content').parentElement;
      expect(pulseContainer).toHaveClass('animate-pulse');
    });

    it('should accept custom className', () => {
      render(
        <Pulse className="custom-pulse">
          <div>Content</div>
        </Pulse>
      );

      const pulseContainer = screen.getByText('Content').parentElement;
      expect(pulseContainer).toHaveClass('animate-pulse', 'custom-pulse');
    });
  });

  describe('FadeIn', () => {
    it('should render with fade-in animation', () => {
      render(
        <FadeIn>
          <div>Fading content</div>
        </FadeIn>
      );

      const fadeContainer = screen.getByText('Fading content').parentElement;
      expect(fadeContainer).toHaveClass('animate-in', 'fade-in', 'duration-500');
    });

    it('should apply custom delay', () => {
      render(
        <FadeIn delay={300}>
          <div>Delayed content</div>
        </FadeIn>
      );

      const fadeContainer = screen.getByText('Delayed content').parentElement;
      expect(fadeContainer).toHaveStyle('animation-delay: 300ms');
    });

    it('should accept custom className', () => {
      render(
        <FadeIn className="custom-fade">
          <div>Content</div>
        </FadeIn>
      );

      const fadeContainer = screen.getByText('Content').parentElement;
      expect(fadeContainer).toHaveClass('custom-fade');
    });
  });

  describe('SlideIn', () => {
    it('should render with default slide-up animation', () => {
      render(
        <SlideIn>
          <div>Sliding content</div>
        </SlideIn>
      );

      const slideContainer = screen.getByText('Sliding content').parentElement;
      expect(slideContainer).toHaveClass('animate-in', 'slide-in-from-bottom-4', 'duration-500');
    });

    it('should support different directions', () => {
      const { rerender } = render(
        <SlideIn direction="down">
          <div>Content</div>
        </SlideIn>
      );

      let slideContainer = screen.getByText('Content').parentElement;
      expect(slideContainer).toHaveClass('slide-in-from-top-4');

      rerender(
        <SlideIn direction="left">
          <div>Content</div>
        </SlideIn>
      );

      slideContainer = screen.getByText('Content').parentElement;
      expect(slideContainer).toHaveClass('slide-in-from-right-4');

      rerender(
        <SlideIn direction="right">
          <div>Content</div>
        </SlideIn>
      );

      slideContainer = screen.getByText('Content').parentElement;
      expect(slideContainer).toHaveClass('slide-in-from-left-4');
    });

    it('should apply custom delay', () => {
      render(
        <SlideIn delay={200}>
          <div>Delayed slide</div>
        </SlideIn>
      );

      const slideContainer = screen.getByText('Delayed slide').parentElement;
      expect(slideContainer).toHaveStyle('animation-delay: 200ms');
    });
  });

  describe('SuccessAnimation', () => {
    it('should render success checkmark with animations', () => {
      const { container } = render(<SuccessAnimation />);

      // Check for the main container
      const mainContainer = container.querySelector('.relative');
      expect(mainContainer).toBeInTheDocument();

      // Check for the checkmark SVG
      const checkmark = container.querySelector('svg');
      expect(checkmark).toBeInTheDocument();

      // Check for animation classes
      const animatedContainer = container.querySelector('.animate-in.zoom-in');
      expect(animatedContainer).toBeInTheDocument();

      // Check for ping effect
      const pingElement = container.querySelector('.animate-ping');
      expect(pingElement).toBeInTheDocument();
    });

    it('should accept custom className', () => {
      const { container } = render(<SuccessAnimation className="custom-success" />);

      const mainContainer = container.querySelector('.relative');
      expect(mainContainer).toHaveClass('custom-success');
    });

    it('should have proper styling for success state', () => {
      const { container } = render(<SuccessAnimation />);

      const greenCircle = container.querySelector('.bg-green-100');
      expect(greenCircle).toBeInTheDocument();
      expect(greenCircle).toHaveClass('rounded-full', 'flex', 'items-center', 'justify-center');

      const checkmark = container.querySelector('svg');
      expect(checkmark).toHaveClass('text-green-600');
    });
  });

  describe('LoadingDots', () => {
    it('should render three animated dots', () => {
      const { container } = render(<LoadingDots />);

      const dotsContainer = container.querySelector('.flex.space-x-1');
      expect(dotsContainer).toBeInTheDocument();
      expect(dotsContainer).toHaveClass('flex', 'space-x-1');

      const dots = container.querySelectorAll('.animate-bounce');
      expect(dots).toHaveLength(3);
    });

    it('should have staggered animation delays', () => {
      const { container } = render(<LoadingDots />);

      const dots = container.querySelectorAll('.animate-bounce');

      expect(dots[0]).toHaveStyle('animation-delay: 0ms');
      expect(dots[1]).toHaveStyle('animation-delay: 150ms');
      expect(dots[2]).toHaveStyle('animation-delay: 300ms');
    });

    it('should accept custom className', () => {
      const { container } = render(<LoadingDots className="text-blue-500" />);

      const dotsContainer = container.querySelector('.flex.space-x-1');
      expect(dotsContainer).toHaveClass('text-blue-500');
    });

    it('should have proper dot styling', () => {
      const { container } = render(<LoadingDots />);

      const dots = container.querySelectorAll('.h-2.w-2.bg-current.rounded-full');
      expect(dots).toHaveLength(3);
    });
  });

  describe('Animation integration', () => {
    it('should work together in complex layouts', () => {
      const { container } = render(
        <div>
          <FadeIn delay={0}>
            <Spinner size="sm" />
          </FadeIn>
          <SlideIn direction="up" delay={100}>
            <LoadingDots />
          </SlideIn>
          <Pulse>
            <SuccessAnimation />
          </Pulse>
        </div>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument(); // SuccessAnimation SVG
      expect(container.querySelectorAll('.animate-bounce')).toHaveLength(3); // LoadingDots
    });
  });
});
