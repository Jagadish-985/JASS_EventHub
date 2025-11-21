
'use client';
import { useParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { Event, Registration, User } from '@/lib/types';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Tag, QrCode, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { firestore, user, userRole } = useFirebase();
  const { toast } = useToast();
  
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);

  const eventId = id as string;

  const eventRef = useMemoFirebase(
    () => (firestore && eventId ? doc(firestore, 'events', eventId) : null),
    [firestore, eventId]
  );

  const { data: event, isLoading } = useDoc<Event>(eventRef);

  const isOrganizerOrAdmin = useMemo(() => {
    if (!user || !event) return false;
    return user.uid === event.organizerId || userRole === 'admin';
  }, [user, event, userRole]);


  useEffect(() => {
    if (!isOrganizerOrAdmin || !firestore || !eventId) return;

    const fetchRegistrations = async () => {
      setIsLoadingRegistrations(true);
      try {
        const q = query(collection(firestore, 'registrations'), where('eventId', '==', eventId));
        const querySnapshot = await getDocs(q);
        const regs = querySnapshot.docs.map(doc => doc.data() as Registration);
        setRegistrations(regs);

        if (regs.length > 0) {
          const userIds = regs.map(r => r.userId);
          const usersQuery = query(collection(firestore, 'users'), where(documentId(), 'in', userIds));
          const usersSnap = await getDocs(usersQuery);
          const usersData = usersSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
          setRegisteredUsers(usersData);
        } else {
          setRegisteredUsers([]);
        }

      } catch (error) {
        console.error("Error fetching registrations: ", error);
        setRegisteredUsers([]);
        setRegistrations([]);
      } finally {
        setIsLoadingRegistrations(false);
      }
    };
    
    fetchRegistrations();
  }, [eventId, firestore, isOrganizerOrAdmin]);

  const handleRegister = () => {
    if (!user || !event || !firestore) return;

    const registrationData = {
      userId: user.uid,
      eventId: event.id,
      createdAt: new Date().toISOString(),
    };

    const registrationRef = collection(firestore, 'registrations');
    addDocumentNonBlocking(registrationRef, registrationData);

    toast({
      title: 'Registration Successful!',
      description: `You have successfully registered for ${event.name}.`,
    });
  };
  
  if (isLoading) {
    return <div className="text-center p-10">Loading event details...</div>;
  }

  if (!event) {
    return <div className="text-center p-10">Event not found.</div>;
  }
  
  return (
    <div className="animate-in fade-in-50 space-y-8">
      <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl">
        <Image
          src={event.image || `https://picsum.photos/seed/${event.id}/1200/400`}
          alt={event.name}
          fill
          className="object-cover"
          data-ai-hint="event banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto -mt-16 bg-card p-6 md:p-8 rounded-xl shadow-lg relative z-10">
        <PageHeader title={event.name} className="mb-4" />
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 space-y-4">
             {event.category && <Badge variant="secondary" className="mb-2 text-sm">{event.category}</Badge>}
            <p className="text-muted-foreground">{event.description}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{new Date(event.startTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <span>{registrations.length} Registered</span>
            </div>
             {user?.uid === event.organizerId && (
              <div className="flex items-center gap-3 pt-2">
                <QrCode className="h-5 w-5 text-primary" />
                <span className="font-semibold">Event QR Code (For Check-in)</span>
              </div>
            )}
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="mb-6 flex items-center gap-3">
            <Tag className="h-5 w-5 text-primary" />
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {user && !isOrganizerOrAdmin && (
          <Button size="lg" className="w-full md:w-auto" onClick={handleRegister}>
            Register Now
          </Button>
        )}
      </div>

      {isOrganizerOrAdmin && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck />
              Event Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRegistrations && <p>Loading registrations...</p>}
            {!isLoadingRegistrations && registeredUsers.length === 0 && <p>No one has registered for this event yet.</p>}
            {!isLoadingRegistrations && registeredUsers.length > 0 && (
              <ul className="space-y-3 divide-y">
                {registeredUsers.map((regUser) => (
                  <li key={regUser.id} className="pt-3 first:pt-0">
                    <p className="font-semibold">{regUser.name}</p>
                    <p className="text-sm text-muted-foreground">{regUser.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
