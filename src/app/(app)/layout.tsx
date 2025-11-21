'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Calendar,
  LayoutDashboard,
  QrCode,
  FileText,
  BarChart2,
  Users,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { useFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

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
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, isUserLoading, firestore, router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/home');
  };

  const isLoading = isUserLoading || isRoleLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
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
    { href: '/admin-panel', label: 'Admin Panel', icon: Settings },
  ];

  let navLinks: { href: string; label: string; icon: React.ElementType }[] = [];
  if (userRole === 'student') {
    navLinks = [...studentLinks, ...commonLinks];
  } else if (userRole === 'organizer') {
    navLinks = [...organizerLinks, ...commonLinks];
  } else if (userRole === 'admin') {
    navLinks = [...adminLinks, ...organizerLinks, ...commonLinks];
  }


  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 flex-col border-r bg-card p-4 sm:flex">
        <nav className="flex flex-col gap-2">
          <Link href="/home" className="mb-4 flex items-center gap-2 font-bold text-lg">
            EventHub+
          </Link>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
           <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="sm:hidden">
            <Link href="/home" className="font-bold text-lg">
              EventHub+
            </Link>
          </div>
          <div className="flex-1" />
           {user && <UserNav user={user} />}
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
