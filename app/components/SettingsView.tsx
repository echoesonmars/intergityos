'use client';

import { useState, useEffect } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';
import { Moon, Sun } from 'lucide-react';
import { useToast } from './ToastProvider';

export function SettingsView() {
  const { showToast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast(`Тема изменена на ${newTheme === 'dark' ? 'темную' : 'светлую'}`, 'success');
  };

  const handleSaveSettings = () => {
    showToast('Настройки сохранены', 'success');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Настройки' }]} />
      <BlurFade delay={0.1}>
        <div>
          <TextAnimate
            as="h1"
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            by="word"
            animation="blurInUp"
          >
            Настройки
          </TextAnimate>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Настройки системы и параметры
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Настройки системы
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                Тема оформления
              </label>
              <button
                onClick={toggleTheme}
                className="w-full p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors"
                style={{
                  borderColor: 'var(--color-light-blue)',
                  background: 'var(--color-white)',
                  fontFamily: 'var(--font-geist)',
                  color: 'var(--color-dark-blue)',
                }}
              >
                {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {theme === 'light' ? 'Светлая тема' : 'Темная тема'}
              </button>
            </div>
            <div>
              <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                Язык интерфейса
              </label>
              <Select
                value="ru"
                onChange={() => {}}
                options={[
                  { value: 'ru', label: 'Русский' },
                  { value: 'kz', label: 'Қазақша' },
                  { value: 'en', label: 'English' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                Единицы измерения
              </label>
              <Select
                value="metric"
                onChange={() => {}}
                options={[
                  { value: 'metric', label: 'Метрические' },
                  { value: 'imperial', label: 'Имперские' },
                ]}
              />
            </div>
            <button
              onClick={handleSaveSettings}
              className="w-full p-3 rounded-lg font-semibold transition-colors"
              style={{
                fontFamily: 'var(--font-geist)',
                backgroundColor: 'var(--color-dark-blue)',
                color: 'var(--color-white)',
              }}
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      </BlurFade>

      {/* Управление пользователями */}
      <BlurFade delay={0.3}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Управление пользователями
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Иванов И.И.', role: 'Администратор', email: 'ivanov@integrityos.kz' },
              { name: 'Петров П.П.', role: 'Инженер', email: 'petrov@integrityos.kz' },
              { name: 'Сидоров С.С.', role: 'Оператор', email: 'sidorov@integrityos.kz' },
            ].map((user, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border flex items-center justify-between"
                style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}
              >
                <div>
                  <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    {user.name}
                  </div>
                  <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    {user.role} • {user.email}
                  </div>
                </div>
                <button
                  className="px-3 py-1 rounded text-sm border transition-colors"
                  style={{
                    borderColor: 'var(--color-light-blue)',
                    fontFamily: 'var(--font-geist)',
                    color: 'var(--color-dark-blue)',
                  }}
                >
                  Изменить
                </button>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

