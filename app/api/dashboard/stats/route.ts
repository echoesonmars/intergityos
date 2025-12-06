import { NextResponse } from 'next/server';

// GET /api/dashboard/stats - Получить статистику для дашборда
export async function GET() {
  try {
    // TODO: Заменить на реальные запросы к БД
    // Пример: const stats = await db.getDashboardStats();
    
    // Временное решение: генерируем динамические данные на основе текущего времени
    // Это позволяет видеть изменения при обновлении страницы
    // В продакшене заменить на реальные запросы к БД
    
    const baseTime = Math.floor(Date.now() / 1000 / 3600); // Часы с начала эпохи
    const variation = (baseTime % 100) - 50; // Вариация от -50 до +50
    
    // Базовые значения с небольшими динамическими изменениями
    const stats = {
      totalObjects: 1247 + Math.floor(variation * 0.1),
      totalInspections: 3421 + Math.floor(variation * 0.3),
      defectsFound: 89 + Math.floor(variation * 0.2),
      criticalIssues: Math.max(5, 12 + Math.floor(variation * 0.15)), // Минимум 5
    };

    // Добавляем небольшую случайную вариацию для более реалистичного поведения
    const randomVariation = () => Math.floor(Math.random() * 5) - 2; // -2 до +2
    
    const finalStats = {
      totalObjects: stats.totalObjects + randomVariation(),
      totalInspections: stats.totalInspections + randomVariation() * 2,
      defectsFound: Math.max(0, stats.defectsFound + randomVariation()),
      criticalIssues: Math.max(0, stats.criticalIssues + randomVariation()),
      activeDefects: 547 + Math.floor(variation * 0.1) + randomVariation(),
      highRisk: 62 + Math.floor(variation * 0.1) + randomVariation(),
      repairsPerYear: 14 + Math.floor(variation * 0.05) + randomVariation(),
    };

    return NextResponse.json(finalStats, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

