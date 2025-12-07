'use client';

import { useState, useEffect } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';
import { History, User, FileEdit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AuditLog {
  log_id: string;
  id?: number; // For compatibility
  username: string;
  user?: string; // For compatibility
  action: string;
  entity_type: string;
  entity?: string; // For compatibility
  entity_id?: string;
  entityName?: string; // For compatibility
  timestamp: string;
  date?: string; // For compatibility
  ip_address?: string;
  ip?: string; // For compatibility
}

export function AuditLogView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (filterAction !== 'all') {
          params.append('action', filterAction);
        }
        const response = await fetch(`/api/audit-logs?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        const data = await response.json();
        // Transform backend logs to frontend format
        const transformedLogs = data.map((log: AuditLog, index: number) => ({
          ...log,
          id: index + 1,
          user: log.username,
          entity: log.entity_type,
          entityName: log.entity_id || log.entity_type,
          date: new Date(log.timestamp).toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          ip: log.ip_address,
        }));
        setLogs(transformedLogs);
      } catch (err: unknown) {
        console.error('Error fetching audit logs:', err);
        setError('Не удалось загрузить историю действий');
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [filterAction]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="h-4 w-4" style={{ color: '#28ca42' }} />;
      case 'updated':
        return <FileEdit className="h-4 w-4" style={{ color: '#ffbd2e' }} />;
      case 'deleted':
        return <Trash2 className="h-4 w-4" style={{ color: '#dc2626' }} />;
      default:
        return <History className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created':
        return 'Создано';
      case 'updated':
        return 'Обновлено';
      case 'deleted':
        return 'Удалено';
      case 'imported':
        return 'Импортировано';
      default:
        return action;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const user = log.user || log.username || '';
    const entityName = log.entityName || log.entity_id || log.entity_type || '';
    const matchesSearch = user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entityName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'История действий' }]} />
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            >
              История действий
            </h1>
            <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Лог всех действий пользователей в системе
            </p>
          </div>
        </div>
      </BlurFade>

      {/* Фильтры */}
      <BlurFade delay={0.2}>
        <div className="flex flex-wrap gap-4 p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Поиск по пользователю или объекту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                fontFamily: 'var(--font-geist)',
                borderColor: 'var(--color-light-blue)',
              }}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Select
              value={filterAction}
              onChange={setFilterAction}
              options={[
                { value: 'all', label: 'Все действия' },
                { value: 'created', label: 'Создание' },
                { value: 'updated', label: 'Обновление' },
                { value: 'deleted', label: 'Удаление' },
                { value: 'imported', label: 'Импорт' },
              ]}
            />
          </div>
        </div>
      </BlurFade>

      {/* Таблица логов */}
      <BlurFade delay={0.3}>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
              <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Загрузка истории действий...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 rounded-lg border" style={{ borderColor: '#dc2626', background: 'var(--color-white)' }}>
            <p style={{ fontFamily: 'var(--font-geist)', color: '#dc2626' }}>
              {error}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: 'var(--color-cream)' }}>
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      Дата/Время
                    </th>
                    <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      Пользователь
                    </th>
                    <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      Действие
                    </th>
                    <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      Сущность
                    </th>
                    <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      Название
                    </th>
                    <th className="p-3 text-left text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      IP адрес
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        История действий пуста
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t"
                    style={{ borderColor: 'var(--color-light-blue)' }}
                  >
                      <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {log.date || new Date(log.timestamp).toLocaleString('ru-RU')}
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
                          <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                            {log.user || log.username}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                            {getActionLabel(log.action)}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        {log.entity || log.entity_type}
                      </td>
                      <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {log.entityName || log.entity_id || '-'}
                      </td>
                      <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        {log.ip || log.ip_address || '-'}
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </BlurFade>
    </div>
  );
}

