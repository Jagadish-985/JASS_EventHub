'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, setDocumentNonBlocking, initiateEmailSignUp } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';


function SignupComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'organizer' | 'admin' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery && ['student', 'organizer', 'admin'].includes(roleFromQuery)) {
        setRole(roleFromQuery as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isUserLoading && user && role) {
      const setupUserAndRedirect = async () => {
        setIsLoading(true);
        try {
          await updateProfile(user, { displayName: name });
          
          const userData = {
            name: name,
            email: email,
            role: role,
            interests: [], // Default empty interests
          };
          
          const userDocRef = doc(firestore, 'users', user.uid);
          setDocumentNonBlocking(userDocRef, userData, { merge: false });

          toast({
            title: "Account Created!",
            description: "You have been successfully signed up.",
          });

          if (role === 'student') router.push('/student-dashboard');
          else if (role === 'organizer') router.push('/organizer-dashboard');
          else if (role === 'admin') router.push('/admin-panel');
          else router.push('/home');

        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Setup Failed',
            description: error.message || 'Could not set up user profile.',
          });
        } finally {
          setIsLoading(false);
        }
      };
      setupUserAndRedirect();
    }
  }, [user, isUserLoading, name, email, role, firestore, router, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
        toast({ variant: "destructive", title: "Please select a role." });
        return;
    }
    setIsLoading(true);
    initiateEmailSignUp(auth, email, password); // Non-blocking
  };
  
  if (!role) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-sm mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Select Your Role</CardTitle>
                    <CardDescription>
                        Please choose how you'd like to sign up.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button asChild size="lg"><Link href="/signup?role=student">Student</Link></Button>
                    <Button asChild size="lg" variant="outline"><Link href="/signup?role=organizer">Organizer</Link></Button>
                    <Button asChild size="lg" variant="outline"><Link href="/signup?role=admin">Admin</Link></Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
       <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}</CardTitle>
            <CardDescription>Create a new account to join EventHub+.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input 
                  id="full-name" 
                  placeholder="John Doe" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
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
                Create Account
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href={`/login?role=${role}`} className="underline text-primary">
                Login
              </Link>
            </div>
             <div className="mt-2 text-center text-sm">
                <Link href="/signup" className="underline text-muted-foreground">
                Choose a different role
                </Link>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupComponent />
    </Suspense>
  )
}
