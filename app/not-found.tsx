'use client';

import Link from 'next/link';
import { Home, Search, AlertCircle } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-white)' }}>
      <div className="max-w-2xl w-full text-center space-y-8">
        <BlurFade delay={0.1}>
          <div className="flex justify-center mb-6">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-blue) 100%)',
                boxShadow: '0 20px 60px rgba(33, 52, 72, 0.3)',
              }}
            >
              <AlertCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <TextAnimate
            as="h1"
            className="text-6xl md:text-8xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            by="character"
            animation="blurInUp"
          >
            404
          </TextAnimate>
        </BlurFade>

        <BlurFade delay={0.3}>
          <TextAnimate
            as="h2"
            className="text-2xl md:text-3xl font-semibold mb-4"
            style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
            by="word"
            animation="blurInUp"
          >
            Страница не найдена
          </TextAnimate>
        </BlurFade>

        <BlurFade delay={0.4}>
          <p className="text-lg md:text-xl mb-8" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </BlurFade>

        <BlurFade delay={0.5}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button
                className="flex items-center gap-2 px-6 py-3"
                style={{
                  fontFamily: 'var(--font-geist)',
                  backgroundColor: 'var(--color-dark-blue)',
                  color: 'var(--color-white)',
                }}
              >
                <Home className="h-5 w-5" />
                На главную
              </Button>
            </Link>
            <Link href="/app">
              <Button
                variant="outline"
                className="flex items-center gap-2 px-6 py-3"
                style={{
                  fontFamily: 'var(--font-geist)',
                  borderColor: 'var(--color-light-blue)',
                  color: 'var(--color-dark-blue)',
                }}
              >
                <Search className="h-5 w-5" />
                В приложение
              </Button>
            </Link>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}

