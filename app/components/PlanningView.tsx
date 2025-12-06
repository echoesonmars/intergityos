'use client';

import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from './ToastProvider';

// Mock данные
const mockTasks = [
  {
    id: 1,
    title: 'Обследование крана подвесного',
    objectName: 'Кран подвесной',
    date: '2024-01-25',
    time: '09:00',
    assignedTo: 'Иванов И.И.',
    status: 'planned',
    method: 'VIK',
  },
  {
    id: 2,
    title: 'Плановый осмотр компрессора',
    objectName: 'Турбокомпрессор ТВ-80-1',
    date: '2024-01-26',
    time: '14:00',
    assignedTo: 'Петров П.П.',
    status: 'in_progress',
    method: 'PVK',
  },
  {
    id: 3,
    title: 'Диагностика участка трубы',
    objectName: 'Участок трубы №45',
    date: '2024-01-24',
    time: '10:30',
    assignedTo: 'Сидоров С.С.',
    status: 'completed',
    method: 'MPK',
  },
];

export function PlanningView() {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState(mockTasks);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#28ca42';
      case 'in_progress':
        return '#ffbd2e';
      case 'planned':
        return 'var(--color-blue)';
      default:
        return 'var(--color-light-blue)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in_progress':
        return 'В работе';
      case 'planned':
        return 'Запланировано';
      default:
        return status;
    }
  };

  const handleStartTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: 'in_progress' as const } : task))
    );
    showToast('Задача начата', 'success');
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: 'completed' as const } : task))
    );
    showToast('Задача завершена', 'success');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Планирование' }]} />
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
              Планирование работ
            </TextAnimate>
            <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Календарь плановых обследований и работ
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-geist)',
              backgroundColor: 'var(--color-dark-blue)',
              color: 'var(--color-white)',
            }}
          >
            <Calendar className="h-4 w-4" />
            Создать задачу
          </Button>
        </div>
      </BlurFade>

      {/* Календарь */}
      <BlurFade delay={0.2}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 rounded border"
              style={{
                borderColor: 'var(--color-light-blue)',
                fontFamily: 'var(--font-geist)',
                color: 'var(--color-dark-blue)',
              }}
            />
            <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Выберите дату для просмотра задач
            </span>
          </div>
        </div>
      </BlurFade>

      {/* Список задач */}
      <BlurFade delay={0.3}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-lg border"
              style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {task.title}
                    </h3>
                    <span
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                  <div className="text-sm mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    Объект: {task.objectName}
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {task.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {task.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {task.assignedTo}
                    </div>
                    <div className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-cream)', color: 'var(--color-dark-blue)' }}>
                      {task.method}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.status === 'planned' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartTask(task.id)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        borderColor: 'var(--color-light-blue)',
                        color: 'var(--color-dark-blue)',
                      }}
                    >
                      Начать
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Button
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleCompleteTask(task.id)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        backgroundColor: '#28ca42',
                        color: 'var(--color-white)',
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Завершить
                    </Button>
                  )}
                  {task.status === 'completed' && (
                    <CheckCircle className="h-5 w-5" style={{ color: '#28ca42' }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </BlurFade>
    </div>
  );
}

