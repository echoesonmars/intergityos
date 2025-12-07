import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/map/defects - Get defects for map visualization
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // const method = searchParams.get('method'); // Reserved for future use
    const criticality = searchParams.get('criticality');

    // Get all defects
    const defectsResponse = await defectsApi.getAll({ limit: 1000 });

    // Filter defects
    let filteredDefects = defectsResponse.defects;

    // Filter by criticality
    if (criticality && criticality !== 'all') {
      filteredDefects = filteredDefects.filter((defect) => {
        const severity = defect.details?.severity || defect.severity || '';
        const mappedCriticality = mapSeverityToCriticality(severity);
        return mappedCriticality === criticality;
      });
    }

    // Transform to map format
    const mapDefects = filteredDefects
      .filter((defect) => {
        const location = defect.details?.location;
        return location && location.latitude && location.longitude;
      })
      .map((defect) => {
        const location = defect.details?.location || {};
        const severity = defect.details?.severity || defect.severity || '';
        
        return {
          id: defect.defect_id || defect.segment_number,
          lat: location.latitude,
          lng: location.longitude,
          criticality: mapSeverityToCriticality(severity),
          severity,
          type: defect.details?.type || '',
          segment: defect.segment_number,
          pipeline: defect.pipeline_id,
        };
      });

    return NextResponse.json(mapDefects);
  } catch (error) {
    console.error('Error fetching map defects:', error);
    return NextResponse.json([]);
  }
}

function mapSeverityToCriticality(severity: string): 'normal' | 'medium' | 'high' {
  const map: Record<string, 'normal' | 'medium' | 'high'> = {
    'критичный': 'high',
    'critical': 'high',
    'высокий': 'high',
    'high': 'high',
    'средний': 'medium',
    'medium': 'medium',
    'низкий': 'normal',
    'low': 'normal',
  };
  return map[severity] || 'normal';
}

