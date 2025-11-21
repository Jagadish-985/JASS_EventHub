
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
  Home,
  ShieldCheck,
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
      if (!firestore || !user) return;
      setIsRoleLoading(true);
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data()?.role);
        } else {
          // If user doc doesn't exist, sign out and redirect
          await auth.signOut();
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
        await auth.signOut();
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, isUserLoading, firestore, router, auth]);
  
  useEffect(() => {
    if(!isUserLoading && !user) {
        router.push('/login');
    }
  }, [isUserLoading, user, router]);


  const handleLogout = async () => {
    await auth.signOut();
    router.push('/home');
  };

  const isLoading = isUserLoading || isRoleLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <p>Loading your EventHub+ experience...</p>
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

  const adminLinks = [
      { href: '/admin-panel', label: 'Admin Panel', icon: ShieldCheck },
      { href: '/organizer-dashboard', label: 'Event Management', icon: LayoutDashboard },
      { href: '/reports', label: 'Reports', icon: FileText },
  ];

  let navLinks: { href: string; label: string; icon: React.ElementType }[] = [
    { href: '/home', label: 'Home', icon: Home },
  ];
  if (userRole === 'student') {
    navLinks = [...navLinks, ...studentLinks, ...commonLinks];
  } else if (userRole === 'organizer') {
    navLinks = [...navLinks, ...organizerLinks, ...commonLinks];
  } else if (userRole === 'admin') {
    navLinks = [...navLinks, ...adminLinks, ...commonLinks];
  }

  const SidebarNav = ({ isMobile = false }) => (
    <nav className={`flex h-full flex-col ${isMobile ? 'p-4' : ''}`}>
        <Link
          href="/home"
          className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary"
        >
          EventHub+
        </Link>
        <div className="flex-1 space-y-2">
            {navLinks.map((link) => (
            <TooltipProvider key={link.href} delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Link href={link.href}>
                        <Button
                        variant={pathname.startsWith(link.href) ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-base"
                        >
                        <link.icon className="mr-3 h-5 w-5" />
                        {link.label}
                        </Button>
                    </Link>
                    </TooltipTrigger>
                    {!isMobile && <TooltipContent side="right" className="flex items-center gap-4">
                    {link.label}
                    </TooltipContent>}
                </Tooltip>
            </TooltipProvider>
            ))}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Link href="/profile">
             <Button variant="ghost" className="w-full justify-start text-base">
                <User className="mr-3 h-5 w-5" />
                Profile
              </Button>
          </Link>
           <Link href="/settings">
             <Button variant="ghost" className="w-full justify-start text-base">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-base">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden w-64 flex-col border-r bg-card p-4 lg:flex">
        <SidebarNav />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
           <div className="lg:hidden">
             <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-card">
                  <SidebarNav isMobile={true} />
              </SheetContent>
            </Sheet>
           </div>
           <div className="flex-1 text-center lg:hidden">
              <Link href="/home" className="text-xl font-bold text-primary">
                EventHub+
              </Link>
           </div>
          <div className="hidden flex-1 lg:block" />
          {user && <UserNav user={user} />}
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
        </main>
      </div>
    </div>
  );
}
