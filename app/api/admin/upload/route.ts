import { NextResponse } from 'next/server';
import { authApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

/**
 * POST /api/admin/upload - Upload CSV/XLSX files
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

    // Get form data from request
    const formData = await request.formData();
    
    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend upload error:', errorText);
      return NextResponse.json(
        { error: 'Upload failed', detail: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error uploading files:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload files';
    
    return NextResponse.json(
      { 
        error: 'Failed to upload files',
        detail: errorMessage
      },
      { status: 500 }
    );
  }
}
