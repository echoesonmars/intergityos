'use client';

import { useState, useEffect } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Calendar, Clock, User, CheckCircle, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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
  description?: string;
}

interface NewTask {
  title: string;
  object_name: string;
  date: string;
  time: string;
  assigned_to: string;
  method: string;
  description: string;
}

export function PlanningView() {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    object_name: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    assigned_to: '',
    method: '',
    description: '',
  });

  const methods = ['MFL', 'TFI', 'VIK', 'UZK', 'RGK', 'TVK'];

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

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

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.object_name || !newTask.assigned_to) {
      showToast('Заполните обязательные поля', 'error');
      return;
    }

    try {
      setIsCreating(true);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        showToast('Задача создана', 'success');
        setShowCreateModal(false);
        setNewTask({
          title: '',
          object_name: '',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          assigned_to: '',
          method: '',
          description: '',
        });
        // Refresh tasks if the new task is for selected date
        if (newTask.date === selectedDate) {
          fetchTasks();
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showToast('Ошибка при создании задачи', 'error');
    } finally {
      setIsCreating(false);
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
            onClick={() => setShowCreateModal(true)}
            style={{
              fontFamily: 'var(--font-geist)',
              backgroundColor: 'var(--color-dark-blue)',
              color: 'var(--color-white)',
            }}
          >
            <Plus className="h-4 w-4" />
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

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--color-white)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
              >
                Новая задача
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-medium" style={{ color: 'var(--color-dark-blue)' }}>
                  Название задачи *
                </label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Например: Диагностика участка №5"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium" style={{ color: 'var(--color-dark-blue)' }}>
                  Объект *
                </label>
                <Input
                  value={newTask.object_name}
                  onChange={(e) => setNewTask({ ...newTask, object_name: e.target.value })}
                  placeholder="Например: Трубопровод MT-03"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 font-medium" style={{ color: 'var(--color-dark-blue)' }}>
                    Дата *
                  </label>
                  <Input
                    type="date"
                    value={newTask.date}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium" style={{ color: 'var(--color-dark-blue)' }}>
                    Время *
                  </label>
                  <Input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium" style={{ color: 'var(--color-dark-blue)' }}>
                  Ответственный *
                </label>
                <Input
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                  placeholder="ФИО исполнителя"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium" style={{ color: 'var(--color-dark-blue)' }}>
                  Метод диагностики
                </label>
                <Select
                  value={newTask.method}
                  onChange={(value) => setNewTask({ ...newTask, method: value })}
                  options={[
                    { value: '', label: 'Выберите метод' },
                    ...methods.map((m) => ({ value: m, label: m })),
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium" style={{ color: 'var(--color-dark-blue)' }}>
                  Описание
                </label>
                <textarea
                  className="w-full p-2 border rounded-md resize-none"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Дополнительная информация о задаче"
                  style={{ borderColor: 'var(--color-light-blue)' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                  style={{ borderColor: 'var(--color-light-blue)', color: 'var(--color-dark-blue)' }}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateTask}
                  disabled={isCreating}
                  style={{ backgroundColor: 'var(--color-dark-blue)', color: 'var(--color-white)' }}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Создание...
                    </>
                  ) : (
                    'Создать'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

