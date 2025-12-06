import { NextResponse } from 'next/server';

// GET /api/dashboard/methods-distribution - Получить распределение по методам
export async function GET() {
  try {
    // TODO: Заменить на реальные запросы к БД
    // Пример: const distribution = await db.getMethodsDistribution();
    
    // Базовые значения с динамическими изменениями
    const baseTime = Math.floor(Date.now() / 1000 / 3600);
    const variation = (baseTime % 50) - 25;
    
    const baseDistribution = [
      { method: 'VIK', baseCount: 450 },
      { method: 'PVK', baseCount: 380 },
      { method: 'MPK', baseCount: 290 },
      { method: 'UZK', baseCount: 180 },
      { method: 'RGK', baseCount: 120 },
    ];
    
    // Вычисляем динамические значения
    const distribution = baseDistribution.map((item, index) => {
      const count = Math.max(0, item.baseCount + Math.floor(variation * (index + 1) * 0.1) + Math.floor(Math.random() * 10) - 5);
      return {
        method: item.method,
        count,
        percentage: 0, // Вычислим ниже
      };
    });
    
    // Вычисляем общую сумму и проценты
    const total = distribution.reduce((sum, item) => sum + item.count, 0);
    const distributionWithPercentages = distribution.map(item => ({
      ...item,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));

    return NextResponse.json(distributionWithPercentages, { status: 200 });
  } catch (error) {
    console.error('Error fetching methods distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch methods distribution' },
      { status: 500 }
    );
  }
}

