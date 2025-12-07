import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }
    
    const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8000';
    
    const authHeader = request.headers.get('Authorization');
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
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

    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/reports/download?filename=${encodeURIComponent(filename)}`,
      { 
        headers,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to download report', details: errorText },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('Content-Disposition') || `attachment; filename="${filename}"`;
    
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });

  } catch (error) {
    console.error('Report download error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
