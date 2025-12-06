'use client';

import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { User, Mail, Phone, Building, Save, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Иванов Иван Иванович',
    email: 'user@integrityos.kz',
    phone: '+7 (700) 123-45-67',
    organization: 'ТОО "Интегрити ОС"',
    position: 'Инженер по диагностике',
    department: 'Отдел технического контроля',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Здесь будет логика сохранения данных
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Здесь можно восстановить исходные данные
  };

  return (
    <div className="space-y-6">
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
              Профиль
            </TextAnimate>
            <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Управление личными данными и настройками
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
              style={{
                fontFamily: 'var(--font-geist)',
                backgroundColor: 'var(--color-dark-blue)',
                color: 'var(--color-white)',
              }}
            >
              <Edit2 className="h-4 w-4" />
              Редактировать
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                style={{
                  fontFamily: 'var(--font-geist)',
                  borderColor: 'var(--color-light-blue)',
                  color: 'var(--color-dark-blue)',
                }}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-geist)',
                  backgroundColor: 'var(--color-dark-blue)',
                  color: 'var(--color-white)',
                }}
              >
                <Save className="h-4 w-4" />
                Сохранить
              </Button>
            </div>
          )}
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - Аватар и основная информация */}
        <BlurFade delay={0.2}>
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-dark-blue)' }}>
                  <User className="h-12 w-12" style={{ color: 'var(--color-white)' }} />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                    {formData.fullName}
                  </h2>
                  <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    {formData.position}
                  </p>
                </div>
                <div className="w-full pt-4 border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
                      <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.organization}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
                      <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
                      <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Правая колонка - Форма редактирования */}
        <BlurFade delay={0.3}>
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                Личная информация
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    ФИО
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        borderColor: 'var(--color-light-blue)',
                      }}
                    />
                  ) : (
                    <div className="p-2 rounded border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}>
                      <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.fullName}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        borderColor: 'var(--color-light-blue)',
                      }}
                    />
                  ) : (
                    <div className="p-2 rounded border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}>
                      <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.email}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Телефон
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        borderColor: 'var(--color-light-blue)',
                      }}
                    />
                  ) : (
                    <div className="p-2 rounded border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}>
                      <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.phone}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Организация
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        borderColor: 'var(--color-light-blue)',
                      }}
                    />
                  ) : (
                    <div className="p-2 rounded border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}>
                      <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.organization}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Должность
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        borderColor: 'var(--color-light-blue)',
                      }}
                    />
                  ) : (
                    <div className="p-2 rounded border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}>
                      <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.position}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Отдел
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        borderColor: 'var(--color-light-blue)',
                      }}
                    />
                  ) : (
                    <div className="p-2 rounded border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}>
                      <span style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                        {formData.department}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}

