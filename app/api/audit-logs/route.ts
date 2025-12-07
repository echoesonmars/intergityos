import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Helper function to get admin token
 */
async function getAdminToken(): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin',
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to authenticate');
  }
  
  const data = await response.json();
  return data.access_token;
}

/**
 * GET /api/audit-logs - Get audit logs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const limit = searchParams.get('limit') || '100';

    console.log('[audit-logs] Fetching audit logs...');
    
    const token = await getAdminToken();
    console.log('[audit-logs] Got token:', token ? 'yes' : 'no');
    
    // Build query params
    const params = new URLSearchParams();
    if (action && action !== 'all') params.append('action', action);
    params.append('limit', limit);
    
    const url = `${BACKEND_URL}/audit-logs?${params.toString()}`;
    console.log('[audit-logs] Fetching from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('[audit-logs] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[audit-logs] Error response:', errorText);
      throw new Error('Failed to fetch audit logs');
    }
    
    const logs = await response.json();
    console.log('[audit-logs] Got logs:', logs.length);
    
    // Transform backend logs to frontend format
    const transformedLogs = logs.map((log: {
      log_id?: string;
      user: string;
      action: string;
      entity: string;
      entity_name: string;
      entity_id?: string;
      ip_address?: string;
      created_at: string;
    }) => ({
      log_id: log.log_id,
      username: log.user,
      action: log.action,
      entity_type: log.entity,
      entity_id: log.entity_id || log.entity_name,
      timestamp: log.created_at,
      ip_address: log.ip_address,
    }));
    
    return NextResponse.json(transformedLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

