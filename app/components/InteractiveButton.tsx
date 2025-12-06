'use client';

import { motion } from 'motion/react';

export default function InteractiveButton() {
  return (
    <motion.a
      href="#"
      className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-lg relative overflow-hidden"
      style={{ 
        fontFamily: 'var(--font-geist)',
        backgroundColor: 'var(--color-dark-blue)',
        color: 'var(--color-white)'
      }}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: 'var(--color-blue)',
        boxShadow: '0 20px 40px rgba(33, 52, 72, 0.4)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.span
        className="relative z-10"
        initial={{ x: 0 }}
        whileHover={{ x: 2 }}
      >
        Начать бесплатно
      </motion.span>
      <motion.svg 
        className="w-5 h-5 relative z-10" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 7l5 5m0 0l-5 5m5-5H6" 
        />
      </motion.svg>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.a>
  );
}

