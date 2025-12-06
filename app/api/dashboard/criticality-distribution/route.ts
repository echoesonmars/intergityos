import { NextResponse } from 'next/server';

// GET /api/dashboard/criticality-distribution - Получить распределение по критичности
export async function GET() {
  try {
    // TODO: Заменить на реальные запросы к БД
    // Пример: const distribution = await db.getCriticalityDistribution();
    
    // Базовые значения с динамическими изменениями
    const baseTime = Math.floor(Date.now() / 1000 / 3600);
    const variation = (baseTime % 30) - 15;
    
    const distribution = [
      { 
        label: 'Норма', 
        count: Math.max(800, 856 + Math.floor(variation * 0.5) + Math.floor(Math.random() * 10) - 5), 
        color: '#28ca42' 
      },
      { 
        label: 'Средняя', 
        count: Math.max(250, 302 + Math.floor(variation * 0.3) + Math.floor(Math.random() * 8) - 4), 
        color: '#ffbd2e' 
      },
      { 
        label: 'Высокая', 
        count: Math.max(50, 89 + Math.floor(variation * 0.2) + Math.floor(Math.random() * 6) - 3), 
        color: '#dc2626' 
      },
    ];

    return NextResponse.json(distribution, { status: 200 });
  } catch (error) {
    console.error('Error fetching criticality distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch criticality distribution' },
      { status: 500 }
    );
  }
}

