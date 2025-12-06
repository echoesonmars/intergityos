'use client';

import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { FileUpload } from '@/components/ui/file-upload';

export function ImportView() {
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return;

    setUploadStatus('Загрузка файлов...');

    // Симуляция загрузки
    setTimeout(() => {
      setUploadStatus(`Успешно загружено ${files.length} файл(ов)`);
    }, 2000);
  };

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
            Импорт данных
          </TextAnimate>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Загрузите CSV или XLSX файлы с данными объектов и диагностик
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                Выберите файлы (CSV, XLSX)
              </label>
              <FileUpload onChange={handleFileChange} />
            </div>

            {uploadStatus && (
              <div className="p-3 rounded" style={{ background: 'var(--color-cream)' }}>
                <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                  {uploadStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Формат данных
          </h2>
          <div className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            <p>• <strong>Objects.csv</strong> - таблица объектов контроля (object_id, object_name, object_type, pipeline_id, lat, lon, year, material)</p>
            <p>• <strong>Diagnostics.csv</strong> - таблица результатов диагностик (diag_id, object_id, method, date, defect_found, quality_grade, param1-3, ml_label)</p>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

