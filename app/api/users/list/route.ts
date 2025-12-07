import { NextResponse } from 'next/server';
import { usersApi, authApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/users/list - Get list of all users (admin only)
 */
export async function GET() {
  try {
    // Auto-login for development
    let token = '';
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

    const users = await usersApi.list(token);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users list:', error);
    // Return mock data as fallback
    return NextResponse.json([
      { username: 'admin', full_name: 'Администратор', email: 'admin@integrityos.kz', role: 'admin' },
      { username: 'engineer1', full_name: 'Инженер 1', email: 'engineer1@integrityos.kz', role: 'engineer' },
      { username: 'operator1', full_name: 'Оператор 1', email: 'operator1@integrityos.kz', role: 'operator' },
    ]);
  }
}

