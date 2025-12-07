import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/export/json - Export defects to JSON
 * Note: This requires authentication in the backend, but we'll proxy it
 */
export async function GET(request: Request) {
  try {
    // Get token from cookies or headers (if available)
    // For now, we'll try to call backend directly
    // In production, you should get token from session/cookies
    
    const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8000';
    
    // Try to get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Try to login with default admin (for development)
      // In production, use proper session management
      try {
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'admin', password: 'admin' }),
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          token = loginData.access_token;
        }
      } catch (e) {
        console.error('Auto-login failed:', e);
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call backend export endpoint
    const response = await fetch(`${API_BASE_URL}/export/json`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export data');
    }

    // Get the file blob
    const blob = await response.blob();
    
    // Return as downloadable file
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="defects_export.json"',
      },
    });
  } catch (error) {
    console.error('Error exporting JSON:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

