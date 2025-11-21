'use client';
import { useParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { Event, Registration, User } from '@/lib/types';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Tag, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);

  useEffect(() => {
    if (!user || !firestore) return;
    const fetchUserRole = async () => {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDocs(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data()?.role);
      }
    };
    fetchUserRole();
  }, [user, firestore]);

  const eventRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'events', id as string) : null),
    [firestore, id]
  );

  const { data: event, isLoading } = useDoc<Event>(eventRef);

  useEffect(() => {
    if (!event || !firestore || !user) return;
    if (user.uid === event.organizerId || userRole === 'admin') {
      const fetchRegistrations = async () => {
        setIsLoadingRegistrations(true);
        const q = query(collection(firestore, 'registrations'), where('eventId', '==', event.id));
        const querySnapshot = await getDocs(q);
        const regs = querySnapshot.docs.map(doc => doc.data() as Registration);
        setRegistrations(regs);
        setIsLoadingRegistrations(false);
      };
      fetchRegistrations();
    }
  }, [event, firestore, user, userRole]);

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
  
  const isOrganizerOrAdmin = user?.uid === event.organizerId || userRole === 'admin';

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
            <CardTitle>Event Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRegistrations && <p>Loading registrations...</p>}
            {!isLoadingRegistrations && registrations.length === 0 && <p>No one has registered yet.</p>}
            {!isLoadingRegistrations && registrations.length > 0 && (
              <ul className="space-y-2">
                {registrations.map((reg) => (
                  <li key={reg.userId} className="text-sm text-muted-foreground">User ID: {reg.userId}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
