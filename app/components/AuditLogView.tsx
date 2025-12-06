'use client';

import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { History, User, FileEdit, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock данные
const mockLogs = [
  { id: 1, user: 'Иванов И.И.', action: 'created', entity: 'Объект', entityName: 'Кран подвесной', date: '2024-01-20 14:30', ip: '192.168.1.1' },
  { id: 2, user: 'Петров П.П.', action: 'updated', entity: 'Диагностика', entityName: 'Обследование #123', date: '2024-01-20 13:15', ip: '192.168.1.2' },
  { id: 3, user: 'Сидоров С.С.', action: 'deleted', entity: 'Дефект', entityName: 'Дефект #45', date: '2024-01-19 16:45', ip: '192.168.1.3' },
  { id: 4, user: 'Иванов И.И.', action: 'imported', entity: 'Данные', entityName: 'Diagnostics.csv', date: '2024-01-19 10:20', ip: '192.168.1.1' },
];

export function AuditLogView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

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

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'История действий' }]} />
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <TextAnimate
              as="h1"
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
              by="word"
              animation="blurInUp"
            >
              История действий
            </TextAnimate>
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
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full p-2 rounded border"
              style={{
                borderColor: 'var(--color-light-blue)',
                background: 'var(--color-white)',
                fontFamily: 'var(--font-geist)',
                color: 'var(--color-dark-blue)',
              }}
            >
              <option value="all">Все действия</option>
              <option value="created">Создание</option>
              <option value="updated">Обновление</option>
              <option value="deleted">Удаление</option>
              <option value="imported">Импорт</option>
            </select>
          </div>
        </div>
      </BlurFade>

      {/* Таблица логов */}
      <BlurFade delay={0.3}>
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
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t"
                    style={{ borderColor: 'var(--color-light-blue)' }}
                  >
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {log.date}
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
                        <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                          {log.user}
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
                      {log.entity}
                    </td>
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {log.entityName}
                    </td>
                    <td className="p-3 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {log.ip}
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

