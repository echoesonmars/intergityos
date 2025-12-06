'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, placeholder = 'Выберите...', className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const dropdownHeight = 240; // Примерная высота dropdown
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Определяем, где больше места - сверху или снизу
        const showBelow = spaceBelow >= dropdownHeight || spaceBelow > spaceAbove;
        
        let top: number;
        if (showBelow) {
          // Показываем снизу
          top = rect.bottom + window.scrollY + 8;
        } else {
          // Показываем сверху
          top = rect.top + window.scrollY - dropdownHeight - 8;
        }
        
        // Проверяем горизонтальные границы
        let left = rect.left + window.scrollX;
        const dropdownWidth = rect.width;
        if (left + dropdownWidth > viewportWidth + window.scrollX) {
          left = viewportWidth + window.scrollX - dropdownWidth - 10;
        }
        if (left < window.scrollX) {
          left = window.scrollX + 10;
        }
        
        setPosition({
          top,
          left,
          width: rect.width,
        });
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      updatePosition();
      
      // Закрываем dropdown при скролле (стандартное поведение)
      const handleScroll = () => {
        setIsOpen(false);
      };
      
      // Обновляем позицию только при изменении размера окна
      const handleResize = () => {
        updatePosition();
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  const dropdownContent = (
    <AnimatePresence>
      {isOpen && position.width > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed rounded-lg border shadow-lg overflow-hidden"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${Math.max(position.width, 200)}px`,
            maxWidth: '90vw',
            zIndex: 9999,
            borderColor: 'var(--color-light-blue)',
            background: 'var(--color-white)',
            boxShadow: '0 10px 40px rgba(33, 52, 72, 0.15)',
          }}
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left flex items-center justify-between transition-colors hover:bg-opacity-50"
                style={{
                  background: value === option.value ? 'var(--color-cream)' : 'transparent',
                  fontFamily: 'var(--font-geist)',
                  color: 'var(--color-dark-blue)',
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="h-4 w-4" style={{ color: 'var(--color-dark-blue)' }} />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div ref={selectRef} className={`relative ${className}`}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2.5 rounded-lg border flex items-center justify-between transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            borderColor: isOpen ? 'var(--color-dark-blue)' : 'var(--color-light-blue)',
            background: 'var(--color-white)',
            fontFamily: 'var(--font-geist)',
            color: 'var(--color-dark-blue)',
            '--tw-ring-color': 'var(--color-dark-blue)',
          } as React.CSSProperties}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--color-blue)' }}
          />
        </button>
      </div>
      {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </>
  );
}

