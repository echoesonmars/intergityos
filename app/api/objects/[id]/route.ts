import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * GET /api/objects/[id] - Get object details by ID (segment number)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const segmentId = parseInt(id);
    
    console.log(`[API] Fetching object with segment ID: ${segmentId}, backend: ${BACKEND_URL}`);
    
    if (isNaN(segmentId)) {
      return NextResponse.json(
        { error: 'Invalid object ID' },
        { status: 400 }
      );
    }

    // Fetch directly from backend
    const url = `${BACKEND_URL}/defects?segment=${segmentId}&limit=1000`;
    console.log(`[API] Fetching: ${url}`);
    
    const response = await fetch(url);
    const defectsResponse = await response.json();
    
    console.log(`[API] Got ${defectsResponse.defects?.length || 0} defects for segment ${segmentId}`);

    if (!defectsResponse.defects || defectsResponse.defects.length === 0) {
      return NextResponse.json(
        { error: 'Object not found' },
        { status: 404 }
      );
    }
    
    const defectsData = defectsResponse.defects;

    // Get first defect for location and pipeline info
    const firstDefect = defectsData[0];
    const location = firstDefect.details?.location || { latitude: 0, longitude: 0, altitude: 0 };
    
    // Get source file from defects (use the most common one or first one)
    const sourceFiles = defectsResponse.defects
      .map((d: { source_file?: string | null }) => d.source_file)
      .filter((f: string | null | undefined): f is string => f !== null && f !== undefined);
    const sourceFile = sourceFiles.length > 0 ? sourceFiles[0] : undefined;

    // Calculate statistics
    const totalDefects = defectsData.length;
    const criticalDefects = defectsData.filter((d: { details?: { severity?: string }; severity?: string }) => {
      const severity = d.details?.severity || d.severity || '';
      return severity === 'критичный' || severity === 'critical' || severity === 'высокий' || severity === 'high';
    }).length;

    // Determine criticality based on defects
    let criticality = 'normal';
    if (criticalDefects > 0) {
      criticality = 'high';
    } else if (totalDefects > 5) {
      criticality = 'medium';
    }

    // Transform defects to inspections format
    const inspections = defectsData.map((defect: { details?: { location?: { timestamp?: string }; type?: string; severity?: string; parameters?: { depth_percent?: number; length_mm?: number; width_mm?: number } } }, index: number) => ({
      id: index + 1,
      date: defect.details?.location?.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0],
      method: getMethodFromDefectType(defect.details?.type || ''),
      defectFound: true,
      qualityGrade: getQualityGrade(defect.details?.severity || ''),
      param1: defect.details?.parameters?.depth_percent || 0,
      param2: defect.details?.parameters?.length_mm || 0,
      param3: defect.details?.parameters?.width_mm || 0,
    }));

    // Transform defects to defects format
    const defects = defectsData.map((defect: { details?: { location?: { timestamp?: string }; type?: string; severity?: string; parameters?: { depth_mm?: number; length_mm?: number; width_mm?: number } } }, index: number) => ({
      id: index + 1,
      date: defect.details?.location?.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0],
      description: defect.details?.type || 'Дефект',
      depth: defect.details?.parameters?.depth_mm || 0,
      length: defect.details?.parameters?.length_mm || 0,
      width: defect.details?.parameters?.width_mm || 0,
      criticality: mapSeverityToCriticality(defect.details?.severity || ''),
    }));

    // Generate recommendations based on defects
    const recommendations: string[] = [];
    if (criticalDefects > 0) {
      recommendations.push('Требуется немедленный ремонт');
    }
    if (totalDefects > 10) {
      recommendations.push('Плановый ремонт в Q2 2024');
    }
    if (totalDefects > 0) {
      recommendations.push('Усиленный контроль');
    }

    const object = {
      id: segmentId,
      name: `Сегмент ${segmentId}`,
      type: 'pipeline_section',
      pipeline: firstDefect.pipeline_id || `MT-${String(segmentId).padStart(2, '0')}`,
      lat: location.latitude || 52.96,
      lon: location.longitude || 63.12,
      year: 1985 + (segmentId % 30),
      material: '17Г1С',
      criticality,
      sourceFile,
      inspections,
      defects,
      recommendations,
    };

    return NextResponse.json(object);
  } catch (error) {
    console.error('Error fetching object details:', error);
    
    // Fallback to mock data
    const mockObject = {
      id: 1,
      name: 'Кран подвесной',
      type: 'crane',
      pipeline: 'MT-02',
      lat: 52.96,
      lon: 63.12,
      year: 1961,
      material: 'Ст3',
      criticality: 'medium',
      inspections: [
        { id: 1, date: '2024-01-15', method: 'VIK', defectFound: true, qualityGrade: 'требует_мер', param1: 2.5, param2: 15, param3: 0.8 },
      ],
      defects: [
        { id: 1, date: '2024-01-15', description: 'Коррозия стенки', depth: 2.5, length: 15, width: 0.8, criticality: 'medium' },
      ],
      recommendations: ['Плановый ремонт в Q2 2024', 'Усиленный контроль'],
    };
    
    return NextResponse.json(mockObject);
  }
}

function getMethodFromDefectType(type: string): string {
  const typeMap: Record<string, string> = {
    'коррозия': 'MFL',
    'сварной шов': 'UT',
    'металлический объект': 'VIK',
  };
  return typeMap[type] || 'MFL';
}

function getQualityGrade(severity: string): string {
  const gradeMap: Record<string, string> = {
    'критичный': 'требует_мер',
    'critical': 'требует_мер',
    'высокий': 'требует_мер',
    'high': 'требует_мер',
    'средний': 'допустимо',
    'medium': 'допустимо',
    'низкий': 'удовлетворительно',
    'low': 'удовлетворительно',
  };
  return gradeMap[severity] || 'удовлетворительно';
}

function mapSeverityToCriticality(severity: string): string {
  const map: Record<string, string> = {
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

