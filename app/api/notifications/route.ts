import { NextResponse } from 'next/server';
import { defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/notifications - Get notifications based on defects
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    // Get all defects
    const defectsResponse = await defectsApi.getAll({ limit: 1000 });

    // Generate notifications from defects
    interface Notification {
      id: number;
      type: string;
      title: string;
      message: string;
      date: string;
      read: boolean;
      objectId?: number;
      defectId?: string;
    }
    
    const notifications: Notification[] = [];

    // Critical defects notifications
    const criticalDefects = defectsResponse.defects.filter((defect) => {
      const severity = defect.details?.severity || defect.severity || '';
      return severity === 'критичный' || severity === 'critical' || severity === 'высокий' || severity === 'high';
    });

    criticalDefects.slice(0, 10).forEach((defect, index) => {
      notifications.push({
        id: index + 1,
        type: 'critical',
        title: 'Критический дефект обнаружен',
        message: `Объект "Сегмент ${defect.segment_number}" требует немедленного внимания`,
        date: defect.details?.location?.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0],
        read: false,
        objectId: defect.segment_number,
        defectId: defect.defect_id,
      });
    });

    // Filter notifications
    let filteredNotifications = notifications;
    if (filter === 'unread') {
      filteredNotifications = notifications.filter((n) => !n.read);
    } else if (filter === 'critical') {
      filteredNotifications = notifications.filter((n) => n.type === 'critical');
    }

    return NextResponse.json(filteredNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    
    // Fallback to mock data
    return NextResponse.json([
      {
        id: 1,
        type: 'critical',
        title: 'Критический дефект обнаружен',
        message: 'Объект "Кран подвесной" требует немедленного внимания',
        date: '2024-01-20 14:30',
        read: false,
        objectId: 1,
      },
    ]);
  }
}

