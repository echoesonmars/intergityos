import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/info - Get system information
 */
export async function GET() {
  try {
    // Note: healthApi.check() calls /health, but we need /info
    // We'll call it directly
    const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${API_BASE_URL}/info`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch system info');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching system info:', error);
    return NextResponse.json(
      { 
        application: 'IntegrityOS',
        version: '1.0.0',
        error: 'Failed to fetch system information' 
      },
      { status: 200 } // Return partial info even on error
    );
  }
}

