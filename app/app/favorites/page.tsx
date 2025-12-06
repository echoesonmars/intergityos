'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../../components/AppSidebar';
import { FavoritesView } from '../../components/FavoritesView';

export default function FavoritesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
          <SidebarTrigger />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6" style={{ background: 'var(--color-white)' }}>
          <FavoritesView />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

