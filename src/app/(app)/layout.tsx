'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Settings,
  User,
  QrCode,
  FileText,
} from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { useFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading, firestore, auth } = useFirebase();
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
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data()?.role);
        } else {
          // If no user doc, maybe they signed up but doc creation failed.
          // For now, treat as no role. A robust app might try to create the doc.
          setUserRole(null);
          // Log out the user if their document doesn't exist to prevent being stuck.
          await auth.signOut();
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, isUserLoading, firestore, router, auth]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/home');
  };

  const isLoading = isUserLoading || isRoleLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <p className="text-foreground">Loading your EventHub+ experience...</p>
      </div>
    );
  }

  const commonLinks = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/qr-scanner', label: 'QR Scanner', icon: QrCode },
  ];

  const studentLinks = [
    { href: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const organizerLinks = [
    { href: '/organizer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  const adminLinks = [{ href: '/admin-panel', label: 'Admin Panel', icon: Settings }];

  let navLinks: { href: string; label:string; icon: React.ElementType }[] = [];
  if (userRole === 'student') {
    navLinks = [...studentLinks, ...commonLinks];
  } else if (userRole === 'organizer') {
    navLinks = [...organizerLinks, ...commonLinks];
  } else if (userRole === 'admin') {
    navLinks = [...adminLinks, ...organizerLinks, ...commonLinks];
  }

  const SidebarNav = ({ isMobile = false }) => (
    <TooltipProvider delayDuration={0}>
      <nav className={`flex flex-col gap-2 ${isMobile ? 'p-4' : ''}`}>
        <Link
          href="/home"
          className="mb-4 flex items-center gap-2 text-lg font-bold text-primary"
        >
          EventHub+
        </Link>
        {navLinks.map((link) => (
          <Tooltip key={link.href}>
            <TooltipTrigger asChild>
              <Link href={link.href}>
                <Button
                  variant={pathname.startsWith(link.href) ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              {link.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  );

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden w-64 flex-col border-r bg-card p-4 sm:flex">
        <SidebarNav />
        <div className="mt-auto flex flex-col gap-2">
          <Link href="/profile">
             <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
           <div className="sm:hidden">
             <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex h-full flex-col">
                  <SidebarNav isMobile={true} />
                   <div className="mt-auto flex flex-col gap-2 p-4">
                      <Link href="/profile">
                         <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                      </Link>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                </div>
              </SheetContent>
            </Sheet>
           </div>
           <div className="flex-1 text-center sm:hidden">
              <Link href="/home" className="text-lg font-bold text-primary">
                EventHub+
              </Link>
           </div>
          <div className="hidden flex-1 sm:block" />
          {user && <UserNav user={user} />}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
