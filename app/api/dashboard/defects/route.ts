import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Defect {
  id: number;
  pipeline: string;
  status: 'active' | 'fixed' | 'exhausted' | 'rejected';
  method: string;
  riskClass: 'high' | 'medium' | 'low';
  date: string;
}

// Mock данные дефектов
const mockDefects: Defect[] = [
  { id: 7, pipeline: 'TP-1', status: 'active', method: 'MFL', riskClass: 'high', date: '2025-04-22' },
  { id: 4, pipeline: 'TP-4', status: 'fixed', method: 'MFL', riskClass: 'low', date: '2025-04-22' },
  { id: 3, pipeline: 'TP-3', status: 'active', method: 'UT', riskClass: 'medium', date: '2025-04-21' },
  { id: 8, pipeline: 'TP-2', status: 'fixed', method: 'MFL', riskClass: 'low', date: '2025-04-17' },
  { id: 17, pipeline: 'TP-4', status: 'active', method: 'UT', riskClass: 'high', date: '2025-04-17' },
  { id: 12, pipeline: 'TP-1', status: 'exhausted', method: 'VIK', riskClass: 'medium', date: '2025-04-15' },
  { id: 5, pipeline: 'TP-3', status: 'fixed', method: 'PVK', riskClass: 'low', date: '2025-04-14' },
  { id: 9, pipeline: 'TP-2', status: 'active', method: 'MFL', riskClass: 'high', date: '2025-04-13' },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pipeline = searchParams.get('pipeline');
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredDefects = [...mockDefects];

    if (pipeline) {
      filteredDefects = filteredDefects.filter((d) => d.pipeline === pipeline);
    }
    if (status) {
      filteredDefects = filteredDefects.filter((d) => d.status === status);
    }
    if (method) {
      filteredDefects = filteredDefects.filter((d) => d.method === method);
    }

    // Сортируем по дате (новые сначала)
    filteredDefects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(filteredDefects.slice(0, limit));
  } catch (error) {
    console.error('Error fetching defects:', error);
    return NextResponse.json({ error: 'Failed to fetch defects' }, { status: 500 });
  }
}

