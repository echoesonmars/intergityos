import { NextResponse } from 'next/server';
import { statisticsApi } from '@/lib/api';

// GET /api/dashboard/criticality-distribution - Получить распределение по критичности
export async function GET() {
  try {
    // Получаем статистику из бэкенда
    const backendStats = await statisticsApi.get();
    
    // Преобразуем данные бэкенда в формат фронтенда
    const defectsBySeverity = backendStats.defects_by_severity || {};
    
    const distribution = [
      { 
        label: 'Норма', 
        count: defectsBySeverity['низкий'] || defectsBySeverity['low'] || 0, 
        color: '#28ca42' 
      },
      { 
        label: 'Средняя', 
        count: defectsBySeverity['средний'] || defectsBySeverity['medium'] || 0, 
        color: '#ffbd2e' 
      },
      { 
        label: 'Высокая', 
        count: (defectsBySeverity['высокий'] || defectsBySeverity['high'] || 0) + 
                (defectsBySeverity['критичный'] || defectsBySeverity['critical'] || 0), 
        color: '#dc2626' 
      },
    ];

    return NextResponse.json(distribution, { status: 200 });
  } catch (error) {
    console.error('Error fetching criticality distribution:', error);
    
    // Fallback на mock данные если бэкенд недоступен
    const fallbackDistribution = [
      { label: 'Норма', count: 856, color: '#28ca42' },
      { label: 'Средняя', count: 302, color: '#ffbd2e' },
      { label: 'Высокая', count: 89, color: '#dc2626' },
    ];
    
    return NextResponse.json(fallbackDistribution, { status: 200 });
  }
}

