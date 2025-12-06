'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';

export function DashboardView() {
  // Mock данные для демонстрации
  const stats = {
    totalObjects: 1247,
    totalInspections: 3421,
    defectsFound: 89,
    criticalIssues: 12,
  };

  const methodsDistribution = [
    { method: 'VIK', count: 450, percentage: 32 },
    { method: 'PVK', count: 380, percentage: 27 },
    { method: 'MPK', count: 290, percentage: 21 },
    { method: 'UZK', count: 180, percentage: 13 },
    { method: 'RGK', count: 120, percentage: 8 },
  ];

  const criticalityDistribution = [
    { label: 'Норма', count: 856, color: '#28ca42' },
    { label: 'Средняя', count: 302, color: '#ffbd2e' },
    { label: 'Высокая', count: 89, color: '#dc2626' },
  ];

  return (
    <div className="space-y-6">
      <BlurFade delay={0.1}>
        <div>
          <TextAnimate
            as="h1"
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            by="word"
            animation="blurInUp"
          >
            Дашборд
          </TextAnimate>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Общая статистика по системе
          </p>
        </div>
      </BlurFade>

      {/* Статистические карточки */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Всего объектов
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {stats.totalObjects.toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Обследований
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {stats.totalInspections.toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Найдено дефектов
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: '#dc2626' }}>
              {stats.defectsFound}
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Критических
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: '#dc2626' }}>
              {stats.criticalIssues}
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Распределение по методам */}
      <BlurFade delay={0.3}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Распределение дефектов по методам
          </h2>
          <div className="space-y-3">
            {methodsDistribution.map((item) => (
              <div key={item.method}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    {item.method}
                  </span>
                  <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    {item.count}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'var(--color-light-blue)' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      background: 'var(--color-dark-blue)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Распределение по критичности */}
      <BlurFade delay={0.4}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Распределение по критичности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criticalityDistribution.map((item) => (
              <div key={item.label} className="p-4 rounded-lg" style={{ background: 'var(--color-cream)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: item.color }} />
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    {item.label}
                  </span>
                </div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

