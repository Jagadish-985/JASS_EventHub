'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Award,
  BarChart2,
  Calendar,
  FileText,
  LayoutDashboard,
  QrCode,
  Users,
  GraduationCap,
} from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { user } from '@/lib/data';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/attendance', icon: QrCode, label: 'Attendance' },
  { href: '/certificates', icon: Award, label: 'Certificates' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/tools/invite-suggestions', icon: Users, label: 'Invite Tool' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-sidebar-foreground">
            <GraduationCap className="w-8 h-8 text-sidebar-primary" />
            <span className="font-headline tracking-tight group-data-[collapsible=icon]:hidden">EventHub+</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
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
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <UserNav user={user} />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
