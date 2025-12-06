'use client';

import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export function MapView() {
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');

  const methods = ['all', 'VIK', 'PVK', 'MPK', 'UZK', 'RGK', 'TVK', 'VIBRO', 'MFL', 'TFI', 'GEO', 'UTWM'];
  const criticalities = ['all', 'normal', 'medium', 'high'];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Карта' }]} />
      <BlurFade delay={0.1}>
        <div>
          <TextAnimate
            as="h1"
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            by="word"
            animation="blurInUp"
          >
            Карта объектов
          </TextAnimate>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Визуализация объектов и дефектов на карте Казахстана
          </p>
        </div>
      </BlurFade>

      {/* Фильтры */}
      <BlurFade delay={0.2}>
        <div className="flex flex-wrap gap-4 p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
              Метод контроля
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full p-2 rounded border"
              style={{ 
                borderColor: 'var(--color-light-blue)', 
                background: 'var(--color-white)',
                fontFamily: 'var(--font-geist)',
                color: 'var(--color-dark-blue)'
              }}
            >
              {methods.map((method) => (
                <option key={method} value={method}>
                  {method === 'all' ? 'Все методы' : method}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
              Критичность
            </label>
            <select
              value={selectedCriticality}
              onChange={(e) => setSelectedCriticality(e.target.value)}
              className="w-full p-2 rounded border"
              style={{ 
                borderColor: 'var(--color-light-blue)', 
                background: 'var(--color-white)',
                fontFamily: 'var(--font-geist)',
                color: 'var(--color-dark-blue)'
              }}
            >
              {criticalities.map((crit) => (
                <option key={crit} value={crit}>
                  {crit === 'all' ? 'Все' : crit === 'normal' ? 'Норма' : crit === 'medium' ? 'Средняя' : 'Высокая'}
                </option>
              ))}
            </select>
          </div>
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
            <LeafletMap />
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

