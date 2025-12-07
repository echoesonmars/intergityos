'use client';

import { useState, useEffect } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Calendar, BarChart3, Loader2 } from 'lucide-react';

interface AnalyticsData {
  trends: {
    inspectionsGrowth: string;
    defectsReduction: string;
    plannedWorks: number;
  };
  yearlyData: Array<{ year: number; inspections: number; defects: number }>;
  pipelineComparison: Array<{ pipeline: string; objects: number; defects: number; critical: number }>;
}

export function AnalyticsView() {
  const [selectedPeriod, setSelectedPeriod] = useState<'year' | 'quarter' | 'month'>('year');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/analytics?period=${selectedPeriod}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Не удалось загрузить аналитику');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Аналитика' }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Загрузка аналитики...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Аналитика' }]} />
        <div className="p-6 rounded-lg border" style={{ borderColor: '#dc2626', background: 'var(--color-white)' }}>
          <p style={{ fontFamily: 'var(--font-geist)', color: '#dc2626' }}>
            {error || 'Не удалось загрузить данные'}
          </p>
        </div>
      </div>
    );
  }

  const { trends, yearlyData, pipelineComparison } = data;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Аналитика' }]} />
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <TextAnimate
              as="h1"
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
              by="word"
              animation="blurInUp"
            >
              Аналитика
            </TextAnimate>
            <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Расширенная аналитика и тренды
            </p>
          </div>
          <Select
            value={selectedPeriod}
            onChange={(value) => setSelectedPeriod(value as typeof selectedPeriod)}
            options={[
              { value: 'year', label: 'Год' },
              { value: 'quarter', label: 'Квартал' },
              { value: 'month', label: 'Месяц' },
            ]}
            className="w-40"
          />
        </div>
      </BlurFade>

      {/* Тренды */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5" style={{ color: '#28ca42' }} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Рост обследований
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              +{trends.inspectionsGrowth}%
            </div>
            <div className="text-xs mt-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              За последний год
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5" style={{ color: '#dc2626' }} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Снижение дефектов
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {trends.defectsReduction}%
            </div>
            <div className="text-xs mt-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              За последний год
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Плановых работ
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {trends.plannedWorks}
            </div>
            <div className="text-xs mt-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              В этом месяце
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Динамика по годам */}
      <BlurFade delay={0.3}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Динамика обследований и дефектов
          </h2>
          <div className="space-y-4">
            {yearlyData.map((data) => (
              <div key={data.year}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    {data.year}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      Обследований: {data.inspections}
                    </span>
                    <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: '#dc2626' }}>
                      Дефектов: {data.defects}
                    </span>
                  </div>
                </div>
                <div className="w-full h-4 rounded-full" style={{ background: 'var(--color-light-blue)' }}>
                  <div
                    className="h-4 rounded-full flex"
                    style={{ width: '100%' }}
                  >
                    <div
                      className="h-4 rounded-l-full"
                      style={{
                        width: `${(data.inspections / 200) * 100}%`,
                        background: 'var(--color-blue)',
                      }}
                    />
                    <div
                      className="h-4 rounded-r-full"
                      style={{
                        width: `${(data.defects / 200) * 100}%`,
                        background: '#dc2626',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Сравнение магистралей */}
      <BlurFade delay={0.4}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Сравнение магистралей
          </h2>
          <div className="space-y-4">
            {pipelineComparison.map((pipe) => (
              <div
                key={pipe.pipeline}
                className="p-4 rounded-lg border"
                style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                      {pipe.pipeline}
                    </div>
                    <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      Объектов: {pipe.objects}
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8" style={{ color: 'var(--color-blue)' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      Всего дефектов
                    </div>
                    <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: '#ffbd2e' }}>
                      {pipe.defects}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      Критических
                    </div>
                    <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: '#dc2626' }}>
                      {pipe.critical}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

