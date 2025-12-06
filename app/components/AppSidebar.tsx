'use client';

import { useState } from 'react';
import { LayoutDashboard, Upload, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Панель управления',
    icon: LayoutDashboard,
    url: '#',
  },
  {
    title: 'Импорт',
    icon: Upload,
    url: '#',
  },
  {
    title: 'Настройки',
    icon: Settings,
    url: '#',
  },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState('Панель управления');

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: 'var(--color-dark-blue)' }}>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-white)', fontFamily: 'var(--font-jost)' }}>IO</span>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                    IntegrityOS
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-geist)' }}>
                    Управление
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ fontFamily: 'var(--font-geist)' }}>
            Навигация
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem === item.title}
                    size="lg"
                    onClick={() => setActiveItem(item.title)}
                    style={{ fontFamily: 'var(--font-geist)' }}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

