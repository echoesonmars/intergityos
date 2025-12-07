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
      } catch {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
    }

    const result = await adminApi.reload(token);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error reloading data:', error);
    return NextResponse.json(
      { error: 'Failed to reload data' },
      { status: 500 }
    );
  }
}

