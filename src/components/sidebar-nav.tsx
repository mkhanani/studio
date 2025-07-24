
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wrench,
  FileText,
  Lightbulb,
  Shield,
  LifeBuoy,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['employee', 'department_admin', 'management', 'super_admin'],
    },
  ];

  const adminMenuItems = [
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users,
    },
    {
      href: '/admin/tools',
      label: 'Tools',
      icon: Wrench,
    },
    {
      href: '/admin/logs',
      label: 'Usage Logs',
      icon: FileText,
    },
    {
      href: '/admin/insights',
      label: 'AI Insights',
      icon: Lightbulb,
    },
  ];

  const isActive = (path: string) => pathname === path;
  const isAdmin = user && ['super_admin', 'management', 'department_admin'].includes(user.role);

  return (
    <div className="flex h-full flex-col">
      <SidebarGroup className="flex-1">
        <SidebarMenu>
          {menuItems.map(
            (item) =>
              item.roles.includes(user?.role || 'employee') && (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                     <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              )
          )}
        </SidebarMenu>

        {isAdmin && (
          <>
            <SidebarGroupLabel className="mt-4">Admin</SidebarGroupLabel>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
      </SidebarGroup>

      <SidebarGroup>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Help">
                    <LifeBuoy />
                    <span>Help & Support</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
