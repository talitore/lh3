import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

import { getMapboxSecretToken } from '@/lib/config/env';

// Import error classes
import { NoGeocodingResultsError, MapboxTokenError } from '@/lib/errors';

export interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
  provider: 'mapbox' | 'manual';
}

/**
 * Geocode an address to coordinates using Mapbox Geocoding API
 *
 * @param address - The address to geocode
 * @returns A promise that resolves to a GeocodeResult object
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  try {
    const mapboxToken = getMapboxSecretToken();

    if (!mapboxToken) {
      throw new MapboxTokenError(true);
    }

    const baseClient = mbxClient({ accessToken: mapboxToken });
    const geocodingService = mbxGeocoding(baseClient);

    const response = await geocodingService
      .forwardGeocode({
        query: address,
        limit: 1,
      })
      .send();

    const features = response.body.features;

    if (!features || features.length === 0) {
      throw new NoGeocodingResultsError();
    }

    const [feature] = features;
    const [lng, lat] = feature.center;

    return {
      address: feature.place_name,
      lat,
      lng,
      provider: 'mapbox',
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
}

/**
 * Validate and normalize an address using Mapbox Geocoding API
 *
 * @param address - The address to validate
 * @returns A promise that resolves to a validated and normalized address string
 */
export async function validateAddress(address: string): Promise<string> {
  try {
    const result = await geocodeAddress(address);
    return result.address;
  } catch (error) {
    console.error('Error validating address:', error);
    throw error;
  }
}

/**
 * Create a GeocodeResult from manual coordinates
 *
 * @param lat - Latitude
 * @param lng - Longitude
 * @param address - Optional address string
 * @returns A GeocodeResult object
 */
export function createManualGeocodeResult(
  lat: number,
  lng: number,
  address: string = 'Custom Location'
): GeocodeResult {
  return {
    address,
    lat,
    lng,
    provider: 'manual',
  };
}
