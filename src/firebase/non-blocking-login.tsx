'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

const handleAuthError = (error: any) => {
    let title = 'Authentication Error';
    let description = 'An unexpected error occurred. Please try again.';

    switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            title = 'Login Failed';
            description = 'Invalid email or password. Please try again.';
            break;
        case 'auth/email-already-in-use':
            title = 'Sign Up Failed';
            description = 'An account with this email address already exists.';
            break;
        case 'auth/weak-password':
            title = 'Sign Up Failed';
            description = 'The password is too weak. It must be at least 6 characters long.';
            break;
        case 'auth/invalid-email':
            title = 'Invalid Email';
            description = 'Please enter a valid email address.';
            break;
    }

    toast({
        variant: 'destructive',
        title: title,
        description: description,
    });
}


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance)
    .catch(handleAuthError);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .catch(handleAuthError);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .catch(handleAuthError);
}
