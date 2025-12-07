import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/defects/segment/[id] - Get defects by segment
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const segmentId = parseInt(params.id);
    
    if (isNaN(segmentId)) {
      return NextResponse.json(
        { error: 'Invalid segment ID' },
        { status: 400 }
      );
    }

    const defects = await defectsApi.getBySegment(segmentId);
    return NextResponse.json(defects);
  } catch (error) {
    console.error('Error fetching defects by segment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch defects' },
      { status: 500 }
    );
  }
}

