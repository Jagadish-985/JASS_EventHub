'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, initiateEmailSignIn } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery && ['student', 'organizer', 'admin'].includes(roleFromQuery)) {
        setRole(roleFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isUserLoading && user && role) {
      const checkRoleAndRedirect = async () => {
        setIsLoading(true);
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === role) {
            if (role === 'student') router.push('/student-dashboard');
            else if (role === 'organizer') router.push('/organizer-dashboard');
            else if (role === 'admin') router.push('/admin-panel');
            else router.push('/home');
          } else {
            await auth.signOut();
            toast({
              variant: 'destructive',
              title: 'Role Mismatch',
              description: 'Please log in with the correct role.',
            });
          }
        } catch (e) {
          await auth.signOut();
        } finally {
          setIsLoading(false);
        }
      };
      checkRoleAndRedirect();
    }
  }, [user, isUserLoading, role, firestore, auth, router, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
        toast({ variant: 'destructive', title: 'Please select a role.' });
        return;
    }
    setIsLoading(true);
    initiateEmailSignIn(auth, email, password); // Non-blocking
  };

  if (!role) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-sm mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Select Your Role</CardTitle>
                    <CardDescription>
                        Please choose how you'd like to log in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button asChild size="lg"><Link href="/login?role=student">Student</Link></Button>
                    <Button asChild size="lg" variant="outline"><Link href="/login?role=organizer">Organizer</Link></Button>
                    <Button asChild size="lg" variant="outline"><Link href="/login?role=admin">Admin</Link></Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href={`/signup?role=${role}`} className="underline text-primary">
              Sign up
            </Link>
          </div>
           <div className="mt-2 text-center text-sm">
            <Link href="/login" className="underline text-muted-foreground">
              Choose a different role
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
