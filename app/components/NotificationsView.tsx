'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Bell, AlertTriangle, CheckCircle, Info, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from './ConfirmDialog';

interface Notification {
  id: number;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
  objectId?: number;
  defectId?: string;
}

export function NotificationsView() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter') as 'all' | 'unread' | 'critical';
    if (filterParam) {
      setFilter(filterParam);
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/notifications?filter=${filter}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Не удалось загрузить уведомления');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [filter]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5" style={{ color: '#dc2626' }} />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" style={{ color: '#ffbd2e' }} />;
      case 'success':
        return <CheckCircle className="h-5 w-5" style={{ color: '#28ca42' }} />;
      default:
        return <Info className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />;
    }
  };

  // Filtering is done on backend, but we can also filter here if needed

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setDeleteConfirm(null);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Уведомления' }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Загрузка уведомлений...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Уведомления' }]} />
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
      <Breadcrumbs items={[{ label: 'Уведомления' }]} />
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            >
              Уведомления
            </h1>
            <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              {unreadCount > 0 ? `${unreadCount} непрочитанных уведомлений` : 'Все уведомления прочитаны'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
            {unreadCount > 0 && (
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: '#dc2626' }}
              >
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </BlurFade>

      {/* Фильтры */}
      <BlurFade delay={0.2}>
        <div className="flex gap-2">
          {(['all', 'unread', 'critical'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded border transition-colors"
              style={{
                borderColor: filter === f ? 'var(--color-dark-blue)' : 'var(--color-light-blue)',
                background: filter === f ? 'var(--color-dark-blue)' : 'var(--color-white)',
                color: filter === f ? 'var(--color-white)' : 'var(--color-dark-blue)',
                fontFamily: 'var(--font-geist)',
              }}
            >
              {f === 'all' ? 'Все' : f === 'unread' ? 'Непрочитанные' : 'Критические'}
            </button>
          ))}
        </div>
      </BlurFade>

      {/* Список уведомлений */}
      <BlurFade delay={0.3}>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="p-6 rounded-lg border text-center" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Нет уведомлений
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                !notif.read ? 'border-l-4' : ''
              }`}
              style={{
                borderColor: notif.read ? 'var(--color-light-blue)' : 'var(--color-dark-blue)',
                borderLeftColor: !notif.read ? '#dc2626' : undefined,
                background: notif.read ? 'var(--color-white)' : 'var(--color-cream)',
              }}
            >
              <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3
                    className={`font-semibold ${!notif.read ? 'font-bold' : ''}`}
                    style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}
                  >
                    {notif.title}
                  </h3>
                  <button
                    onClick={() => setDeleteConfirm(notif.id)}
                    className="shrink-0 ml-2 p-1 rounded hover:bg-opacity-50 transition-colors"
                    style={{ color: '#dc2626' }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    {notif.date}
                  </span>
                  {!notif.read && (
                    <Button
                      size="sm"
                      onClick={() => markAsRead(notif.id)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        backgroundColor: 'var(--color-dark-blue)',
                        color: 'var(--color-white)',
                      }}
                    >
                      Отметить прочитанным
                    </Button>
                  )}
                  {notif.objectId && (
                    <button
                      onClick={() => router.push(`/app/object/${notif.objectId}`)}
                      className="text-xs underline hover:opacity-70 transition-opacity"
                      style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}
                    >
                      Перейти к объекту
                    </button>
                  )}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </BlurFade>

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Удалить уведомление?"
        message="Вы уверены, что хотите удалить это уведомление? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
        onConfirm={() => deleteConfirm && deleteNotification(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

