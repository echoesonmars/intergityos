import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/defects/type/[type] - Get defects by type
 */
export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const defects = await defectsApi.getByType(params.type);
    return NextResponse.json(defects);
  } catch (error) {
    console.error('Error fetching defects by type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch defects' },
      { status: 500 }
    );
  }
}

