'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';

// Mock данные
const mockObjects = [
  { id: 1, name: 'Кран подвесной', type: 'crane', pipeline: 'MT-02', year: 1961, material: 'Ст3', inspections: 5, defects: 1 },
  { id: 2, name: 'Турбокомпрессор ТВ-80-1', type: 'compressor', pipeline: 'MT-02', year: 1999, material: '09Г2С', inspections: 8, defects: 0 },
  { id: 3, name: 'Участок трубы №45', type: 'pipeline_section', pipeline: 'MT-01', year: 1985, material: '17Г1С', inspections: 12, defects: 3 },
  { id: 4, name: 'Кран шаровой', type: 'crane', pipeline: 'MT-03', year: 2005, material: '09Г2С', inspections: 3, defects: 0 },
  { id: 5, name: 'Компрессорная станция №2', type: 'compressor', pipeline: 'MT-01', year: 1995, material: 'Ст3', inspections: 15, defects: 2 },
];

export function ObjectsView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPipeline, setSelectedPipeline] = useState<string>('all');

  const filteredObjects = mockObjects.filter((obj) => {
    const matchesSearch = obj.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || obj.type === selectedType;
    const matchesPipeline = selectedPipeline === 'all' || obj.pipeline === selectedPipeline;
    return matchesSearch && matchesType && matchesPipeline;
  });

  const typeLabels: Record<string, string> = {
    crane: 'Кран',
    compressor: 'Компрессор',
    pipeline_section: 'Участок трубы',
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Объекты' }]} />
      <BlurFade delay={0.1}>
        <div>
          <TextAnimate
            as="h1"
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            by="word"
            animation="blurInUp"
          >
            Объекты контроля
          </TextAnimate>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Список объектов с фильтрацией и поиском
          </p>
        </div>
      </BlurFade>

      {/* Фильтры */}
      <BlurFade delay={0.2}>
        <div className="flex flex-wrap gap-4 p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded border"
              style={{ 
                borderColor: 'var(--color-light-blue)', 
                background: 'var(--color-white)',
                fontFamily: 'var(--font-geist)',
                color: 'var(--color-dark-blue)'
              }}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Select
              value={selectedType}
              onChange={setSelectedType}
              options={[
                { value: 'all', label: 'Все типы' },
                { value: 'crane', label: 'Кран' },
                { value: 'compressor', label: 'Компрессор' },
                { value: 'pipeline_section', label: 'Участок трубы' },
              ]}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Select
              value={selectedPipeline}
              onChange={setSelectedPipeline}
              options={[
                { value: 'all', label: 'Все магистрали' },
                { value: 'MT-01', label: 'MT-01' },
                { value: 'MT-02', label: 'MT-02' },
                { value: 'MT-03', label: 'MT-03' },
              ]}
            />
          </div>
        </div>
      </BlurFade>

      {/* Таблица объектов */}
      <BlurFade delay={0.3}>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'var(--color-cream)' }}>
                <tr>
                  <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    ID
                  </th>
                  <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Название
                  </th>
                  <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Тип
                  </th>
                  <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Магистраль
                  </th>
                  <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Год
                  </th>
                  <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Обследований
                  </th>
                  <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Дефектов
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredObjects.map((obj) => (
                  <tr
                    key={obj.id}
                    className="border-t cursor-pointer transition-colors hover:bg-opacity-50"
                    style={{ 
                      borderColor: 'var(--color-light-blue)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => {
                      router.push(`/app/object/${obj.id}`);
                    }}
                  >
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {obj.id}
                    </td>
                    <td className="p-3 text-sm font-medium" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {obj.name}
                    </td>
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {typeLabels[obj.type]}
                    </td>
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {obj.pipeline}
                    </td>
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {obj.year}
                    </td>
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {obj.inspections}
                    </td>
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: obj.defects > 0 ? '#dc2626' : 'var(--color-blue)' }}>
                      {obj.defects}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

