'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { Star, MapPin, Calendar, X, Loader2 } from 'lucide-react';
import { useToast } from './ToastProvider';
import { ConfirmDialog } from './ConfirmDialog';

interface Favorite {
  id: number;
  name: string;
  pipeline: string;
  type: string;
  addedDate: string;
}

export function FavoritesView() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage (client-side only)
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem('favorites');
        if (stored) {
          const parsed = JSON.parse(stored);
          setFavorites(parsed);
        } else {
          // If no favorites in localStorage, try to get from objects API
          fetch('/api/objects?limit=10')
            .then(res => res.json())
            .then((data: Array<{
              id: number;
              name: string;
              pipeline: string;
              type: string;
            }>) => {
              // Get first few objects as default favorites
              const defaultFavorites = data.slice(0, 3).map((obj) => ({
                id: obj.id,
                name: obj.name,
                pipeline: obj.pipeline,
                type: obj.type,
                addedDate: new Date().toISOString().split('T')[0],
              }));
              setFavorites(defaultFavorites);
              localStorage.setItem('favorites', JSON.stringify(defaultFavorites));
            })
            .catch(() => {
              // If API fails, use empty array
              setFavorites([]);
            });
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((fav) => fav.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
    setDeleteConfirm(null);
    showToast('Объект удален из избранного', 'info');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Избранное' }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Загрузка избранного...
            </p>
          </div>
        </div>
      </div>
    );
  }

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

