import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Defect {
  id: number;
  pipeline: string;
  status: 'active' | 'fixed' | 'exhausted' | 'rejected';
  method: string;
  riskClass: 'high' | 'medium' | 'low';
  date: string;
}

// Функция для преобразования данных бэкенда в формат фронтенда
function transformDefect(backendDefect: {
  segment_number?: number;
  details?: {
    severity?: string;
    type?: string;
    location?: {
      timestamp?: string;
    };
  };
  severity?: string;
  pipeline_id?: string;
}, index: number): Defect {
  // Маппинг критичности бэкенда на класс риска фронтенда
  const severityToRiskClass: Record<string, 'high' | 'medium' | 'low'> = {
    'критичный': 'high',
    'высокий': 'high',
    'средний': 'medium',
    'низкий': 'low',
    'critical': 'high',
    'high': 'high',
    'medium': 'medium',
    'low': 'low',
  };

  const severity = backendDefect.details?.severity || backendDefect.severity || 'low';
  const riskClass = severityToRiskClass[severity] || 'low';

  // Маппинг типа дефекта на метод
  const typeToMethod: Record<string, string> = {
    'коррозия': 'MFL',
    'сварной шов': 'UT',
    'металлический объект': 'VIK',
  };
  const defectType = backendDefect.details?.type || '';
  const method = typeToMethod[defectType] || 'MFL';

  return {
    id: index + 1,
    pipeline: `TP-${backendDefect.segment_number || 1}`,
    status: 'active', // Бэкенд не возвращает статус, используем дефолт
    method,
    riskClass,
    date: backendDefect.details?.location?.timestamp || new Date().toISOString().split('T')[0],
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pipeline = searchParams.get('pipeline');
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Получаем дефекты из бэкенда
    const backendResponse = await defectsApi.getAll({
      limit: limit * 2, // Берем больше, чтобы после фильтрации хватило
    });

    // Преобразуем дефекты в формат фронтенда
    let transformedDefects = backendResponse.defects.map((defect, index) => 
      transformDefect(defect, index)
    );

    // Применяем фильтры
    if (pipeline && pipeline !== 'all') {
      transformedDefects = transformedDefects.filter((d) => d.pipeline === pipeline);
    }
    if (status && status !== 'all') {
      transformedDefects = transformedDefects.filter((d) => d.status === status);
    }
    if (method && method !== 'all') {
      transformedDefects = transformedDefects.filter((d) => d.method === method);
    }

    // Сортируем по дате (новые сначала)
    transformedDefects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(transformedDefects.slice(0, limit));
  } catch (error) {
    console.error('Error fetching defects:', error);
    
    // Fallback на mock данные если бэкенд недоступен
    const mockDefects: Defect[] = [
      { id: 7, pipeline: 'TP-1', status: 'active', method: 'MFL', riskClass: 'high', date: '2025-04-22' },
      { id: 4, pipeline: 'TP-4', status: 'fixed', method: 'MFL', riskClass: 'low', date: '2025-04-22' },
      { id: 3, pipeline: 'TP-3', status: 'active', method: 'UT', riskClass: 'medium', date: '2025-04-21' },
    ];
    
    return NextResponse.json(mockDefects);
  }
}

