'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';

export function SettingsView() {
  return (
    <div className="space-y-6">
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
                Язык интерфейса
              </label>
              <select
                className="w-full p-2 rounded border"
                style={{ 
                  borderColor: 'var(--color-light-blue)', 
                  background: 'var(--color-white)',
                  fontFamily: 'var(--font-geist)',
                  color: 'var(--color-dark-blue)'
                }}
              >
                <option value="ru">Русский</option>
                <option value="kz">Қазақша</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                Единицы измерения
              </label>
              <select
                className="w-full p-2 rounded border"
                style={{ 
                  borderColor: 'var(--color-light-blue)', 
                  background: 'var(--color-white)',
                  fontFamily: 'var(--font-geist)',
                  color: 'var(--color-dark-blue)'
                }}
              >
                <option value="metric">Метрические</option>
                <option value="imperial">Имперские</option>
              </select>
            </div>
            <button
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
    </div>
  );
}

