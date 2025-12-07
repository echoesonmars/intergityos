'use client';

import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export function MapView() {
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');
  
  // Date filters
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  // Parameter range filters
  const [depthMin, setDepthMin] = useState<string>('');
  const [depthMax, setDepthMax] = useState<string>('');
  const [distanceMin, setDistanceMin] = useState<string>('');
  const [distanceMax, setDistanceMax] = useState<string>('');
  
  // Show advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);

  const methods = ['all', 'VIK', 'PVK', 'MPK', 'UZK', 'RGK', 'TVK', 'VIBRO', 'MFL', 'TFI', 'GEO', 'UTWM'];
  const criticalities = ['all', 'normal', 'medium', 'high'];
  
  const resetFilters = () => {
    setSelectedMethod('all');
    setSelectedCriticality('all');
    setDateFrom('');
    setDateTo('');
    setDepthMin('');
    setDepthMax('');
    setDistanceMin('');
    setDistanceMax('');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Карта' }]} />
      <BlurFade delay={0.1}>
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
          >
            Карта объектов
          </h1>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Визуализация объектов и дефектов на карте Казахстана
          </p>
        </div>
      </BlurFade>

      {/* Фильтры */}
      <BlurFade delay={0.2}>
        <div className="p-4 rounded-lg border space-y-4" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          {/* Basic filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                Метод контроля
              </label>
              <Select
                value={selectedMethod}
                onChange={setSelectedMethod}
                options={methods.map((method) => ({
                  value: method,
                  label: method === 'all' ? 'Все методы' : method,
                }))}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                Критичность
              </label>
              <Select
                value={selectedCriticality}
                onChange={setSelectedCriticality}
                options={criticalities.map((crit) => ({
                  value: crit,
                  label: crit === 'all' ? 'Все' : crit === 'normal' ? 'Норма' : crit === 'medium' ? 'Средняя' : 'Высокая',
                }))}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showAdvanced ? 'Скрыть' : 'Ещё фильтры'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Сбросить
              </Button>
            </div>
          </div>
          
          {/* Advanced filters */}
          {showAdvanced && (
            <div className="pt-4 border-t space-y-4" style={{ borderColor: 'var(--color-light-blue)' }}>
              {/* Date range */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Дата от
                  </label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Дата до
                  </label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Parameter ranges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Глубина дефекта (%)
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="От"
                      min="0"
                      max="100"
                      value={depthMin}
                      onChange={(e) => setDepthMin(e.target.value)}
                      className="w-full"
                    />
                    <span className="text-gray-400">—</span>
                    <Input
                      type="number"
                      placeholder="До"
                      min="0"
                      max="100"
                      value={depthMax}
                      onChange={(e) => setDepthMax(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Дистанция (м)
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="От"
                      min="0"
                      value={distanceMin}
                      onChange={(e) => setDistanceMin(e.target.value)}
                      className="w-full"
                    />
                    <span className="text-gray-400">—</span>
                    <Input
                      type="number"
                      placeholder="До"
                      min="0"
                      value={distanceMax}
                      onChange={(e) => setDistanceMax(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </BlurFade>

      {/* Карта */}
      <BlurFade delay={0.3}>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-light-blue)' }}>
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              Карта Казахстана
            </h2>
          </div>
          <div className="p-4">
            <LeafletMap 
              selectedMethod={selectedMethod}
              selectedCriticality={selectedCriticality}
              dateFrom={dateFrom}
              dateTo={dateTo}
              depthMin={depthMin ? parseFloat(depthMin) : undefined}
              depthMax={depthMax ? parseFloat(depthMax) : undefined}
              distanceMin={distanceMin ? parseFloat(distanceMin) : undefined}
              distanceMax={distanceMax ? parseFloat(distanceMax) : undefined}
            />
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

