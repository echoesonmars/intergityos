'use client';

import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
  variant = 'info',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getVariantColor = () => {
    switch (variant) {
      case 'danger':
        return '#dc2626';
      case 'warning':
        return '#ffbd2e';
      default:
        return 'var(--color-blue)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="p-6 rounded-lg border max-w-md w-full mx-4"
        style={{
          borderColor: 'var(--color-light-blue)',
          background: 'var(--color-white)',
        }}
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: getVariantColor() }} />
          <div className="flex-1">
            <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-opacity-50 transition-colors"
            style={{ color: 'var(--color-blue)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            style={{
              fontFamily: 'var(--font-geist)',
              borderColor: 'var(--color-light-blue)',
              color: 'var(--color-dark-blue)',
            }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            style={{
              fontFamily: 'var(--font-geist)',
              backgroundColor: getVariantColor(),
              color: 'var(--color-white)',
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

