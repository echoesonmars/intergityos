'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Map, List, Upload, FileText, Settings, User } from 'lucide-react';
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
  SidebarFooter,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Дашборд',
    icon: LayoutDashboard,
    url: '/app',
  },
  {
    title: 'Карта',
    icon: Map,
    url: '/app/map',
  },
  {
    title: 'Объекты',
    icon: List,
    url: '/app/objects',
  },
  {
    title: 'Импорт',
    icon: Upload,
    url: '/app/import',
  },
  {
    title: 'Отчеты',
    icon: FileText,
    url: '/app/reports',
  },
  {
    title: 'Настройки',
    icon: Settings,
    url: '/app/settings',
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="IntegrityOS">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: 'var(--color-dark-blue)' }}>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-white)', fontFamily: 'var(--font-jost)' }}>IO</span>
                </div>
                <div className="flex flex-col items-start gap-0.5 min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold text-sm truncate" style={{ fontFamily: 'var(--font-jost)', color: 'var(--color-dark-blue)' }}>
                    IntegrityOS
                  </span>
                  <span className="text-xs truncate" style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-geist)' }}>
                    Управление
                  </span>
                </div>
              </Link>
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
                    isActive={pathname === item.url}
                    size="lg"
                    tooltip={item.title}
                    style={{ fontFamily: 'var(--font-geist)' }}
                    className="group-data-[collapsible=icon]:justify-center"
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="shrink-0" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Профиль">
              <Link href="/app/profile" className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-dark-blue)' }}>
                  <User className="h-4 w-4" style={{ color: 'var(--color-white)' }} />
                </div>
                <div className="flex flex-col items-start gap-0.5 min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold text-sm truncate" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-dark-blue)' }}>
                    Пользователь
                  </span>
                  <span className="text-xs truncate" style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-geist)' }}>
                    user@integrityos.kz
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

