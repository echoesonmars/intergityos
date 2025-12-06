import { NextResponse } from 'next/server';

// Указываем, что route динамический (использует request)
export const dynamic = 'force-dynamic';

// GET /api/dashboard/recent-inspections - Получить последние обследования
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    // TODO: Заменить на реальные запросы к БД
    // Пример: const inspections = await db.getRecentInspections(limit);
    
    // Генерируем динамические данные с текущей датой
    const today = new Date();
    const methods = ['VIK', 'PVK', 'MPK', 'UZK', 'RGK', 'TVK', 'VIBRO', 'MFL'];
    const objects = [
      'Кран подвесной',
      'Турбокомпрессор ТВ-80-1',
      'Участок трубы №45',
      'Компрессорная станция №3',
      'Кран шаровой DN200',
      'Участок трубы №12',
      'Турбокомпрессор ТВ-80-2',
      'Кран подвесной №2',
    ];
    const criticalities: ('normal' | 'medium' | 'high')[] = ['normal', 'medium', 'high'];
    
    // Генерируем список обследований с динамическими датами
    const inspections = Array.from({ length: Math.min(limit, 8) }, (_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - index);
      
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];
      const randomObject = objects[index % objects.length];
      const randomCriticality = criticalities[Math.floor(Math.random() * criticalities.length)];
      const defectFound = randomCriticality !== 'normal';
      
      return {
        id: index + 1,
        objectName: randomObject,
        method: randomMethod,
        date: date.toISOString().split('T')[0],
        defectFound,
        criticality: randomCriticality,
      };
    });

    return NextResponse.json(inspections, { status: 200 });
  } catch (error) {
    console.error('Error fetching recent inspections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent inspections' },
      { status: 500 }
    );
  }
}

