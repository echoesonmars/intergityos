'use client';

import { useState, useEffect } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';
import { Moon, Sun, Loader2 } from 'lucide-react';
import { useToast } from './ToastProvider';

interface User {
  username: string;
  full_name: string;
  email: string;
  role: string;
}

export function SettingsView() {
  const { showToast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<string>('ru');
  const [units, setUnits] = useState<string>('metric');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const [settingsRes, usersRes] = await Promise.all([
          fetch('/api/users/settings'),
          fetch('/api/users/list'),
        ]);

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setTheme(settings.theme || 'light');
          setLanguage(settings.language || 'ru');
          setUnits(settings.units || 'metric');
          
          // Apply theme
          if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast(`Тема изменена на ${newTheme === 'dark' ? 'темную' : 'светлую'}`, 'success');
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/users/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          language,
          units,
        }),
      });

      if (response.ok) {
        showToast('Настройки сохранены', 'success');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Ошибка при сохранении настроек', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Настройки' }]} />
      <BlurFade delay={0.1}>
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
          >
            Настройки
          </h1>
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
                value={language}
                onChange={setLanguage}
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
                value={units}
                onChange={setUnits}
                options={[
                  { value: 'metric', label: 'Метрические' },
                  { value: 'imperial', label: 'Имперские' },
                ]}
              />
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full p-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              style={{
                fontFamily: 'var(--font-geist)',
                backgroundColor: 'var(--color-dark-blue)',
                color: 'var(--color-white)',
              }}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
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
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
                <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Загрузка пользователей...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {users.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Пользователи не найдены
                </p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.username}
                    className="p-3 rounded-lg border flex items-center justify-between"
                    style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}
                  >
                    <div>
                      <div className="font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {user.full_name || user.username}
                      </div>
                      <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                        {user.role || 'Пользователь'} • {user.email || `${user.username}@integrityos.kz`}
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
                ))
              )}
            </div>
          )}
        </div>
      </BlurFade>
    </div>
  );
}

