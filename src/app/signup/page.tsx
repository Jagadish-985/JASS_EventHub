'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Shield, User } from 'lucide-react';

export default function SignupPage() {
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
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">Sign Up As</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">Please select your role to create an account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild size="lg" className="w-full">
                <Link href="/signup/student">
                    <User className="mr-2" />
                    Student
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/signup/admin">
                    <Shield className="mr-2" />
                    Admin (University)
                </Link>
            </Button>
             <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="underline text-primary">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
