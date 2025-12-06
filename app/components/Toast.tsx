'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" style={{ color: '#28ca42' }} />;
      case 'error':
        return <AlertCircle className="h-5 w-5" style={{ color: '#dc2626' }} />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" style={{ color: '#ffbd2e' }} />;
      default:
        return <Info className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg flex items-center gap-3 min-w-[300px] max-w-md transition-all ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      style={{
        borderColor: 'var(--color-light-blue)',
        background: 'var(--color-white)',
        fontFamily: 'var(--font-geist)',
      }}
    >
      {getIcon()}
      <span className="flex-1" style={{ color: 'var(--color-dark-blue)' }}>
        {message}
      </span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="p-1 rounded hover:bg-opacity-50 transition-colors"
        style={{ color: 'var(--color-blue)' }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

