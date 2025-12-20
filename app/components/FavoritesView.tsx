'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Star, MapPin, Calendar, X, Loader2, Plus, Search } from 'lucide-react';
import { useToast } from './ToastProvider';
import { ConfirmDialog } from './ConfirmDialog';
import { Input } from '@/components/ui/input';

interface Favorite {
  favorite_id?: string;
  object_id: number;
  object_name: string;
  pipeline: string;
  object_type?: string;
  created_at?: string;
}

interface Segment {
  id: number;
  name: string;
  pipeline: string;
  type: string;
}

export function FavoritesView() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [availableSegments, setAvailableSegments] = useState<Segment[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    // Load favorites from backend
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        
        // Fetch favorites from backend
        const favResponse = await fetch('/api/favorites');
        if (favResponse.ok) {
          const data = await favResponse.json();
          setFavorites(data);
        }
        
        // Fetch available segments from backend
        const segResponse = await fetch('/api/objects?limit=100');
        if (segResponse.ok) {
          const segments = await segResponse.json();
          setAvailableSegments(segments);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        showToast('Ошибка загрузки избранного', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [showToast]);

  const addFavorite = async (segment: Segment) => {
    try {
      setAddingId(segment.id);
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_id: segment.id,
          object_name: segment.name,
          pipeline: segment.pipeline,
          object_type: segment.type,
        }),
      });
      
      if (response.ok) {
        const newFavorite = await response.json();
        setFavorites([...favorites, newFavorite]);
        showToast('Объект добавлен в избранное', 'success');
        setShowAddModal(false);
      } else {
        const error = await response.json();
        showToast(error.error || 'Ошибка добавления', 'error');
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      showToast('Ошибка добавления в избранное', 'error');
    } finally {
      setAddingId(null);
    }
  };

  const removeFavorite = async (objectId: number) => {
    try {
      const response = await fetch(`/api/favorites/${objectId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav.object_id !== objectId));
        showToast('Объект удален из избранного', 'info');
      } else {
        showToast('Ошибка удаления', 'error');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      showToast('Ошибка удаления из избранного', 'error');
    }
    setDeleteConfirm(null);
  };

  // Filter segments not already in favorites
  const filteredSegments = availableSegments.filter(
    seg => !favorites.some(fav => fav.object_id === seg.id) &&
           (searchQuery === '' || seg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            seg.pipeline.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            >
              Избранное
            </h1>
            <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Быстрый доступ к важным объектам
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: 'var(--color-dark-blue)' }}
          >
            <Plus className="h-4 w-4" />
            Добавить
          </button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.object_id}
              className="p-4 rounded-lg border relative"
              style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}
            >
              <button
                onClick={() => setDeleteConfirm(fav.object_id)}
                className="absolute top-2 right-2 p-1 rounded hover:bg-opacity-50 transition-colors"
                style={{ color: '#dc2626' }}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 mb-3">
                <Star className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#ffbd2e' }} />
                <div className="flex-1 min-w-0">
                  <Link href={`/app/object/${fav.object_id}`}>
                    <h3 className="font-semibold mb-1 hover:underline" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {fav.object_name}
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
                Добавлено: {fav.created_at ? new Date(fav.created_at).toLocaleDateString('ru-RU') : 'Н/Д'}
              </div>
            </div>
          ))}
        </div>
        {favorites.length === 0 && (
          <div className="p-8 text-center rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}>
            <Star className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Нет избранных объектов. Нажмите &quot;Добавить&quot; чтобы добавить сегменты.
            </p>
          </div>
        )}
      </BlurFade>

      {/* Add Favorite Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                Добавить в избранное
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Поиск сегментов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredSegments.length === 0 ? (
                <p className="text-center py-4" style={{ color: 'var(--color-blue)' }}>
                  {availableSegments.length === 0 ? 'Нет доступных сегментов' : 'Все сегменты уже в избранном'}
                </p>
              ) : (
                filteredSegments.map(segment => (
                  <div
                    key={segment.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                    style={{ borderColor: 'var(--color-light-blue)' }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-dark-blue)' }}>{segment.name}</p>
                      <p className="text-sm" style={{ color: 'var(--color-blue)' }}>{segment.pipeline}</p>
                    </div>
                    <button
                      onClick={() => addFavorite(segment)}
                      disabled={addingId === segment.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded text-white text-sm"
                      style={{ backgroundColor: addingId === segment.id ? '#9ca3af' : 'var(--color-dark-blue)' }}
                    >
                      {addingId === segment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Добавить
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
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

