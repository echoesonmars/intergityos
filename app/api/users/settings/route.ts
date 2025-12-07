import { NextResponse } from 'next/server';
import { usersApi, authApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/users/settings - Get current user settings
 */
export async function GET() {
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

    const settings = await usersApi.getSettings(token, username);
    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error('Error fetching user settings:', error);
    // Return default settings if not found
    return NextResponse.json({
      username: 'admin',
      theme: 'light',
      language: 'ru',
      units: 'metric',
    });
  }
}

/**
 * PUT /api/users/settings - Update current user settings
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
    const updated = await usersApi.updateSettings(token, username, body);

    if (updated) {
      const settings = await usersApi.getSettings(token, username);
      return NextResponse.json(settings);
    } else {
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error updating user settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json(
      { error: 'Failed to update settings', detail: errorMessage },
      { status: 500 }
    );
  }
}

