'use client';
import { usePathname, useRouter } from 'next/navigation';
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
import { useFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

const studentNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/attendance', icon: QrCode, label: 'Attendance' },
  { href: '/certificates', icon: Award, label: 'Certificates' },
];

const adminNavItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/tools/invite-suggestions', icon: Users, label: 'Invite Tool' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserRole = async () => {
      setIsRoleLoading(true);
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        setUserRole(role);

        // Redirect based on role and current path
        if (role === 'admin' && !pathname.startsWith('/admin')) {
          router.push('/admin/dashboard');
        } else if (role === 'student' && pathname.startsWith('/admin')) {
          router.push('/dashboard');
        }

      } else {
        // Handle case where user document doesn't exist yet
        console.warn("User document not found, redirecting to login.");
        router.push('/login');
      }
      setIsRoleLoading(false);
    };

    fetchUserRole();
  }, [isUserLoading, user, router, firestore, pathname]);

  const isLoading = isUserLoading || isRoleLoading;

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center text-foreground">
          <GraduationCap className="mx-auto h-12 w-12 animate-pulse" />
          <p className="mt-4">Loading EventHub+...</p>
        </div>
      </div>
    );
  }

  const navItems = userRole === 'admin' ? adminNavItems : studentNavItems;
  const homeLink = userRole === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4">
          <Link href={homeLink} className="flex items-center gap-2.5 font-bold text-lg text-sidebar-foreground">
            <GraduationCap className="w-8 h-8 text-sidebar-primary" />
            <span className="font-headline tracking-tight group-data-[collapsible=icon]:hidden">RUAS EventHub+</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== homeLink && pathname.startsWith(item.href))}
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
