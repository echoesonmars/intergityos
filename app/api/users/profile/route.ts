import { NextResponse } from 'next/server';
import { usersApi, authApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/users/profile - Get current user profile
 */
export async function GET() {
  try {
    // Auto-login for development (in production, get from session)
    let token = '';
    const username = 'admin';
    
    try {
      const loginResponse = await authApi.login('admin', 'admin');
      token = loginResponse.access_token;
    } catch (error) {
      console.error('Auto-login failed:', error);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const profile = await usersApi.getProfile(token, username);
    return NextResponse.json(profile);
  } catch (error: unknown) {
    console.error('Error fetching user profile:', error);
    // Return default profile if not found
    return NextResponse.json({
      username: 'admin',
      full_name: 'Администратор',
      email: 'admin@integrityos.kz',
      phone: '',
      organization: '',
      position: '',
      department: '',
    });
  }
}

/**
 * PUT /api/users/profile - Update current user profile
 */
export async function PUT(request: Request) {
  try {
    // Auto-login for development
    let token = '';
    const username = 'admin';
    
    try {
      const loginResponse = await authApi.login('admin', 'admin');
      token = loginResponse.access_token;
    } catch (error) {
      console.error('Auto-login failed:', error);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updated = await usersApi.updateProfile(token, username, body);

    if (updated) {
      const profile = await usersApi.getProfile(token, username);
      return NextResponse.json(profile);
    } else {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error updating user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json(
      { error: 'Failed to update profile', detail: errorMessage },
      { status: 500 }
    );
  }
}

