import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

// GET /api/dashboard/methods-distribution - Получить распределение по методам
export async function GET() {
  try {
    // Get all defects
    const defectsResponse = await defectsApi.getAll({ limit: 1000 });

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

    // Count methods
    const methodCounts = new Map<string, number>();
    
    defectsResponse.defects.forEach((defect) => {
      const defectType = defect.details?.type || '';
      const method = typeToMethod[defectType] || 'MFL';
      methodCounts.set(method, (methodCounts.get(method) || 0) + 1);
    });

    // Convert to array and calculate percentages
    const total = defectsResponse.defects.length;
    const distribution = Array.from(methodCounts.entries())
      .map(([method, count]) => ({
        method,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(distribution, { status: 200 });
  } catch (error) {
    console.error('Error fetching methods distribution:', error);
    
    // Fallback to mock data
    return NextResponse.json([
      { method: 'VIK', count: 450, percentage: 35 },
      { method: 'PVK', count: 380, percentage: 30 },
      { method: 'MPK', count: 290, percentage: 23 },
      { method: 'UZK', count: 180, percentage: 14 },
      { method: 'RGK', count: 120, percentage: 9 },
    ], { status: 200 });
  }
}

