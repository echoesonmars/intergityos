'use client';

import Link from 'next/link';
import KazakhstanMap from './components/KazakhstanMap';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import FlipText from './components/FlipText';
import { TextAnimate } from '@/components/ui/text-animate';
import { BlurFade } from '@/components/ui/blur-fade';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-white)' }}>
      <div className="max-w-4xl w-full mx-auto py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center" style={{ gap: '0.5rem' }}>
          {/* Left Column - Text Content */}
          <div className="space-y-3 lg:space-y-4">
            {/* Logo */}
            <BlurFade delay={0.1}>
              <TextAnimate
                as="h1"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
                by="character"
                animation="blurInUp"
              >
                IntegrityOS
              </TextAnimate>
            </BlurFade>
            
            {/* Main Heading */}
            <BlurFade delay={0.2}>
              <TextAnimate
                as="p"
                className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-black)' }}
                by="word"
                animation="blurInUp"
              >
                Надежный контроль за магистральными трубопроводами.
              </TextAnimate>
            </BlurFade>

            {/* Description */}
            <BlurFade delay={0.3}>
              <p className="text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                <FlipText />
              </p>
            </BlurFade>

            {/* CTA Button */}
            <BlurFade delay={0.4}>
              <div className="pt-1">
                <Link href="/app">
                  <InteractiveHoverButton
                    style={{ 
                      fontFamily: 'var(--font-geist)',
                      backgroundColor: 'var(--color-dark-blue)',
                      color: 'var(--color-white)',
                      borderColor: 'var(--color-dark-blue)'
                    }}
                  >
                    Начать бесплатно
                  </InteractiveHoverButton>
                </Link>
              </div>
            </BlurFade>
          </div>

          {/* Right Column - Map */}
          <BlurFade delay={0.2} direction="left">
            <div className="flex items-center justify-center">
              <div className="w-full">
                <div className="macos-window">
                  <div className="macos-titlebar">
                    <div className="macos-buttons">
                      <span className="macos-button macos-button-close"></span>
                      <span className="macos-button macos-button-minimize"></span>
                      <span className="macos-button macos-button-maximize"></span>
                    </div>
                    <div className="macos-title">Карта Казахстана</div>
                  </div>
                  <div className="macos-content">
                    <KazakhstanMap />
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </main>
  );
}
