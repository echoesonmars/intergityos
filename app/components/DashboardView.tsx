'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Loader2, Calendar, MapPin, Filter } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Динамический импорт карты для избежания SSR проблем
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

interface DashboardStats {
  totalObjects: number;
  totalInspections: number;
  defectsFound: number;
  criticalIssues: number;
  activeDefects: number;
  highRisk: number;
  repairsPerYear: number;
}

interface Defect {
  id: number;
  pipeline: string;
  status: 'active' | 'fixed' | 'exhausted' | 'rejected';
  method: string;
  riskClass: 'high' | 'medium' | 'low';
  date: string;
}

interface Event {
  id: number;
  date: string;
  message: string;
  type: 'defect' | 'fixed' | 'upload' | 'repair';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return '#dc2626';
    case 'fixed':
      return '#28ca42';
    case 'exhausted':
      return '#ffbd2e';
    case 'rejected':
      return '#94B4C1';
    default:
      return '#94B4C1';
  }
};

const getRiskClassColor = (riskClass: string) => {
  switch (riskClass) {
    case 'high':
      return '#dc2626';
    case 'medium':
      return '#ffbd2e';
    case 'low':
      return '#28ca42';
    default:
      return '#94B4C1';
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'defect':
      return '#ffbd2e';
    case 'fixed':
      return '#28ca42';
    case 'upload':
      return '#ffbd2e';
    case 'repair':
      return '#28ca42';
    default:
      return '#94B4C1';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [selectedPipeline, setSelectedPipeline] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [statsRes, defectsRes, eventsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/defects'),
          fetch('/api/dashboard/events'),
        ]);

        if (!statsRes.ok || !defectsRes.ok || !eventsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [statsData, defectsData, eventsData] = await Promise.all([
          statsRes.json(),
          defectsRes.json(),
          eventsRes.json(),
        ]);

        setStats(statsData);
        setDefects(defectsData);
        setEvents(eventsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Не удалось загрузить данные дашборда');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Фильтрация дефектов
  const filteredDefects = defects.filter((defect) => {
    if (selectedPipeline !== 'all' && defect.pipeline !== selectedPipeline) return false;
    if (selectedStatus !== 'all' && defect.status !== selectedStatus) return false;
    if (selectedMethod !== 'all' && defect.method !== selectedMethod) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Панель управления' }]} />
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
        <Breadcrumbs items={[{ label: 'Панель управления' }]} />
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
      <Breadcrumbs items={[{ label: 'Панель управления' }]} />

      {/* Статистические карточки */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/app/objects?filter=defects"
            className="p-6 rounded-lg border hover:shadow-lg transition-all cursor-pointer"
            style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}
          >
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Активные дефекты
            </div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: '#dc2626' }}>
              {stats.activeDefects || stats.defectsFound}
            </div>
          </Link>
          <Link
            href="/app/notifications?filter=critical"
            className="p-6 rounded-lg border hover:shadow-lg transition-all cursor-pointer"
            style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}
          >
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Высокий риск
            </div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: '#dc2626' }}>
              {stats.highRisk || stats.criticalIssues}
            </div>
          </Link>
          <Link
            href="/app/objects"
            className="p-6 rounded-lg border hover:shadow-lg transition-all cursor-pointer"
            style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}
          >
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Обследования
            </div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {stats.totalInspections}
            </div>
          </Link>
          <Link
            href="/app/planning"
            className="p-6 rounded-lg border hover:shadow-lg transition-all cursor-pointer"
            style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}
          >
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Ремонты за год
            </div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {stats.repairsPerYear || 14}
            </div>
          </Link>
        </div>
      </BlurFade>

      {/* Фильтры */}
      <BlurFade delay={0.2}>
        <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
              <Select
                value={dateRange}
                onChange={setDateRange}
                options={[
                  { value: 'all', label: 'Все даты' },
                  { value: 'today', label: 'Сегодня' },
                  { value: 'week', label: 'Неделя' },
                  { value: 'month', label: 'Месяц' },
                ]}
                placeholder="Диапазон дат"
                className="w-48"
              />
            </div>
            <Select
              value={selectedPipeline}
              onChange={setSelectedPipeline}
              options={[
                { value: 'all', label: 'Все трубопроводы' },
                { value: 'TP-1', label: 'TP-1' },
                { value: 'TP-2', label: 'TP-2' },
                { value: 'TP-3', label: 'TP-3' },
                { value: 'TP-4', label: 'TP-4' },
              ]}
              placeholder="Трубопровод"
              className="w-40"
            />
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: 'all', label: 'Все статусы' },
                { value: 'active', label: 'Активен' },
                { value: 'fixed', label: 'Исправлен' },
                { value: 'exhausted', label: 'Истражен' },
                { value: 'rejected', label: 'Отреьл' },
              ]}
              placeholder="Статус"
              className="w-40"
            />
            <Select
              value={selectedMethod}
              onChange={setSelectedMethod}
              options={[
                { value: 'all', label: 'Все методы' },
                { value: 'MFL', label: 'MFL' },
                { value: 'UT', label: 'UT' },
                { value: 'VIK', label: 'VIK' },
                { value: 'PVK', label: 'PVK' },
                { value: 'MPK', label: 'MPK' },
              ]}
              placeholder="Метод"
              className="w-40"
            />
            <Button
              className="flex items-center gap-2"
              style={{
                fontFamily: 'var(--font-geist)',
                backgroundColor: 'var(--color-dark-blue)',
                color: 'var(--color-white)',
              }}
            >
              <Filter className="h-4 w-4" />
              Выбрать
            </Button>
          </div>
        </div>
      </BlurFade>

      {/* Основной контент: Карта и События */}
      <BlurFade delay={0.3}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Карта */}
          <div className="lg:col-span-2">
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                  Карта объектов
                </h2>
              </div>
              <div className="h-64 rounded-lg overflow-hidden border relative" style={{ borderColor: 'var(--color-light-blue)' }}>
                <LeafletMap selectedCriticality="all" height="256px" showLegend={false} />
                <Link
                  href="/app/map"
                  className="absolute top-2 right-2 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:shadow-md transition-all"
                  style={{
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-dark-blue)',
                    fontFamily: 'var(--font-geist)',
                    border: '1px solid var(--color-light-blue)',
                  }}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Открыть полную карту
                </Link>
              </div>
            </div>
          </div>

          {/* Панель событий */}
          <div className="lg:col-span-1">
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                События
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: getEventTypeColor(event.type) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        {formatDate(event.date)}
                      </div>
                      <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {event.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Таблица дефектов и Легенда */}
      <BlurFade delay={0.4}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Таблица дефектов */}
          <div className="lg:col-span-3">
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                Дефекты
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-light-blue)' }}>
                      <th className="text-left py-2 px-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        №
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        Трубопровод
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        Статус
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        Метод
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        Класс риска
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        Дата
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDefects.map((defect) => (
                      <tr key={defect.id} style={{ borderBottom: '1px solid var(--color-light-blue)' }}>
                        <td className="py-2 px-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                          {defect.id}
                        </td>
                        <td className="py-2 px-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                          {defect.pipeline}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: getStatusColor(defect.status) }}
                            />
                            <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                              {defect.status === 'active' ? 'Активен' : defect.status === 'fixed' ? 'Исправлен' : defect.status === 'exhausted' ? 'Истражен' : 'Отреьл'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                          {defect.method}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: getRiskClassColor(defect.riskClass) }}
                            />
                            <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                              {defect.riskClass === 'high' ? 'Высокий' : defect.riskClass === 'medium' ? 'Средний' : 'Низкий'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                          {formatDate(defect.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Легенда статусов */}
          <div className="lg:col-span-1">
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                Дефекты
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#dc2626' }} />
                  <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Активен
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#28ca42' }} />
                  <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Исправлен
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                  <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Истражен
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#94B4C1' }} />
                  <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Отреьл
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#dc2626' }} />
                  <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Высокий
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                  <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Средний
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#28ca42' }} />
                  <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Низкий
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
