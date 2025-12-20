'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { ArrowLeft, Calendar, MapPin, Wrench, FileText, AlertTriangle, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from './ToastProvider';

interface ObjectData {
  id: number;
  name: string;
  type: string;
  pipeline: string;
  lat: number;
  lon: number;
  year: number;
  material: string;
  criticality: string;
  sourceFile?: string;
  inspections: Array<{
    id: number;
    date: string;
    method: string;
    defectFound: boolean;
    qualityGrade: string;
    param1: number;
    param2: number;
    param3: number;
  }>;
  defects: Array<{
    id: number;
    date: string;
    description: string;
    depth: number;
    length: number;
    width: number;
    criticality: string;
  }>;
  recommendations: string[];
}

export function ObjectDetailView({ objectId }: { objectId: string }) {
  const { showToast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [object, setObject] = useState<ObjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'defects' | 'recommendations'>('overview');

  useEffect(() => {
    const fetchObject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/objects/${objectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch object');
        }

        const data = await response.json();
        setObject(data);
      } catch (err) {
        console.error('Error fetching object:', err);
        setError('Не удалось загрузить данные объекта');
      } finally {
        setIsLoading(false);
      }
    };

    if (objectId) {
      fetchObject();
    }
  }, [objectId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Объекты', href: '/app/objects' }, { label: 'Загрузка...' }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Загрузка данных объекта...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Объекты', href: '/app/objects' }, { label: 'Ошибка' }]} />
        <div className="p-6 rounded-lg border" style={{ borderColor: '#dc2626', background: 'var(--color-white)' }}>
          <p style={{ fontFamily: 'var(--font-geist)', color: '#dc2626' }}>
            {error || 'Объект не найден'}
          </p>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное', 'success');
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#ffbd2e';
      case 'normal':
        return '#28ca42';
      default:
        return '#94B4C1';
    }
  };

  const getCriticalityLabel = (criticality: string) => {
    switch (criticality) {
      case 'high':
        return 'Высокая';
      case 'medium':
        return 'Средняя';
      case 'normal':
        return 'Норма';
      default:
        return criticality;
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Объекты', href: '/app/objects' },
        { label: object.name }
      ]} />
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-4">
          <Link href="/app/objects">
            <Button
              variant="outline"
              size="icon"
              style={{
                borderColor: 'var(--color-light-blue)',
                color: 'var(--color-dark-blue)',
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            >
              {object.name}
            </h1>
            <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Детальная информация об объекте
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFavorite}
            style={{
              borderColor: 'var(--color-light-blue)',
              color: isFavorite ? '#ffbd2e' : 'var(--color-blue)',
            }}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </BlurFade>

      {/* Основная информация */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Магистраль
              </span>
            </div>
            <div className="text-lg font-semibold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {object.pipeline}
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Год ввода
              </span>
            </div>
            <div className="text-lg font-semibold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {object.year}
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Материал
            </div>
            <div className="text-lg font-semibold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {object.material}
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Критичность
            </div>
            <span
              className="inline-block px-3 py-1 rounded text-sm font-semibold text-white"
              style={{ backgroundColor: getCriticalityColor(object.criticality) }}
            >
              {getCriticalityLabel(object.criticality)}
            </span>
          </div>
          {object.sourceFile && (
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
                <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Исходный файл
                </span>
              </div>
              <div className="text-sm font-medium break-all" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                {object.sourceFile}
              </div>
            </div>
          )}
        </div>
      </BlurFade>

      {/* Табы */}
      <BlurFade delay={0.3}>
        <div className="border-b" style={{ borderColor: 'var(--color-light-blue)' }}>
          <div className="flex gap-4">
            {[
              { id: 'overview', label: 'Обзор' },
              { id: 'history', label: 'История' },
              { id: 'defects', label: 'Дефекты' },
              { id: 'recommendations', label: 'Рекомендации' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="px-4 py-2 border-b-2 transition-colors"
                style={{
                  borderColor: activeTab === tab.id ? 'var(--color-dark-blue)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-dark-blue)' : 'var(--color-blue)',
                  fontFamily: 'var(--font-geist)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Контент табов */}
      {activeTab === 'overview' && (
        <BlurFade delay={0.4}>
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              Общая информация
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Координаты:
                </span>
                <span className="ml-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                  {object.lat}, {object.lon}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Всего обследований:
                </span>
                <span className="ml-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                  {object.inspections.length}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Найдено дефектов:
                </span>
                <span className="ml-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                  {object.defects.length}
                </span>
              </div>
            </div>
          </div>
        </BlurFade>
      )}

      {activeTab === 'history' && (
        <BlurFade delay={0.4}>
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              История диагностик
            </h2>
            <div className="space-y-4">
              {object.inspections.map((insp) => (
                <div
                  key={insp.id}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
                      <div>
                        <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                          {insp.method} - {insp.date}
                        </div>
                        <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                          Оценка: {insp.qualityGrade}
                        </div>
                      </div>
                    </div>
                    {insp.defectFound && (
                      <AlertTriangle className="h-5 w-5" style={{ color: '#dc2626' }} />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                    <div>
                      <div className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        Параметр 1
                      </div>
                      <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {insp.param1}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        Параметр 2
                      </div>
                      <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {insp.param2}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        Параметр 3
                      </div>
                      <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {insp.param3}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      )}

      {activeTab === 'defects' && (
        <BlurFade delay={0.4}>
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              Дефекты
            </h2>
            <div className="space-y-4">
              {object.defects.map((defect) => (
                <div
                  key={defect.id}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {defect.description}
                      </div>
                      <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        Дата обнаружения: {defect.date}
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: getCriticalityColor(defect.criticality) }}
                    >
                      {getCriticalityLabel(defect.criticality)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                    <div>
                      <div className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        Глубина (мм)
                      </div>
                      <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {defect.depth}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        Длина (мм)
                      </div>
                      <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {defect.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        Ширина (мм)
                      </div>
                      <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {defect.width}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      )}

      {activeTab === 'recommendations' && (
        <BlurFade delay={0.4}>
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              Рекомендации
            </h2>
            <div className="space-y-3">
              {object.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border flex items-start gap-3"
                  style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}
                >
                  <Wrench className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'var(--color-blue)' }} />
                  <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      )}
    </div>
  );
}

