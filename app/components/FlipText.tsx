'use client';

import { FlipWords } from '@/components/ui/flip-words';

export default function FlipText() {
  const flipWords = [
    'Импорт данных',
    'визуализация на карте',
    'AI-анализ критичности',
    'отчеты'
  ];

  return (
    <span className="inline-flex items-baseline">
      <FlipWords 
        words={flipWords} 
        duration={3000}
        className="inline-block px-0"
      />
      <span className="inline-block ml-1">в один клик.</span>
    </span>
  );
}

