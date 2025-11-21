'use client';

import { useState, useEffect } from 'react';
import { useFirebase, updateDocumentNonBlocking } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { User } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';

export default function ProfilePage() {
  const { user, firestore } = useFirebase();
  const { toast } = useToast();
  
  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  const { data: userData, isLoading: isUserLoading } = useDoc<User>(userDocRef);

  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userData?.interests) {
      setInterests(userData.interests);
    }
  }, [userData]);

  const handleAddInterest = () => {
    if (interestInput && !interests.includes(interestInput)) {
      setInterests([...interests, interestInput]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleSaveChanges = async () => {
    if (!userDocRef) return;
    setIsUpdating(true);
    
    updateDocumentNonBlocking(userDocRef, { interests });
    
    toast({
      title: 'Success!',
      description: 'Your interests have been updated.',
    });
    
    setIsUpdating(false);
  };

  if (isUserLoading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="My Profile"
        description="View and manage your personal information."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{userData?.name}</CardTitle>
            <CardDescription>{userData?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge>{userData?.role}</Badge>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Interests</CardTitle>
            <CardDescription>
              Help us recommend better events for you by adding your interests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={interestInput}
                onChange={e => setInterestInput(e.target.value)}
                placeholder="e.g., AI, Design, Marketing"
                onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                    }
                }}
              />
              <Button onClick={handleAddInterest} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                  {interest}
                  <button onClick={() => handleRemoveInterest(interest)} className="rounded-full hover:bg-background/50">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button onClick={handleSaveChanges} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
