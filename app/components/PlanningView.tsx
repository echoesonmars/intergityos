'use client';

import { useState, useEffect } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Calendar, Clock, User, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from './ToastProvider';

interface Task {
  task_id: string;
  id?: number; // For compatibility
  title: string;
  object_name: string;
  date: string;
  time: string;
  assigned_to: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  method?: string;
}

export function PlanningView() {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/tasks?date=${selectedDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        // Transform backend tasks to frontend format
        const transformedTasks = data.map((task: Task, index: number) => ({
          ...task,
          id: index + 1, // Add id for compatibility
        }));
        setTasks(transformedTasks);
      } catch (err: unknown) {
        console.error('Error fetching tasks:', err);
        setError('Не удалось загрузить задачи');
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDate]);

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

  const handleStartTask = async (taskId: string | number) => {
    try {
      const taskIdStr = typeof taskId === 'number' ? tasks.find(t => t.id === taskId)?.task_id || String(taskId) : taskId;
      const response = await fetch(`/api/tasks/${taskIdStr}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => (task.task_id === taskIdStr ? { ...task, ...updatedTask, status: 'in_progress' as const } : task))
        );
        showToast('Задача начата', 'success');
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error starting task:', error);
      showToast('Ошибка при обновлении задачи', 'error');
    }
  };

  const handleCompleteTask = async (taskId: string | number) => {
    try {
      const taskIdStr = typeof taskId === 'number' ? tasks.find(t => t.id === taskId)?.task_id || String(taskId) : taskId;
      const response = await fetch(`/api/tasks/${taskIdStr}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => (task.task_id === taskIdStr ? { ...task, ...updatedTask, status: 'completed' as const } : task))
        );
        showToast('Задача завершена', 'success');
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      showToast('Ошибка при обновлении задачи', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Планирование' }]} />
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            >
              Планирование работ
            </h1>
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
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
              <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Загрузка задач...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 rounded-lg border" style={{ borderColor: '#dc2626', background: 'var(--color-white)' }}>
            <p style={{ fontFamily: 'var(--font-geist)', color: '#dc2626' }}>
              {error}
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              На выбранную дату задач не найдено
            </p>
          </div>
        ) : (
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
                    Объект: {task.object_name}
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
                      {task.assigned_to}
                    </div>
                    {task.method && (
                      <div className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-cream)', color: 'var(--color-dark-blue)' }}>
                        {task.method}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.status === 'planned' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartTask(task.task_id || task.id || '')}
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
                      onClick={() => handleCompleteTask(task.task_id || task.id || '')}
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
        )}
      </BlurFade>
    </div>
  );
}

