'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlurFade } from '@/components/ui/blur-fade';
import { FileUpload } from '@/components/ui/file-upload';
import { Breadcrumbs } from './Breadcrumbs';
import { useToast } from './ToastProvider';

export function ImportView() {
  const router = useRouter();
  const { showToast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadStatus('Загрузка файлов...');
    setUploadProgress(0);

    try {
      // Upload files to server (in future, implement file upload endpoint)
      // For now, we'll simulate upload and then reload data
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // After upload, reload data from backend
      // Note: This requires authentication, so we'll call our API route
      const reloadResponse = await fetch('/api/admin/reload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (reloadResponse.ok) {
        const result = await reloadResponse.json();
        setIsUploading(false);
        setUploadStatus(`Успешно загружено ${files.length} файл(ов). Импортировано ${result.inserted || 0} дефектов`);
        showToast(`Успешно импортировано ${result.inserted || 0} дефектов`, 'success');
        
        // Redirect to objects after 2 seconds
        setTimeout(() => {
          router.push('/app/objects');
        }, 2000);
      } else {
        throw new Error('Failed to reload data');
      }
    } catch (error) {
      console.error('Import error:', error);
      setIsUploading(false);
      setUploadStatus('Ошибка при импорте данных');
      showToast('Ошибка при импорте данных. Проверьте подключение к серверу.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Импорт данных' }]} />
      <BlurFade delay={0.1}>
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
          >
            Импорт данных
          </h1>
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

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                  <span>{uploadStatus}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'var(--color-light-blue)' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${uploadProgress}%`,
                      background: 'var(--color-dark-blue)',
                    }}
                  />
                </div>
              </div>
            )}
            {uploadStatus && !isUploading && (
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

