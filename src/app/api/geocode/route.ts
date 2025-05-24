import { NextRequest, NextResponse } from 'next/server';
import { geocodeAddress, validateAddress } from '@/lib/services/geocode-service';

/**
 * POST /api/geocode
 * 
 * Geocode an address to coordinates using server-side Mapbox API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, action = 'geocode' } = body;

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Address is required and must be a string' },
        { status: 400 }
      );
    }

    if (action === 'validate') {
      const validatedAddress = await validateAddress(address);
      return NextResponse.json({ address: validatedAddress });
    } else {
      const result = await geocodeAddress(address);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Geocoding API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/geocode
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Geocoding API is running',
    endpoints: {
      POST: 'Geocode an address to coordinates',
    }
  });
}
