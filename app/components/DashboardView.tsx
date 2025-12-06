'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { Loader2 } from 'lucide-react';

interface DashboardStats {
  totalObjects: number;
  totalInspections: number;
  defectsFound: number;
  criticalIssues: number;
}

interface MethodDistribution {
  method: string;
  count: number;
  percentage: number;
}

interface CriticalityDistribution {
  label: string;
  count: number;
  color: string;
}

export function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [methodsDistribution, setMethodsDistribution] = useState<MethodDistribution[]>([]);
  const [criticalityDistribution, setCriticalityDistribution] = useState<CriticalityDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Параллельная загрузка всех данных
        const [statsRes, methodsRes, criticalityRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/methods-distribution'),
          fetch('/api/dashboard/criticality-distribution'),
        ]);

        if (!statsRes.ok || !methodsRes.ok || !criticalityRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [statsData, methodsData, criticalityData] = await Promise.all([
          statsRes.json(),
          methodsRes.json(),
          criticalityRes.json(),
        ]);

        setStats(statsData);
        setMethodsDistribution(methodsData);
        setCriticalityDistribution(criticalityData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Не удалось загрузить данные дашборда');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Дашборд' }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Загрузка данных...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Дашборд' }]} />
        <div className="p-6 rounded-lg border" style={{ borderColor: '#dc2626', background: 'var(--color-white)' }}>
          <p style={{ fontFamily: 'var(--font-geist)', color: '#dc2626' }}>
            {error || 'Не удалось загрузить данные'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Дашборд' }]} />
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
          <Link href="/app/objects" className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Всего объектов
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {stats.totalObjects.toLocaleString()}
            </div>
          </Link>
          <Link href="/app/objects" className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Обследований
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {stats.totalInspections.toLocaleString()}
            </div>
          </Link>
          <Link href="/app/objects?filter=defects" className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Найдено дефектов
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: '#dc2626' }}>
              {stats.defectsFound}
            </div>
          </Link>
          <Link href="/app/notifications?filter=critical" className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Критических
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: '#dc2626' }}>
              {stats.criticalIssues}
            </div>
          </Link>
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

