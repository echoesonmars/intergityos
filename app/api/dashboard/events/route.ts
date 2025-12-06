import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Event {
  id: number;
  date: string;
  message: string;
  type: 'defect' | 'fixed' | 'upload' | 'repair';
}

// Mock данные событий
const mockEvents: Event[] = [
  { id: 1, date: '2025-04-20', message: 'Обнаружен 62 новый дефект', type: 'defect' },
  { id: 2, date: '2025-04-18', message: 'Устранен дефект HFL', type: 'fixed' },
  { id: 3, date: '2025-04-18', message: 'Загружены UT данные инспекции', type: 'upload' },
  { id: 4, date: '2025-04-15', message: 'Завершен ремонт на участке TP-1', type: 'repair' },
  { id: 5, date: '2025-04-14', message: 'Обнаружен 15 новый дефект', type: 'defect' },
  { id: 6, date: '2025-04-12', message: 'Устранен дефект MFL', type: 'fixed' },
];

export async function GET(request: Request) {
  try {
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10');

    // Сортируем по дате (новые сначала)
    const sortedEvents = [...mockEvents].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(sortedEvents.slice(0, limit));
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

