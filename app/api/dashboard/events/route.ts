import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Event {
  id: number;
  date: string;
  message: string;
  type: 'defect' | 'fixed' | 'upload' | 'repair';
}

export async function GET(request: Request) {
  try {
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10');

    // Get recent defects
    const defectsResponse = await defectsApi.getAll({ limit: limit * 2 });

    // Generate events from defects
    const events: Event[] = [];

    // Group defects by date and create events
    defectsResponse.defects.slice(0, limit).forEach((defect, index) => {
      const date = defect.details?.location?.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0];
      const defectType = defect.details?.type || 'дефект';
      
      // Create defect event
      events.push({
        id: index + 1,
        date,
        message: `Обнаружен дефект: ${defectType} на сегменте ${defect.segment_number}`,
        type: 'defect',
      });
    });

    // Sort by date (newest first)
    const sortedEvents = events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(sortedEvents.slice(0, limit));
  } catch (error) {
    console.error('Error fetching events:', error);
    
    // Fallback to mock data
    return NextResponse.json([
      { id: 1, date: '2025-04-20', message: 'Обнаружен новый дефект', type: 'defect' },
      { id: 2, date: '2025-04-18', message: 'Устранен дефект', type: 'fixed' },
      { id: 3, date: '2025-04-18', message: 'Загружены данные инспекции', type: 'upload' },
    ], { status: 200 });
  }
}

