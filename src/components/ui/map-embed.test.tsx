/**
 * Tests for MapEmbed component
 */

import React from 'react';
import { render, screen, waitFor } from '@/lib/test-data';
import MapEmbed from './map-embed';

// Mock mapbox-gl
const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  addControl: jest.fn(),
  removeControl: jest.fn(),
  getCanvas: jest.fn(() => ({
    style: { cursor: '' },
  })),
  resize: jest.fn(),
  flyTo: jest.fn(),
  setCenter: jest.fn(),
  setZoom: jest.fn(),
};

const mockMarker = {
  setLngLat: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
};

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => mockMap),
  Marker: jest.fn(() => mockMarker),
  NavigationControl: jest.fn(),
}));

describe('MapEmbed Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', async () => {
    render(<MapEmbed />);
    
    const mapContainer = screen.getByTestId('map-embed');
    expect(mapContainer).toBeInTheDocument();
    expect(mapContainer).toHaveAttribute('data-slot', 'map-embed');
  });

  it('should render with custom coordinates', async () => {
    const lat = 40.7128;
    const lng = -74.0060;
    
    render(<MapEmbed lat={lat} lng={lng} />);
    
    await waitFor(() => {
      expect(mockMarker.setLngLat).toHaveBeenCalledWith([lng, lat]);
    });
  });

  it('should render with custom zoom level', async () => {
    const zoom = 15;
    
    render(<MapEmbed zoom={zoom} />);
    
    const mapContainer = screen.getByTestId('map-embed');
    expect(mapContainer).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    render(<MapEmbed />);
    
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
  });

  it('should handle map initialization', async () => {
    render(<MapEmbed />);
    
    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith('load', expect.any(Function));
    });
  });

  it('should add marker when coordinates are provided', async () => {
    const lat = 38.9592;
    const lng = -95.3281;
    
    render(<MapEmbed lat={lat} lng={lng} />);
    
    await waitFor(() => {
      expect(mockMarker.setLngLat).toHaveBeenCalledWith([lng, lat]);
      expect(mockMarker.addTo).toHaveBeenCalled();
    });
  });

  it('should not add marker when coordinates are not provided', async () => {
    render(<MapEmbed />);
    
    await waitFor(() => {
      expect(mockMarker.setLngLat).not.toHaveBeenCalled();
    });
  });

  it('should handle map error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock map initialization to throw an error
    const MapConstructor = require('mapbox-gl').Map;
    MapConstructor.mockImplementationOnce(() => {
      throw new Error('Map initialization failed');
    });
    
    render(<MapEmbed />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load map')).toBeInTheDocument();
    });
    
    consoleError.mockRestore();
  });

  it('should cleanup map on unmount', () => {
    const { unmount } = render(<MapEmbed />);
    
    unmount();
    
    expect(mockMap.remove).toHaveBeenCalled();
  });

  it('should have proper dimensions', () => {
    render(<MapEmbed />);
    
    const mapContainer = screen.getByTestId('map-embed');
    expect(mapContainer).toHaveClass('h-[450px]', 'w-full');
  });

  it('should accept custom className', () => {
    render(<MapEmbed className="custom-map-class" />);
    
    const mapContainer = screen.getByTestId('map-embed');
    expect(mapContainer).toHaveClass('custom-map-class');
  });

  it('should handle address prop', async () => {
    const address = '123 Main St, Lawrence, KS';
    
    render(<MapEmbed address={address} />);
    
    const mapContainer = screen.getByTestId('map-embed');
    expect(mapContainer).toBeInTheDocument();
  });

  it('should update marker when coordinates change', async () => {
    const { rerender } = render(<MapEmbed lat={38.9592} lng={-95.3281} />);
    
    await waitFor(() => {
      expect(mockMarker.setLngLat).toHaveBeenCalledWith([-95.3281, 38.9592]);
    });
    
    // Clear previous calls
    jest.clearAllMocks();
    
    // Update coordinates
    rerender(<MapEmbed lat={40.7128} lng={-74.0060} />);
    
    await waitFor(() => {
      expect(mockMarker.setLngLat).toHaveBeenCalledWith([-74.0060, 40.7128]);
    });
  });

  it('should handle missing Mapbox token gracefully', async () => {
    // Temporarily remove the mocked token
    const originalToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = undefined;
    
    render(<MapEmbed />);
    
    await waitFor(() => {
      expect(screen.getByText('Map configuration error')).toBeInTheDocument();
    });
    
    // Restore the token
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = originalToken;
  });

  it('should be accessible', () => {
    render(<MapEmbed />);
    
    const mapContainer = screen.getByTestId('map-embed');
    expect(mapContainer).toHaveAttribute('role', 'img');
    expect(mapContainer).toHaveAttribute('aria-label');
  });

  it('should handle resize events', async () => {
    render(<MapEmbed />);
    
    // Simulate window resize
    global.dispatchEvent(new Event('resize'));
    
    await waitFor(() => {
      expect(mockMap.resize).toHaveBeenCalled();
    });
  });

  it('should use constants for default values', () => {
    render(<MapEmbed />);
    
    const mapContainer = screen.getByTestId('map-embed');
    // Verify that default dimensions from constants are applied
    expect(mapContainer).toHaveClass('h-[450px]'); // MAP_DIMENSIONS.EMBED_HEIGHT
  });

  it('should handle navigation controls', async () => {
    render(<MapEmbed />);
    
    await waitFor(() => {
      expect(mockMap.addControl).toHaveBeenCalled();
    });
  });

  it('should handle map style loading', async () => {
    render(<MapEmbed />);
    
    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith('load', expect.any(Function));
      expect(mockMap.on).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });
});
