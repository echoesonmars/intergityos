'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';

export default function AppPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <SidebarTrigger />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4" style={{ background: 'var(--color-white)' }}>
          <BlurFade delay={0.1}>
            <div className="space-y-6">
              <TextAnimate
                as="h1"
                className="text-4xl font-bold"
                style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}
                by="word"
                animation="blurInUp"
              >
                Добро пожаловать в IntegrityOS
              </TextAnimate>
              <p className="text-lg" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-black)' }}>
                Управление магистральными трубопроводами
              </p>
            </div>
          </BlurFade>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

