'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Object {
  id: number;
  name: string;
  type: string;
  pipeline: string;
  year: number;
  material: string;
  inspections: number;
  defects: number;
}

export function ObjectsView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPipeline, setSelectedPipeline] = useState<string>('all');
  const [objects, setObjects] = useState<Object[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (selectedPipeline !== 'all') {
          params.append('pipeline', selectedPipeline);
        }
        if (selectedType !== 'all') {
          params.append('type', selectedType);
        }

        const response = await fetch(`/api/objects?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch objects');
        }

        const data = await response.json();
        setObjects(data);
      } catch (err) {
        console.error('Error fetching objects:', err);
        setError('Не удалось загрузить объекты');
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjects();
  }, [selectedType, selectedPipeline]);

  const filteredObjects = objects.filter((obj) => {
    const matchesSearch = obj.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const typeLabels: Record<string, string> = {
    crane: 'Кран',
    compressor: 'Компрессор',
    pipeline_section: 'Участок трубы',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Объекты' }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Загрузка объектов...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Объекты' }]} />
        <div className="p-6 rounded-lg border" style={{ borderColor: '#dc2626', background: 'var(--color-white)' }}>
          <p style={{ fontFamily: 'var(--font-geist)', color: '#dc2626' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

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

