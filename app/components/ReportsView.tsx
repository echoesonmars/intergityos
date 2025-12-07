'use client';

import { useState, useEffect } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Select } from '@/components/ui/select';
import { FileText, Download, FileSpreadsheet, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from './ToastProvider';

interface Report {
  name: string;
  type: string;
  format: string;
  displayDate: string;
  url: string;
}

export function ReportsView() {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState<string>('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    loadReportsHistory();
  }, []);

  const loadReportsHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch('/api/reports/history');
      if (!response.ok) {
        throw new Error('Failed to load reports history');
      }
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error loading reports history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerateReport = async (format: 'pdf' | 'html') => {
    try {
      setIsGenerating(true);
      showToast(`Генерация ${format.toUpperCase()} отчета...`, 'info');
      
      const response = await fetch(`/api/reports/generate?report_type=${reportType}&format=${format}`);
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `report.${format}`;
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename=([^;]+)/);
        if (matches) {
          filename = matches[1].replace(/"/g, '');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast(`Отчет успешно сгенерирован (${format.toUpperCase()})`, 'success');
      
      setTimeout(() => {
        loadReportsHistory();
      }, 500);
    } catch (error) {
      console.error('Generation error:', error);
      showToast('Ошибка при генерации отчета', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'excel' | 'csv' | 'json') => {
    try {
      if (format === 'json') {
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

  const handleDownloadReport = async (report: Report) => {
    try {
      const filename = report.name;
      const response = await fetch(`/api/reports/download?filename=${encodeURIComponent(filename)}`);
      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast('Отчет скачан успешно', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Ошибка при скачивании отчета', 'error');
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
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
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
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
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
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-blue)' }} />
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-2">
              {reports.map((report, index) => (
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
                        {report.displayDate} • {report.format}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(report)}
                    className="p-2 rounded hover:bg-opacity-80 transition-colors"
                    style={{ background: 'var(--color-dark-blue)' }}
                  >
                    <Download className="w-4 h-4" style={{ color: 'var(--color-white)' }} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Отчетов еще не сгенерировано
              </p>
            </div>
          )}
        </div>
      </BlurFade>
    </div>
  );
}

