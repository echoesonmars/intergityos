'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { Star, MapPin, Calendar, X } from 'lucide-react';
import { useToast } from './ToastProvider';
import { ConfirmDialog } from './ConfirmDialog';

// Mock данные
const mockFavorites = [
  { id: 1, name: 'Кран подвесной', pipeline: 'MT-02', type: 'crane', addedDate: '2024-01-15' },
  { id: 3, name: 'Участок трубы №45', pipeline: 'MT-01', type: 'pipeline_section', addedDate: '2024-01-10' },
];

export function FavoritesView() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
    setDeleteConfirm(null);
    showToast('Объект удален из избранного', 'info');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Избранное' }]} />
      <BlurFade delay={0.1}>
        <div>
          <TextAnimate
            as="h1"
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            by="word"
            animation="blurInUp"
          >
            Избранное
          </TextAnimate>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Быстрый доступ к важным объектам
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="p-4 rounded-lg border relative"
              style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}
            >
              <button
                onClick={() => setDeleteConfirm(fav.id)}
                className="absolute top-2 right-2 p-1 rounded hover:bg-opacity-50 transition-colors"
                style={{ color: '#dc2626' }}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 mb-3">
                <Star className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#ffbd2e' }} />
                <div className="flex-1 min-w-0">
                  <Link href={`/app/object/${fav.id}`}>
                    <h3 className="font-semibold mb-1 hover:underline" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {fav.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    <MapPin className="h-3 w-3" />
                    {fav.pipeline}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs pt-3 border-t" style={{ borderColor: 'var(--color-light-blue)', fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                <Calendar className="h-3 w-3" />
                Добавлено: {fav.addedDate}
              </div>
            </div>
          ))}
        </div>
        {favorites.length === 0 && (
          <div className="p-8 text-center rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}>
            <Star className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Нет избранных объектов
            </p>
          </div>
        )}
      </BlurFade>

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Удалить из избранного?"
        message="Вы уверены, что хотите удалить этот объект из избранного?"
        confirmText="Удалить"
        cancelText="Отмена"
        variant="warning"
        onConfirm={() => deleteConfirm && removeFavorite(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

