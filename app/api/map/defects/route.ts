import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/map/defects - Get defects for map visualization
 * Supports filters: criticality, date_from, date_to, depth_min, depth_max, distance_min, distance_max
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // const method = searchParams.get('method'); // Reserved for future use
    const criticality = searchParams.get('criticality');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const depthMin = searchParams.get('depth_min');
    const depthMax = searchParams.get('depth_max');
    const distanceMin = searchParams.get('distance_min');
    const distanceMax = searchParams.get('distance_max');

    // Get all defects
    const defectsResponse = await defectsApi.getAll({ limit: 1000 });

    // Filter defects
    let filteredDefects = defectsResponse.defects;

    // Filter by criticality
    if (criticality && criticality !== 'all') {
      filteredDefects = filteredDefects.filter((defect) => {
        const severity = defect.severity || defect.details?.severity || '';
        const mappedCriticality = mapSeverityToCriticality(severity);
        return mappedCriticality === criticality;
      });
    }

    // Filter by date range (if created_at exists)
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredDefects = filteredDefects.filter((defect) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createdAt = (defect as any).created_at;
        if (!createdAt) return true; // Include if no date
        return new Date(createdAt) >= fromDate;
      });
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filteredDefects = filteredDefects.filter((defect) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createdAt = (defect as any).created_at;
        if (!createdAt) return true; // Include if no date
        return new Date(createdAt) <= toDate;
      });
    }

    // Filter by depth range
    if (depthMin !== null) {
      const min = parseFloat(depthMin);
      if (!isNaN(min)) {
        filteredDefects = filteredDefects.filter((defect) => {
          const depth = defect.details?.parameters?.depth_percent;
          return depth === undefined || depth === null || depth >= min;
        });
      }
    }
    if (depthMax !== null) {
      const max = parseFloat(depthMax);
      if (!isNaN(max)) {
        filteredDefects = filteredDefects.filter((defect) => {
          const depth = defect.details?.parameters?.depth_percent;
          return depth === undefined || depth === null || depth <= max;
        });
      }
    }

    // Filter by distance range
    if (distanceMin !== null) {
      const min = parseFloat(distanceMin);
      if (!isNaN(min)) {
        filteredDefects = filteredDefects.filter((defect) => {
          const distance = defect.measurement_distance_m;
          return distance === undefined || distance === null || distance >= min;
        });
      }
    }
    if (distanceMax !== null) {
      const max = parseFloat(distanceMax);
      if (!isNaN(max)) {
        filteredDefects = filteredDefects.filter((defect) => {
          const distance = defect.measurement_distance_m;
          return distance === undefined || distance === null || distance <= max;
        });
      }
    }

    // Transform to map format
    const mapDefects = filteredDefects
      .filter((defect) => {
        const location = defect.details?.location;
        return location && location.latitude && location.longitude;
      })
      .map((defect) => {
        const location = defect.details?.location || {};
        const severity = defect.severity || defect.details?.severity || '';
        
        return {
          id: defect.defect_id || defect.segment_number,
          lat: location.latitude,
          lng: location.longitude,
          criticality: mapSeverityToCriticality(severity),
          severity,
          type: defect.details?.type || '',
          segment: defect.segment_number,
          pipeline: defect.pipeline_id,
          depth: defect.details?.parameters?.depth_percent,
          distance: defect.measurement_distance_m,
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

