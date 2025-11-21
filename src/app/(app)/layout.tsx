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
    if (!user) {
      if (!isUserLoading) {
        router.push('/login');
      }
      return;
    }

    const fetchUserRole = async () => {
      setIsRoleLoading(true);
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const role = userDoc.data()?.role;
          setUserRole(role);
        } else {
          // If the doc doesn't exist, the user might be signing up.
          // We can wait for it to be created. This can be improved.
          console.warn("User document not found for uid:", user.uid);
          setUserRole(null); 
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null); // Set to null on error
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, isUserLoading, firestore, router]);
  
  // New effect for handling redirection logic separately
  useEffect(() => {
    if (!isUserLoading && !isRoleLoading && user) {
        if (userRole === 'admin' && !pathname.startsWith('/admin')) {
          router.push('/admin/dashboard');
        } else if (userRole === 'student' && (pathname.startsWith('/admin') || pathname.startsWith('/reports') || pathname.startsWith('/analytics') || pathname.startsWith('/tools'))) {
          router.push('/dashboard');
        }
    }
  }, [isUserLoading, isRoleLoading, userRole, pathname, router, user]);


  const isLoading = isUserLoading || isRoleLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center text-foreground">
          <GraduationCap className="mx-auto h-12 w-12 animate-pulse" />
          <p className="mt-4">Loading EventHub+...</p>
        </div>
      </div>
    );
  }

  // If loading is finished and there's no user, we've already redirected, but this is a safeguard.
  if(!user) return null;


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
