'use client';

import { useState, useEffect } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Breadcrumbs } from './Breadcrumbs';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from './ToastProvider';

interface AIAnalysisData {
  totalAnalyzed: number;
  normal: number;
  medium: number;
  high: number;
  defectsWithoutSeverity?: number;
  modelAccuracy: string;
  lastTraining: string;
  algorithm: string;
  predictions: Array<{
    objectId: number;
    objectName: string;
    defectId?: string;
    currentRisk: string;
    predictedRisk: string;
    confidence: number;
    factors: string[];
  }>;
}

export function AIAnalysisView() {
  const { showToast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<AIAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/ai-analysis');
      if (!response.ok) {
        throw new Error('Failed to fetch AI analysis');
      }

      const analysisData = await response.json();
      setData(analysisData);
    } catch (err) {
      console.error('Error fetching AI analysis:', err);
      setError('Не удалось загрузить AI анализ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'predict_all' }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        showToast(result.message || 'Анализ завершён!', 'success');
        // Refresh data
        await fetchData();
      } else {
        showToast(result.error || 'Ошибка анализа', 'error');
      }
    } catch (err) {
      console.error('Error running analysis:', err);
      showToast('Ошибка при запуске анализа', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'AI-анализ' }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-blue)' }} />
            <p style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Загрузка AI анализа...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'AI-анализ' }]} />
        <div className="p-6 rounded-lg border" style={{ borderColor: '#dc2626', background: 'var(--color-white)' }}>
          <p style={{ fontFamily: 'var(--font-geist)', color: '#dc2626' }}>
            {error || 'Не удалось загрузить данные'}
          </p>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#ffbd2e';
      case 'normal':
        return '#28ca42';
      default:
        return '#94B4C1';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'Высокая';
      case 'medium':
        return 'Средняя';
      case 'normal':
        return 'Норма';
      default:
        return risk;
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'AI-анализ' }]} />
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            >
              AI-анализ критичности
            </h1>
            <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Машинное обучение для классификации и прогнозирования рисков
            </p>
          </div>
          <Button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-geist)',
              backgroundColor: 'var(--color-dark-blue)',
              color: 'var(--color-white)',
            }}
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {isAnalyzing ? 'Анализ...' : 'Запустить анализ'}
          </Button>
        </div>
      </BlurFade>

      {/* Статистика модели */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                Точность модели
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {data.modelAccuracy}%
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Проанализировано
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {data.totalAnalyzed}
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Последнее обучение
            </div>
            <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
              {data.lastTraining}
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
            <div className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              Алгоритм
            </div>
            <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
              {data.algorithm}
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Распределение рисков */}
      <BlurFade delay={0.3}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Распределение рисков (ML прогноз)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ background: 'var(--color-cream)' }}>
              <CheckCircle className="h-8 w-8" style={{ color: '#28ca42' }} />
              <div>
                <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Норма
                </div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                  {data.normal}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ background: 'var(--color-cream)' }}>
              <TrendingUp className="h-8 w-8" style={{ color: '#ffbd2e' }} />
              <div>
                <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Средняя
                </div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                  {data.medium}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ background: 'var(--color-cream)' }}>
              <AlertTriangle className="h-8 w-8" style={{ color: '#dc2626' }} />
              <div>
                <div className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Высокая
                </div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                  {data.high}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Прогнозы */}
      <BlurFade delay={0.4}>
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
            Прогнозы критичности
          </h2>
          <div className="space-y-4">
            {data.predictions.map((pred) => (
              <div
                key={pred.objectId}
                className="p-4 rounded-lg border"
                style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-cream)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                      {pred.objectName}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                          Текущий:
                        </span>
                        <span
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: getRiskColor(pred.currentRisk) }}
                        >
                          {getRiskLabel(pred.currentRisk)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                          Прогноз:
                        </span>
                        <span
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: getRiskColor(pred.predictedRisk) }}
                        >
                          {getRiskLabel(pred.predictedRisk)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                          Уверенность:
                        </span>
                        <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                          {pred.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                  {pred.currentRisk !== pred.predictedRisk && (
                    <XCircle className="h-5 w-5 shrink-0" style={{ color: '#dc2626' }} />
                  )}
                </div>
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-light-blue)' }}>
                  <div className="text-xs font-semibold mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    Факторы риска:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pred.factors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded text-xs"
                        style={{ background: 'var(--color-white)', color: 'var(--color-dark-blue)', fontFamily: 'var(--font-geist)' }}
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

