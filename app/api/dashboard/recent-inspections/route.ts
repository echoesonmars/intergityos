import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

// Указываем, что route динамический (использует request)
export const dynamic = 'force-dynamic';

// GET /api/dashboard/recent-inspections - Получить последние обследования
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    // Get recent defects
    const defectsResponse = await defectsApi.getAll({ limit: limit * 2 });

    // Map defect types to methods
    const typeToMethod: Record<string, string> = {
      'коррозия': 'MFL',
      'сварной шов': 'UT',
      'металлический объект': 'VIK',
      'трещина': 'UT',
      'вмятина': 'VIK',
      'расслоение': 'UT',
      'царапина': 'VIK',
      'выработка': 'MFL',
      'потеря металла': 'MFL',
      'деформация': 'VIK',
    };

    // Transform defects to inspections
    const inspections = defectsResponse.defects.slice(0, limit).map((defect, index) => {
      const defectType = defect.details?.type || '';
      const method = typeToMethod[defectType] || 'MFL';
      const severity = defect.details?.severity || defect.severity || '';
      const criticality = mapSeverityToCriticality(severity);
      const date = defect.details?.location?.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0];

      return {
        id: index + 1,
        objectName: `Сегмент ${defect.segment_number}`,
        method,
        date,
        defectFound: criticality !== 'normal',
        criticality,
      };
    });

    return NextResponse.json(inspections, { status: 200 });
  } catch (error) {
    console.error('Error fetching recent inspections:', error);
    
    // Fallback to mock data
    return NextResponse.json([
      {
        id: 1,
        objectName: 'Кран подвесной',
        method: 'VIK',
        date: new Date().toISOString().split('T')[0],
        defectFound: true,
        criticality: 'medium',
      },
    ], { status: 200 });
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

