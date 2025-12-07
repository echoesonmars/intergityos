import { NextResponse } from 'next/server';
import { adminApi, authApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/reload - Reload data from CSV
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    // Get token from Authorization header or try auto-login
    const authHeader = request.headers.get('Authorization');
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Auto-login with default admin (for development)
      try {
        const loginResponse = await authApi.login('admin', 'admin');
        token = loginResponse.access_token;
      } catch (loginError: unknown) {
        console.error('Auto-login failed:', loginError);
        const errorMessage = loginError instanceof Error ? loginError.message : 'Failed to authenticate with backend';
        return NextResponse.json(
          { 
            error: 'Authentication required',
            detail: errorMessage
          },
          { status: 401 }
        );
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token available' },
        { status: 401 }
      );
    }

    const result = await adminApi.reload(token);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error reloading data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to reload data';
    const errorDetail = error instanceof Error && 'detail' in error ? String(error.detail) : errorMessage;
    
    return NextResponse.json(
      { 
        error: 'Failed to reload data',
        detail: errorDetail
      },
      { status: 500 }
    );
  }
}

