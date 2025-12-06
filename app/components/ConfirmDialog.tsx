'use client';

import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div
              className="p-6 rounded-xl border max-w-md w-full mx-4 pointer-events-auto shadow-2xl"
              style={{
                borderColor: 'var(--color-light-blue)',
                background: 'var(--color-white)',
                boxShadow: '0 20px 60px rgba(33, 52, 72, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="p-2 rounded-lg shrink-0"
                  style={{ background: `${getVariantColor()}15` }}
                >
                  <AlertTriangle className="h-5 w-5" style={{ color: getVariantColor() }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-lg" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                    {message}
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className="p-1.5 rounded-lg hover:bg-opacity-50 transition-colors shrink-0"
                  style={{ color: 'var(--color-blue)' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="transition-all hover:scale-105"
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
                  className="transition-all hover:scale-105"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

