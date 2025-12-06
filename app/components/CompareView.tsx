'use client';

import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock данные
const mockObjects = [
  { id: 1, name: 'Кран подвесной', pipeline: 'MT-02', year: 1961, material: 'Ст3', inspections: 5, defects: 1, criticality: 'medium' },
  { id: 2, name: 'Турбокомпрессор ТВ-80-1', pipeline: 'MT-02', year: 1999, material: '09Г2С', inspections: 8, defects: 0, criticality: 'normal' },
  { id: 3, name: 'Участок трубы №45', pipeline: 'MT-01', year: 1985, material: '17Г1С', inspections: 12, defects: 3, criticality: 'high' },
];

export function CompareView() {
  const [selectedObjects, setSelectedObjects] = useState<number[]>([1, 2]);
  const [searchQuery, setSearchQuery] = useState('');

  const availableObjects = mockObjects.filter(
    (obj) => !selectedObjects.includes(obj.id) && obj.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedObjectsData = mockObjects.filter((obj) => selectedObjects.includes(obj.id));

  const addObject = (id: number) => {
    if (selectedObjects.length < 4) {
      setSelectedObjects([...selectedObjects, id]);
    }
  };

  const removeObject = (id: number) => {
    setSelectedObjects(selectedObjects.filter((objId) => objId !== id));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Сравнение объектов' }]} />
      <BlurFade delay={0.1}>
        <div>
          <TextAnimate
            as="h1"
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            by="word"
            animation="blurInUp"
          >
            Сравнение объектов
          </TextAnimate>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Сравнение параметров нескольких объектов
          </p>
        </div>
      </BlurFade>

      {/* Выбор объектов */}
      <BlurFade delay={0.2}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Выберите объекты для сравнения (до 4)
          </h2>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Поиск объектов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                fontFamily: 'var(--font-geist)',
                borderColor: 'var(--color-light-blue)',
              }}
            />
            <div className="flex flex-wrap gap-2">
              {availableObjects.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => addObject(obj.id)}
                  className="px-3 py-2 rounded border flex items-center gap-2 transition-colors hover:bg-opacity-50"
                  style={{
                    borderColor: 'var(--color-light-blue)',
                    background: 'var(--color-cream)',
                    fontFamily: 'var(--font-geist)',
                    color: 'var(--color-dark-blue)',
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {obj.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Таблица сравнения */}
      {selectedObjectsData.length > 0 && (
        <BlurFade delay={0.3}>
          <div className="p-6 rounded-lg border overflow-x-auto" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              Сравнительная таблица
            </h2>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--color-cream)' }}>
                  <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Параметр
                  </th>
                  {selectedObjectsData.map((obj) => (
                    <th key={obj.id} className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      <div className="flex items-center gap-2">
                        {obj.name}
                        <button
                          onClick={() => removeObject(obj.id)}
                          className="p-1 rounded hover:bg-opacity-50 transition-colors"
                          style={{ color: '#dc2626' }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                  <td className="p-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Магистраль
                  </td>
                  {selectedObjectsData.map((obj) => (
                    <td key={obj.id} className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {obj.pipeline}
                    </td>
                  ))}
                </tr>
                <tr className="border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                  <td className="p-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Год ввода
                  </td>
                  {selectedObjectsData.map((obj) => (
                    <td key={obj.id} className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {obj.year}
                    </td>
                  ))}
                </tr>
                <tr className="border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                  <td className="p-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Материал
                  </td>
                  {selectedObjectsData.map((obj) => (
                    <td key={obj.id} className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {obj.material}
                    </td>
                  ))}
                </tr>
                <tr className="border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                  <td className="p-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Обследований
                  </td>
                  {selectedObjectsData.map((obj) => (
                    <td key={obj.id} className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {obj.inspections}
                    </td>
                  ))}
                </tr>
                <tr className="border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                  <td className="p-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Дефектов
                  </td>
                  {selectedObjectsData.map((obj) => (
                    <td key={obj.id} className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: obj.defects > 0 ? '#dc2626' : 'var(--color-blue)' }}>
                      {obj.defects}
                    </td>
                  ))}
                </tr>
                <tr className="border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                  <td className="p-3 text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Критичность
                  </td>
                  {selectedObjectsData.map((obj) => (
                    <td key={obj.id} className="p-3">
                      <span
                        className="px-2 py-1 rounded text-xs text-white"
                        style={{
                          backgroundColor:
                            obj.criticality === 'high' ? '#dc2626' : obj.criticality === 'medium' ? '#ffbd2e' : '#28ca42',
                        }}
                      >
                        {obj.criticality === 'high' ? 'Высокая' : obj.criticality === 'medium' ? 'Средняя' : 'Норма'}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </BlurFade>
      )}
    </div>
  );
}

