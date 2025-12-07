import { NextResponse } from 'next/server';
import { auditLogsApi, authApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/audit-logs - Get audit logs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const entityType = searchParams.get('entity_type');
    const limit = parseInt(searchParams.get('limit') || '100');

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

    const logs = await auditLogsApi.getAll(token, { 
      action: action || undefined, 
      entity_type: entityType || undefined, 
      limit 
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

