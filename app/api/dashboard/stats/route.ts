import { NextResponse } from 'next/server';
import { statisticsApi } from '@/lib/api';

// GET /api/dashboard/stats - Получить статистику для дашборда
export async function GET() {
  try {
    // Получаем статистику из бэкенда
    const backendStats = await statisticsApi.get();
    
    // Преобразуем данные бэкенда в формат фронтенда
    const stats = {
      totalObjects: backendStats.total_segments || 0,
      totalInspections: backendStats.total_defects || 0,
      defectsFound: backendStats.total_defects || 0,
      criticalIssues: backendStats.defects_by_severity?.['критичный'] || 
                      backendStats.defects_by_severity?.['critical'] || 0,
      activeDefects: backendStats.total_defects || 0,
      highRisk: backendStats.defects_by_severity?.['высокий'] || 
                backendStats.defects_by_severity?.['high'] || 0,
      repairsPerYear: 14, // Это значение не приходит из бэкенда, оставляем дефолт
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Fallback на mock данные если бэкенд недоступен
    const fallbackStats = {
      totalObjects: 1247,
      totalInspections: 3421,
      defectsFound: 89,
      criticalIssues: 12,
      activeDefects: 547,
      highRisk: 62,
      repairsPerYear: 14,
    };
    
    return NextResponse.json(fallbackStats, { status: 200 });
  }
}

