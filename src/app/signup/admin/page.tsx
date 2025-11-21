'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { GraduationCap, Loader2, Shield } from 'lucide-react';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function AdminSignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: "Password must be at least 6 characters long.",
        });
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePicture: `https://picsum.photos/seed/${user.uid}/100/100`,
        enrolledSectionIds: [],
        role: 'admin',
      };
      
      setDocumentNonBlocking(userDocRef, userData, { merge: true });

      toast({
        title: "Admin Account Created",
        description: "You have been successfully signed up as an admin.",
      });

      router.push('/admin/dashboard');

    } catch (error: any) {
      console.error('Sign Up Error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
       <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/home" className="flex items-center gap-2.5 font-bold text-lg text-gray-800 dark:text-white">
              <GraduationCap className="w-10 h-10 text-primary" />
              <span className="text-2xl font-headline tracking-tight">RUAS EventHub+</span>
          </Link>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-2">
                <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">Admin Sign Up</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">Create an administrator account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name" className="text-gray-700 dark:text-gray-300">First name</Label>
                    <Input 
                      id="first-name" 
                      placeholder="Max" 
                      required 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name" className="text-gray-700 dark:text-gray-300">Last name</Label>
                    <Input 
                      id="last-name" 
                      placeholder="Robinson" 
                      required 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password"  className="text-gray-700 dark:text-gray-300">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Admin Account
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login/admin" className="underline text-primary">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
