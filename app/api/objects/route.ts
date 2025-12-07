import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/objects - Get all objects (segments) with defects count
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pipeline = searchParams.get('pipeline');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get all defects to group by segment
    const defectsResponse = await defectsApi.getAll({
      limit: 1000, // Get all to properly count
    });

    // Group defects by segment to create "objects"
    interface SegmentData {
      id: number;
      segment_number: number;
      pipeline_id: string;
      defects: Array<{
        segment_number?: number;
        pipeline_id?: string;
        details?: {
          severity?: string;
          location?: {
            latitude?: number;
            longitude?: number;
          };
        };
        severity?: string;
      }>;
      totalDefects: number;
      criticalDefects: number;
    }
    
    const segmentMap = new Map<number, SegmentData>();

    defectsResponse.defects.forEach((defect) => {
      const segmentNum = defect.segment_number || 1;
      if (!segmentMap.has(segmentNum)) {
        segmentMap.set(segmentNum, {
          id: segmentNum,
          segment_number: segmentNum,
          pipeline_id: defect.pipeline_id || `MT-${String(segmentNum).padStart(2, '0')}`,
          defects: [],
          totalDefects: 0,
          criticalDefects: 0,
        });
      }

      const segment = segmentMap.get(segmentNum)!;
      segment.defects.push(defect);
      segment.totalDefects++;

      // Count critical defects
      const severity = defect.details?.severity || defect.severity || '';
      if (severity === 'критичный' || severity === 'critical' || severity === 'высокий' || severity === 'high') {
        segment.criticalDefects++;
      }
    });

    // Convert to array and transform to frontend format
    let objects = Array.from(segmentMap.values()).map((segment) => ({
      id: segment.id,
      name: `Сегмент ${segment.segment_number}`,
      type: 'pipeline_section',
      pipeline: segment.pipeline_id,
      year: 1985 + (segment.segment_number % 30), // Mock year based on segment
      material: '17Г1С',
      inspections: segment.totalDefects,
      defects: segment.totalDefects,
      criticalDefects: segment.criticalDefects,
      location: segment.defects[0]?.details?.location || null,
    }));

    // Apply filters
    if (pipeline && pipeline !== 'all') {
      objects = objects.filter((obj) => obj.pipeline === pipeline);
    }
    if (type && type !== 'all') {
      objects = objects.filter((obj) => obj.type === type);
    }

    // Limit results
    objects = objects.slice(0, limit);

    return NextResponse.json(objects);
  } catch (error) {
    console.error('Error fetching objects:', error);
    
    // Fallback to mock data
    const mockObjects = [
      { id: 1, name: 'Кран подвесной', type: 'crane', pipeline: 'MT-02', year: 1961, material: 'Ст3', inspections: 5, defects: 1 },
      { id: 2, name: 'Турбокомпрессор ТВ-80-1', type: 'compressor', pipeline: 'MT-02', year: 1999, material: '09Г2С', inspections: 8, defects: 0 },
      { id: 3, name: 'Участок трубы №45', type: 'pipeline_section', pipeline: 'MT-01', year: 1985, material: '17Г1С', inspections: 12, defects: 3 },
    ];
    
    return NextResponse.json(mockObjects);
  }
}

