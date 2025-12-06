'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm" style={{ fontFamily: 'var(--font-geist)' }}>
      <Link
        href="/app"
        className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--color-blue)' }}
      >
        <Home className="h-4 w-4" />
        <span>Главная</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" style={{ color: 'var(--color-light-blue)' }} />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-blue)' }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--color-dark-blue)' }}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

