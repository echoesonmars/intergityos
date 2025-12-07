'use client';

import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';
import { FileText, Download, FileSpreadsheet, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from './ToastProvider';

export function ReportsView() {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState<string>('summary');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = (format: 'pdf' | 'html') => {
    setIsGenerating(true);
    showToast(`Генерация ${format.toUpperCase()} отчета...`, 'info');
    setTimeout(() => {
      setIsGenerating(false);
      showToast(`Отчет успешно сгенерирован (${format.toUpperCase()})`, 'success');
    }, 2000);
  };

  const handleExport = async (format: 'excel' | 'csv' | 'json') => {
    try {
      if (format === 'json') {
        // Используем бэкенд API для экспорта JSON
        showToast('Экспорт данных в JSON...', 'info');
        
        const response = await fetch('/api/export/json');
        if (!response.ok) {
          throw new Error('Failed to export data');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'defects_export.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast('Данные успешно экспортированы (JSON)', 'success');
      } else {
        // Excel и CSV пока через mock
        showToast(`Экспорт данных в ${format.toUpperCase()}...`, 'info');
        setTimeout(() => {
          showToast(`Данные успешно экспортированы (${format.toUpperCase()})`, 'success');
        }, 2000);
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('Ошибка при экспорте данных', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Отчеты' }]} />
      <BlurFade delay={0.1}>
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
          >
            Отчеты
          </h1>
          <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            Генерация отчетов в формате HTML или PDF
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              Генерация отчетов
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                  Тип отчета
                </label>
                <Select
                  value={reportType}
                  onChange={setReportType}
                  options={[
                    { value: 'summary', label: 'Общая статистика' },
                    { value: 'defects', label: 'Таблица дефектов' },
                    { value: 'excavations', label: 'Рекомендуемые раскопки' },
                    { value: 'map', label: 'Карта участка' },
                  ]}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleGenerateReport('pdf')}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2"
                  style={{
                    fontFamily: 'var(--font-geist)',
                    backgroundColor: 'var(--color-dark-blue)',
                    color: 'var(--color-white)',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </Button>
                <Button
                  onClick={() => handleGenerateReport('html')}
                  disabled={isGenerating}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  style={{
                    fontFamily: 'var(--font-geist)',
                    borderColor: 'var(--color-light-blue)',
                    color: 'var(--color-dark-blue)',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  HTML
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              Экспорт данных
            </h2>
            <div className="space-y-3">
              <Button
                onClick={() => handleExport('excel')}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  fontFamily: 'var(--font-geist)',
                  backgroundColor: 'var(--color-dark-blue)',
                  color: 'var(--color-white)',
                }}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Экспорт в Excel
              </Button>
              <Button
                onClick={() => handleExport('csv')}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                style={{
                  fontFamily: 'var(--font-geist)',
                  borderColor: 'var(--color-light-blue)',
                  color: 'var(--color-dark-blue)',
                }}
              >
                <FileDown className="w-4 h-4" />
                Экспорт в CSV
              </Button>
              <Button
                onClick={() => handleExport('json')}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                style={{
                  fontFamily: 'var(--font-geist)',
                  borderColor: 'var(--color-light-blue)',
                  color: 'var(--color-dark-blue)',
                }}
              >
                <Download className="w-4 h-4" />
                Экспорт в JSON
              </Button>
            </div>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Последние отчеты
          </h2>
          <div className="space-y-2">
            {[
              { name: 'Отчет_2024_01_15.pdf', date: '15.01.2024', type: 'PDF' },
              { name: 'Статистика_2024.html', date: '10.01.2024', type: 'HTML' },
              { name: 'Дефекты_MT-02.pdf', date: '05.01.2024', type: 'PDF' },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded border"
                style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: 'var(--color-blue)' }} />
                  <div>
                    <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {report.name}
                    </div>
                    <div className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                      {report.date} • {report.type}
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded hover:bg-opacity-80 transition-colors" style={{ background: 'var(--color-dark-blue)' }}>
                  <Download className="w-4 h-4" style={{ color: 'var(--color-white)' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

